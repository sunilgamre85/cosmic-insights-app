import { KundliMatchingClient } from "@/components/kundli-matching-client";
import { PageHeader } from "@/components/layout/page-header";

export default function KundliMatchingPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Kundli Matching (Ashtakoot Milan)"
        description="Enter the birth details for two individuals to check their marriage compatibility."
      />
      <KundliMatchingClient />
    </div>
  );
}
