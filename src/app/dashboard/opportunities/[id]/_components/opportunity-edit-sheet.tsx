'use client';

import { CrudResourceSheet } from '@carefully-built/crud';
import { CustomForm, SchemaForm, type SchemaFormField } from '@carefully-built/forms';
import { RichTextEditor } from '@carefully-built/rich-text';
import { useId } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { pipeline } from '../../_data';
import type { OpportunityFormValues } from './opportunity-types';

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
  { name: 'assignedUserName', label: 'Owner' },
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
  readonly description?: string;
  readonly initialValues: OpportunityFormValues | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (values: OpportunityFormValues) => void;
  readonly open: boolean;
  readonly title?: string;
}

export function OpportunityEditSheet({
  confirmLabel = 'Save',
  description = 'Update the fields shown on this detail page.',
  initialValues,
  onOpenChange,
  onSave,
  open,
  title = 'Edit opportunity',
}: OpportunityEditSheetProps): React.ReactElement | null {
  const formId = useId();

  if (!initialValues) return null;

  return (
    <CrudResourceSheet
      formId={formId}
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      onCancel={() => onOpenChange(false)}
      width={560}
    >
      <CustomForm
        key={`${open}-${initialValues.title}-${initialValues.stageKey}`}
        id={formId}
        schema={formSchema}
        defaultValues={initialValues}
        className="space-y-4 px-4 pb-4"
        onSubmit={(values) => {
          onSave(values);
          onOpenChange(false);
        }}
      >
        {(methods) => (
          <>
            <SchemaForm fields={fields} />
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
    </CrudResourceSheet>
  );
}
