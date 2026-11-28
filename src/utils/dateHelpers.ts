import { tz, TZDate } from '@date-fns/tz';
import {
  format,
  isAfter,
  isBefore,
  isValid,
  parse,
  parseISO,
  set,
  startOfDay,
} from 'date-fns';

const PACIFIC_TIME_ZONE = 'America/Los_Angeles';
const ptZone = tz(PACIFIC_TIME_ZONE);

function parsePacificDate(dateStr: string): TZDate | null {
  const parsed = parse(
    dateStr.trim(),
    'yyyy-MM-dd',
    startOfDay(TZDate.tz(PACIFIC_TIME_ZONE)),
    { in: ptZone },
  );
  return isValid(parsed) ? parsed : null;
}

function parseTaskTime(
  timeStr: string,
  referenceDay: TZDate = startOfDay(TZDate.tz(PACIFIC_TIME_ZONE)),
  fallbackDateISO?: string,
): TZDate | null {
  const trimmed = timeStr.trim();
  const normalizedUtc = trimmed.includes('UTC')
    ? trimmed.replace(' ', 'T').replace(' UTC', 'Z')
    : trimmed.includes('T')
      ? trimmed
      : null;

  if (normalizedUtc) {
    const zoned = new TZDate(normalizedUtc, PACIFIC_TIME_ZONE);
    return isValid(zoned)
      ? set(referenceDay, {
          hours: zoned.getHours(),
          minutes: zoned.getMinutes(),
          seconds: 0,
          milliseconds: 0,
        })
      : null;
  }

  for (const fmt of ['H:mm:ss', 'H:mm']) {
    const parsed = parse(trimmed, fmt, referenceDay, { in: ptZone });
    if (isValid(parsed)) return parsed;
  }

  if (fallbackDateISO) {
    const fallback = new TZDate(
      `${fallbackDateISO}T${trimmed}`,
      PACIFIC_TIME_ZONE,
    );
    if (isValid(fallback)) return fallback;
  }

  return null;
}

/** Return true when pickupDate is strictly before today's calendar date in Pacific Time */
export function isTaskBeforeTodayPT(
  pickupDate: string,
  now: Date = new Date(),
): boolean {
  const day = parsePacificDate(pickupDate);
  if (!day) return false;
  const ptNow = new TZDate(now, PACIFIC_TIME_ZONE);
  return isBefore(startOfDay(day), startOfDay(ptNow));
}

/** Return true when an incomplete task's pickup date/window has passed in Pacific Time */
export function isTaskOverdue(
  pickupDate: string,
  endTime: string | null,
  now: Date = new Date(),
): boolean {
  const day = parsePacificDate(pickupDate);
  if (!day) return false;

  const ptNow = new TZDate(now, PACIFIC_TIME_ZONE);
  if (isBefore(startOfDay(day), startOfDay(ptNow))) return true;
  if (isAfter(startOfDay(day), startOfDay(ptNow))) return false;
  if (!endTime) return false;

  const end = parseTaskTime(endTime, day);
  return end ? isAfter(ptNow, end) : false;
}

/** Return true once the task's pickup window has started in Pacific Time */
export function hasTaskWindowStarted(
  pickupDate: string | null,
  startTime: string | null,
  now: Date = new Date(),
): boolean {
  if (!pickupDate) return false;
  const day = parsePacificDate(pickupDate);
  if (!day) return false;

  const ptNow = new TZDate(now, PACIFIC_TIME_ZONE);
  if (isBefore(startOfDay(day), startOfDay(ptNow))) return true;
  if (isAfter(startOfDay(day), startOfDay(ptNow))) return false;
  if (!startTime) return true;

  const start = parseTaskTime(startTime, day);
  return start ? !isBefore(ptNow, start) : true;
}

/** Format YYYY-MM-DD or an ISO timestamp into M/D in Pacific Time */
export function formatShortStatusDate(dateStr: string): string | undefined {
  const day = parsePacificDate(dateStr);
  if (day) return format(day, 'M/d');

  const parsed = parseISO(dateStr);
  if (!isValid(parsed)) return undefined;
  return format(new TZDate(parsed, PACIFIC_TIME_ZONE), 'M/d');
}

/** Format a local Date as YYYY-MM-DD */
export function localISODate(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

/** Format a single backend time string (e.g. "1:00 PM" or "1:00pm") */
export function formatTimeLabel(
  timeStr: string | null,
  options: { compactLower?: boolean; fallbackDateISO?: string } = {},
): string | null {
  if (!timeStr) return null;
  const parsed = parseTaskTime(
    timeStr,
    startOfDay(TZDate.tz(PACIFIC_TIME_ZONE)),
    options.fallbackDateISO,
  );
  if (!parsed) return null;
  return options.compactLower
    ? format(parsed, 'h:mma').toLowerCase()
    : format(parsed, 'h:mm a');
}

/** Format a time range from any backend time format (e.g. "1:00 PM - 4:00 PM") */
export function formatTimeRangeAny(
  startTime: string | null,
  endTime: string | null,
  options: { compactLower?: boolean; fallbackDateISO?: string } = {},
): string {
  const start = formatTimeLabel(startTime, options);
  const end = formatTimeLabel(endTime, options);
  return start && end ? `${start} - ${end}` : 'Time TBD';
}

/** Format a YYYY-MM-DD date string with date-fns (default "Wed Oct 7") */
export function formatPickupDate(
  dateStr: string,
  pattern = 'EEE MMM d',
): string {
  const day = parsePacificDate(dateStr);
  return day ? format(day, pattern) : dateStr;
}
