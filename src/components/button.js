/**
 * @param {Object} options
 * @param {string} options.text - Button label
 * @param {string} [options.href] - If provided, renders as <a>; otherwise <button>
 * @param {string} [options.classes=''] - Additional CSS classes on the outer element
 */
export function button({ text, href, classes = "" }) {
  const tag = href ? "a" : "button";
  const hrefAttr = href ? ` href="${href}"` : "";

  return `
    <${tag}${hrefAttr} class="button ${classes}">
      <span class="button__front">${text}</span>
    </${tag}>
  `;
}
