// julian.ts
export function getJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // Month is 0-indexed
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  let A = Math.floor(year / 100);
  let B = 2 - A + Math.floor(A / 4);

  let JD = Math.floor(365.25 * (year + 4716)) +
           Math.floor(30.6001 * (month + 1)) +
           day + B - 1524.5 + hour / 24;

  return JD;
}
