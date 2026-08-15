const hero = document.querySelector(".hero");
const projectModal = document.querySelector("#project-modal");

if (hero) {
    initHero();
    initParticles();
}

if (projectModal) {
    initModal();
    initMediaViewer();
}

const cards = document.querySelectorAll("[data-project-id]");

cards.forEach(card => {

    card.addEventListener("click", () => {

        currentPage = 0;

        const id = Number(card.dataset.projectId);

        openModal(id);

    });

});

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("reveal--visible");

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.2
});

revealElements.forEach(element => observer.observe(element));