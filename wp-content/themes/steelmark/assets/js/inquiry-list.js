(function () {
    'use strict';

    var STORAGE_KEY = 'steelmark_inquiry_list';
    var config = window.steelmarkInquiry || {};
    var i18n = config.i18n || {};
    var contactUrl = config.contactUrl || '/contact/';

    /* ====== Storage helpers ====== */
    var InquiryList = {
        get: function () {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            } catch (e) {
                return [];
            }
        },
        save: function (items) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        },
        add: function (product) {
            var items = this.get();
            var url = product.url;
            if (!items.some(function (p) { return p.url === url; })) {
                items.push(product);
                this.save(items);
            }
            this.onChange();
        },
        remove: function (url) {
            var items = this.get().filter(function (p) { return p.url !== url; });
            this.save(items);
            this.onChange();
        },
        clear: function () {
            this.save([]);
            this.onChange();
        },
        has: function (url) {
            return this.get().some(function (p) { return p.url === url; });
        },
        count: function () {
            return this.get().length;
        },
        onChange: function () {
            updateBadge();
            updateAddButtons();
            renderDrawer();
        }
    };

    /* ====== Badge ====== */
    function updateBadge() {
        var count = InquiryList.count();
        document.querySelectorAll('.inquiry-badge').forEach(function (badge) {
            badge.textContent = count;
            badge.hidden = count === 0;
        });
    }

    /* ====== Add-to-inquiry buttons ====== */
    function updateAddButtons() {
        var buttons = document.querySelectorAll('.add-to-inquiry');
        buttons.forEach(function (btn) {
            var url = btn.getAttribute('data-product-url');
            var label = btn.querySelector('.add-to-inquiry-label');
            if (InquiryList.has(url)) {
                btn.classList.add('added');
                if (label) label.textContent = i18n.added || 'Added';
                updateCardIcon(btn, true);
            } else {
                btn.classList.remove('added');
                if (label) label.textContent = i18n.addToList || 'Add to inquiry';
                updateCardIcon(btn, false);
            }
        });
    }

    var ICON_ADD = '<path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>'
        + '<rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>'
        + '<line x1="9" y1="12" x2="15" y2="12"/><line x1="12" y1="9" x2="12" y2="15"/>';
    var ICON_CHECK = '<path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>'
        + '<rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>'
        + '<polyline points="9 13 11.5 15.5 15.5 10"/>';

    function updateCardIcon(btn, isAdded) {
        if (!btn.classList.contains('add-to-inquiry--card')) return;
        var svg = btn.querySelector('svg');
        if (!svg) return;
        svg.innerHTML = isAdded ? ICON_CHECK : ICON_ADD;
    }

    function handleAddClick(e) {
        e.preventDefault();
        e.stopPropagation();
        var btn = e.currentTarget;
        var url = btn.getAttribute('data-product-url') || '';
        if (InquiryList.has(url)) {
            InquiryList.remove(url);
        } else {
            InquiryList.add({
                id: parseInt(btn.getAttribute('data-product-id'), 10) || 0,
                title: btn.getAttribute('data-product-title') || '',
                url: url,
                thumbnail: btn.getAttribute('data-product-thumbnail') || ''
            });
        }
    }

    /* ====== Enhance embed product cards ====== */
    function enhanceEmbedCards() {
        document.querySelectorAll('.product-card-embed').forEach(function (card) {
            if (card.querySelector('.add-to-inquiry')) return; // already enhanced
            var link = card.querySelector('.product-embed-link');
            if (!link) return;

            var url = link.getAttribute('href') || '';
            var titleEl = card.querySelector('.product-embed-title');
            var title = titleEl ? titleEl.textContent.trim() : '';
            var img = card.querySelector('.product-embed-image');
            var thumbnail = img ? img.getAttribute('src') : '';

            var btn = document.createElement('button');
            btn.className = 'add-to-inquiry add-to-inquiry--card';
            btn.setAttribute('data-product-url', url);
            btn.setAttribute('data-product-title', title);
            btn.setAttribute('data-product-thumbnail', thumbnail || '');
            btn.setAttribute('aria-label', title);
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
                + ICON_ADD + '</svg>';
            btn.addEventListener('click', handleAddClick);

            card.appendChild(btn);
        });
    }

    /* ====== Drawer ====== */
    function openDrawer() {
        var drawer = document.getElementById('inquiry-drawer');
        var overlay = document.getElementById('inquiry-drawer-overlay');
        if (!drawer || !overlay) return;
        renderDrawer();
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        overlay.hidden = false;
        // Force reflow before adding visible class for transition
        overlay.offsetHeight;
        overlay.classList.add('is-visible');
        document.body.classList.add('inquiry-drawer-open');
        document.querySelectorAll('.inquiry-list-toggle').forEach(function (t) {
            t.setAttribute('aria-expanded', 'true');
        });
    }

    function closeDrawer() {
        var drawer = document.getElementById('inquiry-drawer');
        var overlay = document.getElementById('inquiry-drawer-overlay');
        if (!drawer || !overlay) return;
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        overlay.classList.remove('is-visible');
        document.body.classList.remove('inquiry-drawer-open');
        document.querySelectorAll('.inquiry-list-toggle').forEach(function (t) {
            t.setAttribute('aria-expanded', 'false');
        });
        setTimeout(function () { overlay.hidden = true; }, 300);
    }

    function renderDrawer() {
        var body = document.getElementById('inquiry-drawer-body');
        var footer = document.getElementById('inquiry-drawer-footer');
        var title = document.getElementById('inquiry-drawer-title');
        if (!body || !footer) return;

        if (title) title.textContent = i18n.drawerTitle || 'Your inquiry list';

        var items = InquiryList.get();

        if (items.length === 0) {
            body.innerHTML =
                '<div class="inquiry-drawer-empty">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
                        '<path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>' +
                        '<rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>' +
                    '</svg>' +
                    '<p>' + escapeHtml(i18n.emptyList || 'Your inquiry list is empty.') + '</p>' +
                    '<p>' + escapeHtml(i18n.emptyHint || 'Browse products and add the ones you are interested in.') + '</p>' +
                '</div>';
            footer.innerHTML = '';
            return;
        }

        var html = '';
        items.forEach(function (item) {
            html +=
                '<div class="inquiry-drawer-item">' +
                    '<div class="inquiry-drawer-item-thumb">' +
                        (item.thumbnail
                            ? '<img src="' + escapeAttr(item.thumbnail) + '" alt="" loading="lazy">'
                            : '') +
                    '</div>' +
                    '<div class="inquiry-drawer-item-info">' +
                        '<a class="inquiry-drawer-item-title" href="' + escapeAttr(item.url) + '">' +
                            escapeHtml(item.title) +
                        '</a>' +
                    '</div>' +
                    '<button class="inquiry-drawer-item-remove" data-remove-url="' + escapeAttr(item.url) + '" aria-label="' + escapeAttr(i18n.remove || 'Remove') + '">&times;</button>' +
                '</div>';
        });
        body.innerHTML = html;

        footer.innerHTML =
            '<button class="inquiry-drawer-send" id="inquiry-drawer-send">' +
                escapeHtml(i18n.sendInquiry || 'Send Inquiry') +
            '</button>' +
            '<button class="inquiry-drawer-clear" id="inquiry-drawer-clear">' +
                escapeHtml(i18n.clearAll || 'Clear all') +
            '</button>';

        // Bind remove buttons
        body.querySelectorAll('.inquiry-drawer-item-remove').forEach(function (btn) {
            btn.addEventListener('click', function () {
                InquiryList.remove(this.getAttribute('data-remove-url'));
            });
        });

        // Bind send button
        var sendBtn = document.getElementById('inquiry-drawer-send');
        if (sendBtn) {
            sendBtn.addEventListener('click', function () {
                var products = InquiryList.get();
                var titles = products.map(function (p) { return p.title; }).join(', ');
                window.location.href = contactUrl + '?product=' + encodeURIComponent(titles);
            });
        }

        // Bind clear button
        var clearBtn = document.getElementById('inquiry-drawer-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                InquiryList.clear();
            });
        }
    }

    /* ====== Helpers ====== */
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function escapeAttr(str) {
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /* ====== Init ====== */
    function init() {
        // Inject buttons on embed product cards
        enhanceEmbedCards();

        // Badge
        updateBadge();

        // Add-to-inquiry buttons (static + injected)
        document.querySelectorAll('.add-to-inquiry').forEach(function (btn) {
            if (!btn._inquiryBound) {
                btn.addEventListener('click', handleAddClick);
                btn._inquiryBound = true;
            }
        });
        updateAddButtons();

        // Drawer toggle — bind all instances (Blocksy renders one in offcanvas + one in desktop header)
        document.querySelectorAll('.inquiry-list-toggle').forEach(function (toggle) {
            toggle.addEventListener('click', function () {
                var drawer = document.getElementById('inquiry-drawer');
                if (drawer && drawer.classList.contains('is-open')) {
                    closeDrawer();
                } else {
                    openDrawer();
                }
            });
        });

        // Drawer close button
        var closeBtn = document.getElementById('inquiry-drawer-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeDrawer);
        }

        // Overlay click closes drawer
        var overlay = document.getElementById('inquiry-drawer-overlay');
        if (overlay) {
            overlay.addEventListener('click', closeDrawer);
        }

        // Escape key closes drawer
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeDrawer();
        });

        // CF7 form submission clears the list
        document.addEventListener('wpcf7mailsent', function () {
            InquiryList.clear();
        });

        // Set drawer title
        var titleEl = document.getElementById('inquiry-drawer-title');
        if (titleEl) titleEl.textContent = i18n.drawerTitle || 'Your inquiry list';
    }

    /* ====== Rebind for dynamically inserted content (e.g. quickview modal) ====== */
    window.steelmarkInquiryRebind = function () {
        document.querySelectorAll('.add-to-inquiry').forEach(function (btn) {
            if (!btn._inquiryBound) {
                btn.addEventListener('click', handleAddClick);
                btn._inquiryBound = true;
            }
        });
        updateAddButtons();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
