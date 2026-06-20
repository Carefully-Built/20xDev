'use client';

import { CrudResourceSheet } from '@carefully-built/crud';
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@carefully-built/ui';
import { useEffect, useId, useState } from 'react';

import type { api } from '@convex/_generated/api';
import type { FunctionArgs } from 'convex/server';

type ContactData = FunctionArgs<typeof api.functions.contacts.mutations.create>['data'];
type ContactStatus = ContactData['status'];

export interface ContactFormRecord {
  readonly company: string;
  readonly email?: string;
  readonly name: string;
  readonly notes?: string;
  readonly owner?: string;
  readonly phone?: string;
  readonly role?: string;
  readonly status: ContactStatus;
  readonly value?: number;
}

interface ContactFormValues {
  readonly company: string;
  readonly email: string;
  readonly name: string;
  readonly notes: string;
  readonly owner: string;
  readonly phone: string;
  readonly role: string;
  readonly status: ContactStatus;
  readonly value: string;
}

interface ContactFormSheetProps {
  readonly contact: ContactFormRecord | null;
  readonly loading: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: ContactData) => Promise<void>;
  readonly open: boolean;
}

const statusOptions: readonly { label: string; value: ContactStatus }[] = [
  { label: 'New', value: 'new' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Proposal', value: 'proposal' },
  { label: 'Customer', value: 'customer' },
];

const defaultValues: ContactFormValues = {
  company: '',
  email: '',
  name: '',
  notes: '',
  owner: '',
  phone: '',
  role: '',
  status: 'new',
  value: '',
};

function toFormValues(contact: ContactFormRecord | null): ContactFormValues {
  if (!contact) return defaultValues;

  return {
    company: contact.company,
    email: contact.email ?? '',
    name: contact.name,
    notes: contact.notes ?? '',
    owner: contact.owner ?? '',
    phone: contact.phone ?? '',
    role: contact.role ?? '',
    status: contact.status,
    value: contact.value === undefined ? '' : String(contact.value),
  };
}

function optionalText(value: string): string | undefined {
  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : undefined;
}

function buildContactData(values: ContactFormValues): ContactData {
  const parsedValue = Number(values.value);

  return {
    company: values.company.trim(),
    name: values.name.trim(),
    status: values.status,
    ...(optionalText(values.email) ? { email: optionalText(values.email) } : {}),
    ...(optionalText(values.notes) ? { notes: optionalText(values.notes) } : {}),
    ...(optionalText(values.owner) ? { owner: optionalText(values.owner) } : {}),
    ...(optionalText(values.phone) ? { phone: optionalText(values.phone) } : {}),
    ...(optionalText(values.role) ? { role: optionalText(values.role) } : {}),
    ...(values.value && Number.isFinite(parsedValue) ? { value: parsedValue } : {}),
  };
}

export function ContactFormSheet({
  contact,
  loading,
  onOpenChange,
  onSubmit,
  open,
}: ContactFormSheetProps): React.ReactElement {
  const formId = useId();
  const fieldIds = {
    company: `${formId}-company`,
    email: `${formId}-email`,
    name: `${formId}-name`,
    notes: `${formId}-notes`,
    owner: `${formId}-owner`,
    phone: `${formId}-phone`,
    role: `${formId}-role`,
    status: `${formId}-status`,
    value: `${formId}-value`,
  };
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    if (open) {
      setValues(toFormValues(contact));
    }
  }, [contact, open]);

  const updateValue = <TField extends keyof ContactFormValues>(
    field: TField,
    value: ContactFormValues[TField],
  ): void => {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  };

  return (
    <CrudResourceSheet
      formId={formId}
      open={open}
      onOpenChange={onOpenChange}
      title={contact ? 'Edit contact' : 'Add contact'}
      description={contact ? 'Update this contact.' : 'Create a new contact.'}
      confirmLabel={contact ? 'Save' : 'Add'}
      confirmDisabled={!values.name.trim() || !values.company.trim() || loading}
      confirmLoading={loading}
      onCancel={() => onOpenChange(false)}
      width={560}
    >
      <form
        id={formId}
        className="space-y-4 px-4 pb-4"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit(buildContactData(values));
        }}
      >
        <FormField fieldId={fieldIds.name} label="Name">
          <Input
            id={fieldIds.name}
            value={values.name}
            onChange={(event) => updateValue('name', event.target.value)}
          />
        </FormField>
        <FormField fieldId={fieldIds.company} label="Company">
          <Input
            id={fieldIds.company}
            value={values.company}
            onChange={(event) => updateValue('company', event.target.value)}
          />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField fieldId={fieldIds.role} label="Role">
            <Input
              id={fieldIds.role}
              value={values.role}
              onChange={(event) => updateValue('role', event.target.value)}
            />
          </FormField>
          <FormField fieldId={fieldIds.owner} label="Owner">
            <Input
              id={fieldIds.owner}
              value={values.owner}
              onChange={(event) => updateValue('owner', event.target.value)}
            />
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField fieldId={fieldIds.email} label="Email">
            <Input
              id={fieldIds.email}
              type="email"
              value={values.email}
              onChange={(event) => updateValue('email', event.target.value)}
            />
          </FormField>
          <FormField fieldId={fieldIds.phone} label="Phone">
            <Input
              id={fieldIds.phone}
              value={values.phone}
              onChange={(event) => updateValue('phone', event.target.value)}
            />
          </FormField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField fieldId={fieldIds.status} label="Status">
            <Select
              value={values.status}
              onValueChange={(value) => updateValue('status', value as ContactStatus)}
            >
              <SelectTrigger id={fieldIds.status} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField fieldId={fieldIds.value} label="Value">
            <Input
              id={fieldIds.value}
              min={0}
              type="number"
              value={values.value}
              onChange={(event) => updateValue('value', event.target.value)}
            />
          </FormField>
        </div>
        <FormField fieldId={fieldIds.notes} label="Notes">
          <Textarea
            id={fieldIds.notes}
            value={values.notes}
            onChange={(event) => updateValue('notes', event.target.value)}
          />
        </FormField>
      </form>
    </CrudResourceSheet>
  );
}

function FormField({
  children,
  fieldId,
  label,
}: {
  readonly children: React.ReactNode;
  readonly fieldId: string;
  readonly label: string;
}): React.ReactElement {
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      {children}
    </div>
  );
}
