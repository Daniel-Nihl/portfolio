const backToTopButton = document.querySelector(".footer__top");

backToTopButton?.addEventListener("click", () => {

    navbar.classList.remove("navbar--hidden");

    navbar.classList.remove("navbar--fade-in");
    void navbar.offsetWidth;
    navbar.classList.add("navbar--fade-in");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});