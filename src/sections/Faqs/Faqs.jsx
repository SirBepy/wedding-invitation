import { useState } from "react";
import "./Faqs.scss";

const faqCategories = [
  {
    name: "General",
    questions: [
      {
        q: "Can I bring a plus one?",
        a: "Please check with us on whatsapp before you RSVP to confirm if you can bring a plus one.",
      },
    ],
  },
  {
    name: "Travel & Accommodation",
    questions: [
      {
        q: "Do I need a visa to get to Medugorje?",
        a: "UK and Canadian guests do not require a visa. For South Africans, please note that you will need a multi-entry Schengen visa. Additionally, you need to enter BiH from a Schengen country.",
      },
      {
        q: "Which airport do I fly to?",
        a: "If you're wanting to fly directly to Croatia, we'd recommend the Split airport as it is the closet to Medugorje - 2 hours drive away. You can always fly through Zagreb, but Zagreb airport is 5-6 hours drive away.",
      },
      {
        q: "If I fly through Split, how do I get to Medugorje?",
        a: "You can catch a bus from Split to Medugorje. If there are enough SA guests coming through Split, we can try to organise a shuttle bus to pick the lot of you up and bring you to Medugorje.",
      },
      {
        q: "Will there be transportation available while in Medugorje?",
        a: "We will organise a shuttle bus for the day of the wedding for any guests who do not have access to a car.",
      },
      {
        q: "What touristic activities can I do while in Croatia and Hercegovina?",
        a: "Please take a look at <a href='https://docs.google.com/document/d/1YHtsDz1PAMM2rCK69JH41a-1yPDKRJX5lpSUaa3GwCk/edit?tab=t.0#heading=h.q1p9y64xtx9q' target='_blank'>this document</a> that lists our recommendations for touristic activities in Croatia and Hercegovina.",
      },
    ],
  },
];

export default function Faqs() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="faqs" className="section">
      <div className="faqs-content">
        <h1>FAQs</h1>
        <div className="faqs-container">
          <div className="faqs-categories">
            {faqCategories.map((cat, i) => (
              <button
                key={cat.name}
                className={`faqs-categories__item font-text ${i === activeCategory ? "faqs-categories__item--active" : ""}`}
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
                className={`faqs-questions__group ${i === activeCategory ? "faqs-questions__group--active" : ""}`}
              >
                {cat.questions.map((faq) => (
                  <details key={faq.q} className="faqs-questions__item">
                    <summary className="faqs-questions__question font-text">
                      {faq.q}
                    </summary>
                    <p className="faqs-questions__answer font-text">{faq.a}</p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
