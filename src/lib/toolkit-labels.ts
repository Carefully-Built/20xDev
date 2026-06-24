import type { TableToolbarLabelsInput } from '@carefully-built/saas-kit';
import type { AssociationPickerLabelsInput } from '@carefully-built/saas-kit/association-picker';
import type { DocumentCardLabelsInput } from '@carefully-built/saas-kit/files';
import type { CreateOrganizationLabelsInput } from '@carefully-built/saas-kit/workos';

interface NotesCrudLabelsInput {
  readonly addNoteLabel?: string;
  readonly searchPlaceholder?: string;
  readonly addSheetTitle?: string;
  readonly editSheetTitle?: string;
  readonly addConfirmLabel?: string;
  readonly saveConfirmLabel?: string;
  readonly deleteLabel?: string;
  readonly titleFieldLabel?: string;
  readonly titlePlaceholder?: string;
  readonly bodyFieldLabel?: string;
  readonly bodyPlaceholder?: string;
  readonly grid?: {
    readonly noResultsTitle?: string;
    readonly noResultsSubtitle?: string;
    readonly emptyTitle?: string;
    readonly emptySubtitle?: string;
    readonly addNoteLabel?: string;
  };
}

export const tableToolbarLabels = {
  filtersButtonLabel: 'Filters',
  filtersTitle: 'Filters',
  filtersDescription: 'Narrow the list using the available criteria.',
  clearFiltersLabel: 'Clear',
  showResultsLabel: (resultCount) =>
    typeof resultCount === 'number'
      ? `Show ${String(resultCount)} results`
      : 'Show results',
  rangeMinPlaceholder: 'Min',
  rangeMaxPlaceholder: 'Max',
} satisfies TableToolbarLabelsInput;

export function buildAllOptionLabel(label: string): string {
  return `All: ${label}`;
}

export const associationPickerLabels = {
  allTypesLabel: 'All',
  createLabel: 'Create',
  createEntityLabel: (entityTypeLabel) => `Create ${entityTypeLabel.toLocaleLowerCase('en-US')}`,
  entityTypeLabels: {
    contact: 'Contact',
    opportunity: 'Opportunity',
    document: 'Document',
    note: 'Note',
    activity: 'Activity',
  },
} satisfies AssociationPickerLabelsInput;

export const smartTableActionLabels = {
  view: 'View',
  edit: 'Edit',
  delete: 'Delete',
};

export const notesCrudLabels = {
  addNoteLabel: 'Add note',
  searchPlaceholder: 'Search notes...',
  addSheetTitle: 'Add note',
  editSheetTitle: 'Edit note',
  addConfirmLabel: 'Add',
  saveConfirmLabel: 'Save changes',
  deleteLabel: 'Delete',
  titleFieldLabel: 'Title',
  titlePlaceholder: 'Note title',
  bodyFieldLabel: 'Body',
  bodyPlaceholder: 'Write the note...',
  grid: {
    noResultsTitle: 'No notes found',
    noResultsSubtitle: 'Try changing your search or filters.',
    emptyTitle: 'No notes yet',
    emptySubtitle: 'Add a note to collect useful context.',
    addNoteLabel: 'Add note',
  },
} satisfies NotesCrudLabelsInput;

export const createOrganizationLabels = {
  triggerLabel: 'Create organization',
  title: 'Create organization',
  description: 'Create a new organization to invite your team and collaborate.',
  confirmLabel: 'Create',
} satisfies CreateOrganizationLabelsInput;

export const documentCardLabels = {
  pendingTitle: 'Document preparing',
  pendingDescription: 'The document will be available as soon as the upload finishes.',
  activePublicLinkLabel: 'Public link active',
  uploadedFileLabel: (fileCount) =>
    `${String(fileCount)} uploaded file${fileCount === 1 ? '' : 's'}`,
  documentFallbackLabel: 'Document',
  linkSourceLabel: 'Link',
  editActionLabel: 'Edit',
  copyLinkActionLabel: 'Copy link',
  downloadActionLabel: 'Download file',
  deleteActionLabel: 'Delete',
  locale: 'en-US',
} satisfies DocumentCardLabelsInput;

export const fileUploadSheetLabels = {
  title: 'Upload file',
  confirmLabel: 'Upload',
  browseLabel: 'Browse files',
  dropzoneTitle: 'Drop the file here or choose from your computer',
  previewAlt: 'File preview',
  helperText: 'PDFs, images, or documents.',
};
