import { ContactDetail } from './_components/contact-detail';

import type { Id } from '@convex/_generated/dataModel';

interface PageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function ContactPage({ params }: PageProps): Promise<React.ReactElement> {
  const { id } = await params;

  return <ContactDetail id={id as Id<'contacts'>} />;
}
