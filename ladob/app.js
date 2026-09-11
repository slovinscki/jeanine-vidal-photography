const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu-principal");
const header = document.querySelector("[data-header]");
const hero = document.querySelector(".hero");
const floatingCta = document.querySelector("[data-floating-cta]");
const viewer = document.querySelector("[data-viewer]");
const viewerImage = document.querySelector("[data-viewer-image]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const closeMenu = () => {
    if (!menuButton) return;
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
};

if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
        const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
        menuButton.setAttribute("aria-expanded", String(willOpen));
        document.body.classList.toggle("menu-open", willOpen);
    });

    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
            closeMenu();
            menuButton.focus();
        }
    });
}

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (hero && floatingCta) {
    const heroObserver = new IntersectionObserver(([entry]) => {
        floatingCta.classList.toggle("is-visible", !entry.isIntersecting);
    }, { threshold: 0.08 });
    heroObserver.observe(hero);
}

if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -8%", threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

if (viewer && viewerImage) {
    document.querySelectorAll("[data-view]").forEach((button) => {
        button.addEventListener("click", () => {
            viewerImage.src = button.dataset.view;
            viewerImage.alt = button.dataset.alt || "Fotografia ampliada";
            viewer.showModal();
        });
    });

    document.querySelector("[data-viewer-close]")?.addEventListener("click", () => viewer.close());
    viewer.addEventListener("click", (event) => {
        if (event.target === viewer) viewer.close();
    });
    viewer.addEventListener("close", () => {
        viewerImage.removeAttribute("src");
        viewerImage.alt = "";
    });
}
