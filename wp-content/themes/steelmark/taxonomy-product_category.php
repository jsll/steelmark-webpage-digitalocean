<?php
/**
 * Product category taxonomy archive.
 *
 * Shows breadcrumbs, subcategory cards (if children exist),
 * and product grid for the current category.
 *
 * @package Steelmark
 */

get_header();

$current_term = get_queried_object();
$current_lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';

// Build breadcrumb trail
$breadcrumbs = [];
$ancestor = $current_term;
while ($ancestor) {
    array_unshift($breadcrumbs, $ancestor);
    if ($ancestor->parent) {
        $ancestor = get_term($ancestor->parent, 'product_category');
        if (is_wp_error($ancestor)) break;
    } else {
        break;
    }
}

// Get subcategories
$subcategories = get_terms([
    'taxonomy'   => 'product_category',
    'hide_empty' => true,
    'parent'     => $current_term->term_id,
]);

// Filter subcategories to current language
if (!empty($subcategories) && !is_wp_error($subcategories) && function_exists('pll_get_term_language')) {
    $subcategories = array_filter($subcategories, function ($term) use ($current_lang) {
        $term_lang = pll_get_term_language($term->term_id, 'slug');
        return $term_lang === $current_lang;
    });
}

$has_subcategories = !empty($subcategories) && !is_wp_error($subcategories);
?>

<?php
// Blocksy native hero (type-2: background image with overlay)
echo blocksy_output_hero_section(['type' => 'type-2']);
?>

<div class="ct-container" data-content="normal">
    <!-- Breadcrumb -->
    <nav class="taxonomy-breadcrumb" aria-label="<?php esc_attr_e('Breadcrumb', 'steelmark'); ?>">
        <?php
        $products_page_id = (int) get_option("steelmark_products_page_{$current_lang}", 0);
        $products_url = $products_page_id ? get_permalink($products_page_id) : get_post_type_archive_link('product_item');
        $products_title = $products_page_id ? get_the_title($products_page_id) : post_type_archive_title('', false);
        ?>
        <a href="<?php echo esc_url($products_url); ?>">
            <?php echo esc_html($products_title); ?>
        </a>
        <?php foreach ($breadcrumbs as $crumb) : ?>
            <span class="breadcrumb-separator" aria-hidden="true">/</span>
            <?php if ($crumb->term_id === $current_term->term_id) : ?>
                <span class="breadcrumb-current"><?php echo esc_html($crumb->name); ?></span>
            <?php else :
                $crumb_page_id = get_term_meta($crumb->term_id, '_category_page_id', true);
                $crumb_url = $crumb_page_id ? get_permalink($crumb_page_id) : get_term_link($crumb);
            ?>
                <a href="<?php echo esc_url($crumb_url); ?>">
                    <?php echo esc_html($crumb->name); ?>
                </a>
            <?php endif; ?>
        <?php endforeach; ?>
    </nav>

    <div class="product-grid-wrapper">

        <?php if ($has_subcategories) : ?>
            <!-- Subcategory cards -->
            <div class="category-grid">
                <?php foreach ($subcategories as $subcat) :
                    // Representative thumbnail (current language only)
                    $thumb_url = '';
                    $products_in_cat = get_posts([
                        'post_type'      => 'product_item',
                        'posts_per_page' => 1,
                        'lang'           => $current_lang,
                        'tax_query'      => [[
                            'taxonomy' => 'product_category',
                            'field'    => 'term_id',
                            'terms'    => $subcat->term_id,
                        ]],
                        'meta_key'       => '_thumbnail_id',
                        'orderby'        => 'title',
                        'order'          => 'ASC',
                    ]);

                    if (!empty($products_in_cat)) {
                        $thumb_id = get_post_thumbnail_id($products_in_cat[0]->ID);
                        if ($thumb_id) {
                            $thumb_url = wp_get_attachment_image_url($thumb_id, 'medium_large');
                        }
                    }
                ?>
                    <a href="<?php echo esc_url(get_term_link($subcat)); ?>" class="category-card">
                        <div class="category-card-image">
                            <?php if ($thumb_url) : ?>
                                <img src="<?php echo esc_url($thumb_url); ?>"
                                     alt="<?php echo esc_attr($subcat->name); ?>"
                                     loading="lazy">
                            <?php else : ?>
                                <div class="category-card-placeholder">
                                    <span><?php echo esc_html(mb_substr($subcat->name, 0, 1)); ?></span>
                                </div>
                            <?php endif; ?>
                        </div>
                        <div class="category-card-content">
                            <h2 class="category-card-title"><?php echo esc_html($subcat->name); ?></h2>
                            <span class="category-card-count">
                                <?php echo esc_html($subcat->count); ?>
                                <?php echo esc_html(_n('product', 'products', $subcat->count, 'steelmark')); ?>
                            </span>
                        </div>
                    </a>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <?php if (have_posts()) : ?>
            <?php if ($has_subcategories) : ?>
                <h2 class="section-heading">
                    <?php printf(
                        /* translators: %s: category name */
                        esc_html__('Products in %s', 'steelmark'),
                        esc_html(single_term_title('', false))
                    ); ?>
                </h2>
            <?php endif; ?>

            <div class="product-grid">
                <?php while (have_posts()) : the_post(); ?>
                    <article <?php post_class('product-card'); ?>>
                        <a href="<?php the_permalink(); ?>" class="product-card-link" data-product-id="<?php echo get_the_ID(); ?>">
                            <div class="product-card-image">
                                <?php if (has_post_thumbnail()) : ?>
                                    <?php the_post_thumbnail('medium_large', ['loading' => 'lazy']); ?>
                                <?php else : ?>
                                    <div class="product-card-placeholder">
                                        <span><?php echo esc_html(mb_substr(get_the_title(), 0, 1)); ?></span>
                                    </div>
                                <?php endif; ?>
                            </div>
                            <div class="product-card-content">
                                <h2 class="product-card-title"><?php the_title(); ?></h2>
                            </div>
                        </a>
                        <button class="add-to-inquiry add-to-inquiry--card"
                                data-product-id="<?php echo get_the_ID(); ?>"
                                data-product-title="<?php echo esc_attr(get_the_title()); ?>"
                                data-product-url="<?php echo esc_url(get_permalink()); ?>"
                                data-product-thumbnail="<?php echo esc_url(get_the_post_thumbnail_url(get_the_ID(), 'thumbnail')); ?>"
                                aria-label="<?php echo esc_attr(get_the_title()); ?>">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
                                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                                <line x1="9" y1="12" x2="15" y2="12"/>
                                <line x1="12" y1="9" x2="12" y2="15"/>
                            </svg>
                        </button>
                    </article>
                <?php endwhile; ?>
            </div>

            <?php the_posts_pagination([
                'prev_text' => '&larr;',
                'next_text' => '&rarr;',
                'mid_size'  => 2,
            ]); ?>
        <?php elseif (!$has_subcategories) : ?>
            <p class="no-results"><?php esc_html_e('No products found in this category.', 'steelmark'); ?></p>
        <?php endif; ?>
    </div>
</div>

<?php get_footer(); ?>
