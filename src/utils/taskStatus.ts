import type { TaskStatus } from '@/components/TaskCard';

interface ScheduledTask {
  pickup_date: string;
  start_time?: string | null;
  end_time: string | null;
  status?: string;
  completed_at?: string | null;
}

// TaskBlueprint returns date + wall-clock times in America/Los_Angeles.
// Compare in that timezone, independent of the phone's timezone and DST.
const pickupClock = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export function deriveTaskStatus(
  task: ScheduledTask,
  now = new Date(),
): TaskStatus {
  if (task.status === 'complete' || task.completed_at) return 'completed';
  if (task.status === 'failed') return 'missed';

  let date = task.pickup_date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'active';
  const parsedDate = new Date(`${date}T00:00:00Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return 'active';
  }

  const seconds = (value: string | null | undefined) => {
    const time = value?.match(/^([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/);
    return time ? +time[1] * 3600 + +time[2] * 60 + +(time[3] ?? 0) : null;
  };
  const deadline = seconds(task.end_time);
  const start = seconds(task.start_time);
  // The backend permits overnight windows, including a full-day window.
  if (deadline !== null && start !== null && deadline <= start) {
    parsedDate.setUTCDate(parsedDate.getUTCDate() + 1);
    date = parsedDate.toISOString().slice(0, 10);
  }

  const parts = Object.fromEntries(
    pickupClock.formatToParts(now).map(part => [part.type, part.value]),
  );
  const today = `${parts.year}-${parts.month}-${parts.day}`;
  if (date < today) return 'missed';
  if (date > today) return 'active';

  // An unknown end time remains active for the pickup day.
  if (deadline === null) return 'active';
  const current = +parts.hour * 3600 + +parts.minute * 60 + +parts.second;
  return current >= deadline ? 'missed' : 'active';
}
