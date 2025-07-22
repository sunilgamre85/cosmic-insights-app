import React from "react";
import { PanchangData } from "@/lib/panchang-calculator";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Calendar, Sunrise, Sunset, Moon, Sparkles, Sun, Star } from "lucide-react";

export const DailyPanchangCard = ({ data }: { data: PanchangData }) => {
  return (
    <Card className="shadow-lg w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" /> Daily Panchang ({data.date})
        </CardTitle>
      </CardHeader>
      <CardContent>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-base">
        <li className="flex items-center gap-2"><Sun className="text-accent"/><strong>Tithi:</strong> {data.tithi}</li>
        <li className="flex items-center gap-2"><Star className="text-accent"/><strong>Nakshatra:</strong> {data.nakshatra}</li>
        <li className="flex items-center gap-2"><Moon className="text-accent"/><strong>Moon Sign:</strong> {data.moonSign}</li>
        <li className="flex items-center gap-2"><Sparkles className="text-accent"/><strong>Yoga:</strong> {data.yoga}</li>
        <li className="flex items-center gap-2"><Sunrise className="text-accent"/><strong>Sunrise:</strong> {data.sunrise}</li>
        <li className="flex items-center gap-2"><Sunset className="text-accent"/><strong>Sunset:</strong> {data.sunset}</li>
        <li className="flex items-center gap-2 col-span-2"><Sparkles className="text-accent"/><strong>Karana:</strong> {data.karana}</li>
      </ul>
      </CardContent>
    </div >
  );
};