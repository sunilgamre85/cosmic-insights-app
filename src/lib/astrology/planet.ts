// planet.ts
import { getJulianDay } from './julian';

const DEG_PER_DAY = {
  sun: 0.98564736,
  moon: 13.1763966,
  mars: 0.524039,
  mercury: 1.383574,
  jupiter: 0.0830853,
  venus: 1.184557,
  saturn: 0.0334597,
  rahu: -0.0529539, // retrograde
};

const MEAN_LONG_AT_EPOCH = {
  sun: 280.1470,
  moon: 318.351648,
  mars: 293.737334,
  mercury: 231.158434,
  jupiter: 240.768,
  venus: 181.979801,
  saturn: 266.564377,
  rahu: 200.0,
};

const EPOCH_JD = 2451545.0; // Jan 1, 2000 12:00 UTC

function normalizeDegree(deg: number): number {
  return (deg % 360 + 360) % 360;
}

export function getPlanetPositions(jd: number) {
  const daysSinceEpoch = jd - EPOCH_JD;

  const planets: Record<string, number> = {};

  for (const planet in DEG_PER_DAY) {
    const dailyMotion = DEG_PER_DAY[planet as keyof typeof DEG_PER_DAY];
    const meanLong = MEAN_LONG_AT_EPOCH[planet as keyof typeof MEAN_LONG_AT_EPOCH];
    const currentDeg = normalizeDegree(meanLong + dailyMotion * daysSinceEpoch);
    planets[planet] = currentDeg;
  }

  return planets;
}
