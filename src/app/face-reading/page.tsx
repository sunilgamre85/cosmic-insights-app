import { FaceReadingClient } from "@/components/face-reading-client";
import { PageHeader } from "@/components/layout/page-header";

export default function FaceReadingPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader
        title="AI Face Reading"
        description="Discover insights into your personality and destiny based on the ancient art of face reading. Upload a clear, front-facing photo."
      />
      <FaceReadingClient />
    </div>
  );
}
