// houses.ts

import { getJulianDay } from './julian';
import { getLahiriAyanamsa } from './ayanamsa';

/**
 * Convert degrees to radians.
 */
function toRadians(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Convert radians to degrees.
 */
function toDegrees(rad: number): number {
  return rad * (180 / Math.PI);
}

/**
 * Calculate the Local Sidereal Time (in degrees).
 */
function getLocalSiderealTime(jd: number, longitude: number): number {
  const d = jd - 2451545.0;
  const GMST = 280.46061837 + 360.98564736629 * d;
  const LST = (GMST + longitude) % 360;
  return LST < 0 ? LST + 360 : LST;
}

/**
 * Calculate the Ascendant (Lagna) degree.
 */
export function getAscendant(
  date: Date,
  latitude: number,
  longitude: number
): number {
  const jd = getJulianDay(date);
  const lst = getLocalSiderealTime(jd, longitude);
  const obliquity = 23.4393; // Mean obliquity of the ecliptic
  const latRad = toRadians(latitude);
  const lstRad = toRadians(lst);

  const tanAsc = Math.tan(lstRad) * Math.cos(toRadians(obliquity));
  let asc = toDegrees(Math.atan(tanAsc));

  if (lst > 180) asc += 180;
  asc = (asc + 360) % 360;

  // Apply Lahiri Ayanamsa
  const ayanamsa = getLahiriAyanamsa(jd);
  const siderealAsc = (asc - ayanamsa + 360) % 360;

  return siderealAsc;
}

/**
 * Divide the 360° circle into 12 houses starting from Ascendant.
 */
export function getHouses(ascendant: number): Record<number, number> {
  const houses: Record<number, number> = {};
  for (let i = 1; i <= 12; i++) {
    houses[i] = (ascendant + (i - 1) * 30) % 360;
  }
  return houses;
}
