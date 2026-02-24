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
                    // Include child terms for thumbnail lookup and product count
                    $child_ids = get_term_children($cat->term_id, 'product_category');
                    $all_term_ids = array_merge([$cat->term_id], is_array($child_ids) ? $child_ids : []);

                    // Get a representative product thumbnail from this category tree
                    $thumb_url = '';
                    $products_in_cat = get_posts([
                        'post_type'      => 'product_item',
                        'posts_per_page' => 1,
                        'tax_query'      => [[
                            'taxonomy' => 'product_category',
                            'field'    => 'term_id',
                            'terms'    => $all_term_ids,
                        ]],
                        'meta_key'       => '_thumbnail_id',
                        'orderby'        => 'date',
                        'order'          => 'DESC',
                    ]);

                    if (!empty($products_in_cat)) {
                        $thumb_id = get_post_thumbnail_id($products_in_cat[0]->ID);
                        if ($thumb_id) {
                            $thumb_url = wp_get_attachment_image_url($thumb_id, 'medium_large');
                        }
                    }

                    // Count products (including children)
                    $product_count = 0;
                    foreach ($all_term_ids as $tid) {
                        $t = get_term($tid, 'product_category');
                        if ($t && !is_wp_error($t)) {
                            $product_count += $t->count;
                        }
                    }

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
