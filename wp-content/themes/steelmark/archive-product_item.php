<?php
/**
 * Product archive template — category card grid.
 *
 * Shows root-level product categories as cards (not individual products).
 * Users drill into categories to see products.
 *
 * @package Steelmark
 */

get_header();

// Current language for filtering
$current_lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';
?>

<?php
// Blocksy native hero (type-2: background image with overlay)
echo blocksy_output_hero_section(['type' => 'type-2']);
?>

<div class="ct-container" data-content="normal">
    <?php
    // Fetch ALL terms in one query (roots + children) to avoid per-category get_term_children calls
    $all_terms = get_terms([
        'taxonomy'   => 'product_category',
        'hide_empty' => false,
    ]);

    if (empty($all_terms) || is_wp_error($all_terms)) {
        $all_terms = [];
    }

    // Build parent→children map and extract root categories
    $categories = [];
    $children_map = []; // root_term_id => [root_id, child_id, ...]
    foreach ($all_terms as $term) {
        if ($term->parent === 0) {
            $categories[] = $term;
            $children_map[$term->term_id] = [$term->term_id];
        }
    }
    foreach ($all_terms as $term) {
        if ($term->parent !== 0) {
            // Walk up to find the root ancestor
            $ancestor = $term->parent;
            $visited = [];
            while ($ancestor && !isset($children_map[$ancestor])) {
                $visited[] = $ancestor;
                // Find parent term in our list
                $parent_term = null;
                foreach ($all_terms as $t) {
                    if ($t->term_id === $ancestor) {
                        $parent_term = $t;
                        break;
                    }
                }
                $ancestor = $parent_term ? $parent_term->parent : 0;
            }
            if ($ancestor && isset($children_map[$ancestor])) {
                $children_map[$ancestor][] = $term->term_id;
            }
        }
    }

    // Filter root categories to current language
    if (!empty($categories) && function_exists('pll_get_term_language')) {
        $categories = array_filter($categories, function ($term) use ($current_lang) {
            return pll_get_term_language($term->term_id, 'slug') === $current_lang;
        });
    }

    // Collect all term IDs across all root categories for a single product query
    $all_category_term_ids = [];
    foreach ($categories as $cat) {
        $ids = isset($children_map[$cat->term_id]) ? $children_map[$cat->term_id] : [$cat->term_id];
        $all_category_term_ids = array_merge($all_category_term_ids, $ids);
    }

    // Single query: fetch one representative product per category tree (with thumbnails)
    $cat_thumbs = [];
    if (!empty($all_category_term_ids)) {
        $representative_products = get_posts([
            'post_type'      => 'product_item',
            'posts_per_page' => -1,
            'no_found_rows'  => true,
            'tax_query'      => [[
                'taxonomy' => 'product_category',
                'field'    => 'term_id',
                'terms'    => array_unique($all_category_term_ids),
            ]],
            'meta_key'       => '_thumbnail_id',
            'orderby'        => 'date',
            'order'          => 'DESC',
            'fields'         => 'ids',
        ]);

        if (!empty($representative_products)) {
            // Prime the thumbnail cache for all products at once
            update_postmeta_cache($representative_products);

            // Build term_id → product_id mapping (first match wins = newest)
            $term_to_product = [];
            foreach ($representative_products as $product_id) {
                $product_terms = wp_get_object_terms($product_id, 'product_category', ['fields' => 'ids']);
                foreach ($product_terms as $tid) {
                    if (!isset($term_to_product[$tid])) {
                        $term_to_product[$tid] = $product_id;
                    }
                }
            }

            // Map each root category to its best thumbnail
            foreach ($categories as $cat) {
                $tree_ids = isset($children_map[$cat->term_id]) ? $children_map[$cat->term_id] : [$cat->term_id];
                foreach ($tree_ids as $tid) {
                    if (isset($term_to_product[$tid])) {
                        $thumb_id = get_post_thumbnail_id($term_to_product[$tid]);
                        if ($thumb_id) {
                            $cat_thumbs[$cat->term_id] = wp_get_attachment_image_url($thumb_id, 'medium_large');
                            break;
                        }
                    }
                }
            }
        }
    }

    // Pre-compute product counts per root category from already-fetched terms
    $cat_counts = [];
    $terms_by_id = [];
    foreach ($all_terms as $term) {
        $terms_by_id[$term->term_id] = $term;
    }
    foreach ($categories as $cat) {
        $tree_ids = isset($children_map[$cat->term_id]) ? $children_map[$cat->term_id] : [$cat->term_id];
        $count = 0;
        foreach ($tree_ids as $tid) {
            if (isset($terms_by_id[$tid])) {
                $count += $terms_by_id[$tid]->count;
            }
        }
        $cat_counts[$cat->term_id] = $count;
    }

    // Batch-fetch _category_page_id term meta for all root categories
    $cat_term_ids = wp_list_pluck($categories, 'term_id');
    if (!empty($cat_term_ids)) {
        update_termmeta_cache($cat_term_ids);
    }
    ?>

    <div class="product-grid-wrapper">
        <?php if (!empty($categories)) : ?>
            <div class="category-grid">
                <?php foreach ($categories as $cat) :
                    $thumb_url = isset($cat_thumbs[$cat->term_id]) ? $cat_thumbs[$cat->term_id] : '';
                    $product_count = isset($cat_counts[$cat->term_id]) ? $cat_counts[$cat->term_id] : 0;

                    // Link to the rich content page if one exists, otherwise taxonomy archive
                    $page_id = get_term_meta($cat->term_id, '_category_page_id', true);
                    $card_url = $page_id ? get_permalink($page_id) : get_term_link($cat);
                ?>
                    <a href="<?php echo esc_url($card_url); ?>" class="category-card">
                        <div class="category-card-image">
                            <?php if ($thumb_url) : ?>
                                <img src="<?php echo esc_url($thumb_url); ?>"
                                     alt="<?php echo esc_attr($cat->name); ?>"
                                     loading="lazy">
                            <?php else : ?>
                                <div class="category-card-placeholder">
                                    <span><?php echo esc_html(mb_substr($cat->name, 0, 1)); ?></span>
                                </div>
                            <?php endif; ?>
                        </div>
                        <div class="category-card-content">
                            <h2 class="category-card-title"><?php echo esc_html($cat->name); ?></h2>
                            <span class="category-card-count">
                                <?php echo esc_html($product_count); ?>
                                <?php echo esc_html(_n('product', 'products', $product_count, 'steelmark')); ?>
                            </span>
                        </div>
                    </a>
                <?php endforeach; ?>
            </div>
        <?php else : ?>
            <p class="no-results"><?php esc_html_e('No product categories found.', 'steelmark'); ?></p>
        <?php endif; ?>
    </div>
</div>

<?php get_footer(); ?>
