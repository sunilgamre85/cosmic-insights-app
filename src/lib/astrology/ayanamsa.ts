// ayanamsa.ts

export function getLahiriAyanamsa(julianDay: number): number {
  // Lahiri Ayanamsa (Chitrapaksha) base value
  const baseAyanamsa = 23.85675; // value near J2000
  const daysSinceEpoch = julianDay - 2451545.0;
  const centuries = daysSinceEpoch / 36525;

  // Approximate yearly increase
  const ayanamsa = baseAyanamsa + (0.013 * centuries);
  return ayanamsa;
}

export function applyAyanamsa(longitude: number, julianDay: number): number {
  const ayanamsa = getLahiriAyanamsa(julianDay);
  let sidereal = longitude - ayanamsa;
  if (sidereal < 0) sidereal += 360;
  return sidereal % 360;
}
