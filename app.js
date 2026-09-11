const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu-principal");

if (menuButton && menu) {
    const closeMenu = () => {
        menuButton.setAttribute("aria-expanded", "false");
    };

    menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        menuButton.setAttribute("aria-expanded", String(!isOpen));
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            menuButton.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest("nav")) {
            closeMenu();
        }
    });
}
