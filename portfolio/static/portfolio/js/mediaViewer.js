//==================================================
// VIEWER
//==================================================

let viewer;
let viewerImage;
let viewerVideo;

let viewerClose;

let viewerLeft;
let viewerRight;

//==================================================
// GALLERY
//==================================================

let galleryViewport;
let galleryTrack;

let galleryLeft;
let galleryRight;

//==================================================
// CONFIG
//==================================================

const ITEMS_PER_PAGE = 10;
const PANEL_COUNT = 3;

//==================================================
// STATE
//==================================================

let currentMediaIndex = 0;

let loadedVideo = null;

function getGalleryMedia() {

    return currentProject
        ? currentProject.media
        : [];

}

let currentPage = 0;

let panels = [];

let isAnimating = false;

let animationDirection = 0;

//==================================================
// DIRECTIONS
//==================================================

const MOVE_LEFT = -1;
const MOVE_RIGHT = 1;





function createSlot() {

    const root = document.createElement("div");

    root.className = "project-modal__gallery-item";

    const image = document.createElement("img");

    image.draggable = false;

    root.appendChild(image);

    return {

        root,
        image,

        mediaIndex: -1

    };

}

function createPanel() {

    const element = document.createElement("div");

    element.className = "project-modal__gallery-page";

    const slots = [];

    for (let i = 0; i < ITEMS_PER_PAGE; i++) {

        const slot = createSlot();

        element.appendChild(slot.root);

        slots.push(slot);

    }

    return {

        element,

        slots,

        page: -1

    };

}

function getTotalPages() {

    return Math.ceil(

        getGalleryMedia().length / ITEMS_PER_PAGE

    );

}

function normalizePage(page) {

    const total = getTotalPages();

    while (page < 0) {

        page += total;

    }

    while (page >= total) {

        page -= total;

    }

    return page;

}

function initializeGallery() {

    panels = [];

    galleryTrack.innerHTML = "";

    for (let i = 0; i < PANEL_COUNT; i++) {

        const panel = createPanel();

        galleryTrack.appendChild(panel.element);

        panels.push(panel);

    }

    galleryTrack.style.transition = "none";

    galleryTrack.style.transform = "translateX(-100%)";

}

function loadPanel(panel, pageIndex) {

    panel.page = normalizePage(pageIndex);

    const firstMedia = panel.page * ITEMS_PER_PAGE;

    const galleryMedia = getGalleryMedia();

    for (let i = 0; i < ITEMS_PER_PAGE; i++) {

        const slot = panel.slots[i];

        const mediaIndex = firstMedia + i;

        slot.root.classList.remove(

            "project-modal__gallery-item--active"

        );

        if (mediaIndex >= galleryMedia.length) {

            slot.mediaIndex = -1;

            slot.root.style.display = "none";

            slot.root.onclick = null;

            continue;

        }

        slot.mediaIndex = mediaIndex;

        slot.root.style.display = "";

        const media = galleryMedia[mediaIndex];

        slot.image.src = media.thumbnail;

        slot.image.alt = "";

        slot.root.onclick = () => {

            currentMediaIndex = slot.mediaIndex;

            updateActiveThumbnail();

            showCurrentMedia();

            openViewer();

        };

    }

}

function renderGallery() {

    console.count("renderGallery");

    if (!currentProject) {
            return;
        }

    currentPage = normalizePage(currentPage);

    loadPanel(

        panels[0],

        currentPage - 1

    );

    loadPanel(

        panels[1],

        currentPage

    );

    loadPanel(

        panels[2],

        currentPage + 1

    );

    galleryTrack.style.transition = "none";

    galleryTrack.style.transform = "translateX(-100%)";

    requestAnimationFrame(() => {

        galleryTrack.style.transition = "";

    });

}

function nextPage() {

    if (isAnimating) {
        return;
    }

    if (getTotalPages() <= 1) {
        return;
    }

    isAnimating = true;

    animationDirection = MOVE_RIGHT;

    galleryTrack.style.transform = "translateX(-200%)";

}

function previousPage() {

    if (isAnimating) {
        return;
    }

    if (getTotalPages() <= 1) {
        return;
    }

    isAnimating = true;

    animationDirection = MOVE_LEFT;

    galleryTrack.style.transform = "translateX(0%)";

}

function recycleForward() {

    currentPage = normalizePage(currentPage + 1);

    const recycledPanel = panels.shift();

    panels.push(recycledPanel);

    galleryTrack.appendChild(recycledPanel.element);

    loadPanel(
        recycledPanel,
        currentPage + 1
    );

}

function recycleBackward() {

    currentPage = normalizePage(currentPage - 1);

    const recycledPanel = panels.pop();

    panels.unshift(recycledPanel);

    galleryTrack.prepend(recycledPanel.element);

    loadPanel(
        recycledPanel,
        currentPage - 1
    );

}

