const faqCategories = [
  {
    name: "General",
    questions: [
      {
        q: "What is the dress code?",
        a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        q: "Can I bring a plus one?",
        a: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
      {
        q: "Will there be parking available?",
        a: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      },
    ],
  },
  {
    name: "Travel & Accommodation",
    questions: [
      {
        q: "Where should I stay?",
        a: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
      {
        q: "How do I get to the venue?",
        a: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      },
      {
        q: "Is there a shuttle service?",
        a: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.",
      },
    ],
  },
];

export function faqs() {
  return `
    <section id="faqs" class="section">
      <div class="faqs-content">
        <h1>FAQs</h1>
        <div class="faqs-container">
          <div class="faqs-categories">
            ${faqCategories
              .map(
                (cat, i) => `
              <button class="faqs-categories__item font-text ${i === 0 ? "faqs-categories__item--active" : ""}" data-category="${i}">
                ${cat.name}
              </button>
            `,
              )
              .join("")}
          </div>
          <div class="faqs-divider"></div>
          <div class="faqs-questions">
            ${faqCategories
              .map(
                (cat, i) => `
              <div class="faqs-questions__group ${i === 0 ? "faqs-questions__group--active" : ""}" data-category="${i}">
                ${cat.questions
                  .map(
                    (faq) => `
                  <details class="faqs-questions__item">
                    <summary class="faqs-questions__question font-text">${faq.q}</summary>
                    <p class="faqs-questions__answer font-text">${faq.a}</p>
                  </details>
                `,
                  )
                  .join("")}
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initFaqsSection() {
  const categoryButtons = document.querySelectorAll(".faqs-categories__item");
  const questionGroups = document.querySelectorAll(".faqs-questions__group");

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;

      categoryButtons.forEach((b) =>
        b.classList.remove("faqs-categories__item--active"),
      );
      btn.classList.add("faqs-categories__item--active");

      questionGroups.forEach((group) => {
        group.classList.toggle(
          "faqs-questions__group--active",
          group.dataset.category === category,
        );
      });
    });
  });
}
