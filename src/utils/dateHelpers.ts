/** Format two ISO times into a range (e.g. "9:00 am - 10:30 am") */
export const fmtTimeRange = (startISO: string, endISO: string) => {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const to12h = (d: Date) =>
    d
      .toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
      .toLowerCase();
  return `${to12h(s)} - ${to12h(e)}`;
};

/** Format a single ISO time to 12-hour format (e.g. "9:00 am") */
export function fmtTime(iso: string) {
  return new Date(iso)
    .toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    .toLowerCase();
}

/** Format a pickup date string like "Mon Apr 8" from "YYYY-MM-DD" */
export function formatPickupDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${weekday} ${month} ${day}`;
  } catch {
    return dateStr;
  }
}

/** Format hours/minutes to 12-hour string (e.g. "9:00 AM") */
export function fmt12(h: number, m: number): string {
  const ap = h >= 12 ? 'PM' : 'AM';
  const hr12 = h % 12 || 12;
  return `${hr12}:${String(m).padStart(2, '0')} ${ap}`;
}

/**
 * Parse a backend time string into hours and minutes.
 * Handles "YYYY-MM-DD HH:MM:SS UTC", ISO "...T...", and bare "HH:MM"/"HH:MM:SS".
 */
export function parseHMAny(ts: string): { h: number; m: number } | null {
  const s = ts.trim();

  if (s.includes('UTC')) {
    const d = new Date(s.replace(' ', 'T').replace(' UTC', 'Z'));
    if (isNaN(d.getTime())) return null;
    return { h: d.getHours(), m: d.getMinutes() };
  }

  if (s.includes('T')) {
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return { h: d.getHours(), m: d.getMinutes() };
  }

  const m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m) return null;
  return { h: Number(m[1]), m: Number(m[2]) };
}

/**
 * Format a time range from backend time strings into "9:00 AM - 10:30 AM".
 * Handles "HH:MM", ISO, and "...UTC" formats. Returns "Time TBD" on null/parse failure.
 */
export function formatTimeRangeAny(
  startTime: string | null,
  endTime: string | null,
): string {
  if (!startTime || !endTime) return 'Time TBD';
  const s = parseHMAny(startTime);
  const e = parseHMAny(endTime);
  if (!s || !e) return 'Time TBD';
  return `${fmt12(s.h, s.m)} - ${fmt12(e.h, e.m)}`;
}
