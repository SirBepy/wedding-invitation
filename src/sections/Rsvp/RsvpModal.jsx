import { useReducer, useEffect, useCallback } from "react";
import Modal from "../../components/Modal/Modal";
import useApi from "../../hooks/useApi";
import SearchField from "./SearchField";
import PersonRow from "./PersonRow";
import {
  getGuestCache,
  getGroupFromCache,
  updateGuestCache,
} from "../../utils/guestCache";
import "./RsvpModal.scss";

const initialState = {
  mode: "loading", // 'loading' | 'search' | 'form'
  allGuests: [],
  groupGuests: [],
  selectedPeople: [],
  originalStatuses: {},
  submitting: false,
  submitError: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, mode: "loading" };

    case "SET_SEARCH":
      return {
        ...state,
        mode: "search",
        allGuests: action.guests,
        groupGuests: [],
        selectedPeople: [],
        originalStatuses: {},
      };

    case "SET_FORM": {
      const originals = {};
      action.people.forEach((p) => {
        originals[p.rowNumber] = p.status || "";
      });
      return {
        ...state,
        mode: "form",
        groupGuests: action.groupGuests,
        selectedPeople: action.people,
        originalStatuses: originals,
        submitError: null,
      };
    }

    case "UPDATE_STATUS":
      return {
        ...state,
        selectedPeople: state.selectedPeople.map((p) =>
          p.rowNumber === action.rowNumber
            ? { ...p, status: action.status }
            : p,
        ),
      };

    case "DELETE_PERSON": {
      const updated = state.selectedPeople.filter(
        (p) => p.rowNumber !== action.rowNumber,
      );
      if (updated.length === 0) {
        return {
          ...state,
          selectedPeople: [],
          mode: "search",
          groupGuests: [],
          originalStatuses: {},
        };
      }
      return { ...state, selectedPeople: updated };
    }

    case "ADD_PERSON": {
      const originals = { ...state.originalStatuses };
      originals[action.person.rowNumber] = action.person.status || "";
      return {
        ...state,
        selectedPeople: [...state.selectedPeople, { ...action.person }],
        originalStatuses: originals,
      };
    }

    case "SET_SUBMITTING":
      return { ...state, submitting: action.value, submitError: null };

    case "SET_SUBMIT_ERROR":
      return { ...state, submitting: false, submitError: action.error };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

