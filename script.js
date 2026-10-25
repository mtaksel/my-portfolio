"use strict";
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Native anchors handle navigation, including when JavaScript is unavailable.
const links = [...document.querySelectorAll(".nav-links a")];
function updateNavigation() {
    const hash = window.location.hash || "#home";
    for (const link of links) {
        if (link.getAttribute("href") === hash) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    }
}
window.addEventListener("hashchange", updateNavigation);
updateNavigation();
