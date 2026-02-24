/**
 * Mobile Menu Toggle Fix
 *
 * Blocksy's hamburger trigger only opens the offcanvas panel — clicking
 * it again while the panel is open does nothing (guard clause in
 * fast-overlay.js). This script intercepts the click in the capture
 * phase, stops it from reaching Blocksy (which would re-open the panel),
 * and triggers the built-in close button instead.
 */
(function () {
  function init() {
    var triggers = document.querySelectorAll('.ct-header-trigger[data-toggle-panel]');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        if (!document.body.hasAttribute('data-panel')) return;

        var panelSelector = trigger.dataset.togglePanel || trigger.getAttribute('href');
        if (!panelSelector) return;

        var panel = document.querySelector(panelSelector);
        if (!panel || !panel.classList.contains('active')) return;

        // Stop Blocksy's handler from re-opening the panel
        e.stopImmediatePropagation();
        e.preventDefault();

        // Trigger the built-in close button
        var closeBtn = panel.querySelector('.ct-toggle-close');
        if (closeBtn) {
          closeBtn.click();
        }
      }, { capture: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
