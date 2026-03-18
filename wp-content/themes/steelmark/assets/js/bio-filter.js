/**
 * Bio product filter — pest-category buttons for biological products page.
 * Activates only when body.page-bio-products is present.
 */
(function () {
    'use strict';

    if (!document.body.classList.contains('page-bio-products')) {
        return;
    }

    // Detect language from URL path
    var path = window.location.pathname;
    var lang = 'sv';
    if (path.indexOf('/fi/') === 0) lang = 'fi';
    else if (path.indexOf('/en/') === 0) lang = 'en';

    // Category definitions: filter key → taxonomy slug per language
    var categorySlugs = {
        sv: {
            aphids: 'bladloss', thrips: 'trips', whiteflies: 'vita-flygare',
            spidermites: 'spinn', fungusgnats: 'sorgmyggor', mitefood: 'kvalsterfoda',
            pollination: 'pollinering', caterpillars: 'fjarilslarver',
            leafminers: 'minerarflugor', nematodes: 'nematoder', humlor: 'humlor'
        },
        fi: {
            aphids: 'kirvat-fi', thrips: 'ripsiaiset-fi', whiteflies: 'jauhiaiset-fi',
            spidermites: 'vihannespunkki-fi', fungusgnats: 'sienisaaski-fi',
            mitefood: 'punkkiruokaa-fi', pollination: 'polytys-fi',
            caterpillars: 'perhonen-toukat-fi', leafminers: 'miinaajakarpeset-fi',
            nematodes: 'nematodit-fi', humlor: 'kimalaiset-fi'
        },
        en: {
            aphids: 'aphids-en', thrips: 'thrips-en', whiteflies: 'whiteflies-en',
            spidermites: 'spider-mites-en', fungusgnats: 'fungus-gnats-en',
            mitefood: 'mite-food-en', pollination: 'pollination-en',
            caterpillars: 'caterpillars-en', leafminers: 'leaf-miners-en',
            nematodes: 'nematodes-en', humlor: 'bumblebees-en'
        }
    };

    var slugs = categorySlugs[lang] || categorySlugs.sv;

    // Translated button labels
    var labels = {
        sv: {
            all:          'Alla',
            aphids:       'Bladl\u00f6ss',
            thrips:       'Trips',
            whiteflies:   'Vita flygare',
            spidermites:  'Spinn',
            fungusgnats:  'Sorgmyggor',
            mitefood:     'Kvalsterf\u00f6da',
            pollination:  'Pollinering',
            caterpillars: 'Larver',
            leafminers:   'Minerarflugor',
            nematodes:    'Nematoder',
            other:        '\u00d6vriga'
        },
        fi: {
            all:          'Kaikki',
            aphids:       'Kirvat',
            thrips:       'Ripsiaiset',
            whiteflies:   'Jauhiaiset',
            spidermites:  'Punkit',
            fungusgnats:  'Sienisaaski',
            mitefood:     'Punkkien ravinto',
            pollination:  'P\u00f6lytys',
            caterpillars: 'Toukat',
            leafminers:   'Miinaajakärpäset',
            nematodes:    'Nematodit',
            other:        'Muut'
        },
        en: {
            all:          'All',
            aphids:       'Aphids',
            thrips:       'Thrips',
            whiteflies:   'Whiteflies',
            spidermites:  'Spider mites',
            fungusgnats:  'Fungus gnats',
            mitefood:     'Mite food',
            pollination:  'Pollination',
            caterpillars: 'Caterpillars',
            leafminers:   'Leaf miners',
            nematodes:    'Nematodes',
            other:        'Other'
        }
    };

    var t = labels[lang] || labels.sv;

    // Find ALL query block grids on the page
    var grids = document.querySelectorAll('.wp-block-blocksy-query');
    if (!grids.length) return;

    var allCards = [];
    grids.forEach(function (g) {
        var cards = g.querySelectorAll('.wp-block-post');
        cards.forEach(function (c) { allCards.push(c); });
    });
    if (!allCards.length) return;

    // Tag each card with its categories using taxonomy CSS classes
    var cardData = [];
    var filterKeys = ['aphids', 'thrips', 'whiteflies', 'spidermites', 'fungusgnats',
                      'mitefood', 'pollination', 'caterpillars', 'leafminers', 'nematodes', 'humlor'];

    allCards.forEach(function (card) {
        var matched = [];

        filterKeys.forEach(function (cat) {
            var slug = slugs[cat];
            if (slug && card.classList.contains('product_category-' + slug)) {
                matched.push(cat);
            }
        });

        // Merge humlor into pollination
        if (matched.indexOf('humlor') !== -1 && matched.indexOf('pollination') === -1) {
            matched.push('pollination');
        }
        // Remove humlor from matched (it's merged into pollination)
        matched = matched.filter(function (m) { return m !== 'humlor'; });

        if (matched.length === 0) {
            matched.push('other');
        }

        cardData.push({ el: card, cats: matched });
    });

    // Determine which category buttons have at least one product
    var buttonOrder = ['all', 'aphids', 'thrips', 'whiteflies', 'spidermites', 'fungusgnats', 'mitefood', 'pollination', 'caterpillars', 'leafminers', 'nematodes', 'other'];
    var activeCats = {};
    cardData.forEach(function (d) {
        d.cats.forEach(function (c) { activeCats[c] = true; });
    });

    // Build filter bar
    var bar = document.createElement('div');
    bar.className = 'bio-filter-bar';

    var inner = document.createElement('div');
    inner.className = 'bio-filter-inner';
    bar.appendChild(inner);

    var firstGrid = grids[0];
    var currentFilter = 'all';

    buttonOrder.forEach(function (key) {
        if (key !== 'all' && !activeCats[key]) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'bio-filter-btn' + (key === 'all' ? ' active' : '');
        btn.textContent = t[key] || key;
        btn.setAttribute('data-filter', key);

        btn.addEventListener('click', function () {
            if (currentFilter === key) return;
            currentFilter = key;

            // Update active button
            inner.querySelectorAll('.bio-filter-btn').forEach(function (b) {
                b.classList.toggle('active', b.getAttribute('data-filter') === key);
            });

            // Show/hide cards across all grids
            var visibleCount = 0;
            cardData.forEach(function (d) {
                var show = key === 'all' || d.cats.indexOf(key) !== -1;
                d.el.classList.toggle('bio-hidden', !show);
                if (show) visibleCount++;
            });

            // Show/hide empty grids (hide a grid entirely when none of its cards are visible)
            grids.forEach(function (g) {
                var hasVisible = g.querySelector('.wp-block-post:not(.bio-hidden)');
                g.classList.toggle('bio-hidden', !hasVisible);
            });

            // Show/hide empty message
            var msg = firstGrid.querySelector('.bio-filter-empty');
            if (visibleCount === 0) {
                if (!msg) {
                    msg = document.createElement('p');
                    msg.className = 'bio-filter-empty';
                    msg.textContent = lang === 'fi' ? 'Ei tuotteita t\u00e4ss\u00e4 kategoriassa.' :
                                     lang === 'en' ? 'No products in this category.' :
                                     'Inga produkter i denna kategori.';
                    firstGrid.appendChild(msg);
                }
                msg.style.display = '';
            } else if (msg) {
                msg.style.display = 'none';
            }
        });

        inner.appendChild(btn);
    });

    // Insert bar before the first grid
    firstGrid.parentNode.insertBefore(bar, firstGrid);

})();