function onGalleryTransitionEnd(event) {

    if (event.target !== galleryTrack) {
        return;
    }

    if (!isAnimating) {
        return;
    }

    if (animationDirection === MOVE_RIGHT) {

        recycleForward();

    }
    else if (animationDirection === MOVE_LEFT) {

        recycleBackward();

    }

    galleryTrack.style.transition = "none";

    galleryTrack.style.transform = "translateX(-100%)";

    galleryTrack.offsetHeight;

    galleryTrack.style.transition = "";

    animationDirection = 0;

    isAnimating = false;

}

function updateActiveThumbnail() {

    for (const panel of panels) {

        for (const slot of panel.slots) {

            slot.root.classList.remove(
                "project-modal__gallery-item--active"
            );

            if (slot.mediaIndex === currentMediaIndex) {

                slot.root.classList.add("project-modal__gallery-item--active");

            }

        }

    }

}

function showCurrentMedia() {

    console.count("showCurrentMedia");

    const galleryMedia = getGalleryMedia();

    const media = galleryMedia[currentMediaIndex];

    if (!media) {
        return;
    }

    const isVideo = media.type === "video";

    viewerImage.classList.toggle("project-viewer__image--active", !isVideo);

    viewerVideo.classList.toggle("project-viewer__video--active", isVideo);

    if (isVideo) {

        if (loadedVideo !== media.url) {

            loadedVideo = media.url;

            viewerVideo.src = media.url;

            viewerVideo.load();

        }

        viewerVideo.play();

    }
    else {

        loadedVideo = null;

        viewerVideo.pause();

        viewerVideo.removeAttribute("src");

        viewerVideo.load();

        viewerImage.src = media.url;

    }

    updateActiveThumbnail();

}

function syncGallery() {

    const page = Math.floor(
        currentMediaIndex / ITEMS_PER_PAGE
    );

    if (page === currentPage) {

        updateActiveThumbnail();

        return;

    }

    currentPage = page;

    renderGallery();

    updateActiveThumbnail();

}

function nextMedia() {

    const galleryMedia = getGalleryMedia();

    if (galleryMedia.length === 0) {
        return;
    }

    currentMediaIndex++;

    if (currentMediaIndex >= galleryMedia.length) {

        currentMediaIndex = 0;

    }

    syncGallery();

    showCurrentMedia();

}

function previousMedia() {

    const galleryMedia = getGalleryMedia();

    if (galleryMedia.length === 0) {
        return;
    }

    currentMediaIndex--;

    if (currentMediaIndex < 0) {

        currentMediaIndex = galleryMedia.length - 1;

    }

    syncGallery();

    showCurrentMedia();

}

function openViewer() {

    viewer.classList.add("project-viewer--open");

    showCurrentMedia();

}

function closeViewer() {

    viewer.classList.remove("project-viewer--open");

    viewerVideo.pause();

}

function onViewerKeyDown(event) {

    if (!viewer.classList.contains("project-viewer--open")) {
        return;
    }

    switch (event.key) {

        case "ArrowLeft":
            event.preventDefault();
            previousMedia();
            break;

        case "ArrowRight":
            event.preventDefault();
            nextMedia();
            break;

        case "Escape":
            event.preventDefault();
            closeViewer();
            break;

    }

}

function onViewerClick(event) {

    if (!viewer.classList.contains("project-viewer--open")) {
        return;
    }

    if (event.target === viewer) {

        event.stopPropagation();

        closeViewer();

    }

}


function initMediaViewer() {

    viewer = document.querySelector(".project-viewer");

    viewerImage = document.querySelector(".project-viewer__image");
    viewerVideo = document.querySelector(".project-viewer__video");

    viewerClose = document.querySelector(".project-viewer__close");

    viewerLeft = document.querySelector(".project-viewer__arrow--left");

    viewerRight = document.querySelector(".project-viewer__arrow--right");

    galleryViewport = document.querySelector(".project-modal__gallery-viewport");

    galleryTrack = document.querySelector(".project-modal__gallery-track");

    galleryLeft = document.querySelector(".project-modal__gallery-arrow--left");

    galleryRight = document.querySelector(".project-modal__gallery-arrow--right");

    document.addEventListener("keydown", onViewerKeyDown);

    viewer.addEventListener("click", onViewerClick);

    initializeGallery();

    galleryLeft.onclick = previousPage;
    galleryRight.onclick = nextPage;

    viewerLeft.onclick = previousMedia;
    viewerRight.onclick = nextMedia;

    viewerClose.onclick = closeViewer;

    galleryTrack.addEventListener("transitionend", onGalleryTransitionEnd);

}

