/**
 * Fertilizer Layout Preview
 * Renders 3 visualization approaches for product display
 */
(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     PRODUCT DATA
     ────────────────────────────────────────────── */
  const products = [
    // Complete NPK (Fullgödsel)
    { name: 'Soluplant Start', n: 13, p: 17, k: 11, mg: 0, extra: '', group: 'npk', series: 'soluplant', desc: 'Hög fosforhalt för plantuppfödning' },
    { name: 'Soluplant Standard', n: 20, p: 3, k: 17, mg: 1, extra: '+Mg', group: 'npk', series: 'soluplant', desc: 'Allround för vegetativ fas' },
    { name: 'Soluplant Universal', n: 20, p: 9, k: 17, mg: 0, extra: '', group: 'npk', series: 'soluplant', desc: 'Balanserad universalgödsel' },
    { name: 'Soluplant Plus', n: 23, p: 2, k: 9, mg: 2, extra: '+Mg', group: 'npk', series: 'soluplant', desc: 'Kvävrik för stark tillväxt' },
    { name: 'Soluplant Finish', n: 15, p: 2, k: 25, mg: 2, extra: '+Mg', group: 'npk', series: 'soluplant', desc: 'Kaliumrik för mognadsfas' },
    { name: 'Soluplant Multi', n: 6, p: 9, k: 30, mg: 2, extra: '+Mg', group: 'npk', series: 'soluplant', desc: 'Mycket hög kaliumhalt' },
    { name: 'Soluplant Solid', n: 12, p: 5, k: 30, mg: 1, extra: '+Mg', group: 'npk', series: 'soluplant', desc: 'Hög kalium, medelhög kväve' },
    { name: 'Soluplant Special', n: 8, p: 4, k: 29, mg: 3, extra: '+Mg', group: 'npk', series: 'soluplant', desc: 'Hög kalium + magnesium' },
    { name: 'Soluplant (custom)', n: 0, p: 0, k: 0, mg: 0, extra: 'Skräddarsydd', group: 'npk', series: 'soluplant', desc: 'Anpassad sammansättning' },
    { name: 'Haifa Steelgrow NPK', n: 7, p: 10, k: 32, mg: 0, extra: '', group: 'npk', desc: 'Hög kalium fullgödsel' },
    { name: 'SteelGrow NPK Fosfat', n: 0, p: 11, k: 21, mg: 0, extra: '+MgS+ME', group: 'npk', desc: 'Fosfor-kalium med spårelement' },
    { name: 'Haifa GrowClean', n: 5.5, p: 31, k: 40, mg: 0, extra: '', group: 'npk', desc: 'Rengörande fullgödsel, mycket hög P+K' },
    { name: 'Haifa GrowClean Micro', n: 5, p: 31, k: 39, mg: 0, extra: '+mikro', group: 'npk', desc: 'GrowClean med mikronäringsämnen' },

    // Single-nutrient salts
    { name: 'Haifa Multi-K GG', n: 13.5, p: 0, k: 46.2, mg: 0, extra: '', group: 'salt', desc: 'Kaliumnitrat (greenhouse grade)' },
    { name: 'Haifa Multi-K Reci', n: 13.5, p: 0, k: 46.5, mg: 0, extra: 'Na max 300 ppm', group: 'salt', desc: 'Kaliumnitrat (recirkulering)' },
    { name: 'Haifa MAP', n: 12, p: 61, k: 0, mg: 0, extra: '', group: 'salt', desc: 'Monoammoniumfosfat' },
    { name: 'Haifa-MKP Tech', n: 0, p: 23, k: 29, mg: 0, extra: '', group: 'salt', desc: 'Monokaliumfosfat' },
    { name: 'Haifa SOP', n: 0, p: 0, k: 52, mg: 0, extra: 'Kaliumsulfat', group: 'salt', desc: 'Kaliumsulfat (klorfri)' },
    { name: 'Haifa KCL', n: 0, p: 0, k: 49.8, mg: 0, extra: 'Cl 47%', group: 'salt', desc: 'Kaliumklorid' },
    { name: 'Haifa Soluble DUO', n: 3, p: 0, k: 8, mg: 0, extra: '+Ca 25%', group: 'salt', desc: 'Kalcium-kalium kombination' },

    // Calcium
    { name: 'Haifa Cal GG', n: 15.5, p: 0, k: 0, mg: 0, extra: 'CaO 26.5%', group: 'calcium', desc: 'Kalciumnitrat (greenhouse grade)' },
    { name: 'Flytande kalksalpeter', n: 8.7, p: 0, k: 0, mg: 0, extra: 'CaO 17.5%', group: 'calcium', desc: 'Flytande kalciumnitrat' },
    { name: 'Kalciumkloridpulver', n: 0, p: 0, k: 0, mg: 0, extra: '77% CaCl\u2082', group: 'calcium', desc: 'Kalciumklorid i pulverform' },
    { name: 'Kalciumv\u00e4tska', n: 0, p: 0, k: 0, mg: 0, extra: 'Flytande Ca', group: 'calcium', desc: 'Flytande kalcium' },

    // Magnesium
    { name: 'Haifa BitterMag', n: 0, p: 0, k: 0, mg: 0, extra: 'MgO 16.3%, SO\u2083 32.4%', group: 'magnesium', desc: 'Magnesiumsulfat (Haifa)' },
    { name: 'Haifa Magnisal', n: 11, p: 0, k: 0, mg: 0, extra: 'MgO 16%', group: 'magnesium', desc: 'Magnesiumnitrat med kväve' },
    { name: 'MgSO\u2084 EPSO', n: 0, p: 0, k: 0, mg: 0, extra: 'Mg 10%, S 13%', group: 'magnesium', desc: 'Magnesiumsulfat (Epsom)' },

    // Micronutrients
    { name: 'SteelGrow Micro', n: 0, p: 0, k: 0, mg: 0, extra: 'Fe/Mn/Cu/Zn/B/Mo', group: 'micro', desc: 'Komplett mikronäringspulver' },
    { name: 'LMI J\u00e4rnkelat', n: 0, p: 0, k: 0, mg: 0, extra: 'Fe-DTPA 3.1%', group: 'micro', desc: 'Järnkelat för droppbevattning' },
    { name: 'LMI Mikro+', n: 0, p: 0, k: 0, mg: 0, extra: 'Fe/Mn/Cu/Zn EDTA', group: 'micro', desc: 'Flytande mikronäringsblandning' },
    { name: 'LMI Magnofoss', n: 1, p: 12, k: 0, mg: 0, extra: 'Mg 4.4%', group: 'micro', desc: 'Fosfor-magnesiumkälla' },
    { name: 'Kelater', n: 0, p: 0, k: 0, mg: 0, extra: 'Fe/Zn/Mn/Cu', group: 'micro', desc: 'Kelaterade spårelement' },
    { name: 'Mikronit', n: 0, p: 0, k: 0, mg: 0, extra: 'Flytande mikro', group: 'micro', desc: 'Flytande mikronäringsämnen' },

    // Acids & chemicals
    { name: 'Fosforsyra', n: 0, p: 0, k: 0, mg: 0, extra: '85%', group: 'acid', desc: '85% fosforsyra' },
    { name: 'Salpetersyra', n: 0, p: 0, k: 0, mg: 0, extra: '60%', group: 'acid', desc: '60% salpetersyra' },
    { name: 'V\u00e4teperoxid', n: 0, p: 0, k: 0, mg: 0, extra: '35%', group: 'acid', desc: '35% väteperoxid' },

    // Biostimulants
    { name: 'HaifaStim KIR', n: 0, p: 0, k: 0, mg: 0, extra: 'Kitosan + mikro', group: 'bio', desc: 'Biostimulant med kitosan' },

    // Custom
    { name: 'Haifa MyMultifeed', n: 0, p: 0, k: 0, mg: 0, extra: 'A/B BigBag', group: 'custom', desc: 'Skräddarsytt A/B-system' },
  ];

  const groupMeta = {
    npk:       { label: 'Fullgödsel (NPK)',       icon: '\u25C6', iconClass: 'fp-icon-npk',    color: '#2d6a4f' },
    salt:      { label: 'Enskilda näringsämnen',   icon: '\u25C7', iconClass: 'fp-icon-salt',   color: '#7b5ea7' },
    calcium:   { label: 'Kalciumprodukter',        icon: '\u25CF', iconClass: 'fp-icon-ca',     color: '#4a7c9b' },
    magnesium: { label: 'Magnesiumkällor',         icon: '\u25CB', iconClass: 'fp-icon-mg',     color: '#d4a017' },
    micro:     { label: 'Mikronäringsämnen',       icon: '\u2726', iconClass: 'fp-icon-micro',  color: '#c05e3c' },
    acid:      { label: 'Syror & kemikalier',      icon: '\u25B2', iconClass: 'fp-icon-acid',   color: '#b35900' },
    bio:       { label: 'Biostimulanter',          icon: '\u274B', iconClass: 'fp-icon-bio',    color: '#2e7d32' },
    custom:    { label: 'Speciallösningar',        icon: '\u2699', iconClass: 'fp-icon-custom', color: '#5a5a52' },
  };

  const groupBgMap = {
    npk: '#d8f3dc', salt: '#e8dff5', calcium: '#d0e4f0', magnesium: '#f5e6b8',
    micro: '#fde8e8', acid: '#ffecd2', bio: '#e8f5e8', custom: '#f0efe8',
  };

  const groupOrder = ['npk', 'salt', 'calcium', 'magnesium', 'micro', 'acid', 'bio', 'custom'];

  /* ──────────────────────────────────────────────
     BRAND FILTERING — Only Haifa products in visualizations
     ────────────────────────────────────────────── */
  products.forEach(function (p) {
    p.brand = (p.series === 'soluplant' || p.name.indexOf('Haifa') >= 0 || p.name.indexOf('SteelGrow') >= 0) ? 'haifa' : 'other';
  });

  var haifaProducts = products.filter(function (p) { return p.brand === 'haifa'; });
  var otherProducts = products.filter(function (p) { return p.brand !== 'haifa'; });

  function buildOtherProductsSection() {
    if (!otherProducts.length) return '';
    var html = '<div class="fp-other-section">';
    html += '<div class="fp-other-divider"></div>';
    html += '<h3 class="fp-other-heading">\u00d6vriga produkter i kategorin</h3>';
    html += '<p class="fp-other-subtext">Dessa produkter visas i standardlistan l\u00e4ngst ner p\u00e5 kategorisidan.</p>';
    html += '<div class="fp-other-grid">';
    otherProducts.forEach(function (p) {
      var total = p.n + p.p + p.k;
      html += '<div class="fp-other-card">';
      html += '<div class="fp-other-name">' + p.name + '</div>';
      if (total > 0) {
        html += '<div class="fp-other-npk"><span style="color:var(--fp-n)">' + p.n + '</span>-<span style="color:var(--fp-p)">' + p.p + '</span>-<span style="color:var(--fp-k)">' + p.k + '</span></div>';
      }
      html += '<div class="fp-other-desc-text">' + p.desc + '</div>';
      if (p.extra) html += '<div class="fp-other-extra">' + p.extra + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
    return html;
  }

  /* ──────────────────────────────────────────────
     TAB SWITCHING
     ────────────────────────────────────────────── */
  document.querySelectorAll('.fp-tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.fp-tab-btn').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.fp-tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('fp-panel-' + btn.dataset.tab).classList.add('active');
    });
  });

  /* ──────────────────────────────────────────────
     APPROACH A: FUNCTIONAL GROUPS
     ────────────────────────────────────────────── */
  function buildPanelA() {
    var panel = document.getElementById('fp-panel-a');
    if (!panel) return;
    var html = '';

    // Legend
    html += '<div class="fp-npk-legend">' +
      '<div class="fp-npk-legend-item"><div class="fp-npk-legend-dot" style="background:var(--fp-n)"></div><span class="fp-npk-legend-label">N</span><span class="fp-npk-legend-desc">Kväve \u2014 tillväxt</span></div>' +
      '<div class="fp-npk-legend-item"><div class="fp-npk-legend-dot" style="background:var(--fp-p)"></div><span class="fp-npk-legend-label">P</span><span class="fp-npk-legend-desc">Fosfor \u2014 rotutveckling</span></div>' +
      '<div class="fp-npk-legend-item"><div class="fp-npk-legend-dot" style="background:var(--fp-k)"></div><span class="fp-npk-legend-label">K</span><span class="fp-npk-legend-desc">Kalium \u2014 fruktsättning</span></div>' +
      '</div>';

    groupOrder.forEach(function (gKey) {
      var items = haifaProducts.filter(function (p) { return p.group === gKey; });
      if (!items.length) return;
      var meta = groupMeta[gKey];

      html += '<div class="fp-func-group">';
      html += '<div class="fp-func-group-header">' +
        '<div class="fp-func-group-icon ' + meta.iconClass + '">' + meta.icon + '</div>' +
        '<h2>' + meta.label + '</h2>' +
        '<span class="fp-count">' + items.length + ' produkter</span>' +
        '</div>';

      if (gKey === 'npk') {
        html += buildSoluplantStrip(items);
        var otherNPK = items.filter(function (p) { return p.series !== 'soluplant'; });
        if (otherNPK.length) {
          html += '<div style="margin-top:1.25rem">';
          otherNPK.forEach(function (p) { html += buildNPKRow(p); });
          html += '</div>';
        }
      } else if (items.some(function (p) { return (p.n + p.p + p.k) > 0; })) {
        items.forEach(function (p) {
          if ((p.n + p.p + p.k) > 0) {
            html += buildNPKRow(p);
          } else {
            html += buildNonNPKRow(p, gKey);
          }
        });
      } else {
        html += '<div class="fp-non-npk-grid">';
        items.forEach(function (p) {
          html += '<div class="fp-non-npk-card">' +
            '<div class="fp-card-name">' + p.name + '</div>' +
            '<div class="fp-card-desc">' + p.desc + '</div>' +
            '<div class="fp-comp-badges">' +
            (p.extra ? p.extra.split(',').map(function (e) {
              return '<span class="fp-comp-badge" style="background:' + groupBgMap[gKey] + ';color:' + meta.color + '">' + e.trim() + '</span>';
            }).join('') : '') +
            '</div></div>';
        });
        html += '</div>';
      }

      html += '</div>';
    });

    panel.innerHTML = html + buildOtherProductsSection();
  }

  function buildSoluplantStrip(items) {
    var soluplants = items.filter(function (p) { return p.series === 'soluplant' && (p.n + p.p + p.k) > 0; })
      .sort(function (a, b) {
        var ra = a.k / (a.n + a.p + a.k || 1);
        var rb = b.k / (b.n + b.p + b.k || 1);
        return ra - rb;
      });
    var customSolu = items.find(function (p) { return p.series === 'soluplant' && (p.n + p.p + p.k) === 0; });

    var html = '<div class="fp-soluplant-strip">' +
      '<h3>Soluplant-serien</h3>' +
      '<p class="fp-strip-sub">8 sammansättningar fr\u00e5n kv\u00e4vrik (tillv\u00e4xt) till kaliumrik (mognad) \u2014 sorterade efter K-halt</p>' +
      '<table class="fp-solu-table"><thead><tr>' +
      '<th style="width:170px">Variant</th>' +
      '<th class="fp-col-n" style="width:80px">N</th>' +
      '<th class="fp-col-p" style="width:80px">P</th>' +
      '<th class="fp-col-k" style="width:80px">K</th>' +
      '<th style="width:50px">Mg</th>' +
      '<th>NPK-spektrum</th>' +
      '<th>Anv\u00e4ndning</th>' +
      '</tr></thead><tbody>';

    soluplants.forEach(function (p) {
      var maxVal = Math.max(p.n, p.p, p.k);
      html += '<tr>' +
        '<td class="fp-name-cell">' + p.name.replace('Soluplant ', '') + '</td>' +
        '<td class="fp-val-cell' + (p.n === maxVal ? ' fp-highlight' : '') + '" style="color:var(--fp-n)">' + p.n + '</td>' +
        '<td class="fp-val-cell' + (p.p === maxVal ? ' fp-highlight' : '') + '" style="color:var(--fp-p)">' + p.p + '</td>' +
        '<td class="fp-val-cell' + (p.k === maxVal ? ' fp-highlight' : '') + '" style="color:var(--fp-k)">' + p.k + '</td>' +
        '<td class="fp-val-cell" style="color:var(--fp-text-ter)">' + (p.mg || '\u2014') + '</td>' +
        '<td>' +
        '<span class="fp-mini-bar" style="background:var(--fp-n);width:' + (p.n / 30 * 60) + 'px"></span>' +
        '<span class="fp-mini-bar" style="background:var(--fp-p);width:' + (p.p / 30 * 60) + 'px"></span>' +
        '<span class="fp-mini-bar" style="background:var(--fp-k);width:' + (p.k / 30 * 60) + 'px"></span>' +
        '</td>' +
        '<td style="font-size:0.75rem;color:var(--fp-text-sec)">' + p.desc + '</td>' +
        '</tr>';
    });

    if (customSolu) {
      html += '<tr>' +
        '<td class="fp-name-cell">' + customSolu.name.replace('Soluplant ', '') + '</td>' +
        '<td colspan="5" style="font-style:italic;color:var(--fp-text-ter);font-size:0.8rem">Skr\u00e4ddarsydd sammansättning efter behov</td>' +
        '<td style="font-size:0.75rem;color:var(--fp-text-sec)">' + customSolu.desc + '</td>' +
        '</tr>';
    }

    html += '</tbody></table></div>';
    return html;
  }

  function buildNPKRow(p) {
    return '<div class="fp-npk-product">' +
      '<div class="fp-product-name">' + p.name + '</div>' +
      '<div class="fp-npk-bar-container"><div class="fp-npk-bar">' +
      '<div class="fp-seg fp-seg-n" style="flex:' + p.n + '">' + (p.n > 4 ? p.n : '') + '</div>' +
      '<div class="fp-seg fp-seg-p" style="flex:' + p.p + '">' + (p.p > 4 ? p.p : '') + '</div>' +
      '<div class="fp-seg fp-seg-k" style="flex:' + p.k + '">' + (p.k > 4 ? p.k : '') + '</div>' +
      '</div></div>' +
      '<div class="fp-npk-values">' +
      '<span class="fp-val-n">' + p.n + '</span>-<span class="fp-val-p">' + p.p + '</span>-<span class="fp-val-k">' + p.k + '</span>' +
      (p.extra ? ' <span style="color:var(--fp-text-ter)">' + p.extra + '</span>' : '') +
      '</div></div>';
  }

  function buildNonNPKRow(p, gKey) {
    var meta = groupMeta[gKey];
    return '<div class="fp-npk-product" style="grid-template-columns:220px 1fr auto">' +
      '<div class="fp-product-name">' + p.name + '</div><div></div>' +
      '<div class="fp-comp-badges" style="justify-content:flex-end">' +
      '<span class="fp-comp-badge" style="background:' + groupBgMap[gKey] + ';color:' + meta.color + '">' + (p.extra || p.desc) + '</span>' +
      '</div></div>';
  }

  /* ──────────────────────────────────────────────
     APPROACH B: NUTRIENT-CENTRIC
     ────────────────────────────────────────────── */
  function buildPanelB() {
    var panel = document.getElementById('fp-panel-b');
    if (!panel) return;

    var nutrients = [
      {
        symbol: 'N', name: 'Kv\u00e4ve', desc: 'Blad- och skottillv\u00e4xt, proteinsyntes',
        color: '#2d6a4f', bg: '#d8f3dc',
        getVal: function (p) { return p.n; },
        filter: function (p) { return p.n > 0; }
      },
      {
        symbol: 'P', name: 'Fosfor', desc: 'Rotutveckling, energiomsättning, blomning',
        color: '#d4a017', bg: '#f5e6b8',
        getVal: function (p) { return p.p; },
        filter: function (p) { return p.p > 0; }
      },
      {
        symbol: 'K', name: 'Kalium', desc: 'Fruktkvalitet, motst\u00e5ndskraft, vattenbalans',
        color: '#7b5ea7', bg: '#e8dff5',
        getVal: function (p) { return p.k; },
        filter: function (p) { return p.k > 0; }
      },
      {
        symbol: 'Ca', name: 'Kalcium', desc: 'Cellv\u00e4ggsstyrka, fruktfasthet',
        color: '#4a7c9b', bg: '#d0e4f0',
        getVal: function (p) {
          if (p.extra.indexOf('CaO 26.5') >= 0) return 26.5;
          if (p.extra.indexOf('CaO 17.5') >= 0) return 17.5;
          if (p.extra.indexOf('77% CaCl') >= 0) return 77;
          if (p.extra.indexOf('Ca 25') >= 0) return 25;
          if (p.extra.indexOf('Flytande Ca') >= 0) return 15;
          return 0;
        },
        filter: function (p) { return p.group === 'calcium' || p.extra.indexOf('Ca ') >= 0; }
      },
      {
        symbol: 'Mg', name: 'Magnesium', desc: 'Klorofyllbildning, fotosyntesaktivitet',
        color: '#9a7200', bg: '#f5e6b8',
        getVal: function (p) {
          if (p.extra.indexOf('MgO 16.3') >= 0) return 16.3;
          if (p.extra.indexOf('MgO 16%') >= 0) return 16;
          if (p.extra.indexOf('Mg 10%') >= 0) return 10;
          if (p.extra.indexOf('Mg 4.4') >= 0) return 4.4;
          if (p.mg) return p.mg;
          return 0;
        },
        filter: function (p) { return p.group === 'magnesium' || (p.mg && p.mg > 0) || p.extra.indexOf('Mg ') >= 0; }
      },
      {
        symbol: '\u00b5', name: 'Mikron\u00e4rings\u00e4mnen', desc: 'Fe, Mn, Cu, Zn, B, Mo \u2014 enzymer och tillv\u00e4xtreglering',
        color: '#c05e3c', bg: '#fde8e8',
        getVal: function (p) {
          if (p.group === 'micro') return 10;
          if (p.extra.indexOf('mikro') >= 0 || p.extra.indexOf('+ME') >= 0) return 5;
          return 0;
        },
        filter: function (p) { return p.group === 'micro' || p.extra.indexOf('mikro') >= 0 || p.extra.indexOf('+ME') >= 0; }
      },
      {
        symbol: 'pH', name: 'Syror & kemikalier', desc: 'pH-justering, vattenrening, systemunderh\u00e5ll',
        color: '#b35900', bg: '#ffecd2',
        getVal: function (p) {
          if (p.extra.indexOf('85%') >= 0) return 85;
          if (p.extra.indexOf('60%') >= 0) return 60;
          if (p.extra.indexOf('35%') >= 0) return 35;
          return 0;
        },
        filter: function (p) { return p.group === 'acid'; }
      },
    ];

    var html = '';

    nutrients.forEach(function (nut) {
      var matching = haifaProducts.filter(nut.filter).sort(function (a, b) { return nut.getVal(b) - nut.getVal(a); });
      if (!matching.length) return;

      var maxVal = Math.max.apply(null, matching.map(nut.getVal));

      html += '<div class="fp-nutrient-section">' +
        '<div class="fp-nutrient-header">' +
        '<div class="fp-nutrient-symbol" style="color:' + nut.color + '">' + nut.symbol + '</div>' +
        '<div class="fp-nutrient-name-block"><h3>' + nut.name + '</h3>' +
        '<div class="fp-nutrient-desc">' + nut.desc + '</div></div>' +
        '<span style="font-family:var(--fp-font-mono);font-size:0.7rem;color:var(--fp-text-ter);margin-left:auto">' + matching.length + ' produkter</span>' +
        '</div><div class="fp-nutrient-products">';

      matching.forEach(function (p) {
        var val = nut.getVal(p);
        var pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
        html += '<div class="fp-nutrient-row">' +
          '<div class="fp-np-name">' + p.name + '</div>' +
          '<div class="fp-np-bar-wrap"><div class="fp-np-bar-fill" style="width:' + pct + '%;background:' + nut.color + ';opacity:0.7"></div></div>' +
          '<div class="fp-np-value" style="color:' + nut.color + '">' + val + (nut.symbol === 'pH' ? '%' : '') + '</div>' +
          '</div>';
      });

      html += '</div></div>';
    });

    panel.innerHTML = html + buildOtherProductsSection();
  }

  /* ──────────────────────────────────────────────
     APPROACH C: TERNARY PLOT
     ────────────────────────────────────────────── */
  function buildPanelC() {
    var panel = document.getElementById('fp-panel-c');
    if (!panel) return;

    var npkProducts = haifaProducts.filter(function (p) { return (p.n + p.p + p.k) > 0; });
    var nonNpkProducts = haifaProducts.filter(function (p) { return (p.n + p.p + p.k) === 0; });

    var W = 600, pad = 60;
    var triH = Math.sqrt(3) / 2;
    var H = pad + (W - 2 * pad) * triH + pad;

    var vN = { x: W / 2, y: pad };
    var vP = { x: pad, y: pad + (W - 2 * pad) * triH };
    var vK = { x: W - pad, y: pad + (W - 2 * pad) * triH };

    function toXY(n, p, k) {
      var total = n + p + k;
      if (total === 0) return { x: W / 2, y: (vN.y + vP.y + vK.y) / 3 };
      var fn = n / total, fp = p / total, fk = k / total;
      return { x: fn * vN.x + fp * vP.x + fk * vK.x, y: fn * vN.y + fp * vP.y + fk * vK.y };
    }

    function lerp(a, b, t) {
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }

    // Grid lines
    var gridLines = '';
    for (var i = 1; i <= 4; i++) {
      var t = i / 5;
      var p1 = lerp(vN, vP, t), p2 = lerp(vN, vK, t);
      gridLines += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" stroke="#e2e1d9" stroke-width="0.5" stroke-dasharray="3,3"/>';
      p1 = lerp(vP, vN, t); p2 = lerp(vP, vK, t);
      gridLines += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" stroke="#e2e1d9" stroke-width="0.5" stroke-dasharray="3,3"/>';
      p1 = lerp(vK, vN, t); p2 = lerp(vK, vP, t);
      gridLines += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y + '" stroke="#e2e1d9" stroke-width="0.5" stroke-dasharray="3,3"/>';
    }

    // Soluplant path
    var soluplants = npkProducts.filter(function (p) { return p.series === 'soluplant'; })
      .sort(function (a, b) {
        return (a.k / (a.n + a.p + a.k || 1)) - (b.k / (b.n + b.p + b.k || 1));
      });

    var soluPath = '';
    if (soluplants.length > 1) {
      var pts = soluplants.map(function (p) { return toXY(p.n, p.p, p.k); });
      soluPath = '<polyline points="' + pts.map(function (p) { return p.x + ',' + p.y; }).join(' ') +
        '" fill="none" stroke="#40916c" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.6"/>';
    }

    // Product dots
    var dots = '';
    npkProducts.forEach(function (p) {
      var pt = toXY(p.n, p.p, p.k);
      var isSolu = p.series === 'soluplant';
      var color = '#2d6a4f';
      var r = isSolu ? 7 : 6;
      if (p.group === 'salt') color = '#7b5ea7';
      if (p.group === 'calcium') color = '#4a7c9b';
      if (p.group === 'magnesium') color = '#d4a017';
      if (p.group === 'micro') color = '#c05e3c';

      dots += '<circle cx="' + pt.x + '" cy="' + pt.y + '" r="' + r + '" fill="' + color + '" stroke="white" stroke-width="2" ' +
        'style="cursor:pointer;transition:r 0.15s" ' +
        'data-name="' + escHtml(p.name) + '" data-npk="' + p.n + '-' + p.p + '-' + p.k + '" data-desc="' + escHtml(p.desc) + '" ' +
        'class="fp-ternary-dot"/>';

      if (isSolu) {
        var shortName = p.name.replace('Soluplant ', '');
        dots += '<text x="' + pt.x + '" y="' + (pt.y - 12) + '" text-anchor="middle" font-family="var(--fp-font-mono)" font-size="9" fill="#8a8a80" pointer-events="none">' + shortName + '</text>';
      }
    });

    // Zone annotations
    var zN = toXY(75, 12.5, 12.5);
    var zP = toXY(10, 75, 15);
    var zK = toXY(10, 15, 75);

    // Scale labels
    var scaleLabels = '';
    [20, 40, 60, 80].forEach(function (v) {
      var t2 = v / 100;
      var pLeft = lerp(vN, vP, t2);
      scaleLabels += '<text x="' + (pLeft.x - 12) + '" y="' + (pLeft.y + 3) + '" text-anchor="end" font-family="var(--fp-font-mono)" font-size="8" fill="#8a8a80">' + (100 - v) + '</text>';
    });

    var html = '<div class="fp-ternary-layout"><div class="fp-ternary-plot-area">' +
      '<svg class="fp-ternary-svg" viewBox="0 0 ' + W + ' ' + Math.ceil(H) + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="fpTriBg" x1="50%" y1="0%" x2="50%" y2="100%">' +
      '<stop offset="0%" style="stop-color:rgba(45,106,79,0.04)"/>' +
      '<stop offset="100%" style="stop-color:rgba(123,94,167,0.04)"/>' +
      '</linearGradient></defs>' +
      '<polygon points="' + vN.x + ',' + vN.y + ' ' + vP.x + ',' + vP.y + ' ' + vK.x + ',' + vK.y + '" fill="url(#fpTriBg)" stroke="#e2e1d9" stroke-width="1.5"/>' +
      gridLines +
      '<text class="fp-plot-annotation" x="' + zN.x + '" y="' + zN.y + '" text-anchor="middle" opacity="0.5">Tillv\u00e4xt</text>' +
      '<text class="fp-plot-annotation" x="' + (zP.x + 15) + '" y="' + zP.y + '" text-anchor="middle" opacity="0.5">Rotutveckling</text>' +
      '<text class="fp-plot-annotation" x="' + (zK.x - 15) + '" y="' + zK.y + '" text-anchor="middle" opacity="0.5">Mognad</text>' +
      soluPath + dots +
      '<text x="' + vN.x + '" y="' + (vN.y - 18) + '" text-anchor="middle" font-family="var(--fp-font-display)" font-size="22" font-weight="700" fill="#2d6a4f">N</text>' +
      '<text x="' + vN.x + '" y="' + (vN.y - 4) + '" text-anchor="middle" font-family="var(--fp-font-body)" font-size="10" fill="#8a8a80">Kv\u00e4ve</text>' +
      '<text x="' + (vP.x - 18) + '" y="' + (vP.y + 6) + '" text-anchor="middle" font-family="var(--fp-font-display)" font-size="22" font-weight="700" fill="#d4a017">P</text>' +
      '<text x="' + (vP.x - 18) + '" y="' + (vP.y + 20) + '" text-anchor="middle" font-family="var(--fp-font-body)" font-size="10" fill="#8a8a80">Fosfor</text>' +
      '<text x="' + (vK.x + 18) + '" y="' + (vK.y + 6) + '" text-anchor="middle" font-family="var(--fp-font-display)" font-size="22" font-weight="700" fill="#7b5ea7">K</text>' +
      '<text x="' + (vK.x + 18) + '" y="' + (vK.y + 20) + '" text-anchor="middle" font-family="var(--fp-font-body)" font-size="10" fill="#8a8a80">Kalium</text>' +
      scaleLabels +
      '</svg>' +
      '<div class="fp-ternary-legend">' +
      '<div class="fp-ternary-legend-item"><div class="fp-ternary-legend-dot" style="background:#2d6a4f"></div><span>Fullg\u00f6dsel / Soluplant</span></div>' +
      '<div class="fp-ternary-legend-item"><div class="fp-ternary-legend-dot" style="background:#7b5ea7"></div><span>Enskilda salter</span></div>' +
      '<div class="fp-ternary-legend-item"><div class="fp-ternary-legend-dot" style="background:#4a7c9b"></div><span>Kalcium</span></div>' +
      '<div class="fp-ternary-legend-item"><div class="fp-ternary-legend-dot" style="background:#d4a017"></div><span>Magnesium</span></div>' +
      '</div></div>';

    // Sidebar
    html += '<div class="fp-ternary-sidebar"><h3>Utan NPK-v\u00e4rden</h3>' +
      '<p>Dessa produkter har inte standardiserade NPK-f\u00f6rh\u00e5llanden och visas separat.</p>';

    var sidebarGroups = {};
    nonNpkProducts.forEach(function (p) {
      if (!sidebarGroups[p.group]) sidebarGroups[p.group] = [];
      sidebarGroups[p.group].push(p);
    });

    Object.keys(sidebarGroups).forEach(function (gKey) {
      var items = sidebarGroups[gKey];
      var meta = groupMeta[gKey];
      html += '<div class="fp-sidebar-group"><h4 style="color:' + meta.color + '">' + meta.icon + ' ' + meta.label + '</h4>';
      items.forEach(function (p) {
        html += '<div class="fp-sidebar-product"><strong>' + p.name + '</strong><br><span class="fp-sp-comp">' + (p.extra || p.desc) + '</span></div>';
      });
      html += '</div>';
    });

    html += '</div></div>';
    panel.innerHTML = html + buildOtherProductsSection();

    // Attach hover events
    initTernaryTooltips();
  }

  function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ──────────────────────────────────────────────
     TERNARY TOOLTIPS
     ────────────────────────────────────────────── */
  function initTernaryTooltips() {
    var tooltip = document.getElementById('fp-tooltip');
    if (!tooltip) return;

    document.querySelectorAll('.fp-ternary-dot').forEach(function (dot) {
      dot.addEventListener('mouseenter', function (e) {
        tooltip.innerHTML = '<div class="fp-tt-name">' + dot.dataset.name + '</div>' +
          '<div class="fp-tt-npk">N-P-K ' + dot.dataset.npk + '</div>' +
          '<div class="fp-tt-desc">' + dot.dataset.desc + '</div>';
        tooltip.classList.add('visible');
        positionTooltip(e);
      });

      dot.addEventListener('mouseleave', function () {
        tooltip.classList.remove('visible');
      });

      dot.addEventListener('mouseover', function () {
        var r = parseFloat(dot.getAttribute('r'));
        dot.setAttribute('r', r + 3);
      });

      dot.addEventListener('mouseout', function () {
        var isSolu = dot.dataset.name.indexOf('Soluplant') >= 0;
        dot.setAttribute('r', isSolu ? 7 : 6);
      });
    });

    document.addEventListener('mousemove', function (e) {
      if (tooltip.classList.contains('visible')) {
        positionTooltip(e);
      }
    });
  }

  function positionTooltip(e) {
    var tooltip = document.getElementById('fp-tooltip');
    if (!tooltip) return;
    tooltip.style.left = (e.clientX + 16) + 'px';
    tooltip.style.top = (e.clientY - 10) + 'px';
  }

  /* ──────────────────────────────────────────────
     APPROACH D: PERIODIC TABLE
     ────────────────────────────────────────────── */
  function buildPanelD() {
    var panel = document.getElementById('fp-panel-d');
    if (!panel) return;

    var columns = [
      { key: 'n_dom', label: 'N-dominant', desc: 'Kv\u00e4ve > P+K' },
      { key: 'balanced', label: 'Balanserad', desc: 'J\u00e4mn f\u00f6rdelning' },
      { key: 'k_dom', label: 'K-dominant', desc: 'Kalium > N+P' },
      { key: 'p_dom', label: 'P-dominant', desc: 'Fosfor > N+K' },
      { key: 'single', label: 'Enkeln\u00e4ring', desc: 'En huvudn\u00e4ring' },
      { key: 'secondary', label: 'Sekund\u00e4r', desc: 'Ca, Mg, S' },
      { key: 'micro', label: 'Mikro/Kemisk', desc: 'Sp\u00e5r\u00e4mnen, syror' },
    ];

    var rows = [
      { key: 'soluplant', label: 'Soluplant', color: '#d8f3dc' },
      { key: 'steelgrow', label: 'SteelGrow', color: '#e8f5e8' },
      { key: 'haifa_npk', label: 'Haifa NPK', color: '#d8f3dc' },
      { key: 'haifa_salt', label: 'Haifa Salter', color: '#e8dff5' },
      { key: 'lmi', label: 'LMI', color: '#fde8e8' },
      { key: 'other', label: '\u00d6vriga', color: '#f0efe8' },
    ];

    function classify(p) {
      var total = p.n + p.p + p.k;
      if (total === 0) return 'micro';
      if (p.group === 'salt' && (p.n === 0 || p.p === 0 || p.k === 0)) return 'single';
      if (p.group === 'calcium' || p.group === 'magnesium') return 'secondary';
      var nR = p.n / total, pR = p.p / total, kR = p.k / total;
      if (pR > 0.4) return 'p_dom';
      if (nR > 0.45) return 'n_dom';
      if (kR > 0.5) return 'k_dom';
      if (Math.abs(nR - kR) < 0.15 && pR < 0.25) return 'balanced';
      if (kR > nR && kR > pR) return 'k_dom';
      if (nR > kR && nR > pR) return 'n_dom';
      return 'balanced';
    }

    function getRow(p) {
      if (p.series === 'soluplant') return 'soluplant';
      if (p.name.indexOf('SteelGrow') >= 0) return 'steelgrow';
      if (p.name.indexOf('LMI') >= 0 || p.name === 'Kelater' || p.name === 'Mikronit') return 'lmi';
      if (p.group === 'npk' && p.name.indexOf('Haifa') >= 0) return 'haifa_npk';
      if ((p.group === 'salt' || p.group === 'calcium' || p.group === 'magnesium') && p.name.indexOf('Haifa') >= 0) return 'haifa_salt';
      return 'other';
    }

    // Build grid
    var grid = {};
    rows.forEach(function (r) { grid[r.key] = {}; columns.forEach(function (c) { grid[r.key][c.key] = []; }); });
    haifaProducts.forEach(function (p) {
      var rk = getRow(p), ck = classify(p);
      if (grid[rk] && grid[rk][ck]) grid[rk][ck].push(p);
    });

    var html = '<div class="fp-ptable"><table><thead><tr><th></th>';
    columns.forEach(function (c) { html += '<th>' + c.label + '<br><span style="font-weight:400;font-size:0.58rem;color:var(--fp-text-ter)">' + c.desc + '</span></th>'; });
    html += '</tr></thead><tbody>';

    rows.forEach(function (r) {
      html += '<tr><td class="fp-ptable-row-label" style="border-left:3px solid ' + r.color + ';padding-left:0.5rem">' + r.label + '</td>';
      columns.forEach(function (c) {
        var items = grid[r.key][c.key];
        if (!items.length) {
          html += '<td class="fp-ptable-cell pt-empty"></td>';
        } else {
          html += '<td class="fp-ptable-cell" style="background:' + r.color + '">';
          items.forEach(function (p) {
            var total = p.n + p.p + p.k;
            html += '<div class="pt-name">' + p.name.replace('Soluplant ', 'SP ').replace('Haifa ', '').replace('SteelGrow ', 'SG ') + '</div>';
            if (total > 0) {
              html += '<div class="pt-formula" style="color:var(--fp-text-sec)"><span style="color:var(--fp-n)">' + p.n + '</span>-<span style="color:var(--fp-p)">' + p.p + '</span>-<span style="color:var(--fp-k)">' + p.k + '</span></div>';
            } else {
              html += '<div class="pt-formula">' + (p.extra || '') + '</div>';
            }
            if (items.length > 1 && items.indexOf(p) < items.length - 1) html += '<div style="border-top:1px solid rgba(0,0,0,0.08);margin:0.3rem 0"></div>';
          });
          html += '</td>';
        }
      });
      html += '</tr>';
    });

    html += '</tbody></table></div>';
    panel.innerHTML = html + buildOtherProductsSection();
  }

  /* ──────────────────────────────────────────────
     APPROACH E: GUIDED WIZARD
     ────────────────────────────────────────────── */
  var wizardState = { step: 0, crop: '', stage: '', method: '' };

  var wizardSteps = [
    {
      question: 'Vad odlar du?',
      hint: 'V\u00e4lj den gr\u00f6da som \u00e4r n\u00e4rmast din odling',
      key: 'crop',
      options: [
        { id: 'tomato', icon: '\ud83c\udf45', label: 'Tomat', desc: 'Tomater, aubergine' },
        { id: 'cucumber', icon: '\ud83e\udd52', label: 'Gurka', desc: 'Gurka, melon, squash' },
        { id: 'pepper', icon: '\ud83c\udf36', label: 'Paprika', desc: 'Paprika, chili' },
        { id: 'salad', icon: '\ud83e\udd6c', label: 'Sallad & \u00f6rter', desc: 'Bladgr\u00f6nsaker' },
        { id: 'flower', icon: '\ud83c\udf3b', label: 'Blommor', desc: 'Prydnadsv\u00e4xter' },
      ]
    },
    {
      question: 'Vilken tillv\u00e4xtfas?',
      hint: 'Olika faser kr\u00e4ver olika n\u00e4ringsbalans',
      key: 'stage',
      options: [
        { id: 'seedling', icon: '\ud83c\udf31', label: 'Plantuppf\u00f6dning', desc: 'Fr\u00f6 till planta' },
        { id: 'vegetative', icon: '\ud83c\udf3f', label: 'Vegetativ tillv\u00e4xt', desc: 'Aktiv blad- och skottillv\u00e4xt' },
        { id: 'flowering', icon: '\ud83c\udf38', label: 'Blomning', desc: 'Blombildning och pollinering' },
        { id: 'fruiting', icon: '\ud83c\udf4e', label: 'Frukts\u00e4ttning', desc: 'Fruktutveckling och mognad' },
      ]
    },
    {
      question: 'Applikationsmetod?',
      hint: 'Hur ska g\u00f6dslet tillf\u00f6ras?',
      key: 'method',
      options: [
        { id: 'drip', icon: '\ud83d\udca7', label: 'Droppbevattning', desc: 'Via bev\u00e4ttningssystem' },
        { id: 'foliar', icon: '\ud83c\udf43', label: 'Bladg\u00f6dsling', desc: 'Sprutning p\u00e5 blad' },
        { id: 'granular', icon: '\u26ab', label: '\u00d6verg\u00f6dsling', desc: 'Direkt i substrat' },
      ]
    },
  ];

  // Recommendation engine
  var recommendations = {
    'tomato-seedling': [
      { name: 'Soluplant Start', npk: '13-17-11', reason: 'H\u00f6g fosforhalt fr\u00e4mjar rotetablering under plantuppf\u00f6dning.' },
      { name: 'Haifa MAP', npk: '12-61-0', reason: 'Fosforkoncentrat f\u00f6r extra rotstimulans vid beh\u00f6v.' },
    ],
    'tomato-vegetative': [
      { name: 'Soluplant Plus', npk: '23-2-9+Mg', reason: 'H\u00f6gsta kv\u00e4vehalten f\u00f6r kraftig vegetativ tillv\u00e4xt.' },
      { name: 'Soluplant Standard', npk: '20-3-17+Mg', reason: 'Allround med bra balans f\u00f6r etablerade plantor.' },
      { name: 'Haifa Cal GG', npk: '15.5-0-0 +CaO 26.5%', reason: 'Kalciumtillskott f\u00f6r att f\u00f6rebygga blossom end rot.' },
    ],
    'tomato-flowering': [
      { name: 'Soluplant Universal', npk: '20-9-17', reason: 'Balanserad g\u00f6dsel f\u00f6r \u00f6verg\u00e5ng till blomning.' },
      { name: 'Haifa Cal GG', npk: '15.5-0-0 +CaO', reason: 'Kalcium f\u00f6r starka cellv\u00e4ggar under blomning.' },
    ],
    'tomato-fruiting': [
      { name: 'Soluplant Finish', npk: '15-2-25+Mg', reason: 'H\u00f6g kaliumhalt f\u00f6r fruktkvalitet och f\u00e4rgutveckling.' },
      { name: 'Soluplant Multi', npk: '6-9-30+Mg', reason: 'Maximal kalium f\u00f6r mognad av tunga sk\u00f6rdar.' },
      { name: 'Haifa SOP', npk: 'K 52%', reason: 'Kaliumsulfat f\u00f6r snabb kaliumh\u00f6jning.' },
    ],
    'cucumber-seedling': [
      { name: 'Soluplant Start', npk: '13-17-11', reason: 'Fosforrik f\u00f6r snabb rotetablering.' },
    ],
    'cucumber-vegetative': [
      { name: 'Soluplant Plus', npk: '23-2-9+Mg', reason: 'Kv\u00e4verik f\u00f6r gurkans snabba vegetativa tillv\u00e4xt.' },
      { name: 'Soluplant Standard', npk: '20-3-17+Mg', reason: 'Balanserat alternativ med god K-halt.' },
    ],
    'cucumber-flowering': [
      { name: 'Soluplant Universal', npk: '20-9-17', reason: 'Balanserad f\u00f6r \u00f6verg\u00e5ngen till fruktbildning.' },
    ],
    'cucumber-fruiting': [
      { name: 'Soluplant Solid', npk: '12-5-30+Mg', reason: 'H\u00f6g K f\u00f6r gurkans intensiva frukts\u00e4ttning.' },
      { name: 'Haifa Multi-K GG', npk: '13.5-0-46.2', reason: 'Kaliumnitrat f\u00f6r snabb K-tillf\u00f6rsel.' },
    ],
    'pepper-seedling': [
      { name: 'Soluplant Start', npk: '13-17-11', reason: 'F\u00f6r stark rotetablering i tidig fas.' },
    ],
    'pepper-vegetative': [
      { name: 'Soluplant Standard', npk: '20-3-17+Mg', reason: 'Allround f\u00f6r paprikans vegetativa fas.' },
    ],
    'pepper-flowering': [
      { name: 'Soluplant Universal', npk: '20-9-17', reason: 'Balanserad f\u00f6r blombildning.' },
      { name: 'Haifa Cal GG', npk: '15.5-0-0 +CaO', reason: 'Kalcium f\u00f6r fruktkvalitet.' },
    ],
    'pepper-fruiting': [
      { name: 'Soluplant Finish', npk: '15-2-25+Mg', reason: 'Kaliumrik f\u00f6r f\u00e4rg och smak.' },
    ],
    'salad-seedling': [
      { name: 'Soluplant Start', npk: '13-17-11', reason: 'Snabb rotetablering.' },
    ],
    'salad-vegetative': [
      { name: 'Soluplant Plus', npk: '23-2-9+Mg', reason: 'H\u00f6gsta N-halt f\u00f6r maximal bladtillv\u00e4xt.' },
      { name: 'Haifa Magnisal', npk: '11-0-0 +MgO 16%', reason: 'Kv\u00e4ve + Mg f\u00f6r gr\u00f6n bladf\u00e4rg.' },
    ],
    'salad-flowering': [
      { name: 'Soluplant Plus', npk: '23-2-9+Mg', reason: 'Forts\u00e4tt med N-rik g\u00f6dsel f\u00f6r bladgr\u00f6nsaker.' },
    ],
    'salad-fruiting': [
      { name: 'Soluplant Plus', npk: '23-2-9+Mg', reason: 'Bladgr\u00f6nsaker sk\u00f6rdas i vegetativ fas.' },
    ],
    'flower-seedling': [
      { name: 'Soluplant Start', npk: '13-17-11', reason: 'F\u00f6r rotetablering av sticklingar/plantor.' },
    ],
    'flower-vegetative': [
      { name: 'Soluplant Standard', npk: '20-3-17+Mg', reason: 'Allround f\u00f6r uppbyggnad av v\u00e4xten.' },
    ],
    'flower-flowering': [
      { name: 'Soluplant Finish', npk: '15-2-25+Mg', reason: 'Kalium f\u00f6r riklig blomning och h\u00e5llbarhet.' },
      { name: 'HaifaStim KIR', npk: 'Kitosan', reason: 'Biostimulant f\u00f6r f\u00f6rb\u00e4ttrad blomkvalitet.' },
    ],
    'flower-fruiting': [
      { name: 'Soluplant Finish', npk: '15-2-25+Mg', reason: 'Forts\u00e4tt med K-rik f\u00f6r l\u00e5ng blomning.' },
    ],
  };

  function buildPanelE() {
    var panel = document.getElementById('fp-panel-e');
    if (!panel) return;
    wizardState = { step: 0, crop: '', stage: '', method: '' };
    renderWizardStep(panel);
  }

  function renderWizardStep(panel) {
    if (wizardState.step >= wizardSteps.length) {
      renderWizardResults(panel);
      return;
    }
    var step = wizardSteps[wizardState.step];
    var html = '<div class="fp-wizard">';

    // Progress
    html += '<div class="fp-wizard-progress">';
    for (var i = 0; i < wizardSteps.length; i++) {
      var cls = i < wizardState.step ? 'done' : (i === wizardState.step ? 'active' : '');
      html += '<div class="fp-wizard-step-dot ' + cls + '"></div>';
    }
    html += '</div>';

    html += '<div class="fp-wizard-question">' + step.question + '</div>';
    html += '<div class="fp-wizard-hint">Steg ' + (wizardState.step + 1) + ' av ' + wizardSteps.length + ' \u2014 ' + step.hint + '</div>';
    html += '<div class="fp-wizard-options">';

    step.options.forEach(function (opt) {
      var sel = wizardState[step.key] === opt.id ? ' selected' : '';
      html += '<div class="fp-wizard-opt' + sel + '" data-wiz-key="' + step.key + '" data-wiz-val="' + opt.id + '">' +
        '<div class="wo-icon">' + opt.icon + '</div>' +
        '<div class="wo-label">' + opt.label + '</div>' +
        '<div class="wo-desc">' + opt.desc + '</div>' +
        '</div>';
    });

    html += '</div>';

    html += '<div class="fp-wizard-nav">';
    if (wizardState.step > 0) html += '<button class="fp-wiz-back">Tillbaka</button>';
    html += '<button class="fp-wiz-next primary"' + (wizardState[step.key] ? '' : ' disabled') + '>N\u00e4sta</button>';
    html += '</div></div>';

    panel.innerHTML = html;

    // Events
    panel.querySelectorAll('.fp-wizard-opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        wizardState[opt.dataset.wizKey] = opt.dataset.wizVal;
        panel.querySelectorAll('.fp-wizard-opt').forEach(function (o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
        panel.querySelector('.fp-wiz-next').disabled = false;
      });
    });

    var nextBtn = panel.querySelector('.fp-wiz-next');
    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (!wizardState[step.key]) return;
      wizardState.step++;
      renderWizardStep(panel);
    });

    var backBtn = panel.querySelector('.fp-wiz-back');
    if (backBtn) backBtn.addEventListener('click', function () {
      wizardState.step--;
      renderWizardStep(panel);
    });
  }

  function renderWizardResults(panel) {
    var key = wizardState.crop + '-' + wizardState.stage;
    var recs = recommendations[key] || [{ name: 'Soluplant Standard', npk: '20-3-17+Mg', reason: 'Allround g\u00f6dsel som fungerar i de flesta situationer.' }];

    var cropNames = { tomato: 'Tomat', cucumber: 'Gurka', pepper: 'Paprika', salad: 'Sallad & \u00f6rter', flower: 'Blommor' };
    var stageNames = { seedling: 'Plantuppf\u00f6dning', vegetative: 'Vegetativ tillv\u00e4xt', flowering: 'Blomning', fruiting: 'Frukts\u00e4ttning' };

    var html = '<div class="fp-wizard"><div class="fp-wizard-results">';
    html += '<h3>Rekommenderade produkter</h3>';
    html += '<p class="wr-subtitle">' + cropNames[wizardState.crop] + ' \u2014 ' + stageNames[wizardState.stage] + '</p>';

    recs.forEach(function (rec, i) {
      html += '<div class="fp-wizard-rec">' +
        '<div class="wr-rank">' + (i + 1) + '</div>' +
        '<div><div class="wr-name">' + rec.name + '</div>' +
        '<div class="wr-npk">N-P-K ' + rec.npk + '</div>' +
        '<div class="wr-reason">' + rec.reason + '</div></div>' +
        '</div>';
    });

    // Supplements
    html += '<div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--fp-border-light)">';
    html += '<h4 style="font-size:0.85rem;font-weight:600;color:var(--fp-text-sec);margin:0 0 0.75rem 0">Kompletterande produkter:</h4>';
    html += '<div class="fp-non-npk-grid">';
    html += '<div class="fp-non-npk-card"><div class="fp-card-name">SteelGrow Micro</div><div class="fp-card-desc">Komplett mikron\u00e4ringspulver</div><div class="fp-comp-badges"><span class="fp-comp-badge" style="background:#fde8e8;color:#c05e3c">Fe/Mn/Cu/Zn/B/Mo</span></div></div>';
    html += '<div class="fp-non-npk-card"><div class="fp-card-name">HaifaStim KIR</div><div class="fp-card-desc">Biostimulant med kitosan</div><div class="fp-comp-badges"><span class="fp-comp-badge" style="background:#e8f5e8;color:#2e7d32">Kitosan + mikro</span></div></div>';
    html += '</div></div>';

    html += '<div class="fp-wizard-nav"><button class="fp-wiz-restart">B\u00f6rja om</button></div>';
    html += '</div></div>';

    panel.innerHTML = html;

    panel.querySelector('.fp-wiz-restart').addEventListener('click', function () {
      wizardState = { step: 0, crop: '', stage: '', method: '' };
      renderWizardStep(panel);
    });
  }

  /* ──────────────────────────────────────────────
     APPROACH F: SUBCATEGORY TABS + CARDS
     ────────────────────────────────────────────── */
  function buildPanelF() {
    var panel = document.getElementById('fp-panel-f');
    if (!panel) return;

    var subcats = [
      { key: 'all', label: 'Alla' },
      { key: 'npk', label: 'Fullg\u00f6dsel' },
      { key: 'salt', label: 'Salter' },
      { key: 'calcium', label: 'Kalcium' },
      { key: 'magnesium', label: 'Magnesium' },
      { key: 'micro', label: 'Mikro' },
      { key: 'acid', label: 'Syror' },
    ];

    var html = '<div class="fp-npk-legend">' +
      '<div class="fp-npk-legend-item"><div class="fp-npk-legend-dot" style="background:var(--fp-n)"></div><span class="fp-npk-legend-label">N</span></div>' +
      '<div class="fp-npk-legend-item"><div class="fp-npk-legend-dot" style="background:var(--fp-p)"></div><span class="fp-npk-legend-label">P</span></div>' +
      '<div class="fp-npk-legend-item"><div class="fp-npk-legend-dot" style="background:var(--fp-k)"></div><span class="fp-npk-legend-label">K</span></div>' +
      '</div>';

    html += '<div class="fp-subcat-nav">';
    subcats.forEach(function (sc) {
      var count = sc.key === 'all' ? haifaProducts.length : haifaProducts.filter(function (p) {
        if (sc.key === 'acid') return p.group === 'acid' || p.group === 'bio' || p.group === 'custom';
        return p.group === sc.key;
      }).length;
      html += '<button class="fp-subcat-btn' + (sc.key === 'all' ? ' active' : '') + '" data-subcat="' + sc.key + '">' + sc.label + '<span class="fsc-count">' + count + '</span></button>';
    });
    html += '</div>';

    html += '<div class="fp-card-grid" id="fp-card-grid-f">';
    html += renderCards('all');
    html += '</div>';

    panel.innerHTML = html + buildOtherProductsSection();

    // Subcat switching
    panel.querySelectorAll('.fp-subcat-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        panel.querySelectorAll('.fp-subcat-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        document.getElementById('fp-card-grid-f').innerHTML = renderCards(btn.dataset.subcat);
      });
    });
  }

  function renderCards(subcat) {
    var filtered = subcat === 'all' ? haifaProducts : haifaProducts.filter(function (p) {
      if (subcat === 'acid') return p.group === 'acid' || p.group === 'bio' || p.group === 'custom';
      return p.group === subcat;
    });

    return filtered.map(function (p) {
      var total = p.n + p.p + p.k;
      var html = '<div class="fp-spectrum-card">';
      html += '<div class="sc-name">' + p.name + '</div>';

      if (total > 0) {
        html += '<div class="sc-npk-row">';
        html += '<div class="sc-npk-item"><div class="sc-npk-dot" style="background:var(--fp-n)"></div><span style="color:var(--fp-n)">' + p.n + '</span></div>';
        html += '<div class="sc-npk-item"><div class="sc-npk-dot" style="background:var(--fp-p)"></div><span style="color:var(--fp-p)">' + p.p + '</span></div>';
        html += '<div class="sc-npk-item"><div class="sc-npk-dot" style="background:var(--fp-k)"></div><span style="color:var(--fp-k)">' + p.k + '</span></div>';
        html += '</div>';
        html += '<div class="sc-bar"><div class="fp-seg fp-seg-n" style="flex:' + p.n + '"></div><div class="fp-seg fp-seg-p" style="flex:' + p.p + '"></div><div class="fp-seg fp-seg-k" style="flex:' + p.k + '"></div></div>';
      }

      html += '<div class="sc-desc">' + p.desc + '</div>';
      if (p.extra) html += '<div class="sc-extra">' + p.extra + '</div>';
      html += '</div>';
      return html;
    }).join('');
  }

  /* ──────────────────────────────────────────────
     APPROACH G: SCATTER PLOT
     ────────────────────────────────────────────── */
  function buildPanelG() {
    var panel = document.getElementById('fp-panel-g');
    if (!panel) return;

    var npkP = haifaProducts.filter(function (p) { return (p.n + p.p + p.k) > 0; });
    var W = 600, H = 500, pad = 60, rPad = 30;

    var maxN = 25, maxK = 55;

    function scaleX(n) { return pad + (n / maxN) * (W - pad - rPad); }
    function scaleY(k) { return H - pad - ((k / maxK) * (H - pad - rPad)); }

    // Grid lines
    var gridSvg = '';
    for (var gn = 0; gn <= maxN; gn += 5) {
      var x = scaleX(gn);
      gridSvg += '<line x1="' + x + '" y1="' + rPad + '" x2="' + x + '" y2="' + (H - pad) + '" stroke="#eeedea" stroke-width="1"/>';
      gridSvg += '<text x="' + x + '" y="' + (H - pad + 16) + '" text-anchor="middle" font-family="var(--fp-font-mono)" font-size="9" fill="#8a8a80">' + gn + '</text>';
    }
    for (var gk = 0; gk <= maxK; gk += 10) {
      var y = scaleY(gk);
      gridSvg += '<line x1="' + pad + '" y1="' + y + '" x2="' + (W - rPad) + '" y2="' + y + '" stroke="#eeedea" stroke-width="1"/>';
      gridSvg += '<text x="' + (pad - 8) + '" y="' + (y + 3) + '" text-anchor="end" font-family="var(--fp-font-mono)" font-size="9" fill="#8a8a80">' + gk + '</text>';
    }

    // Dots
    var dotsSvg = '';
    npkP.forEach(function (p) {
      var cx = scaleX(p.n), cy = scaleY(p.k);
      var r = Math.max(4, Math.sqrt(p.p) * 2.5);
      var color = '#2d6a4f';
      if (p.group === 'salt') color = '#7b5ea7';
      if (p.group === 'calcium') color = '#4a7c9b';
      if (p.group === 'magnesium') color = '#d4a017';
      if (p.group === 'micro') color = '#c05e3c';

      dotsSvg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + color + '" fill-opacity="0.75" stroke="white" stroke-width="1.5" ' +
        'class="fp-scatter-dot" style="cursor:pointer;transition:r 0.15s" ' +
        'data-name="' + escHtml(p.name) + '" data-npk="' + p.n + '-' + p.p + '-' + p.k + '" data-desc="' + escHtml(p.desc) + '" />';
    });

    var html = '<div class="fp-scatter-layout"><div>' +
      '<svg class="fp-scatter-svg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="' + pad + '" y="' + rPad + '" width="' + (W - pad - rPad) + '" height="' + (H - pad - rPad) + '" fill="var(--fp-cream)" rx="4"/>' +
      gridSvg + dotsSvg +
      '<text x="' + (W / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="12" font-weight="600" fill="var(--fp-text-sec)">N (Kv\u00e4ve) %</text>' +
      '<text x="14" y="' + (H / 2) + '" text-anchor="middle" font-size="12" font-weight="600" fill="var(--fp-text-sec)" transform="rotate(-90,14,' + (H / 2) + ')">K (Kalium) %</text>' +
      '</svg></div>';

    // Legend sidebar
    html += '<div class="fp-scatter-legend">';
    html += '<h4>Produktgrupper</h4>';
    [
      { color: '#2d6a4f', label: 'Fullg\u00f6dsel / Soluplant' },
      { color: '#7b5ea7', label: 'Enskilda salter' },
      { color: '#4a7c9b', label: 'Kalciumprodukter' },
      { color: '#d4a017', label: 'Magnesiumk\u00e4llor' },
      { color: '#c05e3c', label: 'Mikron\u00e4ring' },
    ].forEach(function (l) {
      html += '<div class="fp-scatter-legend-item"><div class="fp-scatter-legend-dot" style="background:' + l.color + '"></div><span class="fp-scatter-legend-label">' + l.label + '</span></div>';
    });

    html += '<div class="fp-scatter-size-legend"><h4>Cirkelstorlek = Fosfor (P)</h4>';
    [{ r: 4, label: 'L\u00e5g P (0\u20135)' }, { r: 8, label: 'Medium P (5\u201320)' }, { r: 14, label: 'H\u00f6g P (20\u201361)' }].forEach(function (s) {
      html += '<div class="size-row"><div class="size-circle" style="width:' + (s.r * 2) + 'px;height:' + (s.r * 2) + 'px"></div><span>' + s.label + '</span></div>';
    });
    html += '</div></div>';

    html += '</div>';
    panel.innerHTML = html + buildOtherProductsSection();

    // Scatter tooltips
    panel.querySelectorAll('.fp-scatter-dot').forEach(function (dot) {
      dot.addEventListener('mouseenter', function (e) {
        var tooltip = document.getElementById('fp-tooltip');
        tooltip.innerHTML = '<div class="fp-tt-name">' + dot.dataset.name + '</div><div class="fp-tt-npk">N-P-K ' + dot.dataset.npk + '</div><div class="fp-tt-desc">' + dot.dataset.desc + '</div>';
        tooltip.classList.add('visible');
        positionTooltip(e);
      });
      dot.addEventListener('mouseleave', function () { document.getElementById('fp-tooltip').classList.remove('visible'); });
      dot.addEventListener('mouseover', function () {
        var r = parseFloat(dot.getAttribute('r'));
        dot.setAttribute('r', r + 3);
      });
      dot.addEventListener('mouseout', function () {
        var r = Math.max(4, Math.sqrt(products.find(function (p) { return p.name === dot.dataset.name; }).p) * 2.5);
        dot.setAttribute('r', r);
      });
    });
  }

  /* ──────────────────────────────────────────────
     APPROACH H: CROP CALENDAR
     ────────────────────────────────────────────── */
  function buildPanelH() {
    var panel = document.getElementById('fp-panel-h');
    if (!panel) return;

    var crops = [
      { id: 'tomato', icon: '\ud83c\udf45', label: 'Tomat' },
      { id: 'cucumber', icon: '\ud83e\udd52', label: 'Gurka' },
      { id: 'pepper', icon: '\ud83c\udf36', label: 'Paprika' },
      { id: 'salad', icon: '\ud83e\udd6c', label: 'Sallad' },
      { id: 'flower', icon: '\ud83c\udf3b', label: 'Blommor' },
    ];

    var phases = [
      { label: 'Plantuppf\u00f6dning', desc: 'Vecka 1\u20134', color: 'var(--fp-green-pale)' },
      { label: 'Vegetativ tillv\u00e4xt', desc: 'Vecka 4\u201310', color: '#e8f5e8' },
      { label: 'Blomning', desc: 'Vecka 10\u201316', color: 'var(--fp-amber-light)' },
      { label: 'Frukts\u00e4ttning', desc: 'Vecka 16\u201330+', color: 'var(--fp-purple-light)' },
    ];

    var calendarData = {
      tomato: [
        [{ name: 'Soluplant Start', npk: '13-17-11' }, { name: 'Haifa MAP', npk: '12-61', cls: 'tp-supplement' }],
        [{ name: 'Soluplant Plus', npk: '23-2-9' }, { name: 'Haifa Cal GG', npk: '15.5+CaO', cls: 'tp-supplement' }],
        [{ name: 'Soluplant Universal', npk: '20-9-17' }, { name: 'SteelGrow Micro', npk: 'Mikro', cls: 'tp-micro' }],
        [{ name: 'Soluplant Finish', npk: '15-2-25' }, { name: 'Haifa SOP', npk: 'K 52%', cls: 'tp-supplement' }],
      ],
      cucumber: [
        [{ name: 'Soluplant Start', npk: '13-17-11' }],
        [{ name: 'Soluplant Plus', npk: '23-2-9' }],
        [{ name: 'Soluplant Universal', npk: '20-9-17' }],
        [{ name: 'Soluplant Solid', npk: '12-5-30' }, { name: 'Multi-K GG', npk: '13.5-0-46', cls: 'tp-supplement' }],
      ],
      pepper: [
        [{ name: 'Soluplant Start', npk: '13-17-11' }],
        [{ name: 'Soluplant Standard', npk: '20-3-17' }],
        [{ name: 'Soluplant Universal', npk: '20-9-17' }, { name: 'Haifa Cal GG', npk: '+CaO', cls: 'tp-supplement' }],
        [{ name: 'Soluplant Finish', npk: '15-2-25' }],
      ],
      salad: [
        [{ name: 'Soluplant Start', npk: '13-17-11' }],
        [{ name: 'Soluplant Plus', npk: '23-2-9' }, { name: 'Magnisal', npk: '11+MgO', cls: 'tp-supplement' }],
        [{ name: 'Soluplant Plus', npk: '23-2-9' }],
        [{ name: 'Soluplant Plus', npk: '23-2-9' }],
      ],
      flower: [
        [{ name: 'Soluplant Start', npk: '13-17-11' }],
        [{ name: 'Soluplant Standard', npk: '20-3-17' }],
        [{ name: 'Soluplant Finish', npk: '15-2-25' }, { name: 'HaifaStim KIR', npk: 'Kitosan', cls: 'tp-micro' }],
        [{ name: 'Soluplant Finish', npk: '15-2-25' }],
      ],
    };

    var activeCrop = 'tomato';

    function render() {
      var html = '<div class="fp-calendar">';

      html += '<div class="fp-crop-selector">';
      crops.forEach(function (c) {
        html += '<button class="fp-crop-btn' + (c.id === activeCrop ? ' active' : '') + '" data-crop="' + c.id + '"><span class="crop-icon">' + c.icon + '</span>' + c.label + '</button>';
      });
      html += '</div>';

      html += '<div class="fp-timeline">';

      // Phase headers
      html += '<div class="fp-timeline-header">';
      phases.forEach(function (ph) {
        html += '<div class="fp-timeline-phase" style="border-bottom-color:' + ph.color + '">' + ph.label + '<span class="phase-desc">' + ph.desc + '</span></div>';
      });
      html += '</div>';

      // Arrow
      html += '<div class="fp-timeline-arrows">';
      var colors = ['var(--fp-n)', 'var(--fp-n)', 'var(--fp-p)', 'var(--fp-k)'];
      colors.forEach(function (c) { html += '<div class="fp-timeline-arrow-seg" style="background:' + c + ';opacity:0.4"></div>'; });
      html += '</div>';

      // Products row
      var data = calendarData[activeCrop] || calendarData.tomato;
      html += '<div class="fp-timeline-row">';
      data.forEach(function (phase) {
        html += '<div class="fp-timeline-cell">';
        phase.forEach(function (prod) {
          html += '<div class="fp-timeline-product ' + (prod.cls || '') + '"><div class="tp-name">' + prod.name + '</div><div class="tp-npk">' + prod.npk + '</div></div>';
        });
        html += '</div>';
      });
      html += '</div>';

      html += '</div></div>';
      panel.innerHTML = html + buildOtherProductsSection();

      // Crop switching
      panel.querySelectorAll('.fp-crop-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          activeCrop = btn.dataset.crop;
          render();
        });
      });
    }

    render();
  }

  /* ──────────────────────────────────────────────
     APPROACH I: SCROLL STORYTELLING
     ────────────────────────────────────────────── */
  function buildPanelI() {
    var panel = document.getElementById('fp-panel-i');
    if (!panel) return;

    var html = '';

    // Hero
    html += '<div class="fp-story-hero"><h2>Precision Nutrition</h2><p>Fr\u00e5n plantuppf\u00f6dning till sk\u00f6rd \u2014 r\u00e4tt n\u00e4ring i varje fas f\u00f6r professionell v\u00e4xthusodling.</p></div>';

    // Section 1: Soluplant series
    html += '<div class="fp-story-section fp-story-reveal">';
    html += '<div class="fp-story-visual">';
    var soluSorted = haifaProducts.filter(function (p) { return p.series === 'soluplant' && (p.n + p.p + p.k) > 0; })
      .sort(function (a, b) { return (a.k / (a.n + a.p + a.k || 1)) - (b.k / (b.n + b.p + b.k || 1)); });
    soluSorted.forEach(function (p) {
      html += '<div style="display:flex;align-items:center;gap:0.5rem">';
      html += '<span style="font-size:0.72rem;font-weight:600;width:70px;flex-shrink:0">' + p.name.replace('Soluplant ', '') + '</span>';
      html += '<div style="flex:1;height:14px;display:flex;border-radius:3px;overflow:hidden;background:var(--fp-cream-dark)">';
      html += '<div style="flex:' + p.n + ';background:var(--fp-n)"></div>';
      html += '<div style="flex:' + p.p + ';background:var(--fp-p)"></div>';
      html += '<div style="flex:' + p.k + ';background:var(--fp-k)"></div>';
      html += '</div>';
      html += '<span style="font-family:var(--fp-font-mono);font-size:0.65rem;color:var(--fp-text-ter);width:70px;flex-shrink:0;text-align:right">' + p.n + '-' + p.p + '-' + p.k + '</span>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="fp-story-text"><h3>Soluplant-serien</h3><p>8 precisionsanpassade sammansättningar som täcker hela odlingscykeln. Från kvävrik Start för plantuppfödning till kaliumrik Finish för mognad \u2014 varje variant \u00e4r optimerad f\u00f6r en specifik fas.</p><span class="story-highlight" style="background:var(--fp-green-pale);color:var(--fp-green-deep)">8 varianter \u2022 25 kg s\u00e4ckar</span></div>';
    html += '</div>';

    // Section 2: GrowClean
    html += '<div class="fp-story-section fp-story-reveal reversed">';
    html += '<div class="fp-story-text"><h3>GrowClean-teknologi</h3><p>Unik reng\u00f6rande g\u00f6dsel med extremt h\u00f6ga P+K-v\u00e4rden. Speciellt utvecklad f\u00f6r att h\u00e5lla droppbevattningssystem rena samtidigt som den n\u00e4rer v\u00e4xterna.</p><span class="story-highlight" style="background:var(--fp-amber-light);color:#9a7200">NPK 5-31-40 \u2022 Systemreng\u00f6ring</span></div>';
    html += '<div class="fp-story-visual" style="background:linear-gradient(135deg,var(--fp-cream),var(--fp-amber-light));text-align:center;justify-content:center">';
    html += '<div style="font-size:3rem;font-family:var(--fp-font-display);font-weight:700;color:var(--fp-green-deep)">5-31-40</div>';
    html += '<div style="font-size:0.85rem;color:var(--fp-text-sec)">Extremt h\u00f6g P+K koncentration</div>';
    html += '</div>';
    html += '</div>';

    // Section 3: Single salts
    html += '<div class="fp-story-section fp-story-reveal">';
    html += '<div class="fp-story-visual" style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;padding:1rem">';
    haifaProducts.filter(function (p) { return p.group === 'salt'; }).forEach(function (p) {
      html += '<div style="background:white;padding:0.6rem;border-radius:6px;text-align:center"><div style="font-size:0.72rem;font-weight:600">' + p.name.replace('Haifa ', '') + '</div><div style="font-family:var(--fp-font-mono);font-size:0.62rem;color:var(--fp-text-ter)">' + p.n + '-' + p.p + '-' + p.k + (p.extra ? ' ' + p.extra : '') + '</div></div>';
    });
    html += '</div>';
    html += '<div class="fp-story-text"><h3>Enskilda n\u00e4ringssalter</h3><p>Byggstenar f\u00f6r precisionsg\u00f6dsling. Multi-K f\u00f6r kalium, MAP f\u00f6r fosfor, SOP f\u00f6r klorfri kalium \u2014 anpassa din n\u00e4ringsl\u00f6sning exakt efter behov.</p><span class="story-highlight" style="background:var(--fp-purple-light);color:var(--fp-purple)">7 salter \u2022 H\u00f6gkoncentrerade</span></div>';
    html += '</div>';

    // Section 4: Support products
    html += '<div class="fp-story-section fp-story-reveal reversed">';
    html += '<div class="fp-story-text"><h3>St\u00f6dprodukter</h3><p>Kalcium f\u00f6r cellv\u00e4ggar, magnesium f\u00f6r klorofyll, mikron\u00e4ringsämnen f\u00f6r enzymer. Komplettera basn\u00e4ringen f\u00f6r optimala resultat.</p><span class="story-highlight" style="background:var(--fp-blue-light);color:var(--fp-blue)">Ca \u2022 Mg \u2022 Fe \u2022 Mn \u2022 B \u2022 Mo</span></div>';
    html += '<div class="fp-story-visual" style="background:linear-gradient(135deg,var(--fp-blue-light),var(--fp-cream))">';
    var supportP = haifaProducts.filter(function (p) { return p.group === 'calcium' || p.group === 'magnesium' || p.group === 'micro'; });
    supportP.forEach(function (p) {
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.3rem 0;border-bottom:1px solid rgba(0,0,0,0.05)"><span style="font-size:0.78rem;font-weight:500">' + p.name + '</span><span style="font-family:var(--fp-font-mono);font-size:0.65rem;color:var(--fp-text-ter)">' + (p.extra || '') + '</span></div>';
    });
    html += '</div>';
    html += '</div>';

    // Comparison table
    html += '<h3 style="font-family:var(--fp-font-display);font-size:1.4rem;font-weight:600;color:var(--fp-green-deep);margin:2rem 0 1rem;text-align:center">Snabbj\u00e4mf\u00f6relse \u2014 Soluplant-serien</h3>';
    html += '<div style="overflow-x:auto"><table class="fp-comparison-table"><thead><tr><th>Variant</th><th style="color:var(--fp-n)">N</th><th style="color:var(--fp-p)">P</th><th style="color:var(--fp-k)">K</th><th>Mg</th><th>B\u00e4st f\u00f6r</th></tr></thead><tbody>';

    soluSorted.forEach(function (p) {
      var maxV = Math.max(p.n, p.p, p.k);
      html += '<tr>';
      html += '<td>' + p.name.replace('Soluplant ', '') + '</td>';
      html += '<td class="ct-val' + (p.n === maxV ? ' ct-highlight' : '') + '">' +
        '<span class="ct-bar" style="width:' + (p.n * 2) + 'px;background:var(--fp-n)"></span> ' + p.n + '</td>';
      html += '<td class="ct-val' + (p.p === maxV ? ' ct-highlight' : '') + '">' +
        '<span class="ct-bar" style="width:' + (p.p * 2) + 'px;background:var(--fp-p)"></span> ' + p.p + '</td>';
      html += '<td class="ct-val' + (p.k === maxV ? ' ct-highlight' : '') + '">' +
        '<span class="ct-bar" style="width:' + (p.k * 2) + 'px;background:var(--fp-k)"></span> ' + p.k + '</td>';
      html += '<td class="ct-val">' + (p.mg || '\u2014') + '</td>';
      html += '<td style="font-size:0.75rem;color:var(--fp-text-sec)">' + p.desc + '</td>';
      html += '</tr>';
    });

    html += '</tbody></table></div>';

    panel.innerHTML = html + buildOtherProductsSection();

    // Scroll reveal
    setTimeout(function () { initScrollReveal(); }, 100);
  }

  function initScrollReveal() {
    var sections = document.querySelectorAll('.fp-story-reveal');
    if (!sections.length) return;

    // Observe visibility
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ──────────────────────────────────────────────
     APPROACH J: ACCORDION LIST
     ────────────────────────────────────────────── */
  function buildPanelJ() {
    var panel = document.getElementById('fp-panel-j');
    if (!panel) return;

    var groups = [
      {
        key: 'soluplant',
        label: 'Soluplant-serien',
        subtitle: 'Vattenl\u00f6sliga fullg\u00f6dsel f\u00f6r hela odlingscykeln',
        icon: '\u25c6', iconClass: 'fp-icon-npk',
        filter: function (p) { return p.series === 'soluplant'; },
      },
      {
        key: 'steelgrow',
        label: 'SteelGrow',
        subtitle: 'Steelmarks egen produktlinje',
        icon: '\u25c6', iconClass: 'fp-icon-npk',
        filter: function (p) { return p.name.indexOf('SteelGrow') >= 0 || p.name.indexOf('Steelgrow') >= 0; },
      },
      {
        key: 'growclean',
        label: 'GrowClean',
        subtitle: 'Reng\u00f6rande g\u00f6dsel f\u00f6r droppbevattning',
        icon: '\u25c6', iconClass: 'fp-icon-npk',
        filter: function (p) { return p.name.indexOf('GrowClean') >= 0; },
      },
      {
        key: 'kno3',
        label: 'Kaliumnitrat (Multi-K)',
        subtitle: 'K\u00e4lla till kalium och kv\u00e4ve',
        icon: '\u25c7', iconClass: 'fp-icon-salt',
        filter: function (p) { return p.name.indexOf('Multi-K') >= 0; },
      },
      {
        key: 'phosphates',
        label: 'Fosfater (MAP, MKP)',
        subtitle: 'H\u00f6gkoncentrerade fosfork\u00e4llor',
        icon: '\u25c7', iconClass: 'fp-icon-salt',
        filter: function (p) { return p.name.indexOf('MAP') >= 0 || p.name.indexOf('MKP') >= 0; },
      },
      {
        key: 'potassium',
        label: 'Kaliumsalter (SOP, KCL)',
        subtitle: 'Rena kaliumk\u00e4llor',
        icon: '\u25c7', iconClass: 'fp-icon-salt',
        filter: function (p) { return p.name.indexOf('SOP') >= 0 || p.name.indexOf('KCL') >= 0; },
      },
      {
        key: 'calcium',
        label: 'Kalciumprodukter',
        subtitle: 'Kalciumnitrat, kalciumklorid, kalciumv\u00e4tska',
        icon: '\u25cf', iconClass: 'fp-icon-ca',
        filter: function (p) { return p.group === 'calcium' || p.name.indexOf('Soluble DUO') >= 0; },
      },
      {
        key: 'magnesium',
        label: 'Magnesiumk\u00e4llor',
        subtitle: 'Magnesiumsulfat, magnesiumnitrat',
        icon: '\u25cb', iconClass: 'fp-icon-mg',
        filter: function (p) { return p.group === 'magnesium'; },
      },
      {
        key: 'micro',
        label: 'Mikron\u00e4rings\u00e4mnen',
        subtitle: 'Kelater, sp\u00e5r\u00e4mnen, j\u00e4rn',
        icon: '\u2726', iconClass: 'fp-icon-micro',
        filter: function (p) { return p.group === 'micro'; },
      },
      {
        key: 'acids',
        label: 'Syror & kemikalier',
        subtitle: 'pH-justering och vattenrening',
        icon: '\u25b2', iconClass: 'fp-icon-acid',
        filter: function (p) { return p.group === 'acid'; },
      },
      {
        key: 'special',
        label: 'Biostimulanter & speciall\u00f6sningar',
        subtitle: 'Biostimulanter, skr\u00e4ddarsydda system',
        icon: '\u274b', iconClass: 'fp-icon-bio',
        filter: function (p) { return p.group === 'bio' || p.group === 'custom'; },
      },
    ];

    var html = '';

    groups.forEach(function (g, idx) {
      var items = haifaProducts.filter(g.filter);
      if (!items.length) return;

      // Preview chips: first few product names
      var previewChips = items.slice(0, 4).map(function (p) {
        var total = p.n + p.p + p.k;
        var label = total > 0 ? p.n + '-' + p.p + '-' + p.k : (p.extra || '').substring(0, 15);
        return '<span class="fp-acc-preview-chip">' + p.name.replace('Soluplant ', 'SP ').replace('Haifa ', '') + '</span>';
      }).join('');
      if (items.length > 4) previewChips += '<span class="fp-acc-preview-chip">+' + (items.length - 4) + '</span>';

      html += '<div class="fp-accordion-group' + (idx === 0 ? ' open' : '') + '">';

      // Header
      html += '<div class="fp-accordion-header">';
      html += '<div class="fp-accordion-icon ' + g.iconClass + '">' + g.icon + '</div>';
      html += '<div class="fp-accordion-title"><h3>' + g.label + '</h3><div class="fp-acc-subtitle">' + g.subtitle + '</div></div>';
      html += '<div class="fp-accordion-meta">';
      html += '<div class="fp-acc-preview">' + previewChips + '</div>';
      html += '<span class="fp-acc-count">' + items.length + '</span>';
      html += '<span class="fp-acc-chevron">\u25bc</span>';
      html += '</div></div>';

      // Body
      html += '<div class="fp-accordion-body"><div class="fp-accordion-body-inner">';

      items.forEach(function (p) {
        var total = p.n + p.p + p.k;
        if (total > 0) {
          html += '<div class="fp-acc-product">';
          html += '<div class="fp-acc-pname">' + p.name + '</div>';
          html += '<div class="fp-acc-bar">';
          html += '<div class="fp-seg fp-seg-n" style="flex:' + p.n + '"></div>';
          html += '<div class="fp-seg fp-seg-p" style="flex:' + p.p + '"></div>';
          html += '<div class="fp-seg fp-seg-k" style="flex:' + p.k + '"></div>';
          html += '</div>';
          html += '<div class="fp-acc-spec">';
          html += '<span class="fp-val-n">' + p.n + '</span>-<span class="fp-val-p">' + p.p + '</span>-<span class="fp-val-k">' + p.k + '</span>';
          if (p.extra) html += ' <span style="color:var(--fp-text-ter)">' + p.extra + '</span>';
          html += '</div>';
          html += '</div>';
        } else {
          html += '<div class="fp-acc-product-simple">';
          html += '<div class="fp-acc-pname">' + p.name + '</div>';
          html += '<div class="fp-acc-extra">';
          if (p.extra) {
            p.extra.split(',').forEach(function (e) {
              html += '<span class="fp-comp-badge" style="background:' + (groupBgMap[p.group] || '#f0efe8') + ';color:' + (groupMeta[p.group] ? groupMeta[p.group].color : '#5a5a52') + '">' + e.trim() + '</span>';
            });
          }
          html += '</div></div>';
        }
      });

      html += '</div></div></div>';
    });

    panel.innerHTML = html + buildOtherProductsSection();

    // Toggle accordion
    panel.querySelectorAll('.fp-accordion-header').forEach(function (header) {
      header.addEventListener('click', function () {
        var group = header.parentElement;
        group.classList.toggle('open');
      });
    });
  }

  /* ──────────────────────────────────────────────
     APPROACH K: SHOWCASE — Hero + Product Families
     ────────────────────────────────────────────── */
  function buildPanelK() {
    var panel = document.getElementById('fp-panel-k');
    if (!panel) return;

    var html = '';

    // Hero section for Soluplant
    var soluSorted = haifaProducts.filter(function (p) { return p.series === 'soluplant' && (p.n + p.p + p.k) > 0; })
      .sort(function (a, b) { return (a.k / (a.n + a.p + a.k || 1)) - (b.k / (b.n + b.p + b.k || 1)); });

    html += '<div class="fpk-hero">';
    html += '<div class="fpk-hero-text">';
    html += '<div class="fpk-hero-badge">HAIFA \u2022 SOLUPLANT</div>';
    html += '<h2>8 sammansättningar f\u00f6r hela odlingscykeln</h2>';
    html += '<p>Fr\u00e5n kv\u00e4verik Start f\u00f6r plantuppf\u00f6dning till kaliumrik Finish f\u00f6r mognad \u2014 varje variant \u00e4r optimerad f\u00f6r en specifik fas.</p>';
    html += '</div>';
    html += '<div class="fpk-hero-chart">';
    soluSorted.forEach(function (p) {
      var total = p.n + p.p + p.k;
      html += '<div class="fpk-hero-bar-row">';
      html += '<span class="fpk-bar-label">' + p.name.replace('Soluplant ', '') + '</span>';
      html += '<div class="fpk-bar-track">';
      html += '<div class="fp-seg fp-seg-n" style="flex:' + p.n + '"></div>';
      html += '<div class="fp-seg fp-seg-p" style="flex:' + p.p + '"></div>';
      html += '<div class="fp-seg fp-seg-k" style="flex:' + p.k + '"></div>';
      html += '</div>';
      html += '<span class="fpk-bar-val">' + p.n + '-' + p.p + '-' + p.k + '</span>';
      html += '</div>';
    });
    html += '</div></div>';

    // Product family sections
    var families = [
      {
        key: 'growclean', title: 'GrowClean', subtitle: 'Reng\u00f6rande fullg\u00f6dsel',
        color: '#d4a017', bg: '#fdf8ec',
        filter: function (p) { return p.name.indexOf('GrowClean') >= 0; }
      },
      {
        key: 'salts', title: 'N\u00e4ringssalter', subtitle: 'H\u00f6gkoncentrerade byggstenar',
        color: '#7b5ea7', bg: '#f3eefa',
        filter: function (p) { return p.group === 'salt'; }
      },
      {
        key: 'calcium', title: 'Kalcium', subtitle: 'Cellv\u00e4ggar & fruktstyrka',
        color: '#4a7c9b', bg: '#edf4f8',
        filter: function (p) { return p.group === 'calcium'; }
      },
      {
        key: 'magnesium', title: 'Magnesium', subtitle: 'Klorofyll & fotosyntes',
        color: '#9a7200', bg: '#fdf8ec',
        filter: function (p) { return p.group === 'magnesium'; }
      },
      {
        key: 'micro', title: 'Mikro & Bio', subtitle: 'Sp\u00e5r\u00e4mnen & biostimulanter',
        color: '#c05e3c', bg: '#fdf0ec',
        filter: function (p) { return p.group === 'micro' || p.group === 'bio' || p.group === 'custom'; }
      },
    ];

    html += '<div class="fpk-families">';
    families.forEach(function (fam) {
      var items = haifaProducts.filter(fam.filter);
      if (!items.length) return;
      html += '<div class="fpk-family">';
      html += '<div class="fpk-family-header" style="border-left:4px solid ' + fam.color + '">';
      html += '<h3 style="color:' + fam.color + '">' + fam.title + '</h3>';
      html += '<span class="fpk-family-sub">' + fam.subtitle + ' \u2022 ' + items.length + ' produkter</span>';
      html += '</div>';
      html += '<div class="fpk-family-grid">';
      items.forEach(function (p) {
        var total = p.n + p.p + p.k;
        html += '<div class="fpk-card" style="border-top:3px solid ' + fam.color + '">';
        html += '<div class="fpk-card-name">' + p.name + '</div>';
        if (total > 0) {
          html += '<div class="fpk-card-bar">';
          html += '<div class="fp-seg fp-seg-n" style="flex:' + p.n + '"></div>';
          html += '<div class="fp-seg fp-seg-p" style="flex:' + p.p + '"></div>';
          html += '<div class="fp-seg fp-seg-k" style="flex:' + p.k + '"></div>';
          html += '</div>';
          html += '<div class="fpk-card-npk"><span class="fp-val-n">' + p.n + '</span>-<span class="fp-val-p">' + p.p + '</span>-<span class="fp-val-k">' + p.k + '</span></div>';
        }
        html += '<div class="fpk-card-desc">' + p.desc + '</div>';
        if (p.extra) html += '<div class="fpk-card-extra">' + p.extra + '</div>';
        html += '</div>';
      });
      html += '</div></div>';
    });
    html += '</div>';

    panel.innerHTML = html + buildOtherProductsSection();
  }

  /* ──────────────────────────────────────────────
     APPROACH L: COMPARISON — Select & Compare
     ────────────────────────────────────────────── */
  var compareSelected = [];

  function buildPanelL() {
    var panel = document.getElementById('fp-panel-l');
    if (!panel) return;
    compareSelected = [];
    renderComparison(panel);
  }

  function renderComparison(panel) {
    var npkItems = haifaProducts.filter(function (p) { return (p.n + p.p + p.k) > 0; });

    var html = '<div class="fpl-layout">';

    // Comparison area
    html += '<div class="fpl-compare-area">';
    if (compareSelected.length === 0) {
      html += '<div class="fpl-empty"><div class="fpl-empty-icon">\u2194</div><h3>V\u00e4lj produkter att j\u00e4mf\u00f6ra</h3><p>Klicka p\u00e5 produkter i listan till h\u00f6ger (max 4).</p></div>';
    } else {
      // Grouped bar chart
      var maxVal = 0;
      compareSelected.forEach(function (p) { maxVal = Math.max(maxVal, p.n, p.p, p.k); });
      if (maxVal === 0) maxVal = 1;

      html += '<div class="fpl-chart">';
      html += '<div class="fpl-chart-labels"><span style="color:var(--fp-n)">N</span><span style="color:var(--fp-p)">P</span><span style="color:var(--fp-k)">K</span></div>';
      compareSelected.forEach(function (p, i) {
        var colors = ['#2d6a4f', '#1a6b3c', '#3d7a5f', '#0f5a32'];
        html += '<div class="fpl-chart-group">';
        html += '<div class="fpl-chart-bar-set">';
        html += '<div class="fpl-chart-bar" style="height:' + (p.n / maxVal * 140) + 'px;background:var(--fp-n);opacity:' + (0.5 + i * 0.15) + '"><span>' + p.n + '</span></div>';
        html += '<div class="fpl-chart-bar" style="height:' + (p.p / maxVal * 140) + 'px;background:var(--fp-p);opacity:' + (0.5 + i * 0.15) + '"><span>' + p.p + '</span></div>';
        html += '<div class="fpl-chart-bar" style="height:' + (p.k / maxVal * 140) + 'px;background:var(--fp-k);opacity:' + (0.5 + i * 0.15) + '"><span>' + p.k + '</span></div>';
        html += '</div>';
        html += '<div class="fpl-chart-name">' + p.name.replace('Soluplant ', 'SP ').replace('Haifa ', '') + '</div>';
        html += '</div>';
      });
      html += '</div>';

      // Comparison table
      html += '<table class="fpl-table"><thead><tr><th></th>';
      compareSelected.forEach(function (p) {
        html += '<th>' + p.name.replace('Soluplant ', 'SP ').replace('Haifa ', '') + '</th>';
      });
      html += '</tr></thead><tbody>';
      [
        { label: 'Kv\u00e4ve (N)', get: function (p) { return p.n; }, color: 'var(--fp-n)' },
        { label: 'Fosfor (P)', get: function (p) { return p.p; }, color: 'var(--fp-p)' },
        { label: 'Kalium (K)', get: function (p) { return p.k; }, color: 'var(--fp-k)' },
        { label: 'Magnesium', get: function (p) { return p.mg || 0; }, color: 'var(--fp-text-sec)' },
        { label: 'Extra', get: function (p) { return p.extra || '\u2014'; }, color: 'var(--fp-text-ter)' },
      ].forEach(function (row) {
        html += '<tr><td class="fpl-row-label">' + row.label + '</td>';
        compareSelected.forEach(function (p) {
          var val = row.get(p);
          html += '<td style="color:' + row.color + ';font-family:var(--fp-font-mono);font-weight:600">' + val + '</td>';
        });
        html += '</tr>';
      });
      html += '<tr><td class="fpl-row-label">Anv\u00e4ndning</td>';
      compareSelected.forEach(function (p) {
        html += '<td style="font-size:0.75rem;color:var(--fp-text-sec)">' + p.desc + '</td>';
      });
      html += '</tr></tbody></table>';

      html += '<button class="fpl-clear-btn" id="fpl-clear">Rensa j\u00e4mf\u00f6relse</button>';
    }
    html += '</div>';

    // Product list
    html += '<div class="fpl-product-list">';
    html += '<h4>Klicka f\u00f6r att v\u00e4lja (max 4)</h4>';
    npkItems.forEach(function (p) {
      var isSelected = compareSelected.indexOf(p) >= 0;
      html += '<div class="fpl-list-item' + (isSelected ? ' selected' : '') + '" data-pname="' + escHtml(p.name) + '">';
      html += '<div class="fpl-list-check">' + (isSelected ? '\u2713' : '') + '</div>';
      html += '<div class="fpl-list-info">';
      html += '<div class="fpl-list-name">' + p.name + '</div>';
      html += '<div class="fpl-list-npk">' + p.n + '-' + p.p + '-' + p.k + '</div>';
      html += '</div></div>';
    });
    html += '</div></div>';

    panel.innerHTML = html + buildOtherProductsSection();

    // Events
    panel.querySelectorAll('.fpl-list-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var name = item.dataset.pname;
        var prod = haifaProducts.find(function (p) { return p.name === name; });
        if (!prod) return;
        var idx = compareSelected.indexOf(prod);
        if (idx >= 0) {
          compareSelected.splice(idx, 1);
        } else if (compareSelected.length < 4) {
          compareSelected.push(prod);
        }
        renderComparison(panel);
      });
    });

    var clearBtn = panel.querySelector('#fpl-clear');
    if (clearBtn) clearBtn.addEventListener('click', function () {
      compareSelected = [];
      renderComparison(panel);
    });
  }

  /* ──────────────────────────────────────────────
     APPROACH M: BENEFIT CATEGORIES
     ────────────────────────────────────────────── */
  function buildPanelM() {
    var panel = document.getElementById('fp-panel-m');
    if (!panel) return;

    var categories = [
      {
        title: 'Tillv\u00e4xt & uppbyggnad',
        icon: '\ud83c\udf3f',
        desc: 'Kv\u00e4verika produkter f\u00f6r stark vegetativ tillv\u00e4xt.',
        gradient: 'linear-gradient(135deg, #d8f3dc 0%, #e8f5e8 100%)',
        accent: 'var(--fp-n)',
        products: [
          { name: 'Soluplant Plus', why: 'H\u00f6gsta N-halt (23%) f\u00f6r maximal tillv\u00e4xt' },
          { name: 'Soluplant Standard', why: 'Allround 20-3-17 med magnesium' },
          { name: 'Soluplant Universal', why: 'Balanserad 20-9-17 f\u00f6r \u00f6verg\u00e5ngsfas' },
          { name: 'Haifa Magnisal', why: 'N + Mg f\u00f6r gr\u00f6n bladf\u00e4rg' },
        ]
      },
      {
        title: 'Rotbildning & etablering',
        icon: '\ud83c\udf31',
        desc: 'Fosforrika produkter f\u00f6r rotutveckling och plantuppf\u00f6dning.',
        gradient: 'linear-gradient(135deg, #f5e6b8 0%, #fdf8ec 100%)',
        accent: 'var(--fp-p)',
        products: [
          { name: 'Soluplant Start', why: 'Fosforrik 13-17-11 f\u00f6r plantfas' },
          { name: 'Haifa MAP', why: 'Monoammoniumfosfat \u2014 extremt h\u00f6g P (61%)' },
          { name: 'Haifa-MKP Tech', why: 'Monokaliumfosfat \u2014 P + K utan kv\u00e4ve' },
          { name: 'Haifa GrowClean', why: 'Reng\u00f6rande med 31% P + 40% K' },
        ]
      },
      {
        title: 'Mognad & fruktkvalitet',
        icon: '\ud83c\udf4e',
        desc: 'Kaliumrika produkter f\u00f6r fruktutveckling, f\u00e4rg och smak.',
        gradient: 'linear-gradient(135deg, #e8dff5 0%, #f3eefa 100%)',
        accent: 'var(--fp-k)',
        products: [
          { name: 'Soluplant Finish', why: 'Kaliumrik 15-2-25 f\u00f6r mognad' },
          { name: 'Soluplant Multi', why: 'Mycket h\u00f6g K (30%) f\u00f6r tunga sk\u00f6rdar' },
          { name: 'Haifa Multi-K GG', why: 'Kaliumnitrat 13.5-0-46.2' },
          { name: 'Haifa SOP', why: 'Kaliumsulfat 52% \u2014 klorfri' },
        ]
      },
      {
        title: 'Kalcium & cellstyrka',
        icon: '\ud83e\uddb4',
        desc: 'F\u00f6rebygg toppf\u00e4ltspr\u00e4cka och st\u00e4rk cellv\u00e4ggar.',
        gradient: 'linear-gradient(135deg, #d0e4f0 0%, #edf4f8 100%)',
        accent: 'var(--fp-blue)',
        products: [
          { name: 'Haifa Cal GG', why: 'Kalciumnitrat CaO 26.5% (greenhouse grade)' },
          { name: 'Haifa Soluble DUO', why: 'Unik Ca+K kombination' },
        ]
      },
      {
        title: 'Systemkomplement',
        icon: '\u2699\ufe0f',
        desc: 'Mikron\u00e4ring, biostimulanter och speciall\u00f6sningar.',
        gradient: 'linear-gradient(135deg, #fde8e8 0%, #fff5f5 100%)',
        accent: 'var(--fp-rust)',
        products: [
          { name: 'SteelGrow Micro', why: 'Komplett mikropulver Fe/Mn/Cu/Zn/B/Mo' },
          { name: 'HaifaStim KIR', why: 'Biostimulant med kitosan' },
          { name: 'Haifa BitterMag', why: 'Magnesiumsulfat f\u00f6r Mg-brist' },
          { name: 'Haifa MyMultifeed', why: 'Skr\u00e4ddarsytt A/B-system' },
        ]
      },
    ];

    var html = '<div class="fpm-intro"><h2>V\u00e4lj efter behov</h2><p>Hitta r\u00e4tt produkt utifr\u00e5n vad du vill uppn\u00e5 i din odling.</p></div>';
    html += '<div class="fpm-grid">';

    categories.forEach(function (cat) {
      html += '<div class="fpm-card" style="background:' + cat.gradient + '">';
      html += '<div class="fpm-card-header">';
      html += '<span class="fpm-card-icon">' + cat.icon + '</span>';
      html += '<h3>' + cat.title + '</h3>';
      html += '</div>';
      html += '<p class="fpm-card-desc">' + cat.desc + '</p>';
      html += '<div class="fpm-card-products">';
      cat.products.forEach(function (rec) {
        var prod = haifaProducts.find(function (p) { return p.name === rec.name; });
        html += '<div class="fpm-rec">';
        html += '<div class="fpm-rec-name">' + rec.name + '</div>';
        if (prod && (prod.n + prod.p + prod.k) > 0) {
          html += '<div class="fpm-rec-bar">';
          html += '<div class="fp-seg fp-seg-n" style="flex:' + prod.n + '"></div>';
          html += '<div class="fp-seg fp-seg-p" style="flex:' + prod.p + '"></div>';
          html += '<div class="fp-seg fp-seg-k" style="flex:' + prod.k + '"></div>';
          html += '</div>';
        }
        html += '<div class="fpm-rec-why">' + rec.why + '</div>';
        html += '</div>';
      });
      html += '</div></div>';
    });

    html += '</div>';
    panel.innerHTML = html + buildOtherProductsSection();
  }

  /* ──────────────────────────────────────────────
     APPROACH N: COMPACT HEATMAP TABLE
     ────────────────────────────────────────────── */
  function buildPanelN() {
    var panel = document.getElementById('fp-panel-n');
    if (!panel) return;

    var sorted = haifaProducts.slice().sort(function (a, b) {
      var ga = groupOrder.indexOf(a.group), gb = groupOrder.indexOf(b.group);
      if (ga !== gb) return ga - gb;
      var ta = a.n + a.p + a.k, tb = b.n + b.p + b.k;
      return tb - ta;
    });

    var maxN = 0, maxP = 0, maxK = 0;
    sorted.forEach(function (p) {
      if (p.n > maxN) maxN = p.n;
      if (p.p > maxP) maxP = p.p;
      if (p.k > maxK) maxK = p.k;
    });

    function heatBg(val, max, hue) {
      if (val === 0 || max === 0) return 'transparent';
      var intensity = Math.min(val / max, 1);
      return 'hsla(' + hue + ', 65%, 45%, ' + (intensity * 0.25) + ')';
    }

    var html = '<div class="fpn-wrapper">';
    html += '<div class="fpn-intro"><p>Tabellen visar alla Haifa-produkter med f\u00e4rgintensitet proportionell till n\u00e4ringsinneh\u00e5ll. Klicka p\u00e5 kolumnrubrik f\u00f6r att sortera.</p></div>';

    html += '<table class="fpn-table" id="fpn-table">';
    html += '<thead><tr>';
    html += '<th class="fpn-th-name" data-sort="name">Produkt \u25b2\u25bc</th>';
    html += '<th class="fpn-th-type" data-sort="type">Typ</th>';
    html += '<th class="fpn-th-n" data-sort="n" style="color:var(--fp-n)">N \u25b2\u25bc</th>';
    html += '<th class="fpn-th-p" data-sort="p" style="color:var(--fp-p)">P \u25b2\u25bc</th>';
    html += '<th class="fpn-th-k" data-sort="k" style="color:var(--fp-k)">K \u25b2\u25bc</th>';
    html += '<th class="fpn-th-extra">Extra</th>';
    html += '<th class="fpn-th-desc">Anv\u00e4ndning</th>';
    html += '</tr></thead><tbody>';

    sorted.forEach(function (p) {
      var meta = groupMeta[p.group] || groupMeta.npk;
      html += '<tr class="fpn-row">';
      html += '<td class="fpn-name">' + p.name + '</td>';
      html += '<td class="fpn-type"><span class="fpn-type-badge" style="background:' + (groupBgMap[p.group] || '#f0efe8') + ';color:' + meta.color + '">' + meta.label.split(' ')[0] + '</span></td>';
      html += '<td class="fpn-val" style="background:' + heatBg(p.n, maxN, 150) + '"><span style="color:var(--fp-n)">' + (p.n || '\u2014') + '</span></td>';
      html += '<td class="fpn-val" style="background:' + heatBg(p.p, maxP, 42) + '"><span style="color:var(--fp-p)">' + (p.p || '\u2014') + '</span></td>';
      html += '<td class="fpn-val" style="background:' + heatBg(p.k, maxK, 270) + '"><span style="color:var(--fp-k)">' + (p.k || '\u2014') + '</span></td>';
      html += '<td class="fpn-extra">' + (p.extra || '') + '</td>';
      html += '<td class="fpn-desc">' + p.desc + '</td>';
      html += '</tr>';
    });

    html += '</tbody></table></div>';
    panel.innerHTML = html + buildOtherProductsSection();

    // Column sorting
    var currentSort = { col: '', dir: 'asc' };
    panel.querySelectorAll('.fpn-table thead th[data-sort]').forEach(function (th) {
      th.style.cursor = 'pointer';
      th.addEventListener('click', function () {
        var col = th.dataset.sort;
        if (currentSort.col === col) {
          currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
        } else {
          currentSort.col = col;
          currentSort.dir = 'asc';
        }
        var tbody = panel.querySelector('.fpn-table tbody');
        var rows = Array.from(tbody.querySelectorAll('tr'));
        rows.sort(function (a, b) {
          var aVal, bVal;
          if (col === 'name') {
            aVal = a.querySelector('.fpn-name').textContent;
            bVal = b.querySelector('.fpn-name').textContent;
            return currentSort.dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          } else if (col === 'type') {
            aVal = a.querySelector('.fpn-type-badge').textContent;
            bVal = b.querySelector('.fpn-type-badge').textContent;
            return currentSort.dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          } else {
            var cells = a.querySelectorAll('.fpn-val');
            var cellsB = b.querySelectorAll('.fpn-val');
            var idx = col === 'n' ? 0 : (col === 'p' ? 1 : 2);
            aVal = parseFloat(cells[idx].textContent) || 0;
            bVal = parseFloat(cellsB[idx].textContent) || 0;
            return currentSort.dir === 'asc' ? aVal - bVal : bVal - aVal;
          }
        });
        rows.forEach(function (r) { tbody.appendChild(r); });
      });
    });
  }

  /* ──────────────────────────────────────────────
     VOTING
     ────────────────────────────────────────────── */
  function initVoting() {
    document.querySelectorAll('.fp-vote-card').forEach(function (card) {
      card.addEventListener('click', function () {
        card.classList.toggle('fp-voted');
      });
    });
  }

  /* ──────────────────────────────────────────────
     INIT
     ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    buildPanelA();
    buildPanelB();
    buildPanelC();
    buildPanelD();
    buildPanelE();
    buildPanelF();
    buildPanelG();
    buildPanelH();
    buildPanelI();
    buildPanelJ();
    buildPanelK();
    buildPanelL();
    buildPanelM();
    buildPanelN();
    initVoting();
  });
})();
