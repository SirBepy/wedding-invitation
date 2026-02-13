import './styles/main.scss'
import './styles/components/_navbar.scss'
import './styles/components/_location-button.scss'
import './styles/sections/_landing.scss'
import './styles/sections/_details.scss'
import './styles/sections/_timeline.scss'
import './styles/sections/_faqs.scss'
import './styles/sections/_rsvp.scss'
// import './styles/sections/_envelope.scss'

import { navbar, initNavbar } from './components/navbar.js'
import { landing } from './sections/landing.js'
import { details } from './sections/details.js'
import { timeline } from './sections/timeline.js'
import { faqs, initFaqsSection } from './sections/faqs.js'
import { rsvp } from './sections/rsvp.js'
// import { envelope, initEnvelopeSection } from './sections/envelope.js'

document.getElementById('app').innerHTML = [
  navbar(),
  landing(),
  details(),
  timeline(),
  faqs(),
  rsvp(),
  // envelope(),
].join('')

initNavbar()
initFaqsSection()
// initEnvelopeSection()

// TODO: Add form to RSVP
// TODO: Write Note: If you want a plus 1, please RSVP contact us directly first.