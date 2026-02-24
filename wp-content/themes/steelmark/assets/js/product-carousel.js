/**
 * Product Carousel — Splide.js powered center-focused infinite carousel.
 *
 * Finds all .product-carousel containers, wraps their .product-card-embed
 * children into Splide slide structure, and initializes with loop mode.
 */
(function () {
    'use strict';

    document.querySelectorAll('.product-carousel').forEach(function (grid) {
        var cards = Array.from(grid.querySelectorAll('.product-card-embed'));
        var total = cards.length;
        if (total < 2) return;

        // Build Splide structure: splide > splide__track > splide__list > splide__slide
        var root = document.createElement('div');
        root.className = 'splide product-carousel-splide';

        var track = document.createElement('div');
        track.className = 'splide__track';

        var list = document.createElement('div');
        list.className = 'splide__list';

        cards.forEach(function (card) {
            var slide = document.createElement('div');
            slide.className = 'splide__slide';
            slide.appendChild(card);
            list.appendChild(slide);
        });

        track.appendChild(list);
        root.appendChild(track);
        grid.parentNode.replaceChild(root, grid);

        // Initialize Splide
        var splide = new Splide(root, {
            type: 'loop',
            focus: 'center',
            fixedWidth: '280px',
            gap: '1.25rem',
            padding: '60px',
            speed: 450,
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            pagination: true,
            arrows: true,
            mediaQuery: 'min',
            breakpoints: {
                0: {
                    fixedWidth: '200px',
                    padding: '32px',
                    gap: '0.75rem',
                },
                481: {
                    fixedWidth: '240px',
                    padding: '40px',
                    gap: '1rem',
                },
                769: {
                    fixedWidth: '280px',
                    padding: '60px',
                    gap: '1.25rem',
                },
            },
        });

        // Apply scale/opacity effect on non-active slides
        function updateSlideEffects() {
            var slides = root.querySelectorAll('.splide__slide');
            slides.forEach(function (slide) {
                var isActive = slide.classList.contains('is-active');
                if (isActive) {
                    slide.style.transform = 'scale(1)';
                    slide.style.opacity = '1';
                } else {
                    slide.style.transform = 'scale(0.88)';
                    slide.style.opacity = '0.6';
                }
            });
        }

        splide.on('mounted move', updateSlideEffects);

        // Click on non-active slide to navigate to it
        splide.on('click', function (slideComponent) {
            if (!slideComponent.slide.classList.contains('is-active')) {
                splide.go(slideComponent.index);
            }
        });

        splide.mount();
    });
})();
