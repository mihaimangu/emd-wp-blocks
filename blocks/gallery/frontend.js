(function () {
    var ROW_UNIT = 10;
    var GAP = 12;

    function setSpan(item) {
        var img = item.querySelector('img');
        if (!img) return;

        function calc() {
            var span = Math.ceil((img.offsetHeight + GAP) / (ROW_UNIT + GAP));
            item.style.gridRowEnd = 'span ' + span;
        }

        if (img.complete && img.naturalHeight) {
            calc();
        } else {
            img.addEventListener('load', calc);
        }
    }

    function initMasonry() {
        document.querySelectorAll('.emd-gallery-grid').forEach(function (grid) {
            grid.querySelectorAll('.emd-gallery-item').forEach(setSpan);
        });
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initMasonry, 150);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMasonry);
    } else {
        initMasonry();
    }
})();
