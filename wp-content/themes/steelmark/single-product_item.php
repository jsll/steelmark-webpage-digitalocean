<?php
/**
 * Single product template.
 *
 * Layout: breadcrumb → gallery + info side-by-side → video + content → related cards.
 *
 * @package Steelmark
 */

get_header();

$lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';

$i18n = [
    'sv' => [
        'products'         => 'Produkter',
        'inquiry_heading'  => 'Intresserad av denna produkt?',
        'inquiry_text'     => 'Kontakta oss för pris och tillgänglighet.',
        'related_products' => 'Relaterade produkter',
    ],
    'fi' => [
        'products'         => 'Tuotteet',
        'inquiry_heading'  => 'Kiinnostaako tämä tuote?',
        'inquiry_text'     => 'Ota yhteyttä saadaksesi hinnan ja saatavuuden.',
        'related_products' => 'Liittyvät tuotteet',
    ],
    'en' => [
        'products'         => 'Products',
        'inquiry_heading'  => 'Interested in this product?',
        'inquiry_text'     => 'Contact us for pricing and availability.',
        'related_products' => 'Related Products',
    ],
];
$t = $i18n[$lang] ?? $i18n['sv'];

$gallery_ids_raw = get_post_meta(get_the_ID(), '_product_gallery_ids', true);
$gallery_ids     = $gallery_ids_raw ? array_filter(array_map('intval', explode(',', $gallery_ids_raw))) : [];
$video_url       = get_post_meta(get_the_ID(), '_product_link_url_0', true);
$has_video       = $video_url && preg_match('~youtu\.?be~i', $video_url);
$has_gallery     = !empty($gallery_ids);

// Taxonomy terms
$terms       = get_the_terms(get_the_ID(), 'product_category');
$brand_terms = get_the_terms(get_the_ID(), 'product_brand');

// Breadcrumb: Products overview page
$products_page_id = (int) get_option("steelmark_products_page_{$lang}", 0);
$products_url     = $products_page_id ? get_permalink($products_page_id) : get_post_type_archive_link('product_item');

// Breadcrumb: Primary category
$primary_cat     = ($terms && !is_wp_error($terms)) ? $terms[0] : null;
$category_url    = '';
$category_name   = '';
if ($primary_cat) {
    $cat_page_id   = get_term_meta($primary_cat->term_id, '_category_page_id', true);
    $category_url  = $cat_page_id ? get_permalink($cat_page_id) : get_term_link($primary_cat);
    $category_name = $primary_cat->name;
}
?>

