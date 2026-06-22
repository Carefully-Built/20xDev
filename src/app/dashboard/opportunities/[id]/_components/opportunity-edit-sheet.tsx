'use client';

import { ResponsiveSheet } from '@carefully-built/saas-kit';
import { CustomForm, CustomUserPickerField, SchemaForm, type SchemaFormField } from '@carefully-built/saas-kit/forms';
import { RichTextEditor } from '@carefully-built/saas-kit/rich-text';
import { useId } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import type { Doc } from '@convex/_generated/dataModel';

import { pipeline } from '../../_data';
import type { OpportunityFormValues } from './opportunity-types';

type User = Doc<'users'>;

const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Won', value: 'won' },
  { label: 'Lost', value: 'lost' },
] as const;

const formSchema: z.ZodType<OpportunityFormValues> = z.object({
  assignedUserName: z.string(),
  notes: z.string(),
  stageKey: z.string().min(1, 'Select a stage'),
  status: z.enum(['open', 'won', 'lost']),
  title: z.string().min(1, 'Name is required'),
  value: z.string(),
});

const fields: readonly SchemaFormField<OpportunityFormValues>[] = [
  { name: 'title', label: 'Name' },
  { name: 'value', label: 'Value', min: 0, type: 'number' },
  {
    name: 'stageKey',
    label: 'Stage',
    type: 'select',
    options: pipeline.stages.map((stage) => ({ label: stage.name, value: stage.key })),
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: statusOptions,
  },
];

async function improveRichTextDocument(serializedDocument: string): Promise<string> {
  const response = await fetch('/api/ai/improve-markdown', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document: JSON.parse(serializedDocument) as unknown }),
  });

  const body = (await response.json()) as {
    readonly document?: unknown;
    readonly error?: string;
  };

  if (!response.ok || !body.document) {
    throw new Error(body.error ?? 'Could not improve text');
  }

  return JSON.stringify(body.document);
}

interface OpportunityEditSheetProps {
  readonly confirmLabel?: string;
  readonly initialValues: OpportunityFormValues | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (values: OpportunityFormValues) => void;
  readonly open: boolean;
  readonly title?: string;
  readonly users: readonly User[];
}

function userOptions(users: readonly User[]) {
  return users.map((user) => ({
    value: user.name ?? user.email,
    label: user.name ?? user.email,
    email: user.email,
    imageUrl: user.imageUrl,
  }));
}

export function OpportunityEditSheet({
  confirmLabel = 'Save',
  initialValues,
  onOpenChange,
  onSave,
  open,
  title = 'Edit opportunity',
  users,
}: OpportunityEditSheetProps): React.ReactElement | null {
  const formId = useId();

  if (!initialValues) return null;

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
      title={title}
      confirmLabel={confirmLabel}
      onCancel={() => onOpenChange(false)}
      onConfirm={submitForm}
      width={560}
    >
      <CustomForm
        key={`${open}-${initialValues.title}-${initialValues.stageKey}`}
        id={formId}
        schema={formSchema}
        defaultValues={initialValues}
        className="space-y-4 pb-4"
        onSubmit={(values) => {
          onSave(values);
          onOpenChange(false);
        }}
      >
        {(methods) => (
          <>
            <SchemaForm fields={fields} />
            <CustomUserPickerField<OpportunityFormValues>
              name="assignedUserName"
              label="Owner"
              mode="single"
              options={userOptions(users)}
              placeholder="Assign an owner"
            />
            <RichTextEditor
              label="Notes"
              value={methods.watch('notes')}
              onChange={(value) => methods.setValue('notes', value, { shouldDirty: true })}
              placeholder="Write long-form notes..."
              improveText={improveRichTextDocument}
              onImproveError={() => {
                toast.error('Could not improve the notes');
              }}
              improveLabel="Improve"
              improvingLabel="Improving..."
            />
          </>
        )}
      </CustomForm>
    </ResponsiveSheet>
  );
}
