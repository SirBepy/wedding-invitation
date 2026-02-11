import { initEnvelope } from '../scripts/envelope.js'

export function envelope() {
  return `
    <section id="envelope-section" class="section">
      <div class="envlope-wrapper">
        <div id="envelope" class="close">
          <div class="front flap"></div>
          <div class="front pocket"></div>
          <div class="letter">
            <div class="words line1">Wedding Timeline</div>
            <div class="words line2">16:30</div>
            <div class="words line3">Church Ceremony</div>
            <div class="words line4">All Other Events</div>
          </div>
          <div class="hearts">
            <div class="heart a1"></div>
            <div class="heart a2"></div>
            <div class="heart a3"></div>
          </div>
        </div>
      </div>
      <div class="reset">
        <button id="open">Open</button>
        <button id="reset">Reset</button>
      </div>
    </section>
  `
}

export function initEnvelopeSection() {
  initEnvelope()
}