<div class="ct-container" data-content="normal">
    <article <?php post_class('single-product'); ?>>

        <!-- Product top: gallery + info -->
        <div class="product-top">
            <div class="product-top-gallery">
                <?php if (has_post_thumbnail() || $has_gallery) : ?>
                    <?php if ($has_gallery) : ?>
                        <div class="product-gallery">
                            <div class="product-gallery-main">
                                <?php the_post_thumbnail('large', ['id' => 'gallery-main-img']); ?>
                            </div>
                            <div class="product-gallery-thumbs">
                                <?php
                                $thumb_id = get_post_thumbnail_id();
                                if ($thumb_id) :
                                    $thumb_url = wp_get_attachment_image_url($thumb_id, 'large');
                                    $alt = get_post_meta($thumb_id, '_wp_attachment_image_alt', true) ?: get_the_title();
                                    ?>
                                    <button class="gallery-thumb active" data-full="<?php echo esc_url($thumb_url); ?>">
                                        <?php echo wp_get_attachment_image($thumb_id, 'thumbnail', false, ['alt' => esc_attr($alt)]); ?>
                                    </button>
                                <?php endif; ?>

                                <?php foreach ($gallery_ids as $att_id) :
                                    $full_url = wp_get_attachment_image_url($att_id, 'large');
                                    $alt = get_post_meta($att_id, '_wp_attachment_image_alt', true) ?: '';
                                    ?>
                                    <button class="gallery-thumb" data-full="<?php echo esc_url($full_url); ?>">
                                        <?php echo wp_get_attachment_image($att_id, 'thumbnail', false, ['alt' => esc_attr($alt)]); ?>
                                    </button>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php else : ?>
                        <div class="product-gallery">
                            <div class="product-gallery-main">
                                <?php the_post_thumbnail('large'); ?>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php else : ?>
                    <div class="product-gallery">
                        <div class="product-gallery-main product-gallery-placeholder">
                            <span><?php echo esc_html(mb_substr(get_the_title(), 0, 1)); ?></span>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if ($terms && !is_wp_error($terms)) : ?>
                    <div class="product-categories">
                        <?php foreach ($terms as $term) : ?>
                            <a href="<?php echo esc_url(get_term_link($term)); ?>" class="product-category-badge">
                                <?php echo esc_html($term->name); ?>
                            </a>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="product-top-info">
                <?php if ($brand_terms && !is_wp_error($brand_terms)) : ?>
                    <div class="product-brand">
                        <a href="<?php echo esc_url(get_term_link($brand_terms[0])); ?>" class="product-brand-badge">
                            <?php echo esc_html($brand_terms[0]->name); ?>
                        </a>
                    </div>
                <?php endif; ?>

                <h1 class="product-title"><?php the_title(); ?></h1>

                <?php if (trim(get_the_content())) : ?>
                    <div class="entry-content">
                        <?php the_content(); ?>
                    </div>
                <?php endif; ?>

                <div class="product-inquiry-card">
                    <h3><?php echo esc_html($t['inquiry_heading']); ?></h3>
                    <p><?php echo esc_html($t['inquiry_text']); ?></p>
                    <button class="add-to-inquiry add-to-inquiry--large"
                            data-product-id="<?php echo get_the_ID(); ?>"
                            data-product-title="<?php echo esc_attr(get_the_title()); ?>"
                            data-product-url="<?php echo esc_url(get_permalink()); ?>"
                            data-product-thumbnail="<?php echo esc_url(get_the_post_thumbnail_url(get_the_ID(), 'thumbnail')); ?>">
                        <span class="add-to-inquiry-label"></span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Video embed (full-width) -->
        <?php if ($has_video) : ?>
            <div class="product-video">
                <iframe
                    src="<?php echo esc_url(str_replace('watch?v=', 'embed/', $video_url)); ?>"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy"
                ></iframe>
            </div>
        <?php endif; ?>

        <!-- Related products -->
        <?php
        $related_ids_raw = get_post_meta(get_the_ID(), '_related_product_ids', true);

        if ($related_ids_raw) {
            $related_ids = array_filter(array_map('intval', explode(',', $related_ids_raw)));
            $related = new WP_Query([
                'post_type'      => 'product_item',
                'post__in'       => $related_ids,
                'orderby'        => 'post__in',
                'posts_per_page' => 4,
                'post_status'    => 'publish',
                'no_found_rows'  => true,
            ]);
        } else {
            $related = new WP_Query([
                'post_type'      => 'product_item',
                'posts_per_page' => 4,
                'post__not_in'   => [get_the_ID()],
                'lang'           => $lang,
                'no_found_rows'  => true,
                'tax_query'      => ($terms && !is_wp_error($terms)) ? [
                    ['taxonomy' => 'product_category', 'terms' => wp_list_pluck($terms, 'term_id')],
                ] : [],
                'orderby'        => 'date',
                'order'          => 'DESC',
            ]);
        }

        if ($related->have_posts()) : ?>
            <section class="product-related">
                <h2><?php echo esc_html($t['related_products']); ?></h2>
                <div class="product-related-grid">
                    <?php while ($related->have_posts()) : $related->the_post(); ?>
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
                                    <h3 class="product-card-title"><?php the_title(); ?></h3>
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
            </section>
            <?php wp_reset_postdata(); ?>
        <?php endif; ?>

    </article>
</div>

<?php get_footer(); ?>
