import { JanamKundliClient } from "@/components/janam-kundli-client";
import { PageHeader } from "@/components/layout/page-header";

export default function JanamKundliPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Janam Kundli Report"
        description="Enter your birth details to generate your Vedic birth chart and detailed report."
      />
      <JanamKundliClient />
    </div>
  );
}
