const navbar = document.querySelector(".navbar");

let lastScroll = window.scrollY;
let upwardScroll = 0;

const SHOW_NAVBAR_AFTER = 5;

let userScrolling = false;

window.addEventListener("wheel", () => {
    userScrolling = true;
}, { passive: true });

window.addEventListener("touchmove", () => {
    userScrolling = true;
}, { passive: true });

window.addEventListener("scroll", () => {

    const currentScroll = window.scrollY;
    const delta = currentScroll - lastScroll;

    if (!userScrolling) {
        lastScroll = currentScroll;
        return;
    }

    userScrolling = false;

    if (currentScroll <= 0) {

        navbar.classList.remove("navbar--hidden");

        navbar.classList.remove("navbar--fade-in");
        void navbar.offsetWidth;
        navbar.classList.add("navbar--fade-in");

        upwardScroll = 0;
        lastScroll = 0;

        return;
    }

    if (delta > 0) {

        upwardScroll = 0;

        navbar.classList.add("navbar--hidden");

    }
    else if (delta < 0) {

        upwardScroll += Math.abs(delta);

        if (upwardScroll >= SHOW_NAVBAR_AFTER) {
            navbar.classList.remove("navbar--hidden");
        }

    }

    lastScroll = currentScroll;

});

const language = document.querySelector(".navbar__language");

if (language) {

    const button = language.querySelector(".navbar__language-button");

    button.addEventListener("click", (event) => {

        event.stopPropagation();

        const opened = language.classList.toggle("navbar__language--open");

        button.setAttribute("aria-expanded", opened ? "true" : "false");

    });

    document.addEventListener("click", (event) => {

        if (!language.contains(event.target)) {

            language.classList.remove("navbar__language--open");

            button.setAttribute("aria-expanded", "false");

        }

    });

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            language.classList.remove("navbar__language--open");

            button.setAttribute("aria-expanded", "false");

        }

    });

}

const navbarToggle = document.querySelector(".navbar__toggle");

if (navbarToggle) {

    navbarToggle.addEventListener("click", () => {

        const opened = navbar.classList.toggle("navbar--menu-open");

        navbarToggle.textContent = opened ? "✕" : "☰";

        navbarToggle.setAttribute(
            "aria-expanded",
            opened ? "true" : "false"
        );

    });

}

const navbarLinks = document.querySelectorAll(".navbar__nav a");

navbarLinks.forEach(link => {

    link.addEventListener("click", () => {

        navbar.classList.remove("navbar--menu-open");

        if (navbarToggle) {
            navbarToggle.textContent = "☰";
            navbarToggle.setAttribute("aria-expanded", "false");
        }

    });

});

// ==================================================
// VIEW MODE
// ==================================================

const VIEW_MODE_KEY = "portfolio-view-mode";

const desktopViewButton = document.querySelector(
    ".navbar__view-button--desktop"
);

const mobileViewButton = document.querySelector(
    ".navbar__view-button--mobile"
);

const mobileMediaQuery = window.matchMedia(
    "(max-width: 768px)"
);


// --------------------------------------------------
// APPLY VIEW MODE
// --------------------------------------------------

function applyViewMode(mode) {

    const mobile = mode === "mobile";

    /*
     * Guarda el modo actual en el <body>.
     * hero.js utilizará este valor para saber qué vídeo cargar.
     */
    document.body.dataset.portfolioViewMode = mobile
        ? "mobile"
        : "desktop";


    /*
     * El viewport simulado solo se utiliza cuando estamos
     * probando móvil desde una pantalla realmente grande.
     *
     * En un móvil real, el navegador ya está usando su
     * viewport móvil y no queremos limitarlo artificialmente
     * a 390px.
     */
    const isRealMobileViewport = mobileMediaQuery.matches;

    document.body.classList.toggle(
        "portfolio--mobile-preview",
        mobile && !isRealMobileViewport
    );


    updateViewModeButtons(mobile);
}


// --------------------------------------------------
// BUTTON STATE
// --------------------------------------------------

function updateViewModeButtons(mobile) {

    desktopViewButton?.classList.toggle(
        "navbar__view-button--active",
        !mobile
    );

    mobileViewButton?.classList.toggle(
        "navbar__view-button--active",
        mobile
    );

    desktopViewButton?.setAttribute(
        "aria-pressed",
        String(!mobile)
    );

    mobileViewButton?.setAttribute(
        "aria-pressed",
        String(mobile)
    );
}


// --------------------------------------------------
// CHANGE VIEW MODE
// --------------------------------------------------

function setViewMode(mode, save = true) {

    applyViewMode(mode);


    /*
     * Guardar aquí significa que el usuario ha elegido
     * manualmente el modo.
     */
    if (save) {

        localStorage.setItem(
            VIEW_MODE_KEY,
            mode
        );

    }


    /*
     * hero.js puede estar ya inicializado en la página.
     * Este evento permite cambiar el vídeo inmediatamente
     * sin recargar.
     */
    document.dispatchEvent(
        new CustomEvent("portfolioViewModeChanged", {
            detail: {
                mode: mode
            }
        })
    );

}


// --------------------------------------------------
// INITIAL MODE
// --------------------------------------------------

const savedViewMode = localStorage.getItem(
    VIEW_MODE_KEY
);


if (savedViewMode === "mobile" || savedViewMode === "desktop") {

    /*
     * Existe una elección manual anterior.
     * Tiene prioridad sobre el dispositivo.
     */
    setViewMode(savedViewMode, false);

}
else {

    /*
     * Primera visita:
     * detectar automáticamente el viewport.
     *
     * Importante:
     * NO guardamos este resultado en localStorage.
     * Por tanto sigue siendo modo automático.
     */
    const automaticMode = mobileMediaQuery.matches
        ? "mobile"
        : "desktop";

    setViewMode(automaticMode, false);

}


// --------------------------------------------------
// MANUAL BUTTONS
// --------------------------------------------------

desktopViewButton?.addEventListener(
    "click",
    () => setViewMode("desktop")
);

mobileViewButton?.addEventListener(
    "click",
    () => setViewMode("mobile")
);


// --------------------------------------------------
// AUTOMATIC MODE + RESIZE
// --------------------------------------------------

mobileMediaQuery.addEventListener(
    "change",
    () => {

        /*
         * Si existe una elección manual, no hacemos nada.
         */
        if (localStorage.getItem(VIEW_MODE_KEY)) {
            return;
        }


        const automaticMode = mobileMediaQuery.matches
            ? "mobile"
            : "desktop";

        setViewMode(automaticMode, false);

    }
);