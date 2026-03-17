<?php
/**
 * Steelmark child theme functions (Blocksy parent).
 *
 * @package Steelmark
 */

defined('ABSPATH') || exit;

/* =========================================================================
   0. FORCE LIGHT COLOR SCHEME
   ========================================================================= */

/**
 * Output color-scheme meta tag to prevent mobile browsers from auto-darkening.
 * Priority -999 ensures it appears before charset and viewport meta tags.
 */
function steelmark_color_scheme_meta() {
    echo '<meta name="color-scheme" content="light only">' . "\n";
}
add_action('wp_head', 'steelmark_color_scheme_meta', -999);

/* =========================================================================
   1. ASSET ENQUEUING
   ========================================================================= */

/**
 * Enqueue child theme styles and scripts.
 *
 * Blocksy handles its own parent styles. We enqueue only the child-theme
 * CSS/JS files that are still needed for product pages, inquiry list,
 * carousels, and the front page hero.
 */
function steelmark_enqueue_assets() {
    $theme_uri = get_stylesheet_directory_uri();
    $theme_dir = get_stylesheet_directory();
    $version   = wp_get_theme()->get('Version');

    // Child theme style (style.css — variable aliases + component styles)
    wp_enqueue_style(
        'steelmark-style',
        $theme_uri . '/style.css',
        ['ct-main-styles'],
        $version
    );

    // Helper: enqueue a child-theme CSS file
    $enqueue_css = function ($handle, $file) use ($theme_uri, $theme_dir) {
        $path = $theme_dir . '/assets/css/' . $file;
        if (file_exists($path)) {
            wp_enqueue_style($handle, $theme_uri . '/assets/css/' . $file, ['steelmark-style'], filemtime($path));
        }
    };

    // Detect product context (product singles, archives, taxonomy, category pages)
    $is_product_context = is_singular('product_item')
        || is_post_type_archive('product_item')
        || is_tax('product_category')
        || is_tax('product_brand');
    if (!$is_product_context && is_page()) {
        $parent_id = wp_get_post_parent_id(get_the_ID());
        if ($parent_id && in_array($parent_id, steelmark_get_products_page_ids(), true)) {
            $is_product_context = true;
        }
        // Products overview pages themselves
        if (in_array(get_the_ID(), steelmark_get_products_page_ids(), true)) {
            $is_product_context = true;
        }
    }

    // --- Global CSS (needed on all pages) ---
    $enqueue_css('steelmark-blocks', 'blocks.css');
    $enqueue_css('steelmark-forms', 'forms.css');
    $enqueue_css('steelmark-inquiry', 'inquiry-list.css');
    $enqueue_css('steelmark-splide-core', 'vendor/splide-core.min.css');

    // --- Product pages only ---
    if ($is_product_context || is_front_page()) {
        $enqueue_css('steelmark-products', 'products.css');
        $enqueue_css('steelmark-carousel', 'product-carousel.css');
        $enqueue_css('steelmark-quickview', 'product-quickview.css');
    }

    // --- Homepage only ---
    if (is_front_page()) {
        $enqueue_css('steelmark-home', 'home.css');
    }

    // --- Homepage: Greenshift swiper CSS (not enqueued by the plugin for swiper blocks) ---
    if (is_front_page()) {
        wp_enqueue_style('gsswiper');
    }

    // --- Blog pages ---
    if (is_home() || is_singular('post') || is_category() || is_tag() || is_date() || is_author()) {
        $enqueue_css('steelmark-blog', 'blog.css');
    }

    // --- Bio/fertilizer filter pages ---
    if (is_page(['biologiska-produkter', 'biologiset-tuotteet', 'biological-products',
                  'vaxthusgodsel', 'kasvihuonelannoite', 'greenhouse-fertilizer'])) {
        $enqueue_css('steelmark-bio-filter', 'bio-filter.css');
    }

    // Inquiry list JS
    $inquiry_path = $theme_dir . '/assets/js/inquiry-list.js';
    if (file_exists($inquiry_path)) {
        wp_enqueue_script(
            'steelmark-inquiry-list',
            $theme_uri . '/assets/js/inquiry-list.js',
            [],
            filemtime($inquiry_path),
            true
        );

        $lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';
        $inquiry_i18n = [
            'sv' => [
                'addToList'    => 'Lägg till i förfrågan',
                'added'        => 'Tillagd',
                'drawerTitle'  => 'Din förfrågningslista',
                'sendInquiry'  => 'Skicka förfrågan',
                'clearAll'     => 'Rensa alla',
                'remove'       => 'Ta bort',
                'emptyList'    => 'Din förfrågningslista är tom.',
                'emptyHint'    => 'Bläddra bland produkter och lägg till de du är intresserad av.',
            ],
            'fi' => [
                'addToList'    => 'Lisää tiedusteluun',
                'added'        => 'Lisätty',
                'drawerTitle'  => 'Tiedustelulistasi',
                'sendInquiry'  => 'Lähetä tiedustelu',
                'clearAll'     => 'Tyhjennä kaikki',
                'remove'       => 'Poista',
                'emptyList'    => 'Tiedustelulistasi on tyhjä.',
                'emptyHint'    => 'Selaa tuotteita ja lisää kiinnostavat.',
            ],
            'en' => [
                'addToList'    => 'Add to inquiry',
                'added'        => 'Added',
                'drawerTitle'  => 'Your inquiry list',
                'sendInquiry'  => 'Send Inquiry',
                'clearAll'     => 'Clear all',
                'remove'       => 'Remove',
                'emptyList'    => 'Your inquiry list is empty.',
                'emptyHint'    => 'Browse products and add the ones you are interested in.',
            ],
        ];

        $contact_slugs = ['sv' => 'kontakt', 'fi' => 'yhteystiedot', 'en' => 'contact'];
        $contact_page = get_page_by_path($contact_slugs[$lang] ?? 'contact');
        $contact_url = $contact_page ? get_permalink($contact_page) : home_url('/contact/');

        wp_localize_script('steelmark-inquiry-list', 'steelmarkInquiry', [
            'contactUrl' => $contact_url,
            'i18n'       => $inquiry_i18n[$lang] ?? $inquiry_i18n['sv'],
        ]);
    }

    // Splide.js (vendor) — carousel library
    $splide_js_path = $theme_dir . '/assets/js/vendor/splide.min.js';
    if (file_exists($splide_js_path)) {
        wp_enqueue_script(
            'splide-core',
            $theme_uri . '/assets/js/vendor/splide.min.js',
            [],
            filemtime($splide_js_path),
            true
        );
    }

    // Product carousel JS — product pages + homepage only (depends on Splide)
    if ($is_product_context || is_front_page()) {
        $carousel_js_path = $theme_dir . '/assets/js/product-carousel.js';
        if (file_exists($carousel_js_path)) {
            wp_enqueue_script(
                'steelmark-product-carousel',
                $theme_uri . '/assets/js/product-carousel.js',
                ['splide-core'],
                filemtime($carousel_js_path),
                true
            );
        }
    }

    // Mega menu news carousel JS (depends on Splide) — global (mega menu on all pages)
    $mega_news_path = $theme_dir . '/assets/js/mega-menu-news.js';
    if (file_exists($mega_news_path)) {
        wp_enqueue_script(
            'steelmark-mega-menu-news',
            $theme_uri . '/assets/js/mega-menu-news.js',
            ['splide-core'],
            filemtime($mega_news_path),
            true
        );
    }

    // Mega menu hover-intent delay — global
    $mega_hover_path = $theme_dir . '/assets/js/mega-menu-hover-intent.js';
    if (file_exists($mega_hover_path)) {
        wp_enqueue_script(
            'steelmark-mega-menu-hover-intent',
            $theme_uri . '/assets/js/mega-menu-hover-intent.js',
            [],
            filemtime($mega_hover_path),
            true
        );
    }

    // Mobile menu toggle fix — allow hamburger button to close the offcanvas
    $mobile_toggle_path = $theme_dir . '/assets/js/mobile-menu-toggle.js';
    if (file_exists($mobile_toggle_path)) {
        wp_enqueue_script(
            'steelmark-mobile-menu-toggle',
            $theme_uri . '/assets/js/mobile-menu-toggle.js',
            [],
            filemtime($mobile_toggle_path),
            true
        );
    }

    // Bio product filter JS — bio products page only
    if (is_page(['biologiska-produkter', 'biologiset-tuotteet', 'biological-products'])) {
        $bio_filter_path = $theme_dir . '/assets/js/bio-filter.js';
        if (file_exists($bio_filter_path)) {
            wp_enqueue_script(
                'steelmark-bio-filter',
                $theme_uri . '/assets/js/bio-filter.js',
                [],
                filemtime($bio_filter_path),
                true
            );
        }
    }

    // Fertilizer filter JS — fertilizer page only
    if (is_page(['vaxthusgodsel', 'kasvihuonelannoite', 'greenhouse-fertilizer'])) {
        $fert_filter_path = $theme_dir . '/assets/js/fertilizer-filter.js';
        if (file_exists($fert_filter_path)) {
            wp_enqueue_script(
                'steelmark-fertilizer-filter',
                $theme_uri . '/assets/js/fertilizer-filter.js',
                [],
                filemtime($fert_filter_path),
                true
            );
        }
    }

    // Product quickview JS — product pages + homepage only
    if ($is_product_context || is_front_page()) {
        $quickview_path = $theme_dir . '/assets/js/product-quickview.js';
        if (file_exists($quickview_path)) {
            wp_enqueue_script(
                'steelmark-quickview',
                $theme_uri . '/assets/js/product-quickview.js',
                ['steelmark-inquiry-list'],
                filemtime($quickview_path),
                true
            );

        $qv_lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';
        $qv_i18n = [
            'sv' => [
                'close'        => 'Stäng',
                'loading'      => 'Laddar...',
                'error'        => 'Kunde inte ladda produkten.',
                'viewFullPage' => 'Visa hela sidan',
            ],
            'fi' => [
                'close'        => 'Sulje',
                'loading'      => 'Ladataan...',
                'error'        => 'Tuotteen lataaminen epäonnistui.',
                'viewFullPage' => 'Näytä koko sivu',
            ],
            'en' => [
                'close'        => 'Close',
                'loading'      => 'Loading...',
                'error'        => 'Could not load product.',
                'viewFullPage' => 'View full page',
            ],
        ];

        wp_localize_script('steelmark-quickview', 'steelmarkQuickView', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce'   => wp_create_nonce('steelmark_quickview'),
            'i18n'    => $qv_i18n[$qv_lang] ?? $qv_i18n['sv'],
        ]);
    }
    } // end product quickview conditional

    // Product gallery JS (single product pages only)
    if (is_singular('product_item')) {
        $gallery_path = $theme_dir . '/assets/js/product-gallery.js';
        if (file_exists($gallery_path)) {
            wp_enqueue_script(
                'steelmark-product-gallery',
                $theme_uri . '/assets/js/product-gallery.js',
                [],
                filemtime($gallery_path),
                true
            );
        }
    }

    // --- Fertilizer layout preview page ---
    if (is_page_template('page-fertilizer-layout-preview.php')) {
        $enqueue_css('steelmark-fert-preview', 'fertilizer-preview.css');

        $fp_js_path = $theme_dir . '/assets/js/fertilizer-preview.js';
        if (file_exists($fp_js_path)) {
            wp_enqueue_script(
                'steelmark-fert-preview',
                $theme_uri . '/assets/js/fertilizer-preview.js',
                [],
                filemtime($fp_js_path),
                true
            );
        }
    }
}
add_action('wp_enqueue_scripts', 'steelmark_enqueue_assets');

