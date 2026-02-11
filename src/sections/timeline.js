import { locationButton } from "../components/location-button.js";

const timelineItems = [
  { time: "14:00", icon: "/icons/sign.svg", title: "Welcome Party" },
  { time: "16:30", icon: "/icons/church.svg", title: "Church Ceremony" },
  { time: "18:00", icon: "/icons/drinks.svg", title: "Cocktail Hour" },
  // { time: '19:00', icon: '', title: '' },
  // { time: '19:30', icon: '', title: '' },
  // { time: '23:00', icon: '', title: '' },
  // { time: '3:00', icon: '', title: '' },
];

const locations = [
  {
    title: "All Other Events",
    link: "https://maps.app.goo.gl/Niw21p7dzi6Ryziq9",
  },
  { title: "Church", link: "https://maps.app.goo.gl/srK3JGs34MgFSgfi9" },
];

export function timeline() {
  return `
    <section id="timeline" class="section">
      <div class="timeline-content">
        <h1>Wedding Timeline</h1>

        <div class="timeline">
          ${timelineItems
            .map(
              (item) => `
            <div class="timeline__item">
              <span class="timeline__time font-decorative1">${item.time}</span>
              <div class="timeline__dot"></div>
              <img class="timeline__icon" src="${item.icon}" alt="">
              <span class="timeline__title font-decorative2">${item.title}</span>
            </div>
          `,
            )
            .join("")}
        </div>

        <div class="timeline-locations">
          ${locations
            .map((loc) =>
              locationButton({
                texts: [loc.title],
                link: loc.link,
                layout: "horizontal",
              }),
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}
