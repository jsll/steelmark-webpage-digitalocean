/**
 * Mega menu news carousel — initializes Splide on the news strip.
 * Uses MutationObserver to catch when Blocksy injects the mega menu into the DOM.
 */
(function () {
  function initNewsCarousel(root) {
    root.querySelectorAll('.mega-menu-news-splide:not(.is-initialized)').forEach(function (el) {
      new Splide(el, {
        type: 'loop',
        perPage: 3,
        gap: '16px',
        autoplay: true,
        interval: 4000,
        pauseOnHover: true,
        pagination: false,
        arrows: false,
        speed: 600,
        breakpoints: {
          999: { perPage: 2 },
          689: { perPage: 1 },
        },
      }).mount();
    });
  }

  // Init on DOMContentLoaded (in case it's already in the page)
  document.addEventListener('DOMContentLoaded', function () {
    initNewsCarousel(document);
  });

  // Observe for dynamically injected mega menu content
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) {
          initNewsCarousel(node);
        }
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
