import { TarotReadingClient } from "@/components/tarot-reading-client";
import { PageHeader } from "@/components/layout/page-header";
import { tarotCards } from "@/lib/astrology-data";

export default function TarotReadingPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="AI Tarot Card Reading"
        description="Draw three cards to gain insight into your past, present, and future."
      />
      <TarotReadingClient cards={tarotCards} />
    </div>
  );
}
