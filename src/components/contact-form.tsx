'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { submitContactForm } from '@/lib/web3forms';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  subject: z.string().min(1, 'Subject is required'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm(): React.ReactElement {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    // Type assertion needed due to Zod 4.x / hookform resolver type mismatch
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    resolver: zodResolver(contactSchema as any) as any,
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactFormData): Promise<void> => {
    setStatus('submitting');
    setErrorMessage('');

    try {
      const result = await submitContactForm(data);

      if (result.success) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
        setErrorMessage(
          result.message ?? 'Something went wrong. Please try again.',
        );
      }
    } catch (err: unknown) {
      setStatus('error');
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setErrorMessage(message);
    }
  };

  return (
    <>
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Get in Touch
        </h1>
        <p className="text-lg text-muted-foreground">
          
            Have a question or want to work together? We&apos;d love to hear
            from you.
          
        </p>
      </div>

      <Card data-testid="contact-form">
        <CardHeader>
          <CardTitle>
            Send us a message
          </CardTitle>
          <CardDescription>
            
              Fill out the form below and we&apos;ll get back to you as soon as
              possible.
            
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'success' ? (
            <div
              className="flex flex-col items-center justify-center py-8 text-center"
              data-testid="contact-success"
            >
              <CheckCircle className="mb-4 size-12 text-green-500" />
              <h3 className="mb-2 text-lg font-semibold">
                Message Sent!
              </h3>
              <p className="mb-6 text-muted-foreground">
                
                  Thank you for reaching out. We&apos;ll get back to you soon.
                
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('idle');
                }}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => void handleSubmit(onSubmit)(e)}
              className="space-y-6"
            >
              {/* Honeypot field — hidden from real users, catches bots */}
              <input
                type="checkbox"
                name="botcheck"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                data-testid="contact-honeypot"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="h-10"
                    disabled={status === 'submitting'}
                    data-testid="contact-name"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="h-10"
                    disabled={status === 'submitting'}
                    data-testid="contact-email"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  Subject
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subject"
                  placeholder="What is this about?"
                  className="h-10"
                  disabled={status === 'submitting'}
                  data-testid="contact-subject"
                  {...register('subject')}
                />
                {errors.subject && (
                  <p className="text-sm text-destructive">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  Message
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your project or question..."
                  rows={5}
                  disabled={status === 'submitting'}
                  data-testid="contact-message"
                  {...register('message')}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {status === 'error' && (
                <div
                  className="flex items-center gap-2 text-sm text-destructive"
                  data-testid="contact-error"
                >
                  <AlertCircle className="size-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={status === 'submitting'}
                data-testid="contact-submit"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 size-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </>
  );
}
