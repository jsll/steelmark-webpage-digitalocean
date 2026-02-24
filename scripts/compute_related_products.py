#!/usr/bin/env python3
"""
Compute embedding-based related products for steelmark.fi.

Embeds all English products using all-mpnet-base-v2, computes 8 nearest
neighbors per product, maps those to sv/fi via Polylang translation links,
and stores the result as _related_product_ids postmeta for all 3 languages.

Idempotent: deletes all existing _related_product_ids before writing.
"""

import re
import sys
import numpy as np
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
import mysql.connector


def read_wp_config(path="/var/www/html/wp-config.php"):
    """Parse DB credentials and table prefix from wp-config.php."""
    with open(path) as f:
        content = f.read()

    def get_define(name):
        m = re.search(
            r"define\s*\(\s*'" + name + r"'\s*,\s*'([^']*)'\s*\)", content
        )
        return m.group(1) if m else None

    m = re.search(r"\$table_prefix\s*=\s*'([^']+)'", content)
    prefix = m.group(1) if m else "wp_"

    return {
        "host": get_define("DB_HOST"),
        "user": get_define("DB_USER"),
        "password": get_define("DB_PASSWORD"),
        "database": get_define("DB_NAME"),
        "prefix": prefix,
    }


def fetch_english_products(db, prefix):
    """Fetch all published English product_items with their categories and brand."""
    cursor = db.cursor(dictionary=True)
    cursor.execute(f"""
        SELECT
            p.ID,
            p.post_title,
            p.post_content,
            GROUP_CONCAT(DISTINCT cat_t.name SEPARATOR ', ') AS categories,
            MAX(brand_t.name) AS brand
        FROM {prefix}posts p
        -- language filter: English
        JOIN {prefix}term_relationships lang_tr
            ON lang_tr.object_id = p.ID
        JOIN {prefix}term_taxonomy lang_tt
            ON lang_tt.term_taxonomy_id = lang_tr.term_taxonomy_id
            AND lang_tt.taxonomy = 'language'
        JOIN {prefix}terms lang_term
            ON lang_term.term_id = lang_tt.term_id
            AND lang_term.slug = 'en'
        -- categories (optional)
        LEFT JOIN {prefix}term_relationships cat_tr
            ON cat_tr.object_id = p.ID
        LEFT JOIN {prefix}term_taxonomy cat_tt
            ON cat_tt.term_taxonomy_id = cat_tr.term_taxonomy_id
            AND cat_tt.taxonomy = 'product_category'
        LEFT JOIN {prefix}terms cat_t
            ON cat_t.term_id = cat_tt.term_id
        -- brand (optional)
        LEFT JOIN {prefix}term_relationships brand_tr
            ON brand_tr.object_id = p.ID
        LEFT JOIN {prefix}term_taxonomy brand_tt
            ON brand_tt.term_taxonomy_id = brand_tr.term_taxonomy_id
            AND brand_tt.taxonomy = 'product_brand'
        LEFT JOIN {prefix}terms brand_t
            ON brand_t.term_id = brand_tt.term_id
        WHERE p.post_type = 'product_item'
          AND p.post_status = 'publish'
        GROUP BY p.ID
    """)
    products = cursor.fetchall()
    cursor.close()
    return products


def build_text(product):
    """Build a text representation for embedding."""
    title = product["post_title"] or ""
    categories = product["categories"] or ""
    brand = product["brand"] or ""

    # Strip HTML from content
    content_html = product["post_content"] or ""
    content_text = BeautifulSoup(content_html, "html.parser").get_text(
        separator=" ", strip=True
    )

    parts = [title]
    if categories:
        parts.append(categories)
    if brand:
        parts.append(brand)
    if content_text:
        parts.append(content_text)

    return ". ".join(parts)


def build_embeddings(texts):
    """Encode texts using sentence-transformers."""
    model = SentenceTransformer("all-mpnet-base-v2")
    embeddings = model.encode(texts, normalize_embeddings=True, show_progress_bar=True)
    return np.array(embeddings)


def compute_neighbors(embeddings, ids, k=8):
    """Compute top-k nearest neighbors via dot product similarity."""
    # Normalized embeddings → dot product = cosine similarity
    sim = embeddings @ embeddings.T

    # Zero out self-similarity
    np.fill_diagonal(sim, -1.0)

    neighbors = {}
    for i, product_id in enumerate(ids):
        top_k_indices = np.argsort(sim[i])[-k:][::-1]
        neighbors[product_id] = [ids[j] for j in top_k_indices]

    return neighbors


