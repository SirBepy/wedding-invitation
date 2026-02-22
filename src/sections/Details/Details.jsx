import "./Details.scss";

const items = [
  ["Dress Code", "Formal"],
  ["Location", "Outdoor"],
  ["Parking", "Parking available at Hotel Storia"],
  ["Transportation", "Shuttle Bus offered to church if preferred"],
  ["Nearest Airports", "Mostar or Split"],
];

export default function Details() {
  return (
    <section id="details" className="section">
      <div className="details-content">
        <h1>Details</h1>
        <ul className="details-list">
          {items.map(([label, value]) => (
            <li key={label} className="details-list__item">
              <span className="font-text details-list__label">{label}</span>
              <span className="font-text details-list__value">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
