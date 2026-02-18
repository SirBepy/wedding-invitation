const CACHE_KEY = "rsvp_guests";
const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export function getGuestCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setGuestCache(guests) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(guests));
  } catch {}
}

export function getGroupFromCache(groupId) {
  const cached = getGuestCache();
  if (!cached) return null;
  return cached.filter((g) => String(g.groupId) === String(groupId));
}

export function updateGuestCache(people) {
  const cached = getGuestCache();
  if (!cached) return;
  const map = new Map(people.map((p) => [p.rowNumber, p]));
  setGuestCache(
    cached.map((g) => {
      const update = map.get(g.rowNumber);
      return update
        ? { ...g, status: update.status, respondedAt: new Date().toISOString() }
        : g;
    }),
  );
}

export async function prefetchGuests() {
  if (getGuestCache()) return;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "getGuests" }),
    });
    if (!res.ok) return;
    const result = await res.json();
    if (result?.guests) setGuestCache(result.guests);
  } catch {}
}
