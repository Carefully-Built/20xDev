'use client';

import {
  buildCustomFieldValuePayload,
  mapCustomFieldValuesToFormValues,
} from '@carefully-built/saas-kit/custom-fields';
import {
  CustomCompactCurrencyField,
  CustomForm,
  CustomSelectField,
  CustomUserPickerField,
  FormFieldLabel,
  SchemaForm,
  type SchemaFormField,
} from '@carefully-built/saas-kit/forms';
import { loadGoogleMapsPlacesApi } from '@carefully-built/saas-kit/maps-ui';
import { ResponsiveSheet } from '@carefully-built/saas-kit';
import { Input } from '@carefully-built/saas-kit/ui';
import { Building2, Mail, MapPinned, Phone, Tag, UserRound } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import type { api } from '@convex/_generated/api';
import type { Doc } from '@convex/_generated/dataModel';
import type { FunctionArgs } from 'convex/server';

type ContactData = FunctionArgs<typeof api.functions.contacts.mutations.create>['data'];
type ContactStatus = ContactData['status'];
type ContactCustomField = NonNullable<ContactData['customFields']>[number];
type User = Doc<'users'>;

interface ContactAddressPrediction {
  readonly description: string;
  readonly placeId: string;
  readonly mainText: string;
  readonly secondaryText: string;
}

interface GooglePlaceDetailsResult {
  readonly formatted_address?: string;
  readonly geometry?: {
    readonly location?: {
      readonly lat: () => number;
      readonly lng: () => number;
    };
  };
  readonly place_id?: string;
}

interface GoogleAutocompleteService {
  getPlacePredictions: (
    request: {
      input: string;
      componentRestrictions?: { country: string };
      types?: readonly string[];
    },
    callback: (
      predictions:
        | readonly {
            description: string;
            place_id: string;
            structured_formatting?: {
              main_text?: string;
              secondary_text?: string;
            };
          }[]
        | null,
      status: string,
    ) => void,
  ) => void;
}

interface GooglePlacesService {
  getDetails: (
    request: { placeId: string; fields: readonly string[] },
    callback: (place: GooglePlaceDetailsResult | null, status: string) => void,
  ) => void;
}

interface GooglePlacesNamespace {
  readonly AutocompleteService?: new () => GoogleAutocompleteService;
  readonly PlacesService?: new (container: HTMLDivElement) => GooglePlacesService;
  readonly PlacesServiceStatus?: {
    readonly OK: string;
  };
}

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

interface ContactFormRecord {
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
  { name: 'role', label: 'Role' },
  { name: 'email', label: 'Email', labelIcon: Mail, type: 'email' },
  { name: 'phone', label: 'Phone', labelIcon: Phone, type: 'tel' },
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
  },
  { name: 'notes', label: 'Notes', type: 'textarea' },
];

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

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
    ...(optionalText(values.googlePlaceId)
      ? { googlePlaceId: optionalText(values.googlePlaceId) }
      : {}),
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

