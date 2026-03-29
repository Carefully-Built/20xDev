import type { PersonStatus } from '../_lib';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function getPersonStatusClasses(status: PersonStatus): string {
  switch (status) {
    case 'active buyer':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200/80';
    case 'nurturing':
      return 'bg-amber-50 text-amber-700 ring-amber-200/80';
    case 'champion':
      return 'bg-sky-50 text-sky-700 ring-sky-200/80';
    case 'at risk':
      return 'bg-rose-50 text-rose-700 ring-rose-200/80';
    default:
      return 'bg-muted text-muted-foreground ring-border';
  }
}
