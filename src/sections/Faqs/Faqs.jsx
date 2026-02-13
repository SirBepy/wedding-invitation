import { useState } from 'react'
import './Faqs.scss'

const faqCategories = [
  {
    name: 'General',
    questions: [
      {
        q: 'What is the dress code?',
        a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        q: 'Can I bring a plus one?',
        a: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        q: 'Will there be parking available?',
        a: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      },
    ],
  },
  {
    name: 'Travel & Accommodation',
    questions: [
      {
        q: 'Where should I stay?',
        a: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
      {
        q: 'How do I get to the venue?',
        a: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        q: 'Is there a shuttle service?',
        a: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.',
      },
    ],
  },
]

export default function Faqs() {
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <section id="faqs" className="section">
      <div className="faqs-content">
        <h1>FAQs</h1>
        <div className="faqs-container">
          <div className="faqs-categories">
            {faqCategories.map((cat, i) => (
              <button
                key={cat.name}
                className={`faqs-categories__item font-text ${i === activeCategory ? 'faqs-categories__item--active' : ''}`}
                onClick={() => setActiveCategory(i)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="faqs-divider"></div>
          <div className="faqs-questions">
            {faqCategories.map((cat, i) => (
              <div
                key={cat.name}
                className={`faqs-questions__group ${i === activeCategory ? 'faqs-questions__group--active' : ''}`}
              >
                {cat.questions.map((faq) => (
                  <details key={faq.q} className="faqs-questions__item">
                    <summary className="faqs-questions__question font-text">{faq.q}</summary>
                    <p className="faqs-questions__answer font-text">{faq.a}</p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
