<?php
/**
 * Template Name: Products Overview
 *
 * Replaces the CPT archive — shows root product categories as cards
 * with banner image. Used for /sv/produkter/, /fi/tuotteet/, /en/products/.
 *
 * @package Steelmark
 */

get_header();

$current_lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';
$page_title = get_the_title();

/**
 * Expand term IDs to include all Polylang translations.
 * E.g. SV term 131 → [131, 130 (fi), 714 (en)]
 */
function steelmark_expand_term_translations(array $term_ids): array {
    if (!function_exists('pll_get_term_translations')) {
        return $term_ids;
    }
    $expanded = [];
    foreach ($term_ids as $tid) {
        $translations = pll_get_term_translations($tid);
        foreach ($translations as $trans_id) {
            $expanded[$trans_id] = true;
        }
        $expanded[$tid] = true; // Always include original
    }
    return array_keys($expanded);
}
?>

<?php
// Blocksy native hero (type-2: background image with overlay)
echo blocksy_output_hero_section(['type' => 'type-2']);
?>

<div class="ct-container" data-content="normal">
    <?php
    // Fetch root categories (hide_empty=false because products live in child terms)
    $categories = get_terms([
        'taxonomy'   => 'product_category',
        'hide_empty' => false,
        'parent'     => 0,
    ]);

    // Filter to current language only
    if (!empty($categories) && !is_wp_error($categories) && function_exists('pll_get_term_language')) {
        $categories = array_filter($categories, function ($term) use ($current_lang) {
            $term_lang = pll_get_term_language($term->term_id, 'slug');
            return $term_lang === $current_lang;
        });
    }
    ?>

    <div class="product-grid-wrapper">
        <?php if (!empty($categories)) : ?>
            <div class="category-grid">
                <?php foreach ($categories as $cat) :
                    // Resolve SV root term (source of truth — most complete child set)
                    $sv_root_id = function_exists('pll_get_term') ? pll_get_term($cat->term_id, 'sv') : $cat->term_id;
                    if (!$sv_root_id) $sv_root_id = $cat->term_id;

                    $sv_child_ids = get_term_children($sv_root_id, 'product_category');
                    $sv_all_ids = array_merge([$sv_root_id], is_array($sv_child_ids) ? $sv_child_ids : []);

                    // Current language terms (for direct lookups)
                    $child_ids = get_term_children($cat->term_id, 'product_category');
                    $all_term_ids = array_merge([$cat->term_id], is_array($child_ids) ? $child_ids : []);

                    // Expand SV terms to include all language translations
                    $all_lang_term_ids = steelmark_expand_term_translations($sv_all_ids);

                    // Link to the rich content page if one exists, otherwise taxonomy archive
                    $page_id = get_term_meta($cat->term_id, '_category_page_id', true);
                    $card_url = $page_id ? get_permalink($page_id) : get_term_link($cat);

                    // Check for manually chosen grid card image first
                    $thumb_url = '';
                    $grid_image_id = get_term_meta($sv_root_id, '_grid_card_image', true);
                    if ($grid_image_id) {
                        $thumb_url = wp_get_attachment_image_url((int) $grid_image_id, 'medium_large');
                    }

                    // Fall back to a representative product thumbnail (prefer current language)
                    if (!$thumb_url) :
                    $thumb_query = [
                        'post_type'      => 'product_item',
                        'posts_per_page' => 1,
                        'meta_key'       => '_thumbnail_id',
                        'orderby'        => 'title',
                        'order'          => 'ASC',
                        'tax_query'      => [[
                            'taxonomy' => 'product_category',
                            'field'    => 'term_id',
                            'terms'    => $all_lang_term_ids,
                        ]],
                    ];

                    // Try current language first
                    $products_in_cat = get_posts(array_merge($thumb_query, ['lang' => $current_lang]));

                    // Fall back: any language
                    if (empty($products_in_cat)) {
                        $products_in_cat = get_posts(array_merge($thumb_query, ['lang' => '']));
                    }

                    if (!empty($products_in_cat)) {
                        $thumb_id = get_post_thumbnail_id($products_in_cat[0]->ID);
                        if ($thumb_id) {
                            $thumb_url = wp_get_attachment_image_url($thumb_id, 'medium_large');
                        }
                    }

                    endif; // end fallback product thumbnail search

                    // Last resort: use the category page's featured image
                    if (!$thumb_url && $page_id) {
                        $page_thumb = get_post_thumbnail_id($page_id);
                        if ($page_thumb) {
                            $thumb_url = wp_get_attachment_image_url($page_thumb, 'medium_large');
                        }
                    }

                    // Count products in current language — use WP_Query with
                    // posts_per_page=1 and read found_posts instead of fetching all IDs
                    $count_query = new WP_Query([
                        'post_type'      => 'product_item',
                        'posts_per_page' => 1,
                        'lang'           => $current_lang,
                        'fields'         => 'ids',
                        'tax_query'      => [[
                            'taxonomy' => 'product_category',
                            'field'    => 'term_id',
                            'terms'    => $all_lang_term_ids,
                        ]],
                    ]);
                    $product_count = (int) $count_query->found_posts;

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
