<?php
/**
 * Product brand taxonomy archive.
 *
 * Shows a header with brand name and a product grid for the brand.
 * Mirrors the layout of taxonomy-product_category.php.
 *
 * @package Steelmark
 */

get_header();

$current_term = get_queried_object();
$current_lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';

$products_page_id = (int) get_option("steelmark_products_page_{$current_lang}", 0);
$products_url = $products_page_id ? get_permalink($products_page_id) : get_post_type_archive_link('product_item');
$products_title = $products_page_id ? get_the_title($products_page_id) : post_type_archive_title('', false);
?>

<?php
// Blocksy native hero (type-2: background image with overlay)
echo blocksy_output_hero_section(['type' => 'type-2']);
?>

<div class="ct-container" data-content="normal">
    <!-- Breadcrumb -->
    <nav class="taxonomy-breadcrumb" aria-label="<?php esc_attr_e('Breadcrumb', 'steelmark'); ?>">
        <a href="<?php echo esc_url($products_url); ?>">
            <?php echo esc_html($products_title); ?>
        </a>
        <span class="breadcrumb-separator" aria-hidden="true">/</span>
        <span class="breadcrumb-current"><?php echo esc_html($current_term->name); ?></span>
    </nav>

    <div class="product-grid-wrapper">
        <?php if (have_posts()) : ?>
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
        <?php else : ?>
            <p class="no-results"><?php esc_html_e('No products found for this brand.', 'steelmark'); ?></p>
        <?php endif; ?>
    </div>
</div>

<?php get_footer(); ?>
