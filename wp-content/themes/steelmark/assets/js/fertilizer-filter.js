/**
 * Fertilizer product filter — fertilizer-type buttons for the fertilizer page.
 * Activates only when body.page-fertilizer is present.
 */
(function () {
    'use strict';

    if (!document.body.classList.contains('page-fertilizer')) {
        return;
    }

    // Detect language from URL path
    var path = window.location.pathname;
    var lang = 'sv';
    if (path.indexOf('/fi/') === 0) lang = 'fi';
    else if (path.indexOf('/en/') === 0) lang = 'en';

    // Categorize a product by its title into a fertilizer type.
    // Handles both original brand names and renamed display names.
    function categorize(title) {
        var t = title.toLowerCase();

        // NPK — complete fertilizer blends
        // Renamed: "NPK+Mg 15-2-25+2", "NPK 13-17-11", "NPK Skräddarsydd", etc.
        if (/^npk[\s+]/.test(t)) return 'npk';
        if (t.indexOf('soluplant') === 0) return 'npk';
        if (/steelgrow\s+(npk|fosfat|phosphat)|haifa\s+steelgrow/.test(t)) return 'npk';
        if (/mymultifeed|soluble\s+duo/.test(t)) return 'npk';

        // Calcium nitrate
        // Renamed: "Kalksalpeter GG", "Kalkkisalpietari GG", "Calcium Nitrate GG"
        if (/haifa\s+cal\b/.test(t)) return 'calcium_nitrate';
        if (/kalksalpeter|calcium\s+nitrate|kalkkisalpietari/.test(t)) return 'calcium_nitrate';

        // Potassium nitrate
        // Renamed: "Kaliumnitrat GG/Reci", "Kaliumnitraatti GG/Reci", "Potassium Nitrate GG/Reci"
        if (/multi-k/.test(t)) return 'potassium_nitrate';
        if (/kaliumnitrat|potassium\s+nitrate|kaliumnitraat/.test(t)) return 'potassium_nitrate';

        // Magnesium
        // Renamed: "Magnesiumnitrat", "Bittersalt", "Karvassuola", "Bitter Salt", etc.
        if (/magnisal|bittermag|bittersalt|karvassuola|bitter\s+salt/.test(t)) return 'magnesium';
        if (/magnesium|epso/.test(t)) return 'magnesium';

        // Micronutrients & chelates
        if (/growclean|haifastim/.test(t)) return 'micro';
        if (/steelgrow\s+micro/.test(t)) return 'micro';
        if (/mikronit|mikro\s*\+|micro/.test(t)) return 'micro';
        if (/kelat|chelat|kelaatt/.test(t)) return 'micro';

        // Phosphorus & potassium salts
        // Renamed: "MAP 12-61", "MKP 0-23-29", "Kaliumklorid", "Kaliumsulfat", etc.
        if (/\bmap\b|\bmkp\b|\bkcl\b|\bsop\b/.test(t)) return 'pk_salts';
        if (/kaliumklorid|potassium\s+chloride|kaliumkloridi/.test(t)) return 'pk_salts';
        if (/kaliumsulfat|potassium\s+sulphate|kaliumsulfaat/.test(t)) return 'pk_salts';
        if (/fosmagnit|magnofoss/.test(t)) return 'pk_salts';

        return 'other';
    }

    // Translated button labels
    var labels = {
        sv: {
            all:              'Alla',
            npk:              'NPK',
            calcium_nitrate:  'Kalciumnitrat',
            potassium_nitrate:'Kaliumnitrat',
            magnesium:        'Magnesium',
            micro:            'Mikron\u00e4ring',
            pk_salts:         'P & K',
            other:            '\u00d6vriga'
        },
        fi: {
            all:              'Kaikki',
            npk:              'NPK',
            calcium_nitrate:  'Kalsiumnitraatti',
            potassium_nitrate:'Kaliumnitraatti',
            magnesium:        'Magnesium',
            micro:            'Hivenravinteet',
            pk_salts:         'P & K',
            other:            'Muut'
        },
        en: {
            all:              'All',
            npk:              'NPK',
            calcium_nitrate:  'Calcium nitrate',
            potassium_nitrate:'Potassium nitrate',
            magnesium:        'Magnesium',
            micro:            'Micronutrients',
            pk_salts:         'P & K',
            other:            'Other'
        }
    };

    var t = labels[lang] || labels.sv;

    // Only filter the first product grid (Haifa). Other brand grids are always visible.
    var haifaGrid = document.querySelector('.product-embed-grid');
    if (!haifaGrid) return;

    var cards = haifaGrid.querySelectorAll('.product-card-embed');
    if (!cards.length) return;

    // Tag each card with its fertilizer-type category
    var cardData = [];
    cards.forEach(function (card) {
        var titleEl = card.querySelector('.product-embed-title');
        var title = titleEl ? titleEl.textContent.trim() : '';
        cardData.push({ el: card, cat: categorize(title) });
    });

    // Determine which categories have products
    var buttonOrder = ['all', 'npk', 'calcium_nitrate', 'potassium_nitrate', 'magnesium', 'micro', 'pk_salts', 'other'];
    var activeCats = {};
    cardData.forEach(function (d) { activeCats[d.cat] = true; });

    // Build filter bar
    var bar = document.createElement('div');
    bar.className = 'bio-filter-bar';

    var inner = document.createElement('div');
    inner.className = 'bio-filter-inner';
    bar.appendChild(inner);

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

            // Show/hide cards in the Haifa grid only
            cardData.forEach(function (d) {
                var show = key === 'all' || d.cat === key;
                d.el.classList.toggle('bio-hidden', !show);
            });

            // Show/hide empty message for the Haifa grid
            var visibleCount = haifaGrid.querySelectorAll('.product-card-embed:not(.bio-hidden)').length;
            var msg = haifaGrid.querySelector('.bio-filter-empty');
            if (visibleCount === 0) {
                if (!msg) {
                    msg = document.createElement('p');
                    msg.className = 'bio-filter-empty';
                    msg.textContent = lang === 'fi' ? 'Ei tuotteita t\u00e4ss\u00e4 kategoriassa.' :
                                     lang === 'en' ? 'No products in this category.' :
                                     'Inga produkter i denna kategori.';
                    haifaGrid.appendChild(msg);
                }
                msg.style.display = '';
            } else if (msg) {
                msg.style.display = 'none';
            }
        });

        inner.appendChild(btn);
    });

    // Insert bar before the Haifa grid
    haifaGrid.parentNode.insertBefore(bar, haifaGrid);

})();
