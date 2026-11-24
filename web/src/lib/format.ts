// Display helpers for the dispatcher's board.

/** Show a distance in metres the way dispatchers read it: metres under 1 km, else km. */
export function formatDistance(metres: number): string {
  if (!Number.isFinite(metres) || metres < 0) throw new RangeError(`${metres} is not a distance`);
  if (metres < 1000) return `${Math.round(metres)} m`;
  const km = metres / 1000;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

/** Show a duration in minutes as "45 min" or "1 h 30 min". */
export function formatMinutes(total: number): string {
  if (!Number.isInteger(total) || total < 0) throw new RangeError(`${total} is not a whole number of minutes`);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
