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
 * Calculates the core Kundli data by calling an external astrology API.
 * This needs to be pointed to a real, deployed astrology calculation service.
 */
export async function getKundliData({ dob, tob, placeOfBirth }: { dob: string, tob: string, placeOfBirth: string }): Promise<any> {
  console.log('Fetching Kundli data for:', { dob, tob, placeOfBirth });
  
  const KUNDLI_API_URL = process.env.KUNDLI_API_URL;

  if (!KUNDLI_API_URL) {
      console.warn("KUNDLI_API_URL not set. Returning mock Kundli data.");
      // MOCK RESPONSE if API is not configured
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
            { name: "API Not Configured", description: "Yogas/Doshas are currently unavailable." },
        ],
        mahadashas: [
            { dashaLord: "API", startDate: "N/A", endDate: "N/A" },
            { dashaLord: "Not Configured", startDate: "N/A", endDate: "N/A" },
        ]
      });
  }

  // Step 1: Get coordinates for the place of birth
  const location = await getLatLon(placeOfBirth);
  
  // Step 2: Call the external Kundli API
  const response = await fetch(KUNDLI_API_URL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          dob: dob,
          tob: tob,
          lat: location.lat,
          lon: location.lng,
          // Timezone offset might be needed by the API, assuming IST for now.
          // A robust solution would calculate this based on location.
          timezone: 5.5 
      }),
  });

  if (!response.ok) {
      console.error("Kundli API request failed with status:", response.status);
      throw new Error("Failed to fetch Kundli data from the astrology API.");
  }

  return await response.json();
}
