const PACIFIC_TIME_ZONE = 'America/Los_Angeles';

interface DateParts {
  year: number;
  month: number;
  day: number;
}

interface PacificDateTimeParts extends DateParts {
  hours: number;
  minutes: number;
}

/** Parse a YYYY-MM-DD date string into calendar parts without UTC shift */
export function parseISODateParts(dateStr: string): DateParts | null {
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const probe = new Date(Date.UTC(year, month - 1, day));

  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

/** Return calendar date and 24h time parts in America/Los_Angeles */
export function getPacificDateTimeParts(
  date: Date = new Date(),
): PacificDateTimeParts {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: PACIFIC_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find(p => p.type === type)?.value ?? 0);

  const rawHours = get('hour');
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hours: rawHours === 24 ? 0 : rawHours,
    minutes: get('minute'),
  };
}

function compareDateParts(a: DateParts, b: DateParts): number {
  if (a.year !== b.year) return a.year < b.year ? -1 : 1;
  if (a.month !== b.month) return a.month < b.month ? -1 : 1;
  if (a.day !== b.day) return a.day < b.day ? -1 : 1;
  return 0;
}

/** Parse a backend time string into Pacific {h, m} */
export function parsePacificHM(ts: string): { h: number; m: number } | null {
  const s = ts.trim();
  if (s.includes('UTC')) {
    const d = new Date(s.replace(' ', 'T').replace(' UTC', 'Z'));
    if (isNaN(d.getTime())) return null;
    const pt = getPacificDateTimeParts(d);
    return { h: pt.hours, m: pt.minutes };
  }
  if (s.includes('T')) {
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    const pt = getPacificDateTimeParts(d);
    return { h: pt.hours, m: pt.minutes };
  }
  const m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m) return null;
  return { h: Number(m[1]), m: Number(m[2]) };
}

/** Return true when pickupDate is strictly before today's calendar date in Pacific Time */
export function isTaskBeforeTodayPT(
  pickupDate: string,
  now: Date = new Date(),
): boolean {
  const pickupParts = parseISODateParts(pickupDate);
  if (!pickupParts) return false;

  const ptNow = getPacificDateTimeParts(now);
  return compareDateParts(pickupParts, ptNow) < 0;
}

/** Return true when a task's pickup window has ended in Pacific Time */
export function isTaskPastEndTime(
  pickupDate: string,
  endTime: string | null,
  now: Date = new Date(),
): boolean {
  const pickupParts = parseISODateParts(pickupDate);
  if (!pickupParts) return false;

  const ptNow = getPacificDateTimeParts(now);
  const cmp = compareDateParts(pickupParts, ptNow);
  if (cmp < 0) return true;
  if (cmp > 0) return false;

  if (!endTime) return false;
  const end = parsePacificHM(endTime);
  if (!end) return false;

  return ptNow.hours * 60 + ptNow.minutes > end.h * 60 + end.m;
}

/** Return true once the task's pickup window has started in Pacific Time */
export function hasTaskWindowStarted(
  pickupDate: string | null,
  startTime: string | null,
  now: Date = new Date(),
): boolean {
  if (!pickupDate) return false;
  const pickupParts = parseISODateParts(pickupDate);
  if (!pickupParts) return false;

  const ptNow = getPacificDateTimeParts(now);
  const cmp = compareDateParts(pickupParts, ptNow);
  if (cmp < 0) return true;
  if (cmp > 0) return false;

  if (!startTime) return true;
  const start = parsePacificHM(startTime);
  if (!start) return true;

  return ptNow.hours * 60 + ptNow.minutes >= start.h * 60 + start.m;
}

/** Format YYYY-MM-DD or an ISO timestamp into M/D without UTC date shift */
export function formatShortStatusDate(dateStr: string): string | undefined {
  const dateOnly = parseISODateParts(dateStr);
  if (dateOnly) {
    return `${dateOnly.month}/${dateOnly.day}`;
  }

  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return undefined;
  const pt = getPacificDateTimeParts(parsed);
  return `${pt.month}/${pt.day}`;
}

/** Format a local Date as YYYY-MM-DD */
export function localISODate(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

/** Parse a time string in any of the formats the backend returns into {h, m} */
export function parseHMAny(
  ts: string,
  fallbackDateISO?: string,
): { h: number; m: number } | null {
  const s = ts.trim();
  // "YYYY-MM-DD HH:MM:SS UTC"
  if (s.includes('UTC')) {
    const d = new Date(s.replace(' ', 'T').replace(' UTC', 'Z'));
    if (isNaN(d.getTime())) return null;
    return { h: d.getHours(), m: d.getMinutes() };
  }
  // ISO "YYYY-MM-DDTHH:MM:SSZ"
  if (s.includes('T')) {
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return { h: d.getHours(), m: d.getMinutes() };
  }
  // "HH:MM" or "HH:MM:SS"
  const m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (m) {
    return { h: Number(m[1]), m: Number(m[2]) };
  }
  if (fallbackDateISO) {
    const d = new Date(`${fallbackDateISO}T${s}`);
    if (!isNaN(d.getTime())) {
      return { h: d.getHours(), m: d.getMinutes() };
    }
  }
  return null;
}

/** Format hour + minute into 12-hour string (e.g. "1:00 PM" or "1:00pm") */
export function fmt12(h: number, m: number, compactLower = false): string {
  const ap = h >= 12 ? 'PM' : 'AM';
  const hr12 = h % 12 || 12;
  const suffix = compactLower ? ap.toLowerCase() : ` ${ap}`;
  return `${hr12}:${String(m).padStart(2, '0')}${suffix}`;
}

/** Format a time range from any backend time format (e.g. "1:00 PM - 4:00 PM") */
export function formatTimeRangeAny(
  startTime: string | null,
  endTime: string | null,
  options: { compactLower?: boolean; fallbackDateISO?: string } = {},
): string {
  if (!startTime || !endTime) return 'Time TBD';
  const s = parseHMAny(startTime, options.fallbackDateISO);
  const e = parseHMAny(endTime, options.fallbackDateISO);
  if (!s || !e) return 'Time TBD';
  return `${fmt12(s.h, s.m, options.compactLower)} - ${fmt12(e.h, e.m, options.compactLower)}`;
}

/** Format a YYYY-MM-DD date string (e.g. "Mon Apr 20") */
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
