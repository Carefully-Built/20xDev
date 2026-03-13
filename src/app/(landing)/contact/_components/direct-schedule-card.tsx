'use client';

import { ArrowUpRight, CalendarDays } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface DirectScheduleCardProps {
  url: string;
}

export function DirectScheduleCard({ url }: DirectScheduleCardProps): React.ReactElement {
  return (
    <div className="w-full rounded-[2.2rem] border border-[#ddd4c9] bg-[rgba(255,255,255,0.62)] p-7 text-left shadow-[0_24px_60px_rgba(64,42,30,0.08)] backdrop-blur-md sm:p-9">
      <div className="flex flex-col gap-6 sm:gap-7">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9cebf] bg-[rgba(247,241,231,0.9)] px-3.5 py-1.5 text-[0.8rem] font-medium tracking-[0.02em] text-[#5f5751]">
            <CalendarDays className="size-3.5" />
            Prefer to skip the form?
          </div>
          <h2 className="max-w-[20ch] text-[1.65rem] leading-[1.02] font-normal tracking-[-0.055em] text-[#222221] sm:text-[2rem]">
            Book a discovery call directly
          </h2>
          <p className="max-w-[62ch] text-[1.03rem] leading-7 tracking-[-0.025em] text-[#5f5751]/90 sm:text-[1.08rem]">
            Choose a time on our calendar and go straight to a live conversation. Faster for urgent
            questions, partnerships, or project-fit checks.
          </p>
        </div>

        <div className="flex shrink-0">
          <Button
            asChild
            className="h-13 rounded-full bg-[#160f0c] px-7 text-[1rem] font-normal tracking-[-0.02em] text-white shadow-none hover:bg-[#2b1f1a]"
          >
            <Link href={url} target="_blank" rel="noreferrer">
              Schedule a call
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
