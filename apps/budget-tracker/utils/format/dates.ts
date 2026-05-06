/**
 * Human-readable wall-clock time, e.g. "10:45 AM".
 * Returns an empty string if the input cannot be parsed.
 */
export const formatTime = (iso: string): string => {
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

/**
 * "Monday, 29 Dec 2025"
 */
export const formatLongDate = (date: Date): string =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/** "YYYY-MM-DD" for a Date, in the user's local timezone (no UTC drift). */
export const toLocalDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Parse "YYYY-MM-DD" as a local-midnight Date (avoids UTC interpretation). */
export const fromLocalDateKey = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return startOfDay(new Date());
  return new Date(y, m - 1, d);
};

// ---------- Period boundaries ----------

export const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/** Monday-anchored start-of-week. */
export const startOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return startOfDay(d);
};

export const endOfWeek = (date: Date): Date => {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 6);
  return endOfDay(d);
};

export const startOfMonth = (date: Date): Date =>
  startOfDay(new Date(date.getFullYear(), date.getMonth(), 1));

export const endOfMonth = (date: Date): Date =>
  endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));

export const startOfYear = (date: Date): Date =>
  startOfDay(new Date(date.getFullYear(), 0, 1));

export const endOfYear = (date: Date): Date =>
  endOfDay(new Date(date.getFullYear(), 11, 31));
