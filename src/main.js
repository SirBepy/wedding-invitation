import './styles/main.scss'
import './styles/sections/_landing.scss'
import './styles/sections/_details.scss'
import './styles/sections/_timeline.scss'
import './styles/sections/_faqs.scss'
import './styles/sections/_rsvp.scss'
// import './styles/sections/_envelope.scss'

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
