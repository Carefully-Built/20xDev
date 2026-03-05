'use client';

import { useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ContactForm } from './_components/contact-form';
import { SuccessMessage } from './_components/success-message';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

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
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have a question or want to work together? We&apos;d love to hear from you.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'success' ? (
              <SuccessMessage onReset={() => setStatus('idle')} />
            ) : (
              <ContactForm
                status={status}
                errorMessage={errorMessage}
                onSubmit={(e) => void handleSubmit(e)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