/**
 * Add defer attribute to all child-theme scripts.
 * All are non-critical for initial render and already load in the footer.
 */
function steelmark_defer_scripts($tag, $handle) {
    $defer_handles = [
        'splide-core',
        'steelmark-inquiry-list',
        'steelmark-product-carousel',
        'steelmark-mega-menu-news',
        'steelmark-mega-menu-hover-intent',
        'steelmark-mobile-menu-toggle',
        'steelmark-bio-filter',
        'steelmark-fertilizer-filter',
        'steelmark-quickview',
        'steelmark-product-gallery',
        'steelmark-fert-preview',
    ];

    if (in_array($handle, $defer_handles, true) && strpos($tag, 'defer') === false) {
        $tag = str_replace(' src=', ' defer src=', $tag);
    }

    return $tag;
}
add_filter('script_loader_tag', 'steelmark_defer_scripts', 10, 2);

/* =========================================================================
   2. INQUIRY DRAWER & QUICKVIEW MODAL (moved from footer.php)
   ========================================================================= */

/**
 * Output inquiry drawer and quickview modal HTML via wp_footer.
 * These were previously in the child theme's footer.php template.
 */
function steelmark_footer_modals() {
    ?>
    <div class="inquiry-drawer-overlay ct-popup" id="inquiry-drawer-overlay" hidden></div>
    <aside class="inquiry-drawer ct-popup" id="inquiry-drawer" aria-hidden="true">
        <div class="inquiry-drawer-header">
            <h2 id="inquiry-drawer-title"></h2>
            <button class="inquiry-drawer-close" id="inquiry-drawer-close" aria-label="<?php esc_attr_e('Close', 'steelmark'); ?>">&times;</button>
        </div>
        <div class="inquiry-drawer-body" id="inquiry-drawer-body"></div>
        <div class="inquiry-drawer-footer" id="inquiry-drawer-footer"></div>
    </aside>

    <div class="quickview-overlay" id="quickview-overlay" hidden></div>
    <div class="quickview-modal" id="quickview-modal" role="dialog" aria-modal="true" aria-labelledby="quickview-title" hidden>
        <button class="quickview-close" id="quickview-close" aria-label="<?php esc_attr_e('Close', 'steelmark'); ?>">&times;</button>
        <div class="quickview-body" id="quickview-body"></div>
    </div>
    <?php
}
add_action('wp_footer', 'steelmark_footer_modals');

