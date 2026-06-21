'use client';

import { buildCustomFieldValuePayload, mapCustomFieldValuesToFormValues } from '@carefully-built/custom-fields';
import { CrudResourceSheet } from '@carefully-built/crud';
import {
  CustomCompactCurrencyField,
  CustomForm,
  CustomSelectField,
  CustomUserPickerField,
  SchemaForm,
  type SchemaFormField,
} from '@carefully-built/forms';
import { GooglePlacesAddressInput } from '@carefully-built/maps-ui';
import { Building2, Mail, MapPinned, Phone, Tag, UserRound } from 'lucide-react';
import { useId } from 'react';
import { z } from 'zod';

import type { api } from '@convex/_generated/api';
import type { Doc } from '@convex/_generated/dataModel';
import type { FunctionArgs } from 'convex/server';

type ContactData = FunctionArgs<typeof api.functions.contacts.mutations.create>['data'];
type ContactStatus = ContactData['status'];
type ContactCustomField = NonNullable<ContactData['customFields']>[number];
type User = Doc<'users'>;

const customFieldDefinitions = [
  { _id: 'lead_source', fieldType: 'single_select', label: 'Lead source' },
] as const;

const formSchema = z.object({
  address: z.string().optional(),
  company: z.string().min(1, 'Company is required'),
  email: z.email('Enter a valid email').or(z.literal('')),
  googlePlaceId: z.string().optional(),
  latitude: z.number().optional(),
  lead_source: z.string().optional(),
  longitude: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  notes: z.string().optional(),
  owner: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  status: z.enum(['new', 'qualified', 'proposal', 'customer']),
  value: z.union([z.number(), z.string(), z.undefined()]).optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

export interface ContactFormRecord {
  readonly address?: string;
  readonly company: string;
  readonly customFields?: readonly ContactCustomField[];
  readonly email?: string;
  readonly googlePlaceId?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly name: string;
  readonly notes?: string;
  readonly owner?: string;
  readonly phone?: string;
  readonly role?: string;
  readonly status: ContactStatus;
  readonly value?: number;
}

interface ContactFormSheetProps {
  readonly contact: ContactFormRecord | null;
  readonly loading: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (data: ContactData) => Promise<void>;
  readonly open: boolean;
  readonly users: readonly User[];
}

const fields: readonly SchemaFormField<ContactFormValues>[] = [
  { name: 'name', label: 'Name', labelIcon: UserRound },
  { name: 'company', label: 'Company', labelIcon: Building2 },
  { name: 'role', label: 'Role', className: 'sm:col-span-1' },
  { name: 'email', label: 'Email', labelIcon: Mail, type: 'email', className: 'sm:col-span-1' },
  { name: 'phone', label: 'Phone', labelIcon: Phone, type: 'tel', className: 'sm:col-span-1' },
  {
    name: 'status',
    label: 'Status',
    labelIcon: Tag,
    type: 'select',
    options: [
      { label: 'New', value: 'new' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'Proposal', value: 'proposal' },
      { label: 'Customer', value: 'customer' },
    ],
    className: 'sm:col-span-1',
  },
  { name: 'notes', label: 'Notes', type: 'textarea', className: 'sm:col-span-2' },
];

function optionalText(value: string | undefined): string | undefined {
  const trimmedValue = value?.trim();
  return trimmedValue || undefined;
}

function toFormValues(contact: ContactFormRecord | null): ContactFormValues {
  const customValues = mapCustomFieldValuesToFormValues(contact?.customFields);

  return {
    address: contact?.address ?? '',
    company: contact?.company ?? '',
    email: contact?.email ?? '',
    googlePlaceId: contact?.googlePlaceId ?? '',
    latitude: contact?.latitude,
    lead_source: typeof customValues.lead_source === 'string' ? customValues.lead_source : '',
    longitude: contact?.longitude,
    name: contact?.name ?? '',
    notes: contact?.notes ?? '',
    owner: contact?.owner ?? '',
    phone: contact?.phone ?? '',
    role: contact?.role ?? '',
    status: contact?.status ?? 'new',
    value: contact?.value,
  };
}

function toContactData(values: ContactFormValues): ContactData {
  const parsedValue = typeof values.value === 'number' ? values.value : Number(values.value);

  return {
    company: values.company.trim(),
    name: values.name.trim(),
    status: values.status,
    ...(optionalText(values.address) ? { address: optionalText(values.address) } : {}),
    ...(optionalText(values.email) ? { email: optionalText(values.email) } : {}),
    ...(optionalText(values.googlePlaceId) ? { googlePlaceId: optionalText(values.googlePlaceId) } : {}),
    ...(optionalText(values.notes) ? { notes: optionalText(values.notes) } : {}),
    ...(optionalText(values.owner) ? { owner: optionalText(values.owner) } : {}),
    ...(optionalText(values.phone) ? { phone: optionalText(values.phone) } : {}),
    ...(optionalText(values.role) ? { role: optionalText(values.role) } : {}),
    ...(Number.isFinite(parsedValue) ? { value: parsedValue } : {}),
    ...(typeof values.latitude === 'number' ? { latitude: values.latitude } : {}),
    ...(typeof values.longitude === 'number' ? { longitude: values.longitude } : {}),
    customFields: buildCustomFieldValuePayload(customFieldDefinitions, values),
  };
}

function userOptions(users: readonly User[]) {
  return users.map((user) => ({
    value: user.name ?? user.email,
    label: user.name ?? user.email,
    email: user.email,
    imageUrl: user.imageUrl,
  }));
}

export function ContactFormSheet({
  contact,
  loading,
  onOpenChange,
  onSubmit,
  open,
  users,
}: ContactFormSheetProps): React.ReactElement {
  const formId = useId();
  const defaultValues = toFormValues(contact);

  return (
    <CrudResourceSheet
      formId={formId}
      open={open}
      onOpenChange={onOpenChange}
      title={contact ? 'Edit contact' : 'Add contact'}
      description={contact ? 'Update this contact.' : 'Create a new contact.'}
      confirmLabel={contact ? 'Save' : 'Add'}
      confirmDisabled={loading}
      confirmLoading={loading}
      onCancel={() => onOpenChange(false)}
      width={620}
    >
      <CustomForm
        key={`${open}-${contact?.name ?? 'new'}-${contact?.company ?? ''}`}
        id={formId}
        schema={formSchema}
        defaultValues={defaultValues}
        className="space-y-4 px-4 pb-4"
        onSubmit={(values) => onSubmit(toContactData(values))}
      >
        {(methods) => (
          <>
            <SchemaForm fields={fields} className="grid gap-4 sm:grid-cols-2" />
            <div className="grid gap-4 sm:grid-cols-2">
              <CustomUserPickerField<ContactFormValues>
                name="owner"
                label="Owner"
                mode="single"
                options={userOptions(users)}
                placeholder="Assign an owner"
              />
              <CustomCompactCurrencyField<ContactFormValues>
                name="value"
                label="Value"
                placeholder="12k"
              />
            </div>
            <GooglePlacesAddressInput
              id={`${formId}-address`}
              label="Address"
              value={methods.watch('address') ?? ''}
              placeholder="Search an address"
              componentCountry="it"
              onValueChange={(value) => methods.setValue('address', value, { shouldDirty: true })}
              onPlaceSelect={(place) => {
                methods.setValue('address', place.address, { shouldDirty: true });
                methods.setValue('googlePlaceId', place.googlePlaceId, { shouldDirty: true });
                methods.setValue('latitude', place.latitude, { shouldDirty: true });
                methods.setValue('longitude', place.longitude, { shouldDirty: true });
              }}
            />
            <CustomSelectField<ContactFormValues>
              name="lead_source"
              label="Lead source"
              labelIcon={MapPinned}
              placeholder="Select source"
              options={[
                { label: 'Referral', value: 'Referral' },
                { label: 'Website', value: 'Website' },
                { label: 'Outbound', value: 'Outbound' },
              ]}
            />
          </>
        )}
      </CustomForm>
    </CrudResourceSheet>
  );
}
