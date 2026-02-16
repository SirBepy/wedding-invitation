import Toggle from '../../components/Toggle/Toggle'
import './PersonRow.scss'

export default function PersonRow({ person, onStatusChange, onDelete, showWarning, warningMessage }) {
  const toggleValue = person.status === 'Coming' ? true : person.status === 'Not Coming' ? false : null

  const handleToggle = (val) => {
    onStatusChange(person.id, val ? 'Coming' : 'Not Coming')
  }

  return (
    <div className="person-row">
      <div className="person-row__header">
        <div className="person-row__info">
          <span className="person-row__name font-text">{person.name}</span>
          {person.respondedAt && (
            <span className="person-row__timestamp font-text">
              Responded: {person.respondedAt}
            </span>
          )}
        </div>
        <button
          className="person-row__delete font-text"
          onClick={() => onDelete(person.id)}
          aria-label={`Remove ${person.name}`}
        >
          &times;
        </button>
      </div>
      <Toggle value={toggleValue} onChange={handleToggle} />
      {showWarning && (
        <p className="person-row__warning font-text">{warningMessage}</p>
      )}
    </div>
  )
}
