import { useState, useRef, useLayoutEffect } from "react";
import "./Faqs.scss";

const faqCategories = [
  {
    name: "General",
    questions: [
      {
        q: "Can I bring a plus one?",
        a: "Please check with us on whatsapp before you RSVP to confirm if you can bring a plus one.",
      },
      {
        q: "Will there be transportation available while in Medugorje?",
        a: "We will organise a shuttle bus for the day of the wedding for any guests who do not have access to a car.",
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
        q: "What touristic activities can I do while in Croatia and Hercegovina?",
        a: `Please take a look at <a href='${import.meta.env.BASE_URL}Places to Visit while Travelling to Medj.pdf' target='_blank'>this document</a> that lists our recommendations for touristic activities in Croatia and Hercegovina.`,
      },
    ],
  },
];

export default function Faqs() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState(null);

  const categoryRefs = useRef([]);

  useLayoutEffect(() => {
    const btn = categoryRefs.current[activeCategory];
    if (btn) {
      setIndicatorStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
    }
  }, [activeCategory]);

  function handleCategoryChange(i) {
    setActiveCategory(i);
    setOpenQuestion(null);
  }

  function toggleQuestion(q) {
    setOpenQuestion((prev) => (prev === q ? null : q));
  }

  return (
    <section id="faqs" className="section">
      <div className="faqs-content">
        <h1>FAQs</h1>
        <div className="faqs-container">
          <div className="faqs-categories">
            {faqCategories.map((cat, i) => (
              <button
                key={cat.name}
                ref={(el) => {
                  categoryRefs.current[i] = el;
                }}
                className={`faqs-categories__item font-text ${i === activeCategory ? "faqs-categories__item--active" : ""}`}
                onClick={() => handleCategoryChange(i)}
              >
                {cat.name}
              </button>
            ))}
            {indicatorStyle && (
              <div
                className="faqs-indicator"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
              />
            )}
          </div>
          <div className="faqs-divider"></div>
          <div className="faqs-questions">
            {faqCategories.map((cat, i) => (
              <div
                key={cat.name}
                className={`faqs-questions__group ${i === activeCategory ? "faqs-questions__group--active" : ""}`}
              >
                {cat.questions.map((faq) => {
                  const isOpen = openQuestion === faq.q;
                  return (
                    <div
                      key={faq.q}
                      className={`faqs-questions__item ${isOpen ? "faqs-questions__item--open" : ""}`}
                    >
                      <button
                        className="faqs-questions__question font-text"
                        onClick={() => toggleQuestion(faq.q)}
                      >
                        <span>{faq.q}</span>
                        <span className="faqs-questions__arrow"></span>
                      </button>
                      {isOpen && (
                        <p
                          className="faqs-questions__answer font-text"
                          dangerouslySetInnerHTML={{ __html: faq.a }}
                        ></p>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
