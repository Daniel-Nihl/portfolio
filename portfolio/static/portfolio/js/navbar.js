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