/* =========================================================================
   4. CATEGORY PAGE REDIRECT
   ========================================================================= */

/**
 * Redirect root product_category taxonomy archives to their rich content pages.
 */
add_action('template_redirect', function () {
    if (!is_tax('product_category')) {
        return;
    }
    $term = get_queried_object();
    if (!$term || $term->parent !== 0) {
        return; // Only redirect root categories
    }
    $page_id = get_term_meta($term->term_id, '_category_page_id', true);
    if ($page_id) {
        wp_redirect(get_permalink($page_id), 301);
        exit;
    }
});

/* =========================================================================
   5. BODY CLASSES
   ========================================================================= */

/**
 * Add page-specific body classes needed for filter JS.
 */
add_filter('body_class', function ($classes) {
    if (is_page(['biologiska-produkter', 'biologiset-tuotteet', 'biological-products'])) {
        $classes[] = 'page-bio-products';
    }
    if (is_page(['vaxthusgodsel', 'kasvihuonelannoite', 'greenhouse-fertilizer'])) {
        $classes[] = 'page-fertilizer';
    }
    if (is_page(['om-oss', 'yritys', 'about-us'])) {
        $classes[] = 'page-about';
    }
    if (is_page(['kontakt', 'yhteystiedot', 'contact'])) {
        $classes[] = 'page-contact';
    }
    // Detect product category pages (children of products overview)
    if (is_page()) {
        $parent_id = wp_get_post_parent_id(get_the_ID());
        if ($parent_id && in_array($parent_id, steelmark_get_products_page_ids(), true)) {
            $classes[] = 'page-product-category';
        }
    }
    return $classes;
});

