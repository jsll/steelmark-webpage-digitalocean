/**
 * Mega Menu Hover Intent
 *
 * Adds a short delay (150 ms) before the mega menu becomes visible,
 * preventing accidental triggers when the mouse passes through the
 * header quickly (e.g. moving from page content upward).
 *
 * Works alongside Blocksy's own mouseenter → .ct-active logic:
 *   Blocksy adds .ct-active immediately, but a CSS rule keeps the
 *   sub-menu hidden until [data-mega-ready] is also present.
 */
(function () {
  var DELAY = 150; // ms – short enough to feel instant on intentional hover

  function init() {
    var items = document.querySelectorAll('[class*="ct-mega-menu"]');

    items.forEach(function (li) {
      var timer = null;

      li.addEventListener('mouseenter', function () {
        timer = setTimeout(function () {
          li.setAttribute('data-mega-ready', '');
        }, DELAY);
      });

      li.addEventListener('mouseleave', function () {
        clearTimeout(timer);
        li.removeAttribute('data-mega-ready');
      });
    });
  }

  // Run after DOM is ready (the script is enqueued in the footer)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
