// vimshottari-dasha.ts

import { Planet } from './types';
import { getMoonPosition } from './planetary';
import { getJulianDay } from './julian';
import { getLahiriAyanamsa, applyAyanamsa } from './ayanamsa';

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

/**
 * Determine which nakshatra the moon is in
 */
function getNakshatra(deg: number) {
  const nakshatraSize = 13.333333;
  const nakshatraIndex = Math.floor(deg / nakshatraSize);
  return nakshatraData[nakshatraIndex];
}

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
  const balance = nak.duration * (1 - portion);

  const sequence: Planet[] = [
    "Ketu", "Venus", "Sun", "Moon", "Mars",
    "Rahu", "Jupiter", "Saturn", "Mercury"
  ];

  const startIndex = sequence.indexOf(nak.ruler as Planet);
  const dashaList: { planet: string; years: number }[] = [];

  for (let i = 0; i < 9; i++) {
    const planet = sequence[(startIndex + i) % 9];
    const durData = nakshatraData.find(n => n.ruler === planet);
    if (durData) {
        const dur = durData.duration;
        dashaList.push({ planet, years: i === 0 ? balance : dur });
    }
  }

  return {
    moonDeg: moonSidereal,
    nakshatra: nak.name,
    startPlanet: nak.ruler,
    dashas: dashaList,
  };
}