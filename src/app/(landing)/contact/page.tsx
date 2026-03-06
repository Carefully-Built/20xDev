'use client';

import { T } from 'gt-next';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            <T id="contact.title">Get in Touch</T>
          </h1>
          <p className="text-lg text-muted-foreground">
            <T id="contact.description">Have a question or want to work together? We&apos;d love to hear from you.</T>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle><T id="contact.formTitle">Send us a message</T></CardTitle>
            <CardDescription>
              <T id="contact.formDescription">Fill out the form below and we&apos;ll get back to you as soon as possible.</T>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="size-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2"><T id="contact.successTitle">Message Sent!</T></h3>
                <p className="text-muted-foreground mb-6">
                  <T id="contact.successDescription">Thank you for reaching out. We&apos;ll get back to you soon.</T>
                </p>
                <Button variant="outline" onClick={() => { setStatus('idle'); }}>
                  <T id="contact.sendAnother">Send Another Message</T>
                </Button>
              </div>
            ) : (
              <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name"><T id="contact.nameLabel">Name</T></Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      disabled={status === 'submitting'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email"><T id="contact.emailLabel">Email</T></Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      disabled={status === 'submitting'}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message"><T id="contact.messageLabel">Message</T></Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your project or question..."
                    rows={5}
                    required
                    disabled={status === 'submitting'}
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="size-4" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={status === 'submitting'}>
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      <T id="contact.sending">Sending...</T>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 size-4" />
                      <T id="contact.sendMessage">Send Message</T>
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
