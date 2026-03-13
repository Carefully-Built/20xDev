import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How 20x Step collects, uses, and protects personal information.',
};

export default function PrivacyPage(): React.ReactElement {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <div className="space-y-6 text-muted-foreground">
        <p>
          We collect the information required to operate 20x Step, support customer accounts,
          process payments, improve the product, and communicate important service updates. This
          policy explains what we collect, why we collect it, and the choices available to you.
        </p>
        <h2 className="text-2xl font-semibold text-foreground">1. Information Collection</h2>
        <p>
          We may collect account details such as your name, email address, organization name, and
          billing information. We also collect limited technical data such as browser type, device
          information, IP address, and product usage events so we can keep the service secure and
          reliable.
        </p>
        <h2 className="text-2xl font-semibold text-foreground">2. Use of Information</h2>
        <p>
          We use personal information to create and manage accounts, authenticate users, deliver
          product functionality, process transactions, respond to support requests, send
          administrative notices, and understand how the product is used so we can improve it.
        </p>
        <h2 className="text-2xl font-semibold text-foreground">3. Data Security</h2>
        <p>
          We use commercially reasonable safeguards to protect personal information against
          unauthorized access, disclosure, or loss. No internet-based service can be guaranteed
          completely secure, but we continuously monitor and improve our security practices.
        </p>
        <h2 className="text-2xl font-semibold text-foreground">4. Cookies</h2>
        <p>
          We use cookies and similar technologies to keep you signed in, remember preferences,
          measure performance, and understand product usage. You can control cookies through your
          browser settings, although disabling some cookies may affect how the service works.
        </p>
        <p>
          If you have questions about this policy or want to request access, correction, or
          deletion of your information, contact the team through the support channel listed on the
          site.
        </p>
      </div>
    </div>
  );
}
