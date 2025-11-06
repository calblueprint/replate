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