/* =========================================================================
   6. PRODUCT ARCHIVE SORTING
   ========================================================================= */

/**
 * Sort product_category taxonomy archives alphabetically by title.
 */
add_action('pre_get_posts', function ($query) {
    if (!$query->is_main_query() || is_admin()) {
        return;
    }
    if ($query->is_tax('product_category') || $query->is_tax('product_brand')) {
        $query->set('orderby', 'title');
        $query->set('order', 'ASC');
    }
});


/* =========================================================================
   9. BANNER IMAGE
   ========================================================================= */

/**
 * Site-wide banner image URL (greenhouse aerial photo).
 */
function steelmark_banner_image_url() {
    $id = (int) get_option('steelmark_banner_image_id', 26);
    return wp_get_attachment_image_url($id, 'full');
}

/**
 * Get the products overview page IDs for all three languages.
 */
function steelmark_get_products_page_ids(): array {
    return array_filter([
        (int) get_option('steelmark_products_page_sv', 0),
        (int) get_option('steelmark_products_page_fi', 0),
        (int) get_option('steelmark_products_page_en', 0),
    ]);
}

/* =========================================================================
   9b. PRODUCT PAGE HERO (Blocksy native type-2)
   ========================================================================= */

/**
 * Provide the site-wide banner image for Blocksy type-2 hero on product pages.
 *
 * Applies to: product_item archive, product_category taxonomy,
 * product_brand taxonomy, and Products Overview pages.
 * Falls back to the site-wide greenhouse banner (ID 26).
 */
