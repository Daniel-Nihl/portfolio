function initHero() {

    const root = document.documentElement;

    const MIN_OVERLAY = 0.05;
    const MAX_OVERLAY = 0.99;
    const MAX_SCROLL = 250;

    function updateOverlay() {

        const progress = Math.min(window.scrollY / MAX_SCROLL, 1);

        const opacity = MIN_OVERLAY + (MAX_OVERLAY - MIN_OVERLAY) * progress;

        root.style.setProperty("--portfolio-overlay-opacity", opacity.toFixed(3));

    }

    window.addEventListener("scroll", updateOverlay);

    updateOverlay();

}