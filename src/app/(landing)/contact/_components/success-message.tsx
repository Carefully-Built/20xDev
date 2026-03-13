'use client';

import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface SuccessMessageProps {
  onReset: () => void;
}

export function SuccessMessage({ onReset }: SuccessMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-[#ddd4c9] bg-[rgba(247,241,231,0.28)] px-6 py-10 text-center backdrop-blur-[2px]">
      <CheckCircle className="mb-4 size-12 text-[#5e7e56]" />
      <h3 className="mb-2 text-[1.35rem] leading-tight font-normal tracking-[-0.04em] text-[#222221]">
        Message sent
      </h3>
      <p className="mb-6 max-w-sm text-[1rem] leading-7 tracking-[-0.02em] text-[#5f5751]/85">
        Thank you for reaching out. We&apos;ll get back to you soon.
      </p>
      <Button
        variant="outline"
        onClick={onReset}
        className="h-11 rounded-full border-[#cbbdad] bg-[rgba(255,255,255,0.5)] px-5 text-[#292421] hover:bg-[rgba(255,255,255,0.75)]"
      >
        Send Another Message
      </Button>
    </div>
  );
}