add_filter('blocksy:hero:type-2:image:attachment_id', function ($attachment_id) {
    // Already has an image (e.g., from term meta or featured image)
    if ($attachment_id) {
        return $attachment_id;
    }

    // Product taxonomy archives
    if (is_tax('product_category') || is_tax('product_brand')) {
        return (int) get_option('steelmark_banner_image_id', 26);
    }

    // Product CPT archive
    if (is_post_type_archive('product_item')) {
        return (int) get_option('steelmark_banner_image_id', 26);
    }

    return $attachment_id;
});

/* =========================================================================
   10. PARTNER LOGOS SHORTCODE
   ========================================================================= */

/**
 * [partner_logos] shortcode — renders the partner logo grid.
 * Logos are normalized 300×120 images in assets/images/logos/.
 */
function steelmark_partner_logos_shortcode() {
    $logos = [
        'alumat-zeeman'  => 'Alumat Zeeman',
        'araymond'       => 'ARaymond',
        'auvl'           => 'AUVL',
        'axia'           => 'Axia Vegetable Seeds',
        'bato'           => 'BATO',
        'bioline'        => 'Bioline AgroSciences',
        'cultilene'      => 'Cultilene Saint-Gobain',
        'drygair'        => 'DryGair',
        'dutch-plantin'  => 'Dutch Plantin',
        'food-autonomy'  => 'Food Autonomy',
        'haifa'          => 'Haifa',
        'interfiller'    => 'Interfiller a/s',
        'ks'             => 'K+S',
        'kemeling'       => 'Kemeling',
        'nivola'         => 'Nivola',
        'novarbo'        => 'Novarbo',
        'nuf'            => 'NUF',
        'pull-rhenen'    => 'Pull Rhenen',
        'rivulis'        => 'Rivulis',
        'rkw'            => 'RKW',
        'roam-technology' => 'Roam Technology',
        'simonetti'      => 'Simonetti',
        'toyota'         => 'Toyota Material Handling',
        'van-der-knaap'  => 'Van der Knaap',
        'avena-berner'   => 'Viljelijän Avena Berner',
    ];

    $dir = get_stylesheet_directory_uri() . '/assets/images/logos/';

    $html = '<div class="partners-grid">';
    foreach ($logos as $file => $name) {
        $ext = file_exists(get_stylesheet_directory() . "/assets/images/logos/{$file}.svg") ? 'svg' : 'png';
        $src = esc_url($dir . $file . '.' . $ext);
        $alt = esc_attr($name);
        $html .= '<div class="partner-logo-item">'
               . '<img class="partner-logo" src="' . $src . '" alt="' . $alt . '" width="300" height="120" loading="lazy">'
               . '</div>';
    }
    $html .= '</div>';

    return $html;
}
add_shortcode('partner_logos', 'steelmark_partner_logos_shortcode');

/* Section 10b (Latest News) removed — migrated to wp:latest-posts block in page content. */

/* =========================================================================
   11. AJAX HANDLERS — PRODUCT QUICKVIEW
   ========================================================================= */

/**
 * AJAX handler: quick-view product data by post ID.
 */
