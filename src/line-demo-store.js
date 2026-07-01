const STORAGE_KEY = "nexconLineDemoReservation";

export function saveDemoReservation(data) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* demo only */
  }
}

export function loadDemoReservation() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearDemoReservation() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* demo only */
  }
}
