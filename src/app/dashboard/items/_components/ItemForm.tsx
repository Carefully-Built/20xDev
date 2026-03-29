'use client';

import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { CustomForm } from '@/components/forms/CustomForm';
import { CustomInputField } from '@/components/forms/CustomInputField';
import { CustomSelectField } from '@/components/forms/CustomSelectField';

const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']),
  priority: z.enum(['low', 'medium', 'high']),
});

export type ItemFormValues = z.infer<typeof itemSchema>;

interface ItemFormProps {
  readonly defaultValues?: Partial<ItemFormValues>;
  readonly onSubmit: (data: ItemFormValues) => void;
  readonly onCancel: () => void;
  readonly isLoading?: boolean;
}

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function ItemForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
}: ItemFormProps): React.ReactElement {
  const initialValues: ItemFormValues = {
    name: defaultValues?.name ?? '',
    description: defaultValues?.description ?? '',
    status: defaultValues?.status ?? 'draft',
    priority: defaultValues?.priority ?? 'medium',
  };

  return (
    <CustomForm
      schema={itemSchema}
      defaultValues={initialValues}
      onSubmit={onSubmit}
      className="flex h-full flex-col"
    >
      <div className="flex-1 space-y-4">
        <CustomInputField<ItemFormValues>
          name="name"
          label="Name"
          placeholder="Enter item name"
        />
        <CustomInputField<ItemFormValues>
          name="description"
          label="Description"
          placeholder="Enter description (optional)"
        />
        <CustomSelectField<ItemFormValues>
          name="status"
          label="Status"
          options={statusOptions}
          className="w-full"
        />
        <CustomSelectField<ItemFormValues>
          name="priority"
          label="Priority"
          options={priorityOptions}
          className="w-full"
        />
      </div>
      <div className="mt-6 flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </CustomForm>
  );
}