function steelmark_quickview_product() {
    check_ajax_referer('steelmark_quickview', 'nonce');

    $product_id = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;
    if (!$product_id || get_post_type($product_id) !== 'product_item') {
        wp_send_json_error('Invalid product');
    }

    wp_send_json_success(steelmark_quickview_build_data($product_id));
}
add_action('wp_ajax_quickview_product', 'steelmark_quickview_product');
add_action('wp_ajax_nopriv_quickview_product', 'steelmark_quickview_product');

/**
 * AJAX handler: quick-view product data by URL (for embed grid cards).
 */
function steelmark_quickview_product_by_url() {
    check_ajax_referer('steelmark_quickview', 'nonce');

    $url = isset($_GET['url']) ? esc_url_raw($_GET['url']) : '';
    if (!$url) {
        wp_send_json_error('No URL provided');
    }

    $product_id = url_to_postid($url);
    if (!$product_id || get_post_type($product_id) !== 'product_item') {
        wp_send_json_error('Product not found');
    }

    wp_send_json_success(steelmark_quickview_build_data($product_id));
}
add_action('wp_ajax_quickview_product_by_url', 'steelmark_quickview_product_by_url');
add_action('wp_ajax_nopriv_quickview_product_by_url', 'steelmark_quickview_product_by_url');

/**
 * Build the quick-view JSON payload for a product.
 */
function steelmark_quickview_build_data($product_id) {
    $post = get_post($product_id);

    $thumb_id = get_post_thumbnail_id($product_id);
    $image = $thumb_id ? wp_get_attachment_image_url($thumb_id, 'large') : '';
    $thumbnail = $thumb_id ? wp_get_attachment_image_url($thumb_id, 'thumbnail') : '';

    $gallery = [];
    $gallery_ids_raw = get_post_meta($product_id, '_product_gallery_ids', true);
    if ($gallery_ids_raw) {
        $gallery_ids = array_filter(array_map('intval', explode(',', $gallery_ids_raw)));

        // Prime the attachment metadata + alt text cache in a single query
        // instead of hitting the DB per image (2N queries → 2 queries)
        if (!empty($gallery_ids)) {
            _prime_post_caches($gallery_ids, false, true); // primes post meta cache
        }

        foreach ($gallery_ids as $att_id) {
            $gallery[] = [
                'full'  => wp_get_attachment_image_url($att_id, 'large'),
                'thumb' => wp_get_attachment_image_url($att_id, 'thumbnail'),
                'alt'   => get_post_meta($att_id, '_wp_attachment_image_alt', true) ?: '',
            ];
        }
    }

    $categories = [];
    $terms = get_the_terms($product_id, 'product_category');
    if ($terms && !is_wp_error($terms)) {
        foreach ($terms as $term) {
            $categories[] = [
                'name' => html_entity_decode($term->name, ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                'url'  => get_term_link($term),
            ];
        }
    }

    $brand = null;
    $brand_terms = get_the_terms($product_id, 'product_brand');
    if ($brand_terms && !is_wp_error($brand_terms)) {
        $bt = $brand_terms[0];
        $brand = ['name' => html_entity_decode($bt->name, ENT_QUOTES | ENT_HTML5, 'UTF-8'), 'url' => get_term_link($bt)];
    }

    $content = apply_filters('the_content', $post->post_content);

    $video_url = get_post_meta($product_id, '_product_link_url_0', true);
    $has_video = $video_url && preg_match('~youtu\.?be~i', $video_url);

    return [
        'id'         => $product_id,
        'title'      => html_entity_decode(get_the_title($product_id), ENT_QUOTES | ENT_HTML5, 'UTF-8'),
        'permalink'  => get_permalink($product_id),
        'image'      => $image,
        'thumbnail'  => $thumbnail,
        'gallery'    => $gallery,
        'categories' => $categories,
        'brand'      => $brand,
        'content'    => $content,
        'has_video'  => (bool) $has_video,
    ];
}

/* =========================================================================
   12. IMAGE WHITESPACE AUTO-TRIMMING
   ========================================================================= */

/**
 * Auto-trim whitespace borders from generated image thumbnails.
 */
add_filter('wp_generate_attachment_metadata', 'steelmark_trim_whitespace_sizes', 10, 2);

function steelmark_trim_whitespace_sizes($metadata, $attachment_id) {
    if (empty($metadata['sizes']) || empty($metadata['file'])) {
        return $metadata;
    }

    $upload_dir = wp_upload_dir();
    $base_path  = trailingslashit($upload_dir['basedir']);
    $file_dir   = dirname($metadata['file']);

    $original = $base_path . $metadata['file'];
    if (!file_exists($original) || !steelmark_image_has_white_border($original)) {
        return $metadata;
    }

    foreach ($metadata['sizes'] as $size_key => &$size_info) {
        $path = $base_path . $file_dir . '/' . $size_info['file'];
        if (!file_exists($path)) {
            continue;
        }

        $result = steelmark_trim_image_file($path);
        if ($result) {
            $size_info['width']  = $result['width'];
            $size_info['height'] = $result['height'];
        }
    }

    return $metadata;
}

function steelmark_gd_load($file_path) {
    $info = @getimagesize($file_path);
    if (!$info) {
        return null;
    }

    switch ($info[2]) {
        case IMAGETYPE_JPEG: $src = @imagecreatefromjpeg($file_path); break;
        case IMAGETYPE_PNG:  $src = @imagecreatefrompng($file_path);  break;
        case IMAGETYPE_WEBP: $src = @imagecreatefromwebp($file_path); break;
        default: return null;
    }
    if (!$src) {
        return null;
    }

    $w = imagesx($src);
    $h = imagesy($src);

    $flat = imagecreatetruecolor($w, $h);
    $white = imagecolorallocate($flat, 255, 255, 255);
    imagefill($flat, 0, 0, $white);
    imagealphablending($flat, true);
    imagecopy($flat, $src, 0, 0, 0, 0, $w, $h);
    imagedestroy($src);

    return $flat;
}

function steelmark_gd_save($img, $file_path) {
    $ext = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));
    switch ($ext) {
        case 'jpg': case 'jpeg': imagejpeg($img, $file_path, 90); break;
        case 'png':  imagepng($img, $file_path, 6);  break;
        case 'webp': imagewebp($img, $file_path, 90); break;
    }
}

