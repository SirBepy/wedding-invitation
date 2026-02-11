import './styles/main.scss'

import { landing } from './sections/landing.js'
import { details } from './sections/details.js'
import { timeline } from './sections/timeline.js'
import { faqs } from './sections/faqs.js'
import { rsvp } from './sections/rsvp.js'
// import { envelope, initEnvelopeSection } from './sections/envelope.js'

document.getElementById('app').innerHTML = [
  landing(),
  details(),
  timeline(),
  faqs(),
  rsvp(),
  // envelope(),
].join('')

// initEnvelopeSection()