def fetch_translation_map(db, prefix):
    """Build a mapping from any post ID to its {lang: post_id} translations dict."""
    cursor = db.cursor(dictionary=True)
    cursor.execute(f"""
        SELECT tt.description, GROUP_CONCAT(tr.object_id) AS post_ids
        FROM {prefix}term_taxonomy tt
        JOIN {prefix}term_relationships tr
            ON tr.term_taxonomy_id = tt.term_taxonomy_id
        WHERE tt.taxonomy = 'post_translations'
        GROUP BY tt.term_taxonomy_id
    """)

    # Parse PHP serialized descriptions like: a:3:{s:2:"sv";i:60;s:2:"fi";i:59;s:2:"en";i:1013;}
    translation_map = {}  # post_id -> {lang: post_id}
    for row in cursor.fetchall():
        desc = row["description"]
        # Extract all s:N:"lang";i:ID pairs
        pairs = re.findall(r's:\d+:"(\w+)";i:(\d+);', desc)
        lang_dict = {lang: int(pid) for lang, pid in pairs}

        for pid in lang_dict.values():
            translation_map[pid] = lang_dict

    cursor.close()
    return translation_map


def write_related_meta(db, neighbors, translation_map, prefix):
    """Write _related_product_ids meta for all languages."""
    cursor = db.cursor()

    # Delete all existing related product meta (idempotent)
    cursor.execute(
        f"DELETE FROM {prefix}postmeta WHERE meta_key = '_related_product_ids'"
    )
    deleted = cursor.rowcount
    print(f"Deleted {deleted} existing _related_product_ids rows")

    # Build meta rows for all languages
    rows_to_insert = []

    for en_id, en_neighbors in neighbors.items():
        # Get translation group for this product
        en_translations = translation_map.get(en_id)
        if not en_translations:
            # Product has no translation group, write only for EN
            neighbor_ids_str = ",".join(str(nid) for nid in en_neighbors)
            rows_to_insert.append((en_id, "_related_product_ids", neighbor_ids_str))
            continue

        # For each language this product exists in
        for lang, lang_product_id in en_translations.items():
            # Map each English neighbor to this language
            lang_neighbor_ids = []
            for en_neighbor_id in en_neighbors:
                neighbor_translations = translation_map.get(en_neighbor_id, {})
                lang_neighbor_id = neighbor_translations.get(lang, en_neighbor_id)
                lang_neighbor_ids.append(lang_neighbor_id)

            neighbor_ids_str = ",".join(str(nid) for nid in lang_neighbor_ids)
            rows_to_insert.append(
                (lang_product_id, "_related_product_ids", neighbor_ids_str)
            )

    # Batch insert
    cursor.executemany(
        f"INSERT INTO {prefix}postmeta (post_id, meta_key, meta_value) VALUES (%s, %s, %s)",
        rows_to_insert,
    )
    db.commit()

    print(f"Inserted {len(rows_to_insert)} _related_product_ids rows")
    cursor.close()
    return len(rows_to_insert)


def main():
    print("Reading wp-config.php...")
    config = read_wp_config()
    prefix = config.pop("prefix")

    print(f"Connecting to DB ({config['database']}@{config['host']})...")
    db = mysql.connector.connect(**config)

    print("Fetching English products...")
    products = fetch_english_products(db, prefix)
    print(f"  Found {len(products)} English products")

    if not products:
        print("No products found. Exiting.")
        sys.exit(1)

    print("Building text representations...")
    texts = [build_text(p) for p in products]
    ids = [p["ID"] for p in products]

    print("Computing embeddings (this may take a minute)...")
    embeddings = build_embeddings(texts)
    print(f"  Embedding shape: {embeddings.shape}")

    print("Computing nearest neighbors (k=8)...")
    neighbors = compute_neighbors(embeddings, ids, k=8)

    print("Fetching translation map...")
    translation_map = fetch_translation_map(db, prefix)
    print(f"  Found {len(translation_map)} translated posts")

    print("Writing related product meta...")
    count = write_related_meta(db, neighbors, translation_map, prefix)

    # Verification
    cursor = db.cursor()
    cursor.execute(
        f"SELECT COUNT(*) FROM {prefix}postmeta WHERE meta_key = '_related_product_ids'"
    )
    actual_count = cursor.fetchone()[0]
    print(f"\nVerification: {actual_count} rows in DB")

    # Self-reference check
    cursor.execute(f"""
        SELECT pm.post_id, pm.meta_value
        FROM {prefix}postmeta pm
        WHERE pm.meta_key = '_related_product_ids'
          AND FIND_IN_SET(pm.post_id, pm.meta_value)
    """)
    self_refs = cursor.fetchall()
    if self_refs:
        print(f"WARNING: {len(self_refs)} products reference themselves!")
        for pid, val in self_refs[:5]:
            print(f"  post_id={pid}, meta_value={val}")
    else:
        print("Self-reference check: PASS (no products reference themselves)")

    cursor.close()
    db.close()
    print("\nDone!")


if __name__ == "__main__":
    main()