function steelmark_image_has_white_border($file_path) {
    $img = steelmark_gd_load($file_path);
    if (!$img) {
        return false;
    }

    $w = imagesx($img);
    $h = imagesy($img);
    if ($w < 50 || $h < 50) {
        imagedestroy($img);
        return false;
    }

    $points = [
        [2, 2],
        [$w - 3, 2],
        [2, $h - 3],
        [$w - 3, $h - 3],
        [(int) ($w * 0.25), 2],
        [(int) ($w * 0.75), 2],
        [(int) ($w * 0.25), $h - 3],
        [(int) ($w * 0.75), $h - 3],
    ];

    $white = 0;
    foreach ($points as [$x, $y]) {
        $rgb = imagecolorat($img, $x, $y);
        $r = ($rgb >> 16) & 0xFF;
        $g = ($rgb >> 8) & 0xFF;
        $b = $rgb & 0xFF;
        if ($r > 240 && $g > 240 && $b > 240) {
            $white++;
        }
    }

    imagedestroy($img);
    return $white >= 6;
}

function steelmark_find_content_bounds($img, $threshold = 235) {
    $w = imagesx($img);
    $h = imagesy($img);
    $step = max(1, (int) (min($w, $h) / 150));

    $is_bg = function ($x, $y) use ($img, $threshold) {
        $rgb = imagecolorat($img, $x, $y);
        return (($rgb >> 16) & 0xFF) > $threshold
            && (($rgb >> 8) & 0xFF) > $threshold
            && ($rgb & 0xFF) > $threshold;
    };

    $top = 0;
    for ($y = 0; $y < $h; $y++) {
        for ($x = 0; $x < $w; $x += $step) {
            if (!$is_bg($x, $y)) { $top = $y; goto found_top; }
        }
    }
    found_top:

    $bottom = $h - 1;
    for ($y = $h - 1; $y > $top; $y--) {
        for ($x = 0; $x < $w; $x += $step) {
            if (!$is_bg($x, $y)) { $bottom = $y; goto found_bottom; }
        }
    }
    found_bottom:

    $left = 0;
    for ($x = 0; $x < $w; $x++) {
        for ($y = $top; $y <= $bottom; $y += $step) {
            if (!$is_bg($x, $y)) { $left = $x; goto found_left; }
        }
    }
    found_left:

    $right = $w - 1;
    for ($x = $w - 1; $x > $left; $x--) {
        for ($y = $top; $y <= $bottom; $y += $step) {
            if (!$is_bg($x, $y)) { $right = $x; goto found_right; }
        }
    }
    found_right:

    return ['top' => $top, 'right' => $right, 'bottom' => $bottom, 'left' => $left];
}

