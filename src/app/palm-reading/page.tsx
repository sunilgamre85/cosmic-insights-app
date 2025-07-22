import { PalmReadingClient } from "@/components/palm-reading-client";
import { PageHeader } from "@/components/layout/page-header";

export default function PalmReadingPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="AI Palm Reading"
        description="Uncover the mysteries of your fate and personality. Upload a clear photo of your dominant hand's palm."
      />
      <PalmReadingClient />
    </div>
  );
}
