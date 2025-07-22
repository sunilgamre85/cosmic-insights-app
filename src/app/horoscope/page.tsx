import { PageHeader } from "@/components/layout/page-header";
import { HoroscopeClient } from "@/components/horoscope-client";
import { horoscopes, zodiacSigns } from "@/lib/astrology-data";

export default function HoroscopePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Daily Horoscope"
        description="Select your zodiac sign to reveal what the stars have in store for you today."
      />
      <HoroscopeClient signs={zodiacSigns} horoscopes={horoscopes} />
    </div>
  );
}
