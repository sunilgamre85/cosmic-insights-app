'use server';

async function getLatLon(place: string): Promise<{ lat: number; lng: number }> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        console.warn("Google Maps API key not found. Using default coordinates.");
        // Return default coordinates for Mumbai as a fallback
        return { lat: 19.0760, lng: 72.8777 };
    }
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(place)}&key=${apiKey}`);
    const data = await res.json();
    if (data.status !== 'OK' || !data.results[0]) {
        console.error(`Geocoding failed for place: ${place}. Status: ${data.status}`);
        // Return fallback coordinates if geocoding fails
        return { lat: 19.0760, lng: 72.8777 };
    }
    return data.results[0].geometry.location;
};

/**
 * Calculates the core Kundli data.
 * THIS IS A MOCK IMPLEMENTATION. The astrology calculation package was removed due to installation issues.
 * This needs to be replaced with a reliable external API for astrology calculations.
 */
export async function getKundliData({ dob, tob, placeOfBirth }: { dob: string, tob: string, placeOfBirth: string }): Promise<any> {
  console.log('Attempting to fetch Kundli data for:', { dob, tob, placeOfBirth });
  
  // Geocoding still works
  const location = await getLatLon(placeOfBirth);
  console.log(`Location for ${placeOfBirth}:`, location);

  // MOCK RESPONSE
  console.warn("RETURNING MOCK KUNDLI DATA. The astrology calculation service is disabled.");
  return Promise.resolve({
    ascendant: { sign: 'Leo' },
    planets: [
      { name: 'Sun', sign: 'Leo', house: 1 },
      { name: 'Moon', sign: 'Taurus', house: 10 },
      { name: 'Mars', sign: 'Virgo', house: 2 },
      { name: 'Mercury', sign: 'Leo', house: 1 },
      { name: 'Jupiter', sign: 'Scorpio', house: 4 },
      { name: 'Venus', sign: 'Cancer', house: 12 },
      { name: 'Saturn', sign: 'Pisces', house: 8 },
      { name: 'Rahu', sign: 'Libra', house: 3 },
      { name: 'Ketu', sign: 'Aries', house: 9 }
    ],
    houseSigns: [
        'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 
        'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer'
    ],
    yogasAndDoshas: [
        { name: "Feature Disabled", description: "Yogas/Doshas are currently unavailable." },
    ],
    mahadashas: [
        { dashaLord: "Feature", startDate: "N/A", endDate: "N/A" },
        { dashaLord: "Disabled", startDate: "N/A", endDate: "N/A" },
    ]
  });
}