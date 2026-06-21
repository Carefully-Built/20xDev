'use client';

import { Label } from '@carefully-built/saas-kit';
import { AssociationPicker, type AssociationPickerOption } from '@carefully-built/saas-kit/association-picker';
import { buildAssociationValue, getAssociationTypeLabel } from '@carefully-built/saas-kit/convex-platform';
import { NotesCrudPage, type NoteCrudValues, type NoteListItem } from '@carefully-built/saas-kit/notes';
import { RichTextEditor } from '@carefully-built/saas-kit/rich-text';
import { toast } from 'sonner';

import type { Id } from '@convex/_generated/dataModel';

import { useContactsByOrganization } from '@/hooks/use-contacts';
import {
  useCreateNote,
  useDeleteNote,
  useNotesByOrganization,
  useUpdateNote,
} from '@/hooks/use-notes';
import { useOrganization } from '@/providers';

interface DashboardNote extends NoteListItem {
  readonly id: Id<'notes'>;
}

interface StoredNoteAssociation {
  readonly entityId: string;
  readonly entityType: 'contact' | 'opportunity' | 'document' | 'file';
  readonly label: string;
  readonly typeLabel: string;
  readonly value: string;
}

interface NoteAssociationFieldProps {
  readonly associationOptions: readonly AssociationPickerOption[];
  readonly onChange: (value: readonly string[]) => void;
  readonly value: readonly string[];
}

interface NoteBodyFieldProps {
  readonly onChange: (value: string) => void;
  readonly value: string;
}

function toDashboardNote(note: {
  readonly _id: Id<'notes'>;
  readonly body: string;
  readonly associations?: readonly StoredNoteAssociation[];
  readonly title: string;
  readonly updatedAt: number;
  readonly visibility: 'public' | 'private';
}): DashboardNote {
  return {
    _id: String(note._id),
    associations: [...(note.associations ?? [])],
    body: note.body,
    id: note._id,
    title: note.title,
    updatedAt: note.updatedAt,
    visibility: note.visibility,
  };
}

function renderNoteBodyField({ value, onChange }: NoteBodyFieldProps): React.ReactNode {
  return (
    <RichTextEditor
      label="Body"
      value={value}
      onChange={onChange}
      placeholder="Write the note..."
      improveText={improveRichTextDocument}
      onImproveError={() => {
        toast.error('Could not improve the note');
      }}
      improveLabel="Improve"
      improvingLabel="Improving..."
    />
  );
}

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

function renderNoteAssociationField({
  associationOptions,
  onChange,
  value,
}: NoteAssociationFieldProps): React.ReactNode {
  return (
    <div className="space-y-2">
      <Label>Contact</Label>
      <AssociationPicker
        allowedEntityTypes={['contact']}
        maxSelections={1}
        onChange={onChange}
        options={[...associationOptions]}
        placeholder="Assign a contact"
        searchPlaceholder="Search contacts..."
        value={[...value]}
      />
    </div>
  );
}

export default function NotesPage(): React.ReactElement {
  const { organizationId } = useOrganization();
  const notes = useNotesByOrganization(organizationId);
  const contacts = useContactsByOrganization(organizationId);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const associationOptions: AssociationPickerOption[] = (contacts ?? []).map((contact) => ({
    entityId: String(contact._id),
    entityType: 'contact',
    label: contact.name,
    typeLabel: getAssociationTypeLabel('contact'),
    value: buildAssociationValue('contact', String(contact._id)),
  }));

  function resolveAssociations(values: readonly string[]): StoredNoteAssociation[] {
    return values.flatMap((value) => {
      const option = associationOptions.find((association) => association.value === value);
      if (option?.entityType !== 'contact') {
        return [];
      }

      return [
        {
          entityId: option.entityId,
          entityType: option.entityType,
          label: option.label,
          typeLabel: option.typeLabel,
          value: option.value,
        },
      ];
    });
  }

  function requireOrganization(): string {
    if (!organizationId) {
      throw new Error('No organization selected');
    }

    return organizationId;
  }

  async function create(values: NoteCrudValues): Promise<void> {
    await createNote({
      data: {
        ...values,
        associations: resolveAssociations(values.associations),
        visibility: 'public',
      },
      organizationId: requireOrganization(),
    });
    toast.success('Note added');
  }

  async function update(note: DashboardNote, values: NoteCrudValues): Promise<void> {
    await updateNote({
      data: { ...values, associations: resolveAssociations(values.associations) },
      id: note.id,
      organizationId: requireOrganization(),
    });
    toast.success('Note updated');
  }

  async function remove(note: DashboardNote): Promise<void> {
    await deleteNote({
      id: note.id,
      organizationId: requireOrganization(),
    });
    toast.success('Note deleted');
  }

  return (
    <NotesCrudPage
      isLoading={notes === undefined}
      notes={(notes ?? []).map(toDashboardNote)}
      onCreate={create}
      onDelete={remove}
      onUpdate={update}
      associationField={(props) => renderNoteAssociationField({ ...props, associationOptions })}
      bodyField={renderNoteBodyField}
    />
  );
}
