'use strict';

(function () {
    var thumbs = document.querySelectorAll('.gallery-thumb');
    var mainImg = document.getElementById('gallery-main-img');
    if (!mainImg || thumbs.length === 0) return;

    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            var fullUrl = this.getAttribute('data-full');
            if (!fullUrl) return;
            mainImg.removeAttribute('srcset');
            mainImg.removeAttribute('sizes');
            mainImg.src = fullUrl;
            thumbs.forEach(function (t) { t.classList.remove('active'); });
            this.classList.add('active');
        });
    });
})();
