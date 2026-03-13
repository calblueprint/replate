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

/**
 * Parse a backend time string into hours and minutes.
 * Handles: "YYYY-MM-DD HH:MM:SS UTC", ISO "...T...", and bare "HH:MM".
 */
export function parseBackendTime(
  dateISO: string | undefined,
  ts?: string | null,
): Date | null {
  if (!ts) return null;

  // Case A: backend gave full "YYYY-MM-DD HH:MM:SS UTC"
  if (ts.includes('UTC')) {
    const iso = ts.replace(' ', 'T').replace(' UTC', 'Z');
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

  // Case B: backend gave ISO already
  if (ts.includes('T')) {
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d;
  }

  // Case C: backend gave "HH:MM" -> combine with pickup_date
  if (/^\d{2}:\d{2}$/.test(ts) && dateISO) {
    const d = new Date(`${dateISO}T${ts}:00`);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

/** Format hours/minutes to 12-hour string (e.g. "9:00 AM") */
export function fmt12(h: number, m: number) {
  const ap = h >= 12 ? 'PM' : 'AM';
  const hr12 = h % 12 || 12;
  return `${hr12}:${String(m).padStart(2, '0')} ${ap}`;
}

/** Get AM/PM from a Date */
export function ampm(d: Date): 'AM' | 'PM' {
  return d.getHours() < 12 ? 'AM' : 'PM';
}

/** Format hour only (e.g. "9:00") */
export function fmtHour(d: Date): string {
  const h = d.getHours();
  const hr12 = h % 12 || 12;
  const mins = d.getMinutes();
  const minsStr = mins < 10 ? `0${mins}` : String(mins);
  return `${hr12}:${minsStr}`;
}

/**
 * Format a short hour range like "9:00 - 10:30" with optional AM/PM.
 * Handles all backend time formats via parseBackendTime.
 */
export function fmtShortHourRange(
  dateISO: string,
  startStr?: string | null,
  endStr?: string | null,
  opts?: { showAmPm?: boolean },
) {
  const s = parseBackendTime(dateISO, startStr);
  const e = parseBackendTime(dateISO, endStr);
  if (!s || !e) return 'Time TBD';

  const base = `${fmtHour(s)} \u2013 ${fmtHour(e)}`;
  if (opts?.showAmPm) {
    return ampm(s) === ampm(e)
      ? `${base} ${ampm(s)}`
      : `${fmtHour(s)} ${ampm(s)} \u2013 ${fmtHour(e)} ${ampm(e)}`;
  }
  return base;
}

/** Format a date header like "Monday, March 4" from "YYYY-MM-DD" */
export function fmtDateHeader(isoYYYYMMDD: string) {
  const d = new Date(isoYYYYMMDD + 'T00:00:00');
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  return `${weekday}, ${month} ${day}`;
}

/** Format pickup date like "Mon Mar 4" */
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

/**
 * Format a time range from backend time strings.
 * Handles "HH:MM", ISO, and "... UTC" formats.
 */
export function formatTimeRange(
  startTime: string | null,
  endTime: string | null,
): string {
  if (!startTime || !endTime) return 'Time TBD';

  try {
    const parseTime = (timeStr: string) => {
      // Handle "YYYY-MM-DD HH:MM:SS UTC" and ISO formats
      const utcMatch = timeStr.match(
        /(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*UTC)?$/,
      );
      if (utcMatch) {
        const hours = parseInt(utcMatch[1], 10);
        const minutes = parseInt(utcMatch[2], 10);
        if (isNaN(hours) || isNaN(minutes)) return null;

        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${period}`;
      }
      // Handle bare "HH:MM" format
      const bareMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
      if (bareMatch) {
        const hours = parseInt(bareMatch[1], 10);
        const minutes = parseInt(bareMatch[2], 10);
        if (isNaN(hours) || isNaN(minutes)) return null;

        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${period}`;
      }
      return null;
    };

    const startFormatted = parseTime(startTime);
    const endFormatted = parseTime(endTime);

    if (!startFormatted || !endFormatted) return 'Time TBD';

    return `${startFormatted} - ${endFormatted}`;
  } catch {
    return 'Time TBD';
  }
}

/**
 * Format a time range using parseBackendTime for any format.
 * Used in pickup-details.
 */
export function formatTimeRangeAny(
  startTime: string | null,
  endTime: string | null,
): string {
  if (!startTime || !endTime) return 'Time TBD';

  const parseHM = (ts: string): { h: number; m: number } | null => {
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

    const match = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (!match) return null;
    return { h: Number(match[1]), m: Number(match[2]) };
  };

  const s = parseHM(startTime);
  const e = parseHM(endTime);
  if (!s || !e) return 'Time TBD';
  return `${fmt12(s.h, s.m)} - ${fmt12(e.h, e.m)}`;
}

/** Get local ISO date string (YYYY-MM-DD) */
export function localISODate(d: Date) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}
