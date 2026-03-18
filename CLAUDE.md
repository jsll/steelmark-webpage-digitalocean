# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WordPress website for **Steelmark.fi** — a company selling greenhouse technology and products. The site serves three languages: Swedish (default), Finnish, and English.

Project path: `/var/www/html/`
GitHub repo: `git@github.com:jsll/steelmark-webpage-digitalocean.git`

## Scripting Rules

- **All three languages must be handled.** Any script that modifies the website (content, pages, products, categories, etc.) must apply changes to all three languages: Swedish (`sv`), Finnish (`fi`), and English (`en`). Never create a script that only targets one language.

### Greenshift Block Content Rules
When programmatically creating or modifying Greenshift block content (via WP-CLI, PHP scripts, or database queries):

- **Never encode dashes as `u002d`** in block comment JSON attributes or HTML class names. Always use literal `-` and `--`. The encoding `u002d` breaks Greenshift's JavaScript which expects actual dashes (e.g., `gspb_row--gutter-custom-0`, not `gspb_rowu002du002dgutter-custom-0`). This causes column width calculations like `calc(50% - 10010px)` instead of `calc(50% - 25px)`.
- **CSS variable references must use real dashes**: `var(--theme-palette-color-5)`, never `var(u002du002dtheme-palette-color-5)`.
- **Row blocks require `wp-block-greenshift-blocks-row`** class on the outer div (added by `useBlockProps.save()` in Greenshift v12.8+).
- **Do not set `displayStyles: false`** on row blocks unless intentional — the default is `true`.
- **After any database content changes**, flush APCu cache and restart Apache: `wp cache flush --allow-root && systemctl restart apache2`. The APCu object cache serves stale content otherwise.
- **Delete autosave revisions** after bulk DB updates to prevent "more recent autosave" prompts: `DELETE FROM wp_posts WHERE post_type = 'revision' AND post_name LIKE '%autosave%'`.

## Design System: Blocksy Landscape + Greenshift

The site is built on the **Blocksy Landscape** starter site design system. All new work must follow these rules:

### Blocks & Content
- **Use Gutenberg + Greenshift blocks** for all marketing/content sections (hero, value props, category grids, news, partner logos)
- **No new shortcodes** for layout/content rendering. Existing justified shortcodes:
  - `[partner_logos]` — used on About Us pages (IDs 1255/1256/1257)
  - `[steelmark_mega_menu_news]` — Blocksy header builder mega menu (no block alternative)
  - `[contact-form-7]` and `[instagram-feed]` — third-party plugin shortcodes
- **Block-editable content**: all page sections must be editable in the block editor, not hard-coded in PHP
- **Use synced patterns** (reusable blocks) for content shared across language pages (e.g., partner logos)

### Colors & Typography
- **Use Blocksy palette variables** (`--theme-palette-color-1` through `--theme-palette-color-8`) — never hardcode hex colors
- **No custom typography scale** — use Blocksy's heading/body hierarchy (h1–h6, body text)
- **No new fonts** — the site uses Inter (Blocksy default); do not load external Google Fonts
- **No custom CSS variable systems** — do not create parallel `--steelmark-*` variable scales for shadows, transitions, typography, etc. Use inline values or Blocksy tokens

### CSS Rules
- **Minimal child theme CSS** — only for functional product features (quickview modal, inquiry drawer, product carousels, bio/fertilizer filters, mega menu)
- **No CSS for marketing sections** — Greenshift blocks handle their own styling via inline/block CSS
- **Hardcoded fallback values** are OK in existing product CSS (e.g., `#E5E7EB` as fallback for `--theme-border-color`)

### PHP Templates (Justified)
- Product CPT templates remain as PHP: `single-product_item.php`, `taxonomy-product_category.php`, `taxonomy-product_brand.php`, `archive-product_item.php`, `page-products-overview.php`
- These are functional CPT templates, not marketing sections

### Palette Reference
```
--theme-palette-color-1: #004170  (primary blue)
--theme-palette-color-2: #7DB242  (secondary green)
--theme-palette-color-3: #f09201  (accent orange)
--theme-palette-color-4: #111827  (dark text)
--theme-palette-color-5: #E8F0F6  (light background)
--theme-palette-color-6: #F3F4F6  (lighter background)
--theme-palette-color-7: #FFFFFF  (white)
--theme-palette-color-8: #002D4F  (very dark blue)
```

## WordPress Stack

- Theme: **Blocksy** parent + custom `steelmark` child theme (in `/var/www/html/wp-content/themes/steelmark/`)
- Theme companion: Blocksy Companion (required for header/footer builder)
- Page builder: **Greenshift** (v12.8.7) — used for all page content layout
- Multilingual: Polylang (free; upgrade to WPML later if needed)
- Custom fields: ACF (free; upgrade to Pro later)
- CPT management: CPT UI — `product_item` custom post type with `product_category` taxonomy
- SVG support: Safe SVG
- Forms: Contact Form 7
- SEO/Redirects: Redirection plugin

### Theme Architecture
- **Blocksy** handles: header builder, footer builder, page/post templates, typography, colors, sticky header, mobile menu, hero sections (type-2)
- **Greenshift** handles: page content layout (rows, columns, containers, sliders, query blocks)
- **Child theme** handles: product CPT templates, inquiry list, quickview modal, product carousels, bio/fertilizer filters, mega menu customization
- **CSS**: Functional product styles in `assets/css/` (products.css, inquiry-list.css, product-quickview.css, product-carousel.css, bio-filter.css)
- **JS**: Feature-specific scripts in `assets/js/` (inquiry-list.js, product-quickview.js, product-carousel.js, product-gallery.js, bio-filter.js, fertilizer-filter.js, mega-menu-*.js, mobile-menu-toggle.js)

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
