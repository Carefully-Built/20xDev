'use client';

import { AlertCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContactFormProps {
  status: 'idle' | 'submitting' | 'error';
  errorMessage: string;
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
}

export function ContactForm({ status, errorMessage, onSubmit }: ContactFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="sr-only">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Name *"
            required
            disabled={status === 'submitting'}
            className="h-12 rounded-2xl border-[#8d7a89]/55 bg-[rgba(247,241,231,0.18)] px-4 text-[0.98rem] tracking-[-0.02em] text-[#292421] placeholder:text-[#8b837c] focus-visible:border-[#6a5648] focus-visible:ring-[rgba(106,86,72,0.16)]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="sr-only">Business email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Business email *"
            required
            disabled={status === 'submitting'}
            className="h-12 rounded-2xl border-[#ddd4c9] bg-[rgba(247,241,231,0.12)] px-4 text-[0.98rem] tracking-[-0.02em] text-[#292421] placeholder:text-[#8b837c] focus-visible:border-[#6a5648] focus-visible:ring-[rgba(106,86,72,0.16)]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="sr-only">Phone number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Phone number"
            disabled={status === 'submitting'}
            className="h-12 rounded-2xl border-[#ddd4c9] bg-[rgba(247,241,231,0.12)] px-4 text-[0.98rem] tracking-[-0.02em] text-[#292421] placeholder:text-[#8b837c] focus-visible:border-[#6a5648] focus-visible:ring-[rgba(106,86,72,0.16)]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="sr-only">How can we help you?</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="How can we help you?"
            rows={4}
            required
            disabled={status === 'submitting'}
            className="min-h-28 rounded-2xl border-[#ddd4c9] bg-[rgba(247,241,231,0.12)] px-4 py-4 text-[0.98rem] tracking-[-0.02em] text-[#292421] placeholder:text-[#8b837c] focus-visible:border-[#6a5648] focus-visible:ring-[rgba(106,86,72,0.16)]"
          />
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-center justify-center gap-2 text-sm tracking-[-0.02em] text-destructive">
          <AlertCircle className="size-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Button
          type="submit"
          disabled={status === 'submitting'}
          className="h-12 rounded-full bg-[#160f0c] px-7 text-[0.98rem] font-normal tracking-[-0.02em] text-white shadow-none hover:bg-[#2b1f1a]"
        >
        {status === 'submitting' ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Schedule a demo'
        )}
        </Button>
      </div>
    </form>
  );
}
