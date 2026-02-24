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

    // --- Homepage + product pages (categories grid shortcode uses home.css styles) ---
    if (is_front_page() || $is_product_context) {
        $enqueue_css('steelmark-home', 'home.css');
    }

    // --- Blog pages + front page (news shortcode reuses blog-card styles) ---
    if (is_front_page() || is_home() || is_singular('post') || is_category() || is_tag() || is_date() || is_author()) {
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

    // Hero carousel JS (front page only)
    if (is_front_page()) {
        $carousel_path = $theme_dir . '/assets/js/hero-carousel.js';
        if (file_exists($carousel_path)) {
            wp_enqueue_script(
                'steelmark-hero-carousel',
                $theme_uri . '/assets/js/hero-carousel.js',
                [],
                filemtime($carousel_path),
                true
            );
        }
    }

    // --- Fertilizer layout preview page ---
    if (is_page_template('page-fertilizer-layout-preview.php')) {
        wp_enqueue_style(
            'steelmark-fert-preview-fonts',
            'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
            [],
            null
        );
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
        'steelmark-hero-carousel',
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
   3. HERO CAROUSEL SHORTCODE
   ========================================================================= */

/**
 * [hero_carousel] shortcode — renders the front page hero carousel.
 * Extracted from the old front-page.php template.
 */
function steelmark_hero_carousel_shortcode() {
    $lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';

    $cta_labels = [
        'sv' => 'Läs mer',
        'fi' => 'Lue lisää',
        'en' => 'Read more',
    ];
    $cta = $cta_labels[$lang] ?? $cta_labels['sv'];

    // Each: [attachment_id, heading_sv, heading_fi, heading_en, subtitle_sv, subtitle_fi, subtitle_en, target_page_id_sv]
    $slides_data = [
        [441, 'Fullständigt gödselsortiment',   'Täydellinen lannoitevalikoima',    'Complete fertilizer assortment',
              'Allt från Haifa, K+S och LMI till din odling', 'Kaikkea Haifasta, K+S:stä ja LMI:stä viljelyyn', 'Everything from Haifa, K+S and LMI for your cultivation', 1242],
        [294, 'Cultilene stenullsunderlag',      'Cultilene kivivillasubstraatti',    'Cultilene stone wool substrate',
              'Högkvalitativa odlingsunderlag för professionella', 'Korkealaatuiset kasvualustat ammattilaisille', 'High-quality growing substrates for professionals', 1240],
        [443, 'Biologiska nyttodjur',            'Biologiset hyötyeläimet',           'Biological beneficial insects',
              'Naturlig växtskydd från Bioline AgroSciences', 'Luonnollinen kasvinsuojelu Bioline AgroSciencesilta', 'Natural crop protection from Bioline AgroSciences', 1244],
        [213, 'Multispan plastblockhus',         'Multispan muoviblokkikasvihuoneet', 'Multispan plastic block greenhouses',
              'Modern växthusteknik för nordiska förhållanden', 'Modernia kasvihuonetekniikkaa pohjoismaisiin olosuhteisiin', 'Modern greenhouse technology for Nordic conditions', 1254],
        [1772, 'Dutch Plantin kokosunderlag',       'Dutch Plantin kookossubstraatti',    'Dutch Plantin coco substrates',
               'Högkvalitativa kokosunderlag för professionell odling', 'Korkealaatuiset kookossubstraatit ammattimaiseen viljelyyn', 'High-quality coco substrates for professional growing', 1240],
    ];

    $heading_key  = ['sv' => 1, 'fi' => 2, 'en' => 3];
    $subtitle_key = ['sv' => 4, 'fi' => 5, 'en' => 6];
    $slides = [];
    foreach ($slides_data as $s) {
        $heading  = $s[$heading_key[$lang] ?? 1];
        $subtitle = $s[$subtitle_key[$lang] ?? 4];
        $target_id = $s[7];
        if (function_exists('pll_get_post') && $lang !== 'sv') {
            $translated = pll_get_post($target_id, $lang);
            if ($translated) {
                $target_id = $translated;
            }
        }
        $slides[] = [
            'image_id' => $s[0],
            'heading'  => $heading,
            'subtitle' => $subtitle,
            'link'     => get_permalink($target_id),
            'cta'      => $cta,
        ];
    }

    ob_start();
    ?>
    <section class="hero-carousel" aria-label="<?php esc_attr_e('Featured products', 'steelmark'); ?>">
        <div class="hero-slides">
            <?php foreach ($slides as $i => $slide) : ?>
                <div class="hero-slide<?php echo $i === 0 ? ' active' : ''; ?>"
                     aria-hidden="<?php echo $i === 0 ? 'false' : 'true'; ?>">
                    <?php
                    $img_attrs = [
                        'class'   => 'hero-slide-img',
                        'loading' => $i === 0 ? 'eager' : 'lazy',
                    ];
                    if ($i === 0) {
                        $img_attrs['fetchpriority'] = 'high';
                    }
                    echo wp_get_attachment_image($slide['image_id'], 'full', false, $img_attrs);
                    ?>
                    <div class="hero-slide-overlay">
                        <div class="hero-slide-content">
                            <h2 class="hero-slide-heading"><?php echo esc_html($slide['heading']); ?></h2>
                            <div class="hero-slide-details">
                                <?php if (!empty($slide['subtitle'])) : ?>
                                <p class="hero-slide-subtitle"><?php echo esc_html($slide['subtitle']); ?></p>
                                <?php endif; ?>
                                <a href="<?php echo esc_url($slide['link']); ?>" class="hero-slide-cta">
                                    <?php echo esc_html($slide['cta']); ?>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <button class="hero-arrow hero-arrow--prev" aria-label="<?php esc_attr_e('Previous slide', 'steelmark'); ?>">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <button class="hero-arrow hero-arrow--next" aria-label="<?php esc_attr_e('Next slide', 'steelmark'); ?>">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>

        <div class="hero-dots" role="tablist" aria-label="<?php esc_attr_e('Slide navigation', 'steelmark'); ?>">
            <?php for ($i = 0; $i < count($slides); $i++) : ?>
                <button class="hero-dot<?php echo $i === 0 ? ' active' : ''; ?>"
                        role="tab"
                        aria-selected="<?php echo $i === 0 ? 'true' : 'false'; ?>"
                        aria-label="<?php printf(esc_attr__('Slide %d', 'steelmark'), $i + 1); ?>"></button>
            <?php endfor; ?>
        </div>
    </section>
    <?php
    return ob_get_clean();
}
add_shortcode('hero_carousel', 'steelmark_hero_carousel_shortcode');

/* =========================================================================
   3b. PRODUCT CATEGORIES GRID SHORTCODE
   ========================================================================= */

/**
 * [product_categories_grid] shortcode — renders a grid of 12 main product categories.
 * Attributes:
 *   show_header — "true" (default) or "false" to hide heading/subtitle
 */
function steelmark_product_categories_grid_shortcode($atts = []) {
    $atts = shortcode_atts(['show_header' => 'true'], $atts);
    $show_header = ($atts['show_header'] !== 'false');
    $lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';

    $i18n = [
        'sv' => [
            'heading' => 'Våra produktkategorier',
            'sub'     => 'Allt en professionell växthusodlare behöver — från gödsel till belysning.',
            'more'    => 'Utforska',
        ],
        'fi' => [
            'heading' => 'Tuotekategoriamme',
            'sub'     => 'Kaikkea ammattimaisen kasvihuoneviljelijän tarpeisiin — lannoitteista valaistukseen.',
            'more'    => 'Tutustu',
        ],
        'en' => [
            'heading' => 'Our product categories',
            'sub'     => 'Everything a professional greenhouse grower needs — from fertilizers to lighting.',
            'more'    => 'Explore',
        ],
    ];
    $t = $i18n[$lang] ?? $i18n['sv'];

    // Groups matching the mega menu columns.
    // Each group: heading_sv, heading_fi, heading_en, icon SVG, items[].
    // Each item: [sv_page_id, title_sv, title_fi, title_en, desc_sv, desc_fi, desc_en, sv_term_id, override_thumb_id]
    $groups = [
        [
            'heading' => ['sv' => 'Näring & Odling', 'fi' => 'Ravinteet & Viljely', 'en' => 'Nutrition & Growing'],
            'icon'    => '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 18V8M10 8C10 5.5 12 2 16 2c0 4-2 6-6 6zM10 12C10 9.5 8 6 4 6c0 4 2 6 6 6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            'items'   => [
                [1240, 'Odlingsunderlag', 'Kasvualustat', 'Growing media',
                    'Stenull, torv och kokos.', 'Kivivilla, turve ja kookos.', 'Stone wool, peat and coco.',
                    127, 0],
                [1242, 'Växthusgödsel', 'Lannoitteet', 'Fertilizers',
                    'Komplett sortiment från Haifa, K+S och LMI.', 'Täydellinen valikoima Haifalta, K+S:ltä ja LMI:ltä.', 'Complete range from Haifa, K+S and LMI.',
                    114, 0],
                [1251, 'Växthusfrön', 'Kasvihuonesiemenet', 'Greenhouse seeds',
                    'Högkvalitativa frösorter för proffs.', 'Korkealaatuiset siemenlajikkeet ammattilaisille.', 'High-quality seed varieties for professionals.',
                    651, 0],
            ],
        ],
        [
            'heading' => ['sv' => 'Växtskydd', 'fi' => 'Kasvinsuojelu', 'en' => 'Crop Protection'],
            'icon'    => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            'items'   => [
                [1244, 'Biologiska produkter', 'Biologiset tuotteet', 'Biological products',
                    'Nyttodjur och biologisk växtskydd.', 'Hyötyeläimet ja biologinen kasvinsuojelu.', 'Beneficial insects and biological crop protection.',
                    631, 242],
                [1247, 'Desinficering & hygien', 'Desinfiointi & hygienia', 'Disinfection & hygiene',
                    'Desinfektionsmedel och hygienartiklar.', 'Desinfiointiaineet ja hygieniatarvikkeet.', 'Disinfectants and hygiene supplies.',
                    639, 0],
                [1269, 'Kemisk bekämpning', 'Kemiallinen torjunta', 'Chemical control',
                    'Växtskyddsmedel och skyddsutrustning.', 'Kasvinsuojeluaineet ja suojavarusteet.', 'Crop protection products and safety equipment.',
                    78, 262],
            ],
        ],
        [
            'heading' => ['sv' => 'Utrustning & Infrastruktur', 'fi' => 'Laitteet & Infrastruktuuri', 'en' => 'Equipment & Infrastructure'],
            'icon'    => '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            'items'   => [
                [2924, 'Bevattning', 'Kastelu', 'Irrigation',
                    'Droppbevattning, sensorer och filtreringssystem.', 'Tippukastelu, anturit ja suodatusjärjestelmät.', 'Drip irrigation, sensors and filtration systems.',
                    108, 0],
                [1246, 'Nedläggningstillbehör', 'Istutustarvikkeet', 'Planting accessories',
                    'Clips, krokar och fixeringsmaterial.', 'Kiinnikkeet, koukut ja kiinnitystarvikkeet.', 'Clips, hooks and fixing materials.',
                    635, 390],
                [1263, 'Plast, glas & polykarbonat', 'Muovi, lasi ja polykarbonaatti', 'Plastic, glass & polycarbonate',
                    'Täckmaterial från SM5-plast till växthus­glas.', 'Katemateriaalia SM5-muovista kasvihuonelasiin.', 'Covering materials from SM5 plastic to greenhouse glass.',
                    643, 2621],
                [1254, 'Växthus & underhåll', 'Kasvihuone & ylläpito', 'Greenhouses & maintenance',
                    'Kompletta växthuskonstruktioner och underhåll.', 'Kokonaiset kasvihuonerakenteet ja ylläpito.', 'Complete greenhouse structures and maintenance.',
                    619, 0],
                [1265, 'Växthusbelysning', 'Kasvihuonevalaistus', 'Greenhouse lighting',
                    'LED och HPS för optimerad tillväxt.', 'LED ja HPS optimoituun kasvuun.', 'LED and HPS for optimized growth.',
                    627, 353],
                [1238, 'Växthusteknik', 'Kasvihuonetekniikka', 'Greenhouse technology',
                    'Utrustning för det dagliga arbetet i växthuset.', 'Työvälineet päivittäiseen kasvihuonetyöhön.', 'Equipment for daily greenhouse operations.',
                    623, 2576],
            ],
        ],
    ];

    $title_key = ['sv' => 1, 'fi' => 2, 'en' => 3];
    $desc_key  = ['sv' => 4, 'fi' => 5, 'en' => 6];

    ob_start();
    ?>
    <div class="home-section categories-grid-section">
        <div class="home-section-inner">
            <?php if ($show_header) : ?>
            <div class="categories-grid-header">
                <h2 class="categories-grid-heading"><?php echo esc_html($t['heading']); ?></h2>
                <p class="categories-grid-sub"><?php echo esc_html($t['sub']); ?></p>
            </div>
            <?php endif; ?>
            <?php foreach ($groups as $group) :
                $group_heading = $group['heading'][$lang] ?? $group['heading']['sv'];
                $group_icon    = $group['icon'];
            ?>
            <div class="categories-group">
                <h3 class="categories-group-heading"><?php echo $group_icon; ?> <?php echo esc_html($group_heading); ?></h3>
                <div class="categories-grid">
                    <?php foreach ($group['items'] as $cat) :
                        $page_id = $cat[0];
                        if (function_exists('pll_get_post') && $lang !== 'sv') {
                            $translated = pll_get_post($page_id, $lang);
                            if ($translated) $page_id = $translated;
                        }
                        $title = $cat[$title_key[$lang] ?? 1];
                        $desc  = $cat[$desc_key[$lang] ?? 4];
                        $sv_term_id    = $cat[7];
                        $override_thumb = $cat[8] ?? 0;

                        // Get a product thumbnail from this category
                        $thumb_html = '';
                        if ($override_thumb) {
                            $thumb_html = wp_get_attachment_image($override_thumb, 'medium', false, ['class' => 'category-card-thumb']);
                        } else {
                            $term_id = $sv_term_id;
                            if (function_exists('pll_get_term') && $lang !== 'sv') {
                                $tr_term = pll_get_term($sv_term_id, $lang);
                                if ($tr_term) $term_id = $tr_term;
                            }
                            $product_ids = get_posts([
                                'post_type'      => 'product_item',
                                'posts_per_page' => 1,
                                'fields'         => 'ids',
                                'meta_key'       => '_thumbnail_id',
                                'tax_query'      => [['taxonomy' => 'product_category', 'terms' => $term_id]],
                                'lang'           => '',
                                'no_found_rows'  => true,
                            ]);
                            if (!empty($product_ids)) {
                                $thumb_id = get_post_thumbnail_id($product_ids[0]);
                                if ($thumb_id) {
                                    $thumb_html = wp_get_attachment_image($thumb_id, 'medium', false, ['class' => 'category-card-thumb']);
                                }
                            }
                        }
                    ?>
                    <a href="<?php echo esc_url(get_permalink($page_id)); ?>" class="category-card" data-cat="<?php echo esc_attr($cat[0]); ?>">
                        <?php if ($thumb_html) : ?>
                            <div class="category-card-thumbnail"><?php echo $thumb_html; ?></div>
                        <?php endif; ?>
                        <h4 class="category-card-title"><?php echo esc_html($title); ?></h4>
                        <p class="category-card-desc"><?php echo esc_html($desc); ?></p>
                        <span class="category-card-arrow">
                            <?php echo esc_html($t['more']); ?>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    </a>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('product_categories_grid', 'steelmark_product_categories_grid_shortcode');

/* =========================================================================
   3c. VALUE PROPOSITION SHORTCODE
   ========================================================================= */

/**
 * [steelmark_value_prop] shortcode — renders 3 value proposition cards.
 */
function steelmark_value_prop_shortcode() {
    $lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';

    $i18n = [
        'sv' => [
            'main_heading' => 'Steelmark erbjuder allt vad en professionell växthusodlare behöver!',
            'heading' => 'Varför välja oss?',
            'cards'   => [
                [
                    'title' => 'Stort lager',
                    'text'  => 'Vi har som mål att ha så stor del av produkter i lager — det ger snabb och flexibel leverans.',
                    'icon'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 10l11-8 11 8"/><line x1="3" y1="9" x2="3" y2="22"/><line x1="21" y1="9" x2="21" y2="22"/><line x1="3" y1="11" x2="21" y2="11"/><rect x="4" y="14.5" width="2.5" height="2.5"/><rect x="4" y="17" width="2.5" height="2.5"/><rect x="4" y="19.5" width="2.5" height="2.5"/><rect x="6.5" y="17" width="2.5" height="2.5"/><rect x="6.5" y="19.5" width="2.5" height="2.5"/><rect x="17.5" y="14.5" width="2.5" height="2.5"/><rect x="17.5" y="17" width="2.5" height="2.5"/><rect x="17.5" y="19.5" width="2.5" height="2.5"/><rect x="15" y="17" width="2.5" height="2.5"/><rect x="15" y="19.5" width="2.5" height="2.5"/></svg>',
                ],
                [
                    'title' => 'Direkt import',
                    'text'  => 'Vi importerar direkt från tillverkarna — färre mellanhänder och ett mera konkurrenskraftigt pris.',
                    'icon'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="3.5" ry="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M5.5 7h13"/><path d="M5.5 17h13"/></svg>',
                ],
                [
                    'title' => 'Allt för odlaren',
                    'text'  => 'Från gödsel och substrat till belysning och klimatstyrning — allt en professionell odlare behöver.',
                    'icon'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="10" width="20" height="11" rx="1.5"/><line x1="2" y1="15" x2="22" y2="15"/><path d="M8 10V7a1 1 0 011-1h6a1 1 0 011 1v3"/><path d="M10 4h4"/><rect x="10" y="13" width="4" height="4" rx="0.5"/></svg>',
                ],
            ],
        ],
        'fi' => [
            'main_heading' => 'Steelmark tarjoaa kaiken, mitä ammattimainen kasvihuoneviljelijä tarvitsee!',
            'heading' => 'Miksi valita meidät?',
            'cards'   => [
                [
                    'title' => 'Laaja varasto',
                    'text'  => 'Tavoitteenamme on pitää suurta osaa tuotteista varastossa — se takaa nopean ja joustavan toimituksen.',
                    'icon'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 10l11-8 11 8"/><line x1="3" y1="9" x2="3" y2="22"/><line x1="21" y1="9" x2="21" y2="22"/><line x1="3" y1="11" x2="21" y2="11"/><rect x="4" y="14.5" width="2.5" height="2.5"/><rect x="4" y="17" width="2.5" height="2.5"/><rect x="4" y="19.5" width="2.5" height="2.5"/><rect x="6.5" y="17" width="2.5" height="2.5"/><rect x="6.5" y="19.5" width="2.5" height="2.5"/><rect x="17.5" y="14.5" width="2.5" height="2.5"/><rect x="17.5" y="17" width="2.5" height="2.5"/><rect x="17.5" y="19.5" width="2.5" height="2.5"/><rect x="15" y="17" width="2.5" height="2.5"/><rect x="15" y="19.5" width="2.5" height="2.5"/></svg>',
                ],
                [
                    'title' => 'Suora tuonti',
                    'text'  => 'Tuomme tuotteemme suoraan valmistajilta — vähemmän välikäsiä ja kilpailukykyisemmät hinnat.',
                    'icon'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="3.5" ry="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M5.5 7h13"/><path d="M5.5 17h13"/></svg>',
                ],
                [
                    'title' => 'Kaikki viljelijälle',
                    'text'  => 'Lannoitteista ja substraateista valaistukseen ja ilmastointiin — kaikkea mitä ammattimainen viljelijä tarvitsee.',
                    'icon'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="10" width="20" height="11" rx="1.5"/><line x1="2" y1="15" x2="22" y2="15"/><path d="M8 10V7a1 1 0 011-1h6a1 1 0 011 1v3"/><path d="M10 4h4"/><rect x="10" y="13" width="4" height="4" rx="0.5"/></svg>',
                ],
            ],
        ],
        'en' => [
            'main_heading' => 'Steelmark offers everything a professional greenhouse grower needs!',
            'heading' => 'Why choose us?',
            'cards'   => [
                [
                    'title' => 'Large stock',
                    'text'  => 'We aim to keep a large share of products in stock — ensuring fast and flexible delivery.',
                    'icon'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 10l11-8 11 8"/><line x1="3" y1="9" x2="3" y2="22"/><line x1="21" y1="9" x2="21" y2="22"/><line x1="3" y1="11" x2="21" y2="11"/><rect x="4" y="14.5" width="2.5" height="2.5"/><rect x="4" y="17" width="2.5" height="2.5"/><rect x="4" y="19.5" width="2.5" height="2.5"/><rect x="6.5" y="17" width="2.5" height="2.5"/><rect x="6.5" y="19.5" width="2.5" height="2.5"/><rect x="17.5" y="14.5" width="2.5" height="2.5"/><rect x="17.5" y="17" width="2.5" height="2.5"/><rect x="17.5" y="19.5" width="2.5" height="2.5"/><rect x="15" y="17" width="2.5" height="2.5"/><rect x="15" y="19.5" width="2.5" height="2.5"/></svg>',
                ],
                [
                    'title' => 'Direct import',
                    'text'  => 'We import directly from manufacturers — fewer intermediaries and more competitive pricing.',
                    'icon'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="3.5" ry="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M5.5 7h13"/><path d="M5.5 17h13"/></svg>',
                ],
                [
                    'title' => 'Everything for growers',
                    'text'  => 'From fertilizers and substrates to lighting and climate control — everything a professional grower needs.',
                    'icon'  => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="10" width="20" height="11" rx="1.5"/><line x1="2" y1="15" x2="22" y2="15"/><path d="M8 10V7a1 1 0 011-1h6a1 1 0 011 1v3"/><path d="M10 4h4"/><rect x="10" y="13" width="4" height="4" rx="0.5"/></svg>',
                ],
            ],
        ],
    ];
    $t = $i18n[$lang] ?? $i18n['sv'];

    ob_start();
    ?>
    <div class="home-section value-prop-section">
        <div class="home-section-inner">
            <h2 class="value-prop-main-heading"><?php echo esc_html($t['main_heading']); ?></h2>
            <p class="value-prop-subheading"><?php echo esc_html($t['heading']); ?></p>
            <div class="value-prop-cards">
                <?php foreach ($t['cards'] as $card) : ?>
                <div class="value-prop-card">
                    <div class="value-prop-card-icon"><?php echo $card['icon']; ?></div>
                    <h3 class="value-prop-card-title"><?php echo esc_html($card['title']); ?></h3>
                    <p class="value-prop-card-text"><?php echo esc_html($card['text']); ?></p>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('steelmark_value_prop', 'steelmark_value_prop_shortcode');

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
   7. PRODUCT CARD SORTING (in content)
   ========================================================================= */

/**
 * Sort product cards inside product-embed-grid blocks alphabetically by title.
 * Runs at priority 12, after do_blocks (priority 9), so we work with rendered HTML.
 */
add_filter('the_content', function ($content) {
    if (!is_page() || strpos($content, 'product-embed-grid') === false) {
        return $content;
    }

    // Determine locale for collation
    $lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';
    $locale_map = ['sv' => 'sv_SE', 'fi' => 'fi_FI', 'en' => 'en_US'];
    $locale = $locale_map[$lang] ?? 'sv_SE';

    $collator = class_exists('Collator') ? new Collator($locale) : null;

    // Find all grid opening tags and their positions
    $grid_pattern = '#<div\b[^>]*class="[^"]*product-embed-grid[^"]*"[^>]*>#s';
    if (!preg_match_all($grid_pattern, $content, $grid_opens, PREG_OFFSET_CAPTURE)) {
        return $content;
    }

    // Process grids in reverse order so string replacements don't shift earlier positions
    for ($g = count($grid_opens[0]) - 1; $g >= 0; $g--) {
        $grid_open_tag = $grid_opens[0][$g][0];
        $grid_start    = $grid_opens[0][$g][1];
        $inner_start   = $grid_start + strlen($grid_open_tag);

        // Skip grids with centered-grid class (manually ordered)
        if (strpos($grid_open_tag, 'centered-grid') !== false) {
            continue;
        }

        // Find matching </div> by counting nested div depth
        $depth    = 1;
        $pos      = $inner_start;
        $len      = strlen($content);
        $inner_end = false;
        while ($pos < $len && $depth > 0) {
            $next_open  = strpos($content, '<div', $pos);
            $next_close = strpos($content, '</div>', $pos);
            if ($next_close === false) break;
            if ($next_open !== false && $next_open < $next_close) {
                $depth++;
                $pos = $next_open + 4;
            } else {
                $depth--;
                if ($depth === 0) {
                    $inner_end = $next_close;
                }
                $pos = $next_close + 6;
            }
        }
        if ($inner_end === false) continue;

        $inner_html = substr($content, $inner_start, $inner_end - $inner_start);

        // Extract product cards (cards have no nested divs, so non-greedy match works)
        if (!preg_match_all(
            '#<div\b[^>]*class="[^"]*product-card-embed[^"]*"[^>]*>.*?</div>#s',
            $inner_html,
            $cards
        )) {
            continue;
        }

        $card_blocks = $cards[0];

        // Extract title text from each card for sorting
        $card_titles = [];
        foreach ($card_blocks as $card_html) {
            $title = '';
            if (preg_match('#<span[^>]*class="[^"]*product-embed-title[^"]*"[^>]*>(.*?)</span>#s', $card_html, $tm)) {
                $title = html_entity_decode(strip_tags($tm[1]), ENT_QUOTES, 'UTF-8');
            }
            $card_titles[] = $title;
        }

        // Sort cards by title using natural order (so 250W < 1000W)
        $indices = range(0, count($card_blocks) - 1);
        usort($indices, function ($a, $b) use ($card_titles) {
            return strnatcasecmp($card_titles[$a], $card_titles[$b]);
        });

        // Rebuild inner HTML with sorted cards
        $sorted_inner = "\n";
        foreach ($indices as $i) {
            $sorted_inner .= $card_blocks[$i] . "\n";
        }

        // Replace the grid's inner content
        $content = substr($content, 0, $inner_start) . $sorted_inner . substr($content, $inner_end);
    }

    return $content;
}, 12);

/* =========================================================================
   7b. URL NORMALIZATION HELPER
   ========================================================================= */

/**
 * Normalize a URL by replacing its scheme+host with the WordPress site URL.
 *
 * When the site is accessed through a reverse proxy or Cloudflare tunnel,
 * URLs in rendered HTML use the proxy domain. WordPress functions like
 * url_to_postid() and attachment_url_to_postid() expect the canonical
 * site URL, so this helper bridges the gap.
 */
function steelmark_normalize_url($url) {
    $path = wp_parse_url($url, PHP_URL_PATH);
    if (!$path) return $url;
    return site_url($path);
}

/* =========================================================================
   7c. DYNAMIC PRODUCT CARD IMAGES
   ========================================================================= */

/**
 * Refresh product card images from the product's current featured image.
 *
 * Category page grids are built by standardization scripts that bake static
 * image URLs into post_content. This filter replaces those static images at
 * render time so that updating a product's featured image automatically
 * updates the grid card.
 *
 * Runs at priority 10: after do_blocks (9), before image-size upgrade (11)
 * and alphabetical sort (12).
 */
add_filter('the_content', function ($content) {
    if (!is_page() || strpos($content, 'product-card-embed') === false) {
        return $content;
    }

    return preg_replace_callback(
        '#<div\b[^>]*class="[^"]*product-card-embed[^"]*"[^>]*>.*?</div>#s',
        function ($match) {
            $card = $match[0];

            // Extract product URL from the card link
            if (!preg_match('#<a\s+href="([^"]+)"#', $card, $url_match)) {
                return $card;
            }

            $product_id = url_to_postid(steelmark_normalize_url($url_match[1]));
            if (!$product_id || get_post_type($product_id) !== 'product_item') {
                return $card;
            }

            $title     = get_the_title($product_id);
            $permalink = get_permalink($product_id);
            $thumb_id  = get_post_thumbnail_id($product_id);

            $img_html = '';
            if ($thumb_id) {
                $meta = wp_get_attachment_metadata($thumb_id);
                // Pick the best intermediate size whose actual width is >= 300px
                $thumb_url = null;
                foreach (['1536x1536', 'large', 'medium_large', 'medium'] as $size) {
                    if (!empty($meta['sizes'][$size]) && $meta['sizes'][$size]['width'] >= 300) {
                        $thumb_url = wp_get_attachment_image_url($thumb_id, $size);
                        break;
                    }
                }
                // Fall back to full original if all sizes are too small (whitespace-trimmed)
                if (!$thumb_url) {
                    $thumb_url = wp_get_attachment_image_url($thumb_id, 'full');
                }
                $alt = get_post_meta($thumb_id, '_wp_attachment_image_alt', true) ?: esc_attr($title);
                if ($thumb_url) {
                    $img_html = '<img src="' . esc_url($thumb_url) . '" alt="' . esc_attr($alt) . '" class="product-embed-image"/>';
                }
            }
            if (!$img_html) {
                $img_html = '<span class="product-embed-placeholder">' . esc_html(mb_substr($title, 0, 1)) . '</span>';
            }

            return '<div class="wp-block-group product-card-embed">'
                 . '<a href="' . esc_url($permalink) . '" class="product-embed-link">'
                 . $img_html
                 . '<span class="product-embed-title">' . esc_html($title) . '</span>'
                 . '</a>'
                 . '</div>';
        },
        $content
    );
}, 10);

/* =========================================================================
   8. IMAGE SIZE UPGRADE FOR PRODUCT EMBEDS
   ========================================================================= */

/**
 * Upgrade product-embed-image src to the best available size.
 * Only upgrades — never replaces with a smaller image.
 * Runs at priority 11, after do_blocks (9) and dynamic images (10),
 * but before the sort filter (12).
 */
add_filter('the_content', function ($content) {
    if (!is_page() || strpos($content, 'product-embed-image') === false) {
        return $content;
    }

    return preg_replace_callback(
        '#<img([^>]*class="[^"]*product-embed-image[^"]*"[^>]*)/?>#s',
        function ($match) {
            $tag   = $match[0];
            $attrs = $match[1];

            if (strpos($attrs, 'srcset') !== false) {
                return $tag;
            }

            if (!preg_match('#src="([^"]+)"#', $attrs, $src_match)) {
                return $tag;
            }
            $src_url = $src_match[1];

            $att_id = steelmark_resolve_attachment_id(steelmark_normalize_url($src_url));
            if (!$att_id) {
                return $tag;
            }

            $meta = wp_get_attachment_metadata($att_id);

            // Determine current src width so we only upgrade, never downgrade
            $current_width = 0;
            if (!empty($meta['sizes'])) {
                $src_basename = wp_basename($src_url);
                foreach ($meta['sizes'] as $size_info) {
                    if ($size_info['file'] === $src_basename) {
                        $current_width = (int) $size_info['width'];
                        break;
                    }
                }
            }
            // If src is the full original, treat as max width
            if ($current_width === 0) {
                $full_url = wp_get_attachment_url($att_id);
                if ($full_url && wp_basename($full_url) === wp_basename($src_url)) {
                    return $tag; // Already using full — nothing to upgrade to
                }
            }

            $new_url = null;
            foreach (['1536x1536', 'large', 'medium_large'] as $size) {
                if (empty($meta['sizes'][$size])) continue;
                $size_width = (int) $meta['sizes'][$size]['width'];
                // Skip sizes that are too small or not an upgrade
                if ($size_width < 300 || $size_width <= $current_width) continue;
                $url = wp_get_attachment_image_url($att_id, $size);
                if ($url && $url !== $src_url) {
                    $new_url = $url;
                    break;
                }
            }

            // Fall back to full original if all sizes are too small
            if (!$new_url && $current_width < 300) {
                $full_url = wp_get_attachment_image_url($att_id, 'full');
                if ($full_url && $full_url !== $src_url) {
                    $new_url = $full_url;
                }
            }

            if (!$new_url) {
                return $tag;
            }

            return str_replace($src_url, $new_url, $tag);
        },
        $content
    );
}, 11);

/**
 * Resolve a (possibly resized) image URL to its attachment ID.
 * Handles dimension suffixes (-300x200) and WordPress -scaled originals.
 */
function steelmark_resolve_attachment_id($url) {
    $id = attachment_url_to_postid($url);
    if ($id) {
        return $id;
    }

    $base_url = preg_replace('#-\d+x\d+\.#', '.', $url);
    $id = attachment_url_to_postid($base_url);
    if ($id) {
        return $id;
    }

    $scaled_url = preg_replace('#\.(\w+)$#', '-scaled.$1', $base_url);
    $id = attachment_url_to_postid($scaled_url);
    if ($id) {
        return $id;
    }

    $no_scaled = str_replace('-scaled.', '.', $base_url);
    return attachment_url_to_postid($no_scaled);
}

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

/* =========================================================================
   10b. LATEST NEWS SHORTCODE
   ========================================================================= */

/**
 * [steelmark_news] shortcode — renders latest 3 blog posts as cards.
 *
 * Reuses .blog-grid / .blog-card markup from blog.css and
 * .news-section / .news-header styles from home.css.
 */
function steelmark_news_shortcode() {
    $lang = function_exists('pll_current_language') ? pll_current_language() : 'sv';

    $i18n = [
        'sv' => ['heading' => 'Nyheter',  'more' => 'Fler nyheter',  'blog_slug' => 'nyheter'],
        'fi' => ['heading' => 'Uutiset',  'more' => 'Lisää uutisia', 'blog_slug' => 'uutiset'],
        'en' => ['heading' => 'News',     'more' => 'More news',     'blog_slug' => 'news'],
    ];
    $t = $i18n[$lang] ?? $i18n['sv'];

    $args = [
        'post_type'      => 'post',
        'posts_per_page' => 3,
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

    $blog_page = get_page_by_path($t['blog_slug']);
    $blog_url  = $blog_page ? get_permalink($blog_page) : home_url('/' . $t['blog_slug'] . '/');

    ob_start();
    ?>
    <div class="home-section news-section">
        <div class="home-section-inner">
            <div class="news-header">
                <h2 class="news-heading"><?php echo esc_html($t['heading']); ?></h2>
            </div>
            <div class="blog-grid">
                <?php foreach ($posts as $post) :
                    $thumb_id  = get_post_thumbnail_id($post->ID);
                    $categories = get_the_category($post->ID);
                    $cat_name   = !empty($categories) ? $categories[0]->name : '';
                    $excerpt    = has_excerpt($post->ID)
                        ? get_the_excerpt($post->ID)
                        : wp_trim_words(strip_shortcodes($post->post_content), 25, '&hellip;');
                ?>
                <article class="blog-card">
                    <a href="<?php echo esc_url(get_permalink($post)); ?>" class="blog-card-link">
                        <?php if ($thumb_id) : ?>
                        <div class="blog-card-image">
                            <?php echo wp_get_attachment_image($thumb_id, 'medium_large', false, [
                                'class'   => 'wp-post-image',
                                'loading' => 'lazy',
                            ]); ?>
                        </div>
                        <?php endif; ?>
                        <div class="blog-card-content">
                            <div class="blog-card-meta">
                                <?php if ($cat_name) : ?>
                                <span class="blog-card-category"><?php echo esc_html($cat_name); ?></span>
                                <?php endif; ?>
                                <time datetime="<?php echo esc_attr(get_the_date('c', $post)); ?>"><?php echo esc_html(get_the_date('', $post)); ?></time>
                            </div>
                            <h3 class="blog-card-title"><?php echo esc_html(get_the_title($post)); ?></h3>
                            <p class="blog-card-excerpt"><?php echo esc_html($excerpt); ?></p>
                        </div>
                    </a>
                </article>
                <?php endforeach; ?>
            </div>
            <div class="news-footer">
                <a href="<?php echo esc_url($blog_url); ?>" class="news-more-link">
                    <?php echo esc_html($t['more']); ?>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('steelmark_news', 'steelmark_news_shortcode');

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
                'name' => $term->name,
                'url'  => get_term_link($term),
            ];
        }
    }

    $brand = null;
    $brand_terms = get_the_terms($product_id, 'product_brand');
    if ($brand_terms && !is_wp_error($brand_terms)) {
        $bt = $brand_terms[0];
        $brand = ['name' => $bt->name, 'url' => get_term_link($bt)];
    }

    $content = apply_filters('the_content', $post->post_content);

    $video_url = get_post_meta($product_id, '_product_link_url_0', true);
    $has_video = $video_url && preg_match('~youtu\.?be~i', $video_url);

    return [
        'id'         => $product_id,
        'title'      => get_the_title($product_id),
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

/**
 * Clean up HTML artifacts in product_item content at render time.
 *
 * Strips MS Editor squiggler divs, Drupal migration wrapper divs,
 * and inline font-size/font-family styles that break consistent typography.
 */
function steelmark_clean_product_content($content) {
    if (get_post_type() !== 'product_item') {
        return $content;
    }

    // Strip ms-editor-squiggler divs (empty spell-check artifacts)
    $content = preg_replace('/<div[^>]*class="[^"]*ms-editor-squiggler[^"]*"[^>]*>.*?<\/div>/s', '', $content);

    // Unwrap Drupal migration wrapper divs (keep inner content)
    $content = preg_replace('/<div[^>]*class="[^"]*field-name-[^"]*"[^>]*>(.*?)<\/div>/s', '$1', $content);

    // Strip all inline style attributes (paste-junk and migration artifacts)
    $content = preg_replace('/\s+style="[^"]*"/', '', $content);

    // Collapse excessive blank lines (3+ newlines → 2)
    $content = preg_replace('/\n{3,}/', "\n\n", $content);

    return $content;
}
add_filter('the_content', 'steelmark_clean_product_content', 8);
