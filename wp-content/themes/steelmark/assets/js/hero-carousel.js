/**
 * Hero carousel — auto-advance, arrows, dots, pause on hover.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var carousel = document.querySelector('.hero-carousel');
        if (!carousel) return;

        var slides = carousel.querySelectorAll('.hero-slide');
        var dots   = carousel.querySelectorAll('.hero-dot');
        var total  = slides.length;
        if (total < 2) return;

        var current  = 0;
        var interval = null;
        var DELAY    = 6000;

        function goToSlide(index) {
            slides[current].classList.remove('active');
            slides[current].setAttribute('aria-hidden', 'true');
            dots[current].classList.remove('active');
            dots[current].setAttribute('aria-selected', 'false');

            current = (index + total) % total;

            slides[current].classList.add('active');
            slides[current].setAttribute('aria-hidden', 'false');
            dots[current].classList.add('active');
            dots[current].setAttribute('aria-selected', 'true');
        }

        function startAutoplay() {
            stopAutoplay();
            interval = setInterval(function () {
                goToSlide(current + 1);
            }, DELAY);
        }

        function stopAutoplay() {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        }

        // Arrow buttons
        var prev = carousel.querySelector('.hero-arrow--prev');
        var next = carousel.querySelector('.hero-arrow--next');

        if (prev) prev.addEventListener('click', function () { goToSlide(current - 1); startAutoplay(); });
        if (next) next.addEventListener('click', function () { goToSlide(current + 1); startAutoplay(); });

        // Dot buttons
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { goToSlide(i); startAutoplay(); });
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);

        // Respect reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        startAutoplay();
    });
})();
