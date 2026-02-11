import { locationButton } from "../components/location-button.js";

export function landing() {
  return `
    <section id="landing" class="section">
      <div class="landing-content">
        <h1>You're Invited</h1>
        <p class="font-text landing-text">To the wedding of</p>
        <p class="font-decorative3 landing-names">JOSIP & STORM</p>
        <p class="font-text landing-text">On</p>
        <p class="font-text landing-text landing-text--faded">Saturday, September 12th</p>
        <!-- TODO: link to calendar -->
        <p class="font-decorative3 landing-date">12.09.2026</p>
        ${locationButton({
          texts: ["Hotel Storia", "Tasovčići bb, 88300, Bosnia & Herzegovina"],
          link: "https://maps.app.goo.gl/Niw21p7dzi6Ryziq9",
        })}
        <p class="font-text landing-rsvp">RSVP by August 29th</p>
      </div>
    </section>
  `;
}
