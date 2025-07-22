import { ChatClient } from "@/components/chat-client";
import { PageHeader } from "@/components/layout/page-header";

export default function ChatPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 h-full flex flex-col">
      <PageHeader
        title="Chat with our AI Astrologer"
        description="Ask anything about astrology, from your birth chart to the meaning of a retrograde."
      />
      <ChatClient />
    </div>
  );
}
