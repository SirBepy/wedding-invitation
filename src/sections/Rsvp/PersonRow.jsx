import Toggle from "../../components/Toggle/Toggle";
import "./PersonRow.scss";

function timeAgo(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  const seconds = Math.floor((Date.now() - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

export default function PersonRow({
  person,
  originalStatus,
  onStatusChange,
  onDelete,
}) {
  const toggleValue =
    person.status === "Coming"
      ? true
      : person.status === "Not Coming"
        ? false
        : null;

  const handleToggle = (val) => {
    onStatusChange(person.rowNumber, val ? "Coming" : "Not Coming");
  };

  const hasResponded = !!person.respondedAt;
  const relativeTime = hasResponded ? timeAgo(person.respondedAt) : null;
  const isWarning =
    hasResponded && !!person.status && person.status !== originalStatus;

  return (
    <div className="person-row">
      <div className="person-row__header">
        <div className="person-row__info">
          <span className="person-row__name font-text-2">{person.name}</span>
          {hasResponded && relativeTime && (
            <span
              className={`person-row__timestamp font-text-2 ${isWarning ? " person-row__timestamp--warning" : ""}`}
            >
              {isWarning ? (
                <>
                  Warning: Responded <strong>{originalStatus}</strong>{" "}
                  {relativeTime}. <br />
                  You&apos;re about to overwrite that with{" "}
                  <strong>{person.status}</strong>
                </>
              ) : (
                <>
                  Responded <strong>{originalStatus}</strong> {relativeTime}
                </>
              )}
            </span>
          )}
        </div>
        <button
          className="person-row__delete font-text-2"
          onClick={() => onDelete(person.rowNumber)}
          aria-label={`Remove ${person.name}`}
        >
          &times;
        </button>
      </div>
      <Toggle value={toggleValue} onChange={handleToggle} />
    </div>
  );
}
