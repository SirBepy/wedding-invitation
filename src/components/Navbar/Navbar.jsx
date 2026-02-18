import { useState, useEffect } from "react";
import Button from "../Button/Button";
import "./Navbar.scss";

const SECTIONS = ["landing", "details", "timeline", "faqs", "rsvp"];

const NAV_LINKS = [
  { id: "details", label: "Details" },
  { id: "timeline", label: "Schedule" },
  { id: "faqs", label: "FAQs" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("landing");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 },
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <a
          href="#landing"
          className={`navbar__logo font-decorative2 ${activeSection === "landing" ? "navbar__logo--active" : ""}`}
        >
          J & S
        </a>
        <div className="navbar__links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`navbar__link font-text ${activeSection === link.id ? "navbar__link--active" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <Button
          text="RSVP"
          href="#rsvp"
          classes={`navbar__cta font-text ${activeSection === "rsvp" ? "navbar__cta--active" : ""}`}
        />
      </nav>

      <button
        className={`navbar-burger ${menuOpen ? "navbar-burger--open" : ""}`}
        aria-label="Toggle menu"
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-menu ${menuOpen ? "navbar-menu--open" : ""}`}>
        <div className="navbar-menu__content">
          <div className="navbar-menu__header">
            <p className="navbar-menu__names font-decorative3">Josip & Storm</p>
            <p className="navbar-menu__date font-text">12.09.2026</p>
          </div>
          <div className="navbar-menu__links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="navbar-menu__link font-text"
                onClick={closeMenu}
              >
                {link.label}
              </a>
            ))}
          </div>
          <Button
            text="RSVP"
            href="#rsvp"
            classes="navbar-menu__cta font-text"
          />
        </div>
      </div>
    </>
  );
}
