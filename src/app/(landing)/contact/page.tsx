import type { Metadata } from 'next';

import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'Contact - Blueprint',
  description:
    'Get in touch with us. Send us a message and we will get back to you as soon as possible.',
};

export default function ContactPage(): React.ReactElement {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <ContactForm />
      </div>
    </section>
  );
}
