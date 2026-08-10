let modal;
let closeButton;

let currentProject = null;

let titleElement;
let descriptionElement;

let technologiesElement;

let demoButton;
let repositoryButton;

function initModal() {

    modal = document.getElementById("project-modal");

    titleElement = modal.querySelector(".project-modal__title");

    descriptionElement = modal.querySelector(".project-modal__description");

    technologiesElement = modal.querySelector(".project-modal__technologies");

    demoButton = modal.querySelector(".project-modal__demo");

    repositoryButton = modal.querySelector(".project-modal__repository");

    closeButton = document.querySelector(".project-modal__close");

    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", event => {

        if (document.querySelector(".project-viewer")
            ?.classList.contains("project-viewer--open")) {

            return;

        }

        if (event.target === modal) {

            closeModal();

        }

    });

}

function openModal(projectId) {

    console.log("projects =", projects);
    console.log("typeof projects =", typeof projects);
    console.log("projectId =", projectId);
    console.log("projects[projectId] =", projects[projectId]);
    console.log("projects['1'] =", projects["1"]);

    currentProject = projects[projectId];

    console.log("currentProject:", currentProject);
    console.log("technologies:", currentProject.technologies);
    console.log("Es array:", Array.isArray(currentProject.technologies));

    console.log("PROJECT ID:", projectId);
    console.log("CURRENT PROJECT:", currentProject);

    renderModal();

    renderGallery();

    modal.classList.add("project-modal--open");

    document.body.style.overflow = "hidden";

}

function renderModal() {

    console.log("renderModal ejecutado");

    titleElement.textContent = currentProject.title;

    descriptionElement.textContent = currentProject.description;

    technologiesElement.innerHTML = "";

    if (!Array.isArray(currentProject.technologies)) {
        console.error("technologies no es un array:", currentProject.technologies);
        return;
    }

    for (const technology of currentProject.technologies) {

        const item = document.createElement("div");
        item.className = "project-modal__technology";

        const image = document.createElement("img");
        image.src = technology.icon;
        image.alt = technology.name;

        const text = document.createElement("span");
        text.textContent = technology.name;

        item.appendChild(image);
        item.appendChild(text);

        technologiesElement.appendChild(item);

    }

    console.log("demo =", JSON.stringify(currentProject.demo));
    console.log("repository =", JSON.stringify(currentProject.repository));

    if (currentProject.demo?.trim()) {

         demoButton.href = currentProject.demo;
         demoButton.style.display = "inline-flex";

     }
     else {

         demoButton.style.display = "none";

     }

     if (currentProject.repository?.trim()) {

         repositoryButton.href = currentProject.repository;
         repositoryButton.style.display = "inline-flex";

     }
     else {

         repositoryButton.style.display = "none";

     }

}

function closeModal() {

    closeViewer();

    modal.classList.remove("project-modal--open");

    document.body.style.overflow = "";

}