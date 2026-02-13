import { button } from "./button.js";

export function navbar() {
  return `
    <nav class="navbar">
      <a href="#landing" class="navbar__logo font-decorative2">J & S</a>
      <div class="navbar__links">
        <a href="#details" class="navbar__link font-text" data-section="details">Details</a>
        <a href="#timeline" class="navbar__link font-text" data-section="timeline">Schedule</a>
        <a href="#faqs" class="navbar__link font-text" data-section="faqs">FAQs</a>
      </div>
      ${button({ text: "RSVP", href: "#rsvp", classes: "navbar__cta font-text" })}
    </nav>

    <button class="navbar-burger" aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <div class="navbar-menu">
      <div class="navbar-menu__content">
        <div class="navbar-menu__header">
          <p class="navbar-menu__names font-decorative3">Josip & Storm</p>
          <p class="navbar-menu__date font-text">12.09.2026</p>
        </div>
        <div class="navbar-menu__links">
          <a href="#details" class="navbar-menu__link font-text" data-section="details">Details</a>
          <a href="#timeline" class="navbar-menu__link font-text" data-section="timeline">Schedule</a>
          <a href="#faqs" class="navbar-menu__link font-text" data-section="faqs">FAQs</a>
        </div>
        ${button({ text: "RSVP", href: "#rsvp", classes: "navbar-menu__cta font-text" })}
      </div>
    </div>
  `;
}

export function initNavbar() {
  const links = document.querySelectorAll(".navbar__link[data-section]");
  const logo = document.querySelector(".navbar__logo");
  const cta = document.querySelector(".navbar__cta");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) =>
            link.classList.toggle(
              "navbar__link--active",
              link.dataset.section === entry.target.id,
            ),
          );
          logo.classList.toggle(
            "navbar__logo--active",
            entry.target.id === "landing",
          );
          cta.classList.toggle(
            "navbar__cta--active",
            entry.target.id === "rsvp",
          );
        }
      });
    },
    { threshold: 0.4 },
  );

  ["landing", "details", "timeline", "faqs", "rsvp"].forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });

  // Burger menu
  const burger = document.querySelector(".navbar-burger");
  const menu = document.querySelector(".navbar-menu");
  const menuLinks = document.querySelectorAll(
    ".navbar-menu__link, .navbar-menu__cta",
  );

  const toggleMenu = () => {
    burger.classList.toggle("navbar-burger--open");
    menu.classList.toggle("navbar-menu--open");
  };

  const closeMenu = () => {
    burger.classList.remove("navbar-burger--open");
    menu.classList.remove("navbar-menu--open");
  };

  burger.addEventListener("click", toggleMenu);
  menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
}
