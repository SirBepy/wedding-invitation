export function navbar() {
  return `
    <nav class="navbar">
      <a href="#landing" class="navbar__logo font-decorative2">J & S</a>
      <div class="navbar__links">
        <a href="#details" class="navbar__link font-text">Details</a>
        <a href="#timeline" class="navbar__link font-text">Schedule</a>
        <a href="#faqs" class="navbar__link font-text">FAQs</a>
      </div>
      <a href="#rsvp" class="navbar__cta font-text">RSVP</a>
    </nav>
  `;
}
