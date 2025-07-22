import { MobileNumerologyClient } from "@/components/mobile-numerology-client";
import { PageHeader } from "@/components/layout/page-header";

export default function MobileNumerologyPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="Mobile Number Numerology"
        description="Discover the hidden vibration and secrets of your mobile number."
      />
      <MobileNumerologyClient />
    </div>
  );
}
