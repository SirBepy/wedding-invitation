/**
 * @param {Object} options
 * @param {string[]} options.texts - Lines of text to display
 * @param {string} options.link - URL to the location
 * @param {'vertical' | 'horizontal'} [options.layout='vertical'] - Text below icon (vertical) or beside it (horizontal)
 */
export function locationButton({ texts, link, layout = 'vertical' }) {
  return `
    <a href="${link}" target="_blank" rel="noopener noreferrer"
       class="location-btn location-btn--${layout}">
      <img src="/icons/location.svg" alt="Location" class="location-btn__icon" />
      <span class="location-btn__text font-text">
        ${texts.map((t) => `<span class="location-btn__line">${t}</span>`).join('')}
      </span>
    </a>
  `;
}
