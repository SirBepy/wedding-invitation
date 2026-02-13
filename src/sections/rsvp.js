import { button } from "../components/button.js";

const contacts = [
  {
    name: "Storm",
    number: "+385 99 886 7738",
  },
  {
    name: "Josip",
    number: "+385 95 384 8499",
  },
];

export function rsvp() {
  const contactCards = contacts
    .map(
      (c) => `
          <div class="rsvp-contact">
            <span class="rsvp-contact-name">${c.name}</span>
            <span class="rsvp-contact-number copy-number-btn" data-number="${c.number}">${c.number}</span>
            <div class="rsvp-contact-actions">
              <a href="https://wa.me/${c.number.replace(/\s/g, "")}" class="rsvp-icon-btn" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
              <button class="rsvp-icon-btn copy-number-btn" data-number="${c.number}" title="Copy number"><i class="fa-regular fa-copy"></i></button>
            </div>
          </div>`,
    )
    .join("");

  return `
    <section id="rsvp" class="section">
      <div class="landing-content">
        <h1>RSVP</h1>
        <p class="font-text by-date-text">BY AUGUST 29TH</p>
        ${button({ text: "RSVP HERE", classes: "rsvp-button font-text" })}
        <p class="font-text or-via-text">Or via WhatsApp</p>
        <div class="rsvp-contacts">
          ${contactCards}
        </div>
      </div>
    </section>
  `;
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".copy-number-btn");
  if (!btn) return;

  const number = btn.dataset.number;
  const numberSpan = btn
    .closest(".rsvp-contact")
    .querySelector(".rsvp-contact-number");

  navigator.clipboard.writeText(number).then(() => {
    const original = numberSpan.textContent;
    numberSpan.textContent = "Number copied!";
    setTimeout(() => (numberSpan.textContent = original), 2000);
  });
});
