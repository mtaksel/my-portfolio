"use strict";

// Content, navigation, and project links also work without JavaScript.
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const navigationLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
const sections = navigationLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            for (const link of navigationLinks) {
                if (link.getAttribute("href") === `#${entry.target.id}`) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            }
        }
    }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
    sections.forEach(section => observer.observe(section));
}
