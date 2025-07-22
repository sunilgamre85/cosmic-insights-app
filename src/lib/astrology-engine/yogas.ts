// yogas.ts

// This is a simplified representation. The actual analysis needs more detail.
type PlanetPosition = {
  sign: string;
  degree: number;
  house: number;
};

type PlanetMap = { [planet: string]: PlanetPosition };
type HouseMap = { [house: string]: string };

export function detectYogas(planets: PlanetMap, houses: HouseMap): {type: string, details: string}[] {
  const yogas = [];

  // This is a highly simplified logic and needs to be expanded for real-world use.
  // For now, it serves as a placeholder for the yoga detection engine.

  // Mock Gaj Kesari Yoga: Jupiter and Moon in Kendra from each other.
  // A more accurate check would involve checking if they are in 1, 4, 7, 10 houses from each other.
  const moonHouse = planets['moon']?.house;
  const jupiterHouse = planets['jupiter']?.house;

  if (moonHouse && jupiterHouse) {
      const distance = Math.abs(moonHouse - jupiterHouse);
      if (distance === 0 || distance === 3 || distance === 6 || distance === 9) {
          yogas.push({
            type: "Gaj Kesari Yoga (Simplified)",
            details: "Moon and Jupiter are in a Kendra position relative to each other."
          });
      }
  }


  // Mock Raj Yoga for Leo Ascendant
  const ascendantSign = houses['1'];
  if (ascendantSign === 'Leo') {
    const marsSign = planets['mars']?.sign; // Yogakaraka for Leo
    const jupiterSign = planets['jupiter']?.sign; // 5th lord

    if (marsSign && jupiterSign && marsSign === jupiterSign) {
       yogas.push({
        type: "Raj Yoga (Simplified)",
        details: "For Leo ascendant, Yogakaraka Mars is conjunct with 5th lord Jupiter."
      });
    }
  }

  if (yogas.length === 0) {
    yogas.push({
        type: "Basic Analysis",
        details: "No major yogas detected with the current simplified logic. A detailed manual analysis is recommended."
    })
  }


  return yogas;
}