function steelmark_trim_image_file($file_path) {
    $img = steelmark_gd_load($file_path);
    if (!$img) {
        return null;
    }

    $w = imagesx($img);
    $h = imagesy($img);

    $bounds    = steelmark_find_content_bounds($img);
    $content_w = $bounds['right'] - $bounds['left'] + 1;
    $content_h = $bounds['bottom'] - $bounds['top'] + 1;

    if (($content_w * $content_h) / ($w * $h) > 0.80) {
        imagedestroy($img);
        return null;
    }

    $pad   = max(8, (int) (max($content_w, $content_h) * 0.04));
    $new_w = $content_w + 2 * $pad;
    $new_h = $content_h + 2 * $pad;

    $new_img = imagecreatetruecolor($new_w, $new_h);
    $white   = imagecolorallocate($new_img, 255, 255, 255);
    imagefill($new_img, 0, 0, $white);
    imagecopy($new_img, $img, $pad, $pad, $bounds['left'], $bounds['top'], $content_w, $content_h);
    imagedestroy($img);

    steelmark_gd_save($new_img, $file_path);
    imagedestroy($new_img);

    return ['width' => $new_w, 'height' => $new_h];
}

/* =========================================================================
   13. MEGA MENU NEWS SHORTCODE
   ========================================================================= */

/**
 * [steelmark_mega_menu_news] — renders 2 latest posts as a compact horizontal
 * strip for the mega menu dropdown. Language-aware via Polylang.
 */
function steelmark_mega_menu_news_shortcode() {
    $lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';

    $args = [
        'post_type'      => 'post',
        'posts_per_page' => 8,
        'post_status'    => 'publish',
        'orderby'        => 'date',
        'order'          => 'DESC',
    ];
    if (function_exists('pll_current_language')) {
        $args['lang'] = $lang;
    }

    $posts = get_posts($args);
    if (empty($posts)) {
        return '';
    }

    $html = '<div class="splide mega-menu-news-splide" aria-label="News">';
    $html .= '<div class="splide__track"><ul class="splide__list">';
    foreach ($posts as $post) {
        $thumb_id = get_post_thumbnail_id($post->ID);
        $title    = get_the_title($post);
        $url      = get_permalink($post);
        $site_url = get_option('siteurl');
        if (strpos($url, $site_url) === 0) {
            $url = substr($url, strlen($site_url));
        }
        $date = get_the_date('j M Y', $post);

        $html .= '<li class="splide__slide">';
        $html .= '<a href="' . esc_url($url) . '" class="mega-menu-news-card">';
        if ($thumb_id) {
            $html .= '<span class="mega-menu-news-thumb">';
            $html .= wp_get_attachment_image($thumb_id, 'thumbnail', false, [
                'class'   => 'mega-menu-news-img',
                'loading' => 'lazy',
            ]);
            $html .= '</span>';
        }
        $html .= '<span class="mega-menu-news-text">';
        $html .= '<span class="mega-menu-news-title">' . esc_html($title) . '</span>';
        $html .= '<span class="mega-menu-news-date">' . esc_html($date) . '</span>';
        $html .= '</span>';
        $html .= '</a>';
        $html .= '</li>';
    }
    $html .= '</ul></div>';
    $html .= '</div>';

    return $html;
}
add_shortcode('steelmark_mega_menu_news', 'steelmark_mega_menu_news_shortcode');

