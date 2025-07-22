// panchang/page.tsx
"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { PageHeader } from "@/components/layout/page-header";
import { DailyPanchangCard } from "@/components/DailyPanchangCard";
import { getDailyPanchang, type PanchangData } from "@/lib/panchang-calculator";
import { Skeleton } from "@/components/ui/skeleton";

export default function PanchangPage() {
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you might fetch this data or calculate it based on user's location
    // For now, we use a default location and the current date.
    const today = dayjs().format("YYYY-MM-DD");
    // Default location: Delhi, India
    const data = getDailyPanchang(today, 28.6139, 77.2090);
    setPanchangData(data);
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Today's Panchang"
        description="Explore the astrological details of the day including Tithi, Nakshatra, and more."
      />
      <div className="flex justify-center">
        {loading && (
            <div className="w-full max-w-md">
                <Skeleton className="h-[250px] w-full" />
            </div>
        )}
        {!loading && panchangData && <DailyPanchangCard data={panchangData} />}
      </div>
    </div>
  );
}
