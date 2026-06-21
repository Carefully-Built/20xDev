'use client';

import { Avatar, AvatarFallback, Button, Chip, FieldDetailRow } from '@carefully-built/saas-kit';
import {
  Building2,
  CircleDollarSign,
  Mail,
  NotebookText,
  Pencil,
  Phone,
  UserRound,
} from 'lucide-react';

import type { Doc } from '@convex/_generated/dataModel';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

const statusLabels: Record<Doc<'contacts'>['status'], string> = {
  customer: 'Customer',
  new: 'New',
  proposal: 'Proposal',
  qualified: 'Qualified',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface ContactDetailSidebarProps {
  readonly contact: Doc<'contacts'>;
  readonly onEdit: () => void;
}

export function ContactDetailSidebar({
  contact,
  onEdit,
}: ContactDetailSidebarProps): React.ReactElement {
  return (
    <section className="bg-background h-full">
      <div className="mb-2 flex h-8 items-center justify-between gap-3">
        <div className="text-foreground flex items-center gap-2 text-sm font-medium">
          <UserRound className="text-muted-foreground size-4" />
          <span>Contact details</span>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" onClick={onEdit}>
          <Pencil className="size-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="border-border/60 bg-muted/20 flex items-center gap-3 rounded-[10px] border p-3">
          <Avatar size="lg">
            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-foreground truncate text-sm font-semibold">{contact.name}</p>
            <p className="text-muted-foreground truncate text-xs">{contact.company}</p>
          </div>
        </div>

        <div className="space-y-0">
          <FieldDetailRow icon={Building2} label="Company" value={contact.company} />
          <FieldDetailRow icon={UserRound} label="Role" value={contact.role ?? '-'} />
          <FieldDetailRow icon={Mail} label="Email" value={contact.email ?? '-'} />
          <FieldDetailRow icon={Phone} label="Phone" value={contact.phone ?? '-'} />
          <FieldDetailRow icon={UserRound} label="Owner" value={contact.owner ?? '-'} />
          <FieldDetailRow
            icon={NotebookText}
            label="Status"
            value={<Chip>{statusLabels[contact.status]}</Chip>}
          />
          <FieldDetailRow
            icon={CircleDollarSign}
            label="Value"
            value={currencyFormatter.format(contact.value ?? 0)}
          />
        </div>
      </div>
    </section>
  );
}
