'use client';

import Image from 'next/image';
import { useState } from 'react';

import { ContactForm } from './_components/contact-form';
import { DirectScheduleCard } from './_components/direct-schedule-card';
import { SuccessMessage } from './_components/success-message';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
const heroLandscape = '/images/website/background.avif';
const discoveryCallUrl
  = process.env.NEXT_PUBLIC_CAL_DISCOVERY_CALL_URL ?? 'https://cal.com/20xdev/discovery-call';

export default function ContactPage(): React.ReactElement {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);
    formData.append('access_key', 'fe250ae9-b11c-4b8f-9c9d-ab204ce80687');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json() as { success: boolean; message?: string };

      if (data.success) {
        setStatus('success');
        (event.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
        setErrorMessage(data.message ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-black/6">
      <ContactBackground />
      <ContactContent
        status={status}
        errorMessage={errorMessage}
        onReset={() => {
          setStatus('idle');
        }}
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      />
    </section>
  );
}

interface ContactContentProps {
  status: FormStatus;
  errorMessage: string;
  onReset: () => void;
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
}

function ContactContent({
  status,
  errorMessage,
  onReset,
  onSubmit,
}: ContactContentProps): React.ReactElement {
  return (
    <div className="relative mx-auto min-h-screen max-w-7xl px-6 pb-20 pt-30 sm:px-8 sm:pt-36 lg:px-12 lg:pb-28 lg:pt-[24rem]">
      <div className="mx-auto max-w-[30rem]">
        <div className="flex flex-col items-center gap-8 text-center sm:gap-10">
          <ContactHeader />

          <div className="w-full">
            {status === 'success' ? (
              <SuccessMessage onReset={onReset} />
            ) : (
              <ContactForm status={status} errorMessage={errorMessage} onSubmit={onSubmit} />
            )}
          </div>

          <DirectScheduleCard url={discoveryCallUrl} />
        </div>
      </div>
    </div>
  );
}

function ContactHeader(): React.ReactElement {
  return (
    <header className="space-y-4">
      <h1 className="text-[clamp(3rem,7vw,4.4rem)] leading-[0.95] font-normal tracking-[-0.07em] text-[#222221]">
        Get started
      </h1>
      <p className="mx-auto max-w-[28rem] text-[1rem] leading-7 tracking-[-0.03em] text-[#5f5751]/85 sm:text-[1.12rem]">
        Fill out the form and we will reach out to you soon.
      </p>
    </header>
  );
}

function ContactBackground(): React.ReactElement {
  return (
    <div className="absolute inset-x-0 top-0 h-[28rem] overflow-hidden sm:h-[34rem] lg:h-[40rem]">
      <Image
        src={heroLandscape}
        alt=""
        fill
        priority
        className="object-cover [object-position:center_top]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,241,231,0)_0%,rgba(247,241,231,0.04)_28%,rgba(247,241,231,0.38)_42%,rgba(247,241,231,0.78)_51%,rgba(247,241,231,0.96)_58%,rgba(247,241,231,1)_64%)]" />
    </div>
  );
}
