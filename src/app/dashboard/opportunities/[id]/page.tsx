import { OpportunityDetail } from './_components/opportunity-detail';

interface PageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function OpportunityPage({ params }: PageProps): Promise<React.ReactElement> {
  const { id } = await params;
  return <OpportunityDetail id={id} />;
}
