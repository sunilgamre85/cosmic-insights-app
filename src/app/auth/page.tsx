
'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const { toast } = useToast();

  useEffect(() => {
    // This is a placeholder page for handling auth callbacks.
    // For now, it just shows a toast.
    toast({
      title: 'Authentication',
      description: 'Handling authentication logic...',
    });
  }, [toast]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold">Processing Authentication...</h1>
      <p>Please wait while we process your authentication.</p>
    </div>
  );
}
