// planetary.ts
import { getPlanetPositions } from './planet';

/**
 * Gets the tropical longitude of the Moon for a given Julian Day.
 * This is a simplified wrapper around getPlanetPositions for convenience.
 */
export function getMoonPosition(jd: number): number {
  const positions = getPlanetPositions(jd);
  return positions.moon;
}
