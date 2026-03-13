import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'The terms that govern access to and use of 20x Step.',
};

export default function TermsPage(): React.ReactElement {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Terms and Conditions</h1>
      <div className="space-y-6 text-muted-foreground">
        <p>
          These terms govern your access to and use of 20x Step. By creating an account,
          purchasing a subscription, or using the service, you agree to these terms and to the
          policies referenced within them.
        </p>
        <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
        <p>
          You must use the service in compliance with applicable laws and in a way that does not
          interfere with the security, integrity, or availability of the product for others.
        </p>
        <h2 className="text-2xl font-semibold text-foreground">2. Use License</h2>
        <p>
          Subject to your subscription and these terms, we grant you a limited, non-exclusive,
          non-transferable right to use the service for your internal business purposes. You may
          not resell, reverse engineer, or misuse the platform unless such restrictions are
          prohibited by law.
        </p>
        <h2 className="text-2xl font-semibold text-foreground">3. Disclaimer</h2>
        <p>
          We work to provide a reliable service, but availability and functionality may change over
          time. Except where prohibited by law, the service is provided on an as-available basis
          without warranties of uninterrupted operation or fitness for a particular purpose.
        </p>
        <h2 className="text-2xl font-semibold text-foreground">4. Limitations</h2>
        <p>
          To the extent permitted by law, we are not liable for indirect, incidental, special, or
          consequential damages arising from your use of the service. Our aggregate liability for
          claims related to the service will not exceed the amount paid by you in the preceding
          twelve months.
        </p>
        <p>
          We may update these terms from time to time. When changes materially affect your use of
          the service, we will post the revised terms on this page and update the effective date in
          the site footer or relevant notice area.
        </p>
      </div>
    </div>
  );
}
