function initHero() {

    const root = document.documentElement;

    const heroVideo = document.querySelector(
        ".portfolio-background__video"
    );

    const MIN_OVERLAY = 0.05;
    const MAX_OVERLAY = 0.99;
    const MAX_SCROLL = 250;


    // ==================================================
    // HERO VIDEO
    // ==================================================

    function getVideoUrls() {

        if (!heroVideo) {
            return null;
        }

        return {
            desktop: heroVideo.dataset.desktopVideo || "",
            mobile: heroVideo.dataset.mobileVideo || ""
        };
    }


    function loadHeroVideo() {

        if (!heroVideo) {
            return;
        }

        const videos = getVideoUrls();

        if (!videos) {
            return;
        }


        const mode =
            document.body.dataset.portfolioViewMode === "mobile"
                ? "mobile"
                : "desktop";


        /*
         * Si estamos en móvil pero no existe vídeo móvil,
         * utilizamos el vídeo desktop como fallback.
         */
        const selectedVideo =
            mode === "mobile"
                ? (videos.mobile || videos.desktop)
                : videos.desktop;


        if (!selectedVideo) {
            return;
        }


        /*
         * Evitar recargar el mismo vídeo constantemente.
         */
        if (heroVideo.dataset.currentVideo === selectedVideo) {
            return;
        }


        heroVideo.dataset.currentVideo = selectedVideo;


        /*
         * Guardamos la posición actual para intentar
         * mantener el cambio lo más natural posible.
         */
        const currentTime = heroVideo.currentTime || 0;


        heroVideo.src = selectedVideo;

        heroVideo.load();


        /*
         * Una vez cargado, intentamos continuar la reproducción.
         */
        heroVideo.addEventListener(
            "loadedmetadata",
            () => {

                try {

                    /*
                     * Solo restauramos el tiempo si el vídeo
                     * tiene una duración suficiente.
                     */
                    if (
                        currentTime > 0 &&
                        Number.isFinite(heroVideo.duration)
                    ) {

                        heroVideo.currentTime = Math.min(
                            currentTime,
                            heroVideo.duration
                        );

                    }

                }
                catch (error) {

                }


                heroVideo.play().catch(() => {
                    });

            },
            { once: true }
        );

    }

    loadHeroVideo();

    document.addEventListener(
        "portfolioViewModeChanged",
        loadHeroVideo
    );


    // ==================================================
    // OVERLAY
    // ==================================================

    function updateOverlay() {

        const progress = Math.min(window.scrollY / MAX_SCROLL, 1);

        const opacity = MIN_OVERLAY + (MAX_OVERLAY - MIN_OVERLAY) * progress;

        root.style.setProperty("--portfolio-overlay-opacity", opacity.toFixed(3));

    }


    window.addEventListener("scroll", updateOverlay);

    updateOverlay();

}