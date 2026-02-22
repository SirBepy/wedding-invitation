import "./Toggle.scss";

export default function Toggle({ value, onChange, disabled = false }) {
  return (
    <div className="toggle" role="group" aria-label="RSVP attendance">
      <button
        className={`toggle__btn font-text-2 ${value === true ? "toggle__btn--active" : ""}`}
        onClick={() => onChange?.(true)}
        disabled={disabled}
        role="button"
        aria-pressed={value === true}
      >
        Coming
      </button>
      <button
        className={`toggle__btn font-text-2 ${value === false ? "toggle__btn--active" : ""}`}
        onClick={() => onChange?.(false)}
        disabled={disabled}
        role="button"
        aria-pressed={value === false}
      >
        Not Coming
      </button>
    </div>
  );
}
