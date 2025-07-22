// vimshottari-dasha.ts

import { Planet } from './types';
import { getMoonPosition } from './planetary';
import { getJulianDay } from './julian';
import { applyAyanamsa } from './ayanamsa';
import dayjs from "dayjs";


/**
 * Nakshatra list with ruling planets and their Mahadasha duration
 */
const nakshatraData = [
  { name: "Ashwini", ruler: "Ketu", startDeg: 0, duration: 7 },
  { name: "Bharani", ruler: "Venus", startDeg: 13.3333, duration: 20 },
  { name: "Krittika", ruler: "Sun", startDeg: 26.6667, duration: 6 },
  { name: "Rohini", ruler: "Moon", startDeg: 40, duration: 10 },
  { name: "Mrigashira", ruler: "Mars", startDeg: 53.3333, duration: 7 },
  { name: "Ardra", ruler: "Rahu", startDeg: 66.6667, duration: 18 },
  { name: "Punarvasu", ruler: "Jupiter", startDeg: 80, duration: 16 },
  { name: "Pushya", ruler: "Saturn", startDeg: 93.3333, duration: 19 },
  { name: "Ashlesha", ruler: "Mercury", startDeg: 106.6667, duration: 17 },
  { name: "Magha", ruler: "Ketu", startDeg: 120, duration: 7 },
  { name: "Purva Phalguni", ruler: "Venus", startDeg: 133.3333, duration: 20 },
  { name: "Uttara Phalguni", ruler: "Sun", startDeg: 146.6667, duration: 6 },
  { name: "Hasta", ruler: "Moon", startDeg: 160, duration: 10 },
  { name: "Chitra", ruler: "Mars", startDeg: 173.3333, duration: 7 },
  { name: "Swati", ruler: "Rahu", startDeg: 186.6667, duration: 18 },
  { name: "Vishakha", ruler: "Jupiter", startDeg: 200, duration: 16 },
  { name: "Anuradha", ruler: "Saturn", startDeg: 213.3333, duration: 19 },
  { name: "Jyeshtha", ruler: "Mercury", startDeg: 226.6667, duration: 17 },
  { name: "Moola", ruler: "Ketu", startDeg: 240, duration: 7 },
  { name: "Purva Ashadha", ruler: "Venus", startDeg: 253.3333, duration: 20 },
  { name: "Uttara Ashadha", ruler: "Sun", startDeg: 266.6667, duration: 6 },
  { name: "Shravana", ruler: "Moon", startDeg: 280, duration: 10 },
  { name: "Dhanishta", ruler: "Mars", startDeg: 293.3333, duration: 7 },
  { name: "Shatabhisha", ruler: "Rahu", startDeg: 306.6667, duration: 18 },
  { name: "Purva Bhadrapada", ruler: "Jupiter", startDeg: 320, duration: 16 },
  { name: "Uttara Bhadrapada", ruler: "Saturn", startDeg: 333.3333, duration: 19 },
  { name: "Revati", ruler: "Mercury", startDeg: 346.6667, duration: 17 },
];

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


/**
 * Determine which nakshatra the moon is in
 */
function getNakshatra(deg: number) {
  const nakshatraSize = 13.333333;
  const nakshatraIndex = Math.floor(deg / nakshatraSize);
  return nakshatraData[nakshatraIndex];
}

type DashaPeriod = {
  planet: string;
  start: string;
  end: string;
};

/**
 * Calculate Vimshottari Mahadasha periods starting from moon position
 */
export function getVimshottariDasha(date: Date, lat: number, lon: number) {
  const jd = getJulianDay(date);
  const moonPos = getMoonPosition(jd);
  const moonSidereal = applyAyanamsa(moonPos, jd);

  const nak = getNakshatra(moonSidereal);
  const nakStart = nak.startDeg;
  const nakEnd = nakStart + 13.333333;

  const portion = (moonSidereal - nakStart) / (nakEnd - nakStart);
  const balanceYears = nak.duration * (1 - portion);

  const dashaList: DashaPeriod[] = [];
  let dashaStart = dayjs(date);

  // First dasha with balance duration
  let dashaEnd = dashaStart.add(balanceYears * 365.25, 'day');
  dashaList.push({
      planet: nak.ruler,
      start: dashaStart.format("YYYY-MM-DD"),
      end: dashaEnd.format("YYYY-MM-DD"),
  });
  dashaStart = dashaEnd;


  const startIndex = DashaSequence.indexOf(nak.ruler as Planet);

  for (let i = 1; i < DashaSequence.length; i++) {
    const planet = DashaSequence[(startIndex + i) % DashaSequence.length];
    const years = DURATION[planet];
    dashaEnd = dashaStart.add(years, "year");

    dashaList.push({
      planet,
      start: dashaStart.format("YYYY-MM-DD"),
      end: dashaEnd.format("YYYY-MM-DD"),
    });
    
    dashaStart = dashaEnd;
  }

  return {
    moonDeg: moonSidereal,
    nakshatra: nak.name,
    startPlanet: nak.ruler,
    dashas: dashaList,
  };
}