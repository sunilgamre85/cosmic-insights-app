// lib/panchang-calculator.ts

import dayjs from "dayjs";

export type PanchangData = {
  date: string;
  tithi: string;
  nakshatra: string;
  moonSign: string;
  sunrise: string;
  sunset: string;
  yoga: string;
  karana: string;
};

export function getDailyPanchang(dateStr: string, lat: number, lon: number): PanchangData {
  const date = dayjs(dateStr);

  // 🌗 Placeholder logic (replace with real astro engine)
  const tithis = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", "Amavasya"];
  const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
  const yogas = ["Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarman", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
  const karanas = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga", "Kintughna"];
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];


  return {
    date: date.format("YYYY-MM-DD"),
    tithi: tithis[date.date() % tithis.length],
    nakshatra: nakshatras[date.date() % nakshatras.length],
    moonSign: signs[date.month() % signs.length],
    sunrise: "06:12 AM", // Placeholder
    sunset: "06:58 PM", // Placeholder
    yoga: yogas[date.date() % yogas.length],
    karana: karanas[date.date() % karanas.length],
  };
}