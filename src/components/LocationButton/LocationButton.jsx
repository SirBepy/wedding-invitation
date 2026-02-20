import "./LocationButton.scss";

export default function LocationButton({ texts, link, layout = "vertical" }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`location-btn location-btn--${layout}`}
    >
      <img
        src={`${import.meta.env.BASE_URL}icons/location.svg`}
        alt="Location"
        className="location-btn__icon"
      />
      <span className="location-btn__text font-text">
        {texts.map((t, i) => (
          <span key={i} className="location-btn__line">
            {t}
          </span>
        ))}
      </span>
    </a>
  );
}
