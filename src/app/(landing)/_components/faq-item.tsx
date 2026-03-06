'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface FaqItemProps {
  readonly question: ReactNode;
  readonly answer: ReactNode;
}

export function FaqItem({ question, answer }: FaqItemProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-medium">{question}</span>
        <ChevronDown
          className={cn(
            'size-5 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <p className="text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}
