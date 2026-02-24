(function () {
    'use strict';

    var config = window.steelmarkQuickView || {};
    var ajaxUrl = config.ajaxUrl || '/wp-admin/admin-ajax.php';
    var nonce = config.nonce || '';
    var i18n = config.i18n || {};

    /* ====== Cache ====== */
    var cache = {};
    var currentXHR = null;
    var requestCounter = 0;
    var didPushState = false;
    var isClosing = false;
    var triggerElement = null;

    /* ====== DOM refs ====== */
    function getOverlay() { return document.getElementById('quickview-overlay'); }
    function getModal()   { return document.getElementById('quickview-modal'); }
    function getBody()    { return document.getElementById('quickview-body'); }
    function getClose()   { return document.getElementById('quickview-close'); }

    /* ====== Helpers ====== */
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function escapeAttr(str) {
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /* ====== AJAX fetch ====== */
    function fetchProduct(productId, callback) {
        if (cache[productId]) {
            callback(null, cache[productId]);
            return;
        }

        // Abort previous request
        if (currentXHR) {
            currentXHR.abort();
            currentXHR = null;
        }

        var myRequest = ++requestCounter;
        var url = ajaxUrl + '?action=quickview_product&product_id=' + encodeURIComponent(productId) + '&nonce=' + encodeURIComponent(nonce);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            currentXHR = null;
            if (myRequest !== requestCounter) return; // stale request
            if (xhr.status === 200) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    if (data.success && data.data) {
                        cache[productId] = data.data;
                        callback(null, data.data);
                    } else {
                        callback(data.data || i18n.error || 'Error loading product');
                    }
                } catch (e) {
                    callback(i18n.error || 'Error loading product');
                }
            } else {
                callback(i18n.error || 'Error loading product');
            }
        };
        xhr.send();
        currentXHR = xhr;
    }

    function fetchProductByUrl(productUrl, callback) {
        // Check cache by URL
        for (var key in cache) {
            if (cache[key].permalink === productUrl) {
                callback(null, cache[key]);
                return;
            }
        }

        if (currentXHR) {
            currentXHR.abort();
            currentXHR = null;
        }

        var myRequest = ++requestCounter;
        var url = ajaxUrl + '?action=quickview_product_by_url&url=' + encodeURIComponent(productUrl) + '&nonce=' + encodeURIComponent(nonce);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            currentXHR = null;
            if (myRequest !== requestCounter) return;
            if (xhr.status === 200) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    if (data.success && data.data) {
                        cache[data.data.id] = data.data;
                        callback(null, data.data);
                    } else {
                        callback(data.data || i18n.error || 'Error loading product');
                    }
                } catch (e) {
                    callback(i18n.error || 'Error loading product');
                }
            } else {
                callback(i18n.error || 'Error loading product');
            }
        };
        xhr.send();
        currentXHR = xhr;
    }

    /* ====== Render ====== */
    function renderLoading() {
        var body = getBody();
        if (!body) return;
        body.innerHTML =
            '<div class="quickview-loading">' +
                '<div class="quickview-spinner"></div>' +
            '</div>';
    }

    function renderError(msg) {
        var body = getBody();
        if (!body) return;
        body.innerHTML =
            '<div class="quickview-error">' +
                '<p>' + escapeHtml(msg) + '</p>' +
            '</div>';
    }

    function renderProduct(product) {
        var body = getBody();
        if (!body) return;

        // Image column
        var imageHtml = '';
        if (product.image) {
            imageHtml += '<div class="quickview-main-image">';
            imageHtml += '<img id="quickview-main-img" src="' + escapeAttr(product.image) + '" alt="' + escapeAttr(product.title) + '">';
            imageHtml += '</div>';

            // Gallery thumbnails
            if (product.gallery && product.gallery.length > 0) {
                imageHtml += '<div class="quickview-thumbs">';
                // Featured image as first thumb
                imageHtml += '<button class="quickview-thumb active" data-full="' + escapeAttr(product.image) + '">';
                imageHtml += '<img src="' + escapeAttr(product.thumbnail || product.image) + '" alt="' + escapeAttr(product.title) + '">';
                imageHtml += '</button>';
                for (var i = 0; i < product.gallery.length; i++) {
                    var g = product.gallery[i];
                    imageHtml += '<button class="quickview-thumb" data-full="' + escapeAttr(g.full) + '">';
                    imageHtml += '<img src="' + escapeAttr(g.thumb) + '" alt="' + escapeAttr(g.alt || '') + '">';
                    imageHtml += '</button>';
                }
                imageHtml += '</div>';
            }
        } else {
            // Placeholder
            var initial = product.title ? product.title.charAt(0) : '?';
            imageHtml += '<div class="quickview-placeholder">' + escapeHtml(initial) + '</div>';
        }

        // Content column
        var contentHtml = '';

        // Brand
        if (product.brand) {
            contentHtml += '<div class="quickview-brand">';
            contentHtml += '<a href="' + escapeAttr(product.brand.url) + '" class="quickview-brand-badge">' + escapeHtml(product.brand.name) + '</a>';
            contentHtml += '</div>';
        }

        // Categories
        if (product.categories && product.categories.length > 0) {
            contentHtml += '<div class="quickview-categories">';
            for (var c = 0; c < product.categories.length; c++) {
                var cat = product.categories[c];
                contentHtml += '<a href="' + escapeAttr(cat.url) + '" class="quickview-category-badge">' + escapeHtml(cat.name) + '</a>';
            }
            contentHtml += '</div>';
        }

        // Title
        contentHtml += '<h2 class="quickview-title" id="quickview-title">' + escapeHtml(product.title) + '</h2>';

        // Body content
        if (product.content) {
            contentHtml += '<div class="quickview-excerpt">' + product.content + '</div>';
        }

        // Actions
        contentHtml += '<div class="quickview-actions">';

        // Inquiry button
        contentHtml += '<button class="add-to-inquiry quickview-inquiry-btn"'
            + ' data-product-id="' + escapeAttr(String(product.id)) + '"'
            + ' data-product-title="' + escapeAttr(product.title) + '"'
            + ' data-product-url="' + escapeAttr(product.permalink) + '"'
            + ' data-product-thumbnail="' + escapeAttr(product.thumbnail || '') + '">'
            + '<span class="add-to-inquiry-label"></span>'
            + '</button>';

        // View full page link
        contentHtml += '<a href="' + escapeAttr(product.permalink) + '" class="quickview-full-link">'
            + escapeHtml(i18n.viewFullPage || 'View full page') + ' &rarr;</a>';

        contentHtml += '</div>';

        body.innerHTML =
            '<div class="quickview-image-col">' + imageHtml + '</div>' +
            '<div class="quickview-content-col">' + contentHtml + '</div>';

        // Bind gallery thumbnails
        bindGalleryThumbs();

        // Bind inquiry button
        if (typeof window.steelmarkInquiryRebind === 'function') {
            window.steelmarkInquiryRebind();
        }
    }

    function bindGalleryThumbs() {
        var thumbs = document.querySelectorAll('#quickview-body .quickview-thumb');
        var mainImg = document.getElementById('quickview-main-img');
        if (!mainImg || thumbs.length === 0) return;

        thumbs.forEach(function (thumb) {
            thumb.addEventListener('click', function () {
                var fullUrl = this.getAttribute('data-full');
                if (!fullUrl) return;
                mainImg.src = fullUrl;
                thumbs.forEach(function (t) { t.classList.remove('active'); });
                this.classList.add('active');
            });
        });
    }

    /* ====== Open / Close ====== */
    function openModal(productPermalink) {
        var overlay = getOverlay();
        var modal = getModal();
        if (!overlay || !modal) return;

        overlay.hidden = false;
        modal.hidden = false;

        // Force reflow before adding visible class for transition
        overlay.offsetHeight;

        overlay.classList.add('is-visible');
        modal.classList.add('is-visible');
        document.body.classList.add('quickview-open');

        // Push state (try/catch for cross-origin scenarios)
        if (productPermalink) {
            try {
                history.pushState({ quickview: true }, '', productPermalink);
                didPushState = true;
            } catch (e) {
                didPushState = false;
            }
        }

        // Focus close button
        var closeBtn = getClose();
        if (closeBtn) closeBtn.focus();

        // Update close button aria-label
        if (closeBtn) {
            closeBtn.setAttribute('aria-label', i18n.close || 'Close');
        }
    }

    function closeModal() {
        if (isClosing) return;
        isClosing = true;

        var overlay = getOverlay();
        var modal = getModal();

        if (overlay) overlay.classList.remove('is-visible');
        if (modal) modal.classList.remove('is-visible');
        document.body.classList.remove('quickview-open');

        if (didPushState) {
            didPushState = false;
            history.back();
        }

        // Restore focus
        if (triggerElement) {
            triggerElement.focus();
            triggerElement = null;
        }

        setTimeout(function () {
            if (overlay) overlay.hidden = true;
            if (modal) modal.hidden = true;
            var body = getBody();
            if (body) body.innerHTML = '';
            isClosing = false;
        }, 300);
    }

    function isModalOpen() {
        var modal = getModal();
        return modal && modal.classList.contains('is-visible');
    }

    /* ====== Focus trap ====== */
    function trapFocus(e) {
        var modal = getModal();
        if (!modal || !isModalOpen()) return;

        var focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    /* ====== Click interception ====== */
    function handleCardClick(e) {
        // Allow Ctrl/Cmd+Click to open in new tab
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;

        // Don't intercept clicks on inquiry buttons inside the card
        if (e.target.closest('.add-to-inquiry')) return;

        var link = e.target.closest('.product-card-link[data-product-id]');
        if (!link) return;

        e.preventDefault();

        var productId = link.getAttribute('data-product-id');
        if (!productId) return;

        triggerElement = link;
        var permalink = link.getAttribute('href');

        renderLoading();
        openModal(permalink);

        fetchProduct(productId, function (err, product) {
            if (err) {
                renderError(err);
                return;
            }
            renderProduct(product);
        });
    }

    function handleEmbedCardClick(e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;

        var link = e.target.closest('.product-card-embed .product-embed-link');
        if (!link) return;

        // Don't intercept clicks on inquiry buttons inside the card
        if (e.target.closest('.add-to-inquiry')) return;

        e.preventDefault();

        var productUrl = link.getAttribute('href');
        if (!productUrl) return;

        triggerElement = link;

        renderLoading();
        openModal(productUrl);

        fetchProductByUrl(productUrl, function (err, product) {
            if (err) {
                renderError(err);
                return;
            }
            renderProduct(product);
        });
    }

    /* ====== Event listeners ====== */
    function init() {
        // Taxonomy card clicks (delegated)
        document.addEventListener('click', function (e) {
            if (e.target.closest('.product-card-link[data-product-id]')) {
                handleCardClick(e);
            }
        });

        // Embed grid card clicks (delegated)
        document.addEventListener('click', function (e) {
            if (e.target.closest('.product-card-embed .product-embed-link')) {
                handleEmbedCardClick(e);
            }
        });

        // Close button
        var closeBtn = getClose();
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                closeModal();
            });
        }

        // Overlay click
        var overlay = getOverlay();
        if (overlay) {
            overlay.addEventListener('click', function () {
                closeModal();
            });
        }

        // Escape key (with stopPropagation to prevent inquiry drawer from also closing)
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isModalOpen()) {
                e.stopPropagation();
                closeModal();
            }

            // Focus trap on Tab
            if (e.key === 'Tab' && isModalOpen()) {
                trapFocus(e);
            }
        });

        // Browser back button
        window.addEventListener('popstate', function () {
            if (isModalOpen() && !isClosing) {
                // Back was pressed — close without calling history.back() again
                isClosing = true;
                didPushState = false;

                var overlayEl = getOverlay();
                var modal = getModal();

                if (overlayEl) overlayEl.classList.remove('is-visible');
                if (modal) modal.classList.remove('is-visible');
                document.body.classList.remove('quickview-open');

                if (triggerElement) {
                    triggerElement.focus();
                    triggerElement = null;
                }

                setTimeout(function () {
                    if (overlayEl) overlayEl.hidden = true;
                    if (modal) modal.hidden = true;
                    var body = getBody();
                    if (body) body.innerHTML = '';
                    isClosing = false;
                }, 300);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
