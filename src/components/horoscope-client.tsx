"use client";

import { useState } from "react";
import type { FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ZodiacSignName, horoscopes, zodiacSigns } from "@/lib/astrology-data";

interface HoroscopeClientProps {
  signs: typeof zodiacSigns;
  horoscopes: typeof horoscopes;
}

export const HoroscopeClient: FC<HoroscopeClientProps> = ({ signs, horoscopes }) => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSignName | null>(null);

  const handleSignSelect = (signName: ZodiacSignName) => {
    setSelectedSign(signName);
  };

  const currentHoroscope = selectedSign ? horoscopes[selectedSign] : null;

  return (
    <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Choose Your Sign</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {signs.map((sign) => (
              <button
                key={sign.name}
                onClick={() => handleSignSelect(sign.name)}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-md",
                  selectedSign === sign.name
                    ? "border-accent bg-accent/10"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                <div className="text-4xl">{sign.symbol}</div>
                <div className="mt-2 text-sm font-semibold">{sign.name}</div>
                <div className="text-xs text-muted-foreground">{sign.dateRange}</div>
              </button>
            ))}
          </CardContent>
        </Card>
      
      
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">
              {selectedSign ? `${selectedSign}'s Horoscope` : "Your Daily Reading"}
            </CardTitle>
            <CardDescription>
                {selectedSign ? `Today's outlook for ${selectedSign}` : "Select a sign to see your forecast."}
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-center justify-center">
            {selectedSign && currentHoroscope ? (
              <div key={selectedSign} className="animate-in fade-in-50 duration-500 space-y-4 text-center">
                <div className="text-6xl">{currentHoroscope.emoji}</div>
                <h3 className="font-headline text-2xl text-primary">{currentHoroscope.title}</h3>
                <p className="text-base text-foreground/90">{currentHoroscope.prediction}</p>
              </div>
            ) : (
                <div className="text-center text-muted-foreground">
                    <SparklesIcon className="mx-auto h-12 w-12" />
                    <p className="mt-2">Your cosmic forecast awaits.</p>
                </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
};


function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.9 1.9a10 10 0 0 0-2.2 2.2L6 9l1.9-1.9a10 10 0 0 0 2.2-2.2L12 3Z" />
      <path d="M21 12l-1.9-1.9a10 10 0 0 0-2.2-2.2L15 6l1.9 1.9a10 10 0 0 0 2.2 2.2L21 12Z" />
      <path d="M9 18l-1.9 1.9a10 10 0 0 0-2.2 2.2L3 24l1.9-1.9a10 10 0 0 0 2.2-2.2L9 18Z" />
      <path d="M12 21l1.9-1.9a10 10 0 0 0 2.2-2.2L18 15l-1.9 1.9a10 10 0 0 0-2.2 2.2L12 21Z" />
    </svg>
  )
}
