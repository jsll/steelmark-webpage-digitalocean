# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WordPress website for **Steelmark.fi** — a company selling greenhouse technology and products. The site serves three languages: Swedish (default), Finnish, and English.

Project path: `/var/www/html/`
GitHub repo: `git@github.com:jsll/steelmark-webpage-digitalocean.git`

## Scripting Rules

- **All three languages must be handled.** Any script that modifies the website (content, pages, products, categories, etc.) must apply changes to all three languages: Swedish (`sv`), Finnish (`fi`), and English (`en`). Never create a script that only targets one language.

## WordPress Stack

- Theme: **Blocksy** parent + custom `steelmark` child theme (in `/var/www/html/wp-content/themes/steelmark/`)
- Theme companion: Blocksy Companion (required for header/footer builder)
- Multilingual: Polylang (free; upgrade to WPML later if needed)
- Custom fields: ACF (free; upgrade to Pro later)
- CPT management: CPT UI — `product_item` custom post type with `product_category` taxonomy
- SVG support: Safe SVG
- Forms: WPForms or Contact Form 7
- SEO/Redirects: Redirection plugin

### Theme Architecture
- **Blocksy** handles: header builder, footer builder, page/post templates, typography, colors, sticky header, mobile menu
- **Child theme** handles: product templates (`single-product_item.php`, `archive-product_item.php`, `taxonomy-product_category.php`, `page-products-overview.php`), inquiry list, quickview modal, product carousels, hero carousel shortcode, bio/fertilizer filters
- **Shortcodes**: `[hero_carousel]` (front page hero), `[partner_logos]` (partner logo grid)
- **CSS**: Product-specific styles in `assets/css/` (products.css, inquiry-list.css, product-carousel.css, etc.)
- **JS**: Feature-specific scripts in `assets/js/` (inquiry-list.js, product-quickview.js, hero-carousel.js, etc.)

## Server Environment

- **Hosting**: DigitalOcean droplet (IP: 178.62.250.64)
- **Web server**: Apache 2.4
- **PHP**: 8.3
- **Database**: MySQL 8.0 (database: `wordpress`)
- **WordPress root**: `/var/www/html/`

### Running WP-CLI commands
```bash
wp <command> --allow-root
```

### Access
- WordPress: http://178.62.250.64/sv/
- Admin: http://178.62.250.64/wp-admin/
