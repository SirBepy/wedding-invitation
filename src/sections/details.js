export function details() {
  const items = [
    ["Dress Code", "Formal / Black-tie Optional"],
    ["Location", "Outdoor"],
    ["Parking", "Parking available at Hotel Storia"],
    ["Transportation", "Shuttle Bus offered to church if preferred"],
    ["Nearest Airports", "Mostar or Split"],
  ];

  return `
    <section id="details" class="section">
      <div class="details-content">
        <h1 class="section-title">Details</h1>
        <ul class="details-list">
          ${items
            .map(
              ([label, value]) => `
            <li class="details-list__item">
              <span class="font-text details-list__label">${label}</span>
              <span class="font-text details-list__value">${value}</span>
            </li>
          `,
            )
            .join("")}
        </ul>
      </div>
    </section>
  `;
}
