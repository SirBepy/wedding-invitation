import { useState, useCallback, useRef } from 'react'
import Button from '../../components/Button/Button'
import './Rsvp.scss'

const contacts = [
  { name: 'Storm', number: '+385 99 886 7738' },
  { name: 'Josip', number: '+385 95 384 8499' },
]

export default function Rsvp() {
  const [copiedIndex, setCopiedIndex] = useState(null)
  const timeoutRef = useRef(null)

  const handleCopy = useCallback((number, index) => {
    navigator.clipboard.writeText(number).then(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setCopiedIndex(index)
      timeoutRef.current = setTimeout(() => setCopiedIndex(null), 2000)
    })
  }, [])

  return (
    <section id="rsvp" className="section">
      <div className="landing-content">
        <h1>RSVP</h1>
        <p className="font-text by-date-text">BY AUGUST 29TH</p>
        <Button text="RSVP HERE" classes="rsvp-button font-text" />
        <p className="font-text or-via-text">Or via WhatsApp</p>
        <div className="rsvp-contacts">
          {contacts.map((c, i) => (
            <div key={c.name} className="rsvp-contact">
              <span className="rsvp-contact-name">{c.name}</span>
              <span
                className="rsvp-contact-number"
                onClick={() => handleCopy(c.number, i)}
                style={{ cursor: 'pointer' }}
              >
                {copiedIndex === i ? 'Number copied!' : c.number}
              </span>
              <div className="rsvp-contact-actions">
                <a
                  href={`https://wa.me/${c.number.replace(/\s/g, '')}`}
                  className="rsvp-icon-btn"
                  title="WhatsApp"
                >
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
                <button
                  className="rsvp-icon-btn"
                  title="Copy number"
                  onClick={() => handleCopy(c.number, i)}
                >
                  <i className="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
