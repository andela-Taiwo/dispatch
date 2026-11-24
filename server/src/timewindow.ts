// Time windows within a working day, in minutes after midnight.
//
// Customers book a window ("08:00-12:00"), technicians have shifts and breaks, and a visit
// can only start where all of them agree. Times are local to the depot's time zone; dates
// and zones are handled where days are built, not here.

export interface Window {
  start: number;
  end: number;
}

const PATTERN = /^(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})$/;

function minutes(h: string, m: string): number {
  const hours = Number(h);
  const mins = Number(m);
  if (hours > 24 || mins > 59 || (hours === 24 && mins !== 0)) {
    throw new RangeError(`${h}:${m} is not a time of day`);
  }
  return hours * 60 + mins;
}

export function makeWindow(start: number, end: number): Window {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end > 1440 || end <= start) {
    throw new RangeError(`window ${start}-${end} must end after it starts, within one day`);
  }
  return { start, end };
}

export function parseWindow(text: string): Window {
  const match = PATTERN.exec(text.trim());
  if (!match) throw new SyntaxError(`"${text}" is not a window; expected the form 08:00-12:00`);
  const [, h1, m1, h2, m2] = match as unknown as [string, string, string, string, string];
  return makeWindow(minutes(h1, m1), minutes(h2, m2));
}

const pad = (n: number): string => String(n).padStart(2, "0");

export function formatWindow(w: Window): string {
  const f = (t: number) => `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
  return `${f(w.start)}-${f(w.end)}`;
}

export function intersect(a: Window, b: Window): Window | null {
  const start = Math.max(a.start, b.start);
  const end = Math.min(a.end, b.end);
  return end > start ? { start, end } : null;
}

/** Remove `cut` (a break, an existing visit) from `w`, leaving zero, one or two windows. */
export function subtract(w: Window, cut: Window): Window[] {
  const out: Window[] = [];
  if (cut.start > w.start) out.push({ start: w.start, end: Math.min(w.end, cut.start) });
  if (cut.end < w.end) out.push({ start: Math.max(w.start, cut.end), end: w.end });
  return out.filter((x) => x.end > x.start);
}

/**
 * The latest time a visit of `durationMin` can start inside `w`, or null if it does not fit.
 * Scheduling uses this to keep as much slack as possible after each visit.
 */
export function latestStart(w: Window, durationMin: number): number | null {
  if (!(durationMin > 0)) throw new RangeError("duration must be positive");
  const latest = w.end - durationMin;
  return latest >= w.start ? latest : null;
}
