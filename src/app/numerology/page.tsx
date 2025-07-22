import { NumerologyClient } from "@/components/numerology-client";
import { PageHeader } from "@/components/layout/page-header";

export default function NumerologyPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Numerology Analysis"
        description="Discover your core numbers and what they say about your life's path and personality."
      />
      <NumerologyClient />
    </div>
  );
}