function ContactAddressField({
  formId,
  methods,
}: {
  readonly formId: string;
  readonly methods: UseFormReturn<ContactFormValues>;
}): React.ReactElement {
  const placesServiceRef = useRef<GooglePlacesService | null>(null);
  const autocompleteServiceRef = useRef<GoogleAutocompleteService | null>(null);
  const selectedAddressRef = useRef('');
  const [predictions, setPredictions] = useState<readonly ContactAddressPrediction[]>([]);
  const [open, setOpen] = useState(false);
  const addressValue = methods.watch('address') ?? '';

  useEffect(() => {
    if (!googleMapsApiKey) {
      return undefined;
    }

    let cancelled = false;

    void loadGoogleMapsPlacesApi(googleMapsApiKey)
      .then(() => {
        if (cancelled) {
          return;
        }

        const places = window.google?.maps?.places as GooglePlacesNamespace | undefined;
        const AutocompleteService = places?.AutocompleteService;
        const PlacesService = places?.PlacesService;

        if (!AutocompleteService || !PlacesService) {
          return;
        }

        autocompleteServiceRef.current = new AutocompleteService();
        placesServiceRef.current = new PlacesService(document.createElement('div'));
      })
      .catch(() => {
        // Keep the field usable when Google Places is unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const query = addressValue.trim();

    if (!query || query === selectedAddressRef.current || !autocompleteServiceRef.current) {
      setPredictions([]);
      setOpen(false);
      return undefined;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      autocompleteServiceRef.current?.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'it' },
          types: ['address'],
        },
        (results, status) => {
          if (cancelled) {
            return;
          }

          const places = window.google?.maps?.places as GooglePlacesNamespace | undefined;

          if (status !== places?.PlacesServiceStatus?.OK || !results?.length) {
            setPredictions([]);
            setOpen(false);
            return;
          }

          setPredictions(
            results.map((prediction) => ({
              description: prediction.description,
              placeId: prediction.place_id,
              mainText: prediction.structured_formatting?.main_text ?? prediction.description,
              secondaryText: prediction.structured_formatting?.secondary_text ?? '',
            })),
          );
          setOpen(true);
        },
      );
    }, 200);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [addressValue]);

  const handleAddressChange = useCallback(
    (value: string) => {
      selectedAddressRef.current = '';
      methods.setValue('address', value, { shouldDirty: true });
      methods.setValue('googlePlaceId', '', { shouldDirty: true });
      methods.setValue('latitude', undefined, { shouldDirty: true });
      methods.setValue('longitude', undefined, { shouldDirty: true });
    },
    [methods],
  );

  const handlePlaceSelect = useCallback(
    (prediction: ContactAddressPrediction) => {
      const applySelection = (place: GooglePlaceDetailsResult | null): void => {
        const location = place?.geometry?.location;
        const selectedAddress = place?.formatted_address ?? prediction.description;

        selectedAddressRef.current = selectedAddress;
        methods.setValue('address', selectedAddress, { shouldDirty: true });
        methods.setValue('googlePlaceId', place?.place_id ?? prediction.placeId, {
          shouldDirty: true,
        });
        methods.setValue('latitude', location?.lat(), { shouldDirty: true });
        methods.setValue('longitude', location?.lng(), { shouldDirty: true });
        setOpen(false);
        setPredictions([]);
      };

      if (!placesServiceRef.current) {
        applySelection(null);
        return;
      }

      placesServiceRef.current.getDetails(
        {
          placeId: prediction.placeId,
          fields: ['formatted_address', 'geometry', 'place_id'],
        },
        (place, status) => {
          const places = window.google?.maps?.places as GooglePlacesNamespace | undefined;

          if (status !== places?.PlacesServiceStatus?.OK) {
            applySelection(null);
            return;
          }

          applySelection(place);
        },
      );
    },
    [methods],
  );

  return (
    <div className="space-y-2">
      <FormFieldLabel htmlFor={`${formId}-address`} label="Address" icon={MapPinned} />
      <div className="relative">
        <MapPinned className="text-primary/70 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          id={`${formId}-address`}
          value={addressValue}
          placeholder="Search an address"
          className="pl-9"
          autoComplete="off"
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 150);
          }}
          onChange={(event) => handleAddressChange(event.target.value)}
          onFocus={() => setOpen(predictions.length > 0)}
        />
        {open && predictions.length > 0 ? (
          <div className="border-border bg-popover text-popover-foreground absolute top-full left-0 z-[60] mt-1.5 max-h-72 w-full overflow-y-auto rounded-[16px] border">
            {predictions.map((prediction) => (
              <button
                key={prediction.placeId}
                type="button"
                className="border-border/80 hover:bg-primary/8 flex w-full cursor-pointer flex-col border-t bg-transparent px-3.5 py-2.5 text-left text-sm first:border-t-0"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handlePlaceSelect(prediction)}
              >
                <span className="text-foreground font-medium">{prediction.mainText}</span>
                {prediction.secondaryText ? (
                  <span className="text-muted-foreground text-xs">{prediction.secondaryText}</span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
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

  function submitForm(): void {
    const form = document.getElementById(formId);

    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
    }
  }

  return (
    <ResponsiveSheet
      open={open}
      onOpenChange={onOpenChange}
      title={contact ? 'Edit contact' : 'Add contact'}
      confirmLabel={contact ? 'Save' : 'Add'}
      confirmDisabled={loading}
      confirmLoading={loading}
      onCancel={() => onOpenChange(false)}
      onConfirm={submitForm}
      width={560}
    >
      <CustomForm<ContactFormValues>
        key={`${open}-${contact?.name ?? 'new'}-${contact?.company ?? ''}`}
        id={formId}
        schema={formSchema}
        defaultValues={defaultValues}
        className="space-y-4 pb-4"
        onSubmit={(values) => onSubmit(toContactData(values))}
      >
        {(methods) => (
          <>
            <SchemaForm fields={fields} />
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
            <ContactAddressField formId={formId} methods={methods} />
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
    </ResponsiveSheet>
  );
}