export default function RsvpModal({ isOpen, onClose, onSuccess, groupId }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const api = useApi();

  const loadData = useCallback(async () => {
    if (groupId) {
      const groupGuests = getGroupFromCache(groupId);
      if (groupGuests !== null) {
        if (groupGuests.length === 0) {
          dispatch({ type: "SET_SEARCH", guests: getGuestCache() || [] });
        } else {
          const nonResponded = groupGuests.filter((g) => !g.respondedAt);
          dispatch({
            type: "SET_FORM",
            groupGuests,
            people: nonResponded.length > 0 ? nonResponded : groupGuests,
          });
        }
        return;
      }

      // Cache miss — fall back to API
      dispatch({ type: "SET_LOADING" });
      const result = await api.execute("getGuests", { groupId });
      if (!result || !result.guests || result.guests.length === 0) {
        const allResult = await api.execute("getGuests");
        dispatch({ type: "SET_SEARCH", guests: allResult?.guests || [] });
        return;
      }
      const nonResponded = result.guests.filter((g) => !g.respondedAt);
      dispatch({
        type: "SET_FORM",
        groupGuests: result.guests,
        people: nonResponded.length > 0 ? nonResponded : result.guests,
      });
    } else {
      const allGuests = getGuestCache();
      if (allGuests !== null) {
        dispatch({ type: "SET_SEARCH", guests: allGuests });
        return;
      }

      // Cache miss — fall back to API
      dispatch({ type: "SET_LOADING" });
      const result = await api.execute("getGuests");
      dispatch({ type: "SET_SEARCH", guests: result?.guests || [] });
    }
  }, [groupId, api.execute]);

  useEffect(() => {
    if (isOpen) loadData();
    if (!isOpen) dispatch({ type: "RESET" });
  }, [isOpen]);

  const handleGuestSelect = async (guest) => {
    const groupGuests = getGroupFromCache(guest.groupId);
    if (groupGuests !== null) {
      const nonResponded = groupGuests.filter((g) => !g.respondedAt);
      dispatch({
        type: "SET_FORM",
        groupGuests,
        people: nonResponded.length > 0 ? nonResponded : groupGuests,
      });
      return;
    }

    // Cache miss — fall back to API
    dispatch({ type: "SET_LOADING" });
    const result = await api.execute("getGuests", { groupId: guest.groupId });
    if (!result?.guests) return;
    const nonResponded = result.guests.filter((g) => !g.respondedAt);
    dispatch({
      type: "SET_FORM",
      groupGuests: result.guests,
      people: nonResponded.length > 0 ? nonResponded : result.guests,
    });
  };

  const handleStatusChange = (rowNumber, status) => {
    dispatch({ type: "UPDATE_STATUS", rowNumber, status });
  };

  const handleDelete = (rowNumber) => {
    dispatch({ type: "DELETE_PERSON", rowNumber });
  };

  const handleAddPerson = (e) => {
    const rowNumber = e.target.value;
    if (!rowNumber) return;
    const person = state.groupGuests.find(
      (g) => String(g.rowNumber) === rowNumber,
    );
    if (person) dispatch({ type: "ADD_PERSON", person });
    e.target.value = "";
  };

  const handleSubmit = async () => {
    dispatch({ type: "SET_SUBMITTING", value: true });

    const allWithStatus = state.selectedPeople.filter((p) => p.status);

    const changedPeople = allWithStatus
      .filter((p) => p.status !== state.originalStatuses[p.rowNumber])
      .map((p) => ({ rowNumber: p.rowNumber, name: p.name, status: p.status }));

    if (changedPeople.length > 0) {
      const result = await api.execute("submitRsvp", { people: changedPeople });

      if (api.error || !result) {
        dispatch({
          type: "SET_SUBMIT_ERROR",
          error: api.error || "Failed to submit RSVP",
        });
        return;
      }

      updateGuestCache(changedPeople);
    }

    const anyoneComing = allWithStatus.some((p) => p.status === "Coming");
    const message = anyoneComing
      ? "We are looking forward to seeing you!"
      : "We are sorry to hear you can't make it. We still hope to see you soon.";

    onSuccess?.(message);
    onClose();
  };

  const remainingMembers = state.groupGuests.filter(
    (g) => !state.selectedPeople.some((p) => p.rowNumber === g.rowNumber),
  );

  const hasValidSelection = state.selectedPeople.some((p) => p.status);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="rsvp-modal">
        <h2 className="rsvp-modal__title font-text">RSVP</h2>

        {state.mode === "loading" && (
          <div className="rsvp-modal__loading">
            <p className="font-text">Loading...</p>
          </div>
        )}

        {api.error && state.mode !== "form" && (
          <div className="rsvp-modal__error">
            <p className="font-text">
              Failed to load guest list. Please try again later.
            </p>
            <button className="rsvp-modal__retry font-text" onClick={loadData}>
              Retry
            </button>
          </div>
        )}

        {state.mode === "search" && !api.error && (
          <div className="rsvp-modal__search">
            <p className="font-text">Search for your name to get started.</p>
            <SearchField
              guests={state.allGuests}
              onSelect={handleGuestSelect}
            />
          </div>
        )}

        {state.submitting && (
          <div className="rsvp-modal__submitting">
            <p className="rsvp-modal__submitting-label font-text">
              <span className="rsvp-modal__spinner" />
              Sending responses
            </p>
            <ul className="rsvp-modal__status-list">
              {state.selectedPeople
                .filter((p) => p.status)
                .map((person) => (
                  <li key={person.rowNumber} className="rsvp-modal__status-item">
                    <span className="rsvp-modal__status-name font-text-2">
                      {person.name}
                    </span>
                    <span
                      className={`rsvp-modal__status-badge font-text-2 rsvp-modal__status-badge--${person.status === "Coming" ? "coming" : "not-coming"}`}
                    >
                      {person.status}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {state.mode === "form" && !state.submitting && (
          <div className="rsvp-modal__form">
            <div className="rsvp-modal__people">
              {state.selectedPeople.map((person) => (
                <PersonRow
                  key={person.rowNumber}
                  person={person}
                  originalStatus={state.originalStatuses[person.rowNumber]}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {remainingMembers.length > 0 && (
              <div className="rsvp-modal__add">
                <select
                  className="rsvp-modal__add-select font-text"
                  onChange={handleAddPerson}
                  defaultValue=""
                >
                  <option value="" disabled>
                    + Add family member
                  </option>
                  {remainingMembers.map((g) => (
                    <option key={g.rowNumber} value={g.rowNumber}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {state.submitError && (
              <p className="rsvp-modal__submit-error font-text">
                {state.submitError}
              </p>
            )}

            <button
              className="rsvp-modal__submit font-text-2"
              onClick={handleSubmit}
              disabled={!hasValidSelection}
            >
              Submit RSVP
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
