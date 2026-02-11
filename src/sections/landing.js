export function landing() {
  return `
    <section id="landing" class="section">
      <div class="landing-content">
        <h1 class="section-title">You're Invited</h1>
        <p class="font-text landing-text">To the wedding of</p>
        <p class="font-decorative3 landing-names">Josip & Storm</p>
        <p class="font-text landing-text">On</p>
        <p class="font-text landing-text landing-text--faded">Saturday, September 12th</p>
        <!-- TODO: link to calendar -->
        <p class="font-decorative3 landing-date">12.09.2026</p>
        <div class="landing-location">
          <img src="/icons/location.svg" alt="Location" class="landing-location__icon" />
          <p class="landing-location__text">Hotel Storia<br/>Tasovčići bb, 88300, Bosnia & Herzegovina</p>
        </div>
        <p class="font-text landing-rsvp">RSVP by August 29th</p>
      </div>
    </section>
  `
}
