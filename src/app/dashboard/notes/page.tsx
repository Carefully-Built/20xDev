'use client';

import { AssociationPicker, type AssociationPickerOption } from '@carefully-built/association-picker';
import { NotesCrudPage, type NoteCrudValues, type NoteListItem } from '@carefully-built/notes';
import { Label } from '@carefully-built/ui';
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
    typeLabel: 'Contact',
    value: `contact:${contact._id}`,
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
      associationField={({ value, onChange }) => (
        <div className="space-y-2">
          <Label>Contact</Label>
          <AssociationPicker
            allowedEntityTypes={['contact']}
            maxSelections={1}
            onChange={onChange}
            options={associationOptions}
            placeholder="Assign a contact"
            searchPlaceholder="Search contacts..."
            value={[...value]}
          />
        </div>
      )}
    />
  );
}
