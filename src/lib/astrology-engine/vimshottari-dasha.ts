// lib/vimshottari-dasha.ts
import dayjs from "dayjs";

type DashaPeriod = {
  planet: string;
  start: string;
  end: string;
};

const DURATION: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const DashaSequence = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
];

// This is a simplified version for demonstration.
// A real implementation would calculate the starting Nakshatra lord based on Moon's degree.
export function getVimshottariDasha(startPlanet: string, birthDate: string): DashaPeriod[] {
  const index = DashaSequence.indexOf(startPlanet);
  if (index === -1) return [];

  let dashaStart = dayjs(birthDate);
  const fullDasha: DashaPeriod[] = [];

  for (let i = 0; i < DashaSequence.length; i++) {
    const planet = DashaSequence[(index + i) % DashaSequence.length];
    const years = DURATION[planet];
    const dashaEnd = dashaStart.add(years, "year");

    fullDasha.push({
      planet,
      start: dashaStart.format("YYYY-MM-DD"),
      end: dashaEnd.format("YYYY-MM-DD"),
    });

    dashaStart = dashaEnd;
  }

  return fullDasha;
}
