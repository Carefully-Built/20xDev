'use client';

import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface SuccessMessageProps {
  onReset: () => void;
}

export function SuccessMessage({ onReset }: SuccessMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <CheckCircle className="size-12 text-green-500 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
      <p className="text-muted-foreground mb-6">
        Thank you for reaching out. We&apos;ll get back to you soon.
      </p>
      <Button variant="outline" onClick={onReset}>
        Send Another Message
      </Button>
    </div>
  );
}
