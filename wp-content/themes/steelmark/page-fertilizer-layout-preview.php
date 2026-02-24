<?php
/**
 * Template Name: Fertilizer Layout Preview
 *
 * Preview page for 14 fertilizer product display approaches.
 * Collaborators can view and vote on preferred layout.
 *
 * @package Steelmark
 */

get_header();
?>

<div class="ct-container fert-preview" data-content="normal">

  <div class="fert-preview__intro">
    <h1>Växthussgödsel — Layoutförslag</h1>
    <p class="lead">14 olika sätt att visa Haifa-sortimentet. Övriga produkter (LMI, K+S m.fl.) visas i standardlistan längst ner på sidan. Klicka på flikarna för att jämföra, och rösta på dina favoriter.</p>
  </div>

  <nav class="fp-tab-nav">
    <button class="fp-tab-btn active" data-tab="a">
      <span class="fp-tab-label">A — Funktionsgrupper</span>
      <span class="fp-tab-desc">Produkttyp + NPK-spektrum</span>
    </button>
    <button class="fp-tab-btn" data-tab="b">
      <span class="fp-tab-label">B — Näringscentrisk</span>
      <span class="fp-tab-desc">Sök per näringsbehov</span>
    </button>
    <button class="fp-tab-btn" data-tab="c">
      <span class="fp-tab-label">C — NPK-triangel</span>
      <span class="fp-tab-desc">Ternärt diagram</span>
    </button>
    <button class="fp-tab-btn" data-tab="d">
      <span class="fp-tab-label">D — Periodiskt system</span>
      <span class="fp-tab-desc">Familj × näringsprofil</span>
    </button>
    <button class="fp-tab-btn" data-tab="e">
      <span class="fp-tab-label">E — Gödselguiden</span>
      <span class="fp-tab-desc">Steg-för-steg rekommendation</span>
    </button>
    <button class="fp-tab-btn" data-tab="f">
      <span class="fp-tab-label">F — Filterkort</span>
      <span class="fp-tab-desc">Underkategorier + NPK-kort</span>
    </button>
    <button class="fp-tab-btn" data-tab="g">
      <span class="fp-tab-label">G — Spridningsdiagram</span>
      <span class="fp-tab-desc">N vs K med P-storlek</span>
    </button>
    <button class="fp-tab-btn" data-tab="h">
      <span class="fp-tab-label">H — Odlingskalender</span>
      <span class="fp-tab-desc">Produkt per tillväxtfas</span>
    </button>
    <button class="fp-tab-btn" data-tab="i">
      <span class="fp-tab-label">I — Berättande</span>
      <span class="fp-tab-desc">Scroll-storytelling + jämförelse</span>
    </button>
    <button class="fp-tab-btn" data-tab="j">
      <span class="fp-tab-label">J — Expanderbar lista</span>
      <span class="fp-tab-desc">Kompakt accordion per kategori</span>
    </button>
    <button class="fp-tab-btn" data-tab="k">
      <span class="fp-tab-label">K — Showcase</span>
      <span class="fp-tab-desc">Hero + produktfamiljer</span>
    </button>
    <button class="fp-tab-btn" data-tab="l">
      <span class="fp-tab-label">L — Jämförelse</span>
      <span class="fp-tab-desc">Välj & jämför produkter</span>
    </button>
    <button class="fp-tab-btn" data-tab="m">
      <span class="fp-tab-label">M — Nyttokategorier</span>
      <span class="fp-tab-desc">Grupperat efter nytta</span>
    </button>
    <button class="fp-tab-btn" data-tab="n">
      <span class="fp-tab-label">N — Kompakt tabell</span>
      <span class="fp-tab-desc">Sorterad värmekarta</span>
    </button>
  </nav>

  <div class="fp-tab-panels">
    <div class="fp-tab-panel active" id="fp-panel-a"></div>
    <div class="fp-tab-panel" id="fp-panel-b"></div>
    <div class="fp-tab-panel" id="fp-panel-c"></div>
    <div class="fp-tab-panel" id="fp-panel-d"></div>
    <div class="fp-tab-panel" id="fp-panel-e"></div>
    <div class="fp-tab-panel" id="fp-panel-f"></div>
    <div class="fp-tab-panel" id="fp-panel-g"></div>
    <div class="fp-tab-panel" id="fp-panel-h"></div>
    <div class="fp-tab-panel" id="fp-panel-i"></div>
    <div class="fp-tab-panel" id="fp-panel-j"></div>
    <div class="fp-tab-panel" id="fp-panel-k"></div>
    <div class="fp-tab-panel" id="fp-panel-l"></div>
    <div class="fp-tab-panel" id="fp-panel-m"></div>
    <div class="fp-tab-panel" id="fp-panel-n"></div>
  </div>

  <div class="fp-voting">
    <h2>Vilka layouter föredrar du?</h2>
    <p>Klicka på de alternativ du tycker passar bäst. Du kan välja flera.</p>

    <div class="fp-vote-grid">
      <div class="fp-vote-card" data-vote="a">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">A</div>
        <h3>Funktionsgrupper</h3>
        <p>Produkttyp med NPK-staplar och Soluplant-jämförelse.</p>
      </div>
      <div class="fp-vote-card" data-vote="b">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">B</div>
        <h3>Näringscentrisk</h3>
        <p>Hitta produkt via N/P/K/Ca/Mg-behov.</p>
      </div>
      <div class="fp-vote-card" data-vote="c">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">C</div>
        <h3>NPK-triangel</h3>
        <p>Interaktivt ternärt NPK-diagram.</p>
      </div>
      <div class="fp-vote-card" data-vote="d">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">D</div>
        <h3>Periodiskt system</h3>
        <p>Produktfamilj × näringsdominans i rutnät.</p>
      </div>
      <div class="fp-vote-card" data-vote="e">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">E</div>
        <h3>Gödselguiden</h3>
        <p>3-stegs guide: gröda &rarr; fas &rarr; rekommendation.</p>
      </div>
      <div class="fp-vote-card" data-vote="f">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">F</div>
        <h3>Filterkort</h3>
        <p>Kategori-flikar med NPK-spektrumkort.</p>
      </div>
      <div class="fp-vote-card" data-vote="g">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">G</div>
        <h3>Spridningsdiagram</h3>
        <p>N &times; K scatter plot med P som cirkelstorlek.</p>
      </div>
      <div class="fp-vote-card" data-vote="h">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">H</div>
        <h3>Odlingskalender</h3>
        <p>Produkter per tillväxtfas och gröda.</p>
      </div>
      <div class="fp-vote-card" data-vote="i">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">I</div>
        <h3>Berättande</h3>
        <p>Scroll-storytelling med jämförelsetabell.</p>
      </div>
      <div class="fp-vote-card" data-vote="j">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">J</div>
        <h3>Expanderbar lista</h3>
        <p>Kompakt accordion per kategori.</p>
      </div>
      <div class="fp-vote-card" data-vote="k">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">K</div>
        <h3>Showcase</h3>
        <p>Hero-sektion med produktfamiljer och visuella kort.</p>
      </div>
      <div class="fp-vote-card" data-vote="l">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">L</div>
        <h3>Jämförelse</h3>
        <p>Interaktiv jämförelse — välj produkter och se skillnader.</p>
      </div>
      <div class="fp-vote-card" data-vote="m">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">M</div>
        <h3>Nyttokategorier</h3>
        <p>Produkter grupperade efter användningsområde.</p>
      </div>
      <div class="fp-vote-card" data-vote="n">
        <div class="fp-vote-check">&#10003;</div>
        <div class="fp-vote-letter">N</div>
        <h3>Kompakt tabell</h3>
        <p>Sorterad tabell med NPK-värmekarta.</p>
      </div>
    </div>
  </div>

</div>

<div class="fp-tooltip" id="fp-tooltip"></div>

<?php get_footer(); ?>
