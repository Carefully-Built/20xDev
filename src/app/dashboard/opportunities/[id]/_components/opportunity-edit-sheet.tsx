'use client';

import {
  Input,
  Label,
  ResponsiveSheet,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@carefully-built/ui';
import { useEffect, useId, useState } from 'react';

import { pipeline } from '../../_data';
import type { OpportunityFormValues } from './opportunity-types';

const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Won', value: 'won' },
  { label: 'Lost', value: 'lost' },
] as const;

interface OpportunityEditSheetProps {
  readonly initialValues: OpportunityFormValues | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (values: OpportunityFormValues) => void;
  readonly open: boolean;
}

export function OpportunityEditSheet({
  initialValues,
  onOpenChange,
  onSave,
  open,
}: OpportunityEditSheetProps): React.ReactElement | null {
  const formId = useId();
  const fieldIds = {
    notes: `${formId}-notes`,
    owner: `${formId}-owner`,
    stage: `${formId}-stage`,
    status: `${formId}-status`,
    title: `${formId}-title`,
    value: `${formId}-value`,
  };
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    if (open) {
      setValues(initialValues);
    }
  }, [initialValues, open]);

  if (!values) return null;

  const updateValue = <TField extends keyof OpportunityFormValues>(
    field: TField,
    value: OpportunityFormValues[TField],
  ): void => {
    setValues((currentValues) => (currentValues ? { ...currentValues, [field]: value } : null));
  };

  const submitForm = (): void => {
    const form = document.getElementById(formId);

    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
    }
  };

  return (
    <ResponsiveSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Edit opportunity"
      description="Update the fields shown on this detail page."
      confirmLabel="Save"
      confirmDisabled={!values.title.trim()}
      onCancel={() => onOpenChange(false)}
      onConfirm={submitForm}
      width={560}
    >
      <form
        id={formId}
        className="space-y-4 px-4 pb-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(values);
          onOpenChange(false);
        }}
      >
        <FormField label="Name" fieldId={fieldIds.title}>
          <Input
            id={fieldIds.title}
            value={values.title}
            onChange={(event) => updateValue('title', event.target.value)}
          />
        </FormField>
        <FormField label="Value" fieldId={fieldIds.value}>
          <Input
            id={fieldIds.value}
            min={0}
            type="number"
            value={values.value}
            onChange={(event) => updateValue('value', event.target.value)}
          />
        </FormField>
        <FormField label="Stage" fieldId={fieldIds.stage}>
          <Select value={values.stageKey} onValueChange={(value) => updateValue('stageKey', value)}>
            <SelectTrigger id={fieldIds.stage} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pipeline.stages.map((stage) => (
                <SelectItem key={stage.key} value={stage.key}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Status" fieldId={fieldIds.status}>
          <Select
            value={values.status}
            onValueChange={(value) => updateValue('status', value as OpportunityFormValues['status'])}
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
        <FormField label="Owner" fieldId={fieldIds.owner}>
          <Input
            id={fieldIds.owner}
            value={values.assignedUserName}
            onChange={(event) => updateValue('assignedUserName', event.target.value)}
          />
        </FormField>
        <FormField label="Notes" fieldId={fieldIds.notes}>
          <Textarea
            id={fieldIds.notes}
            value={values.notes}
            onChange={(event) => updateValue('notes', event.target.value)}
          />
        </FormField>
      </form>
    </ResponsiveSheet>
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
