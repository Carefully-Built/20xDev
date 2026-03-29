import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CrmMetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly hint: string;
  readonly accentClassName?: string;
}

export function CrmMetricCard({
  label,
  value,
  hint,
  accentClassName,
}: CrmMetricCardProps): React.ReactElement {
  return (
    <Card className="border-0 bg-card/85 py-0 shadow-sm ring-1 ring-black/5 backdrop-blur-sm">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{hint}</p>
        </div>
        <div className={cn('mt-1 h-11 w-1.5 rounded-full bg-muted', accentClassName)} />
      </CardContent>
    </Card>
  );
}
