import type { AssociationPickerLabelsInput } from '@carefully-built/saas-kit/association-picker';
import type { DocumentCardLabelsInput } from '@carefully-built/saas-kit/files';
import type { CreateOrganizationLabelsInput } from '@carefully-built/saas-kit/workos';
import type { TableToolbarLabelsInput } from '@carefully-built/saas-kit';

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
  filtersButtonLabel: 'Filtri',
  filtersTitle: 'Filtri',
  filtersDescription: 'Filtra i risultati con i criteri disponibili.',
  clearFiltersLabel: 'Azzera',
  showResultsLabel: (resultCount) =>
    typeof resultCount === 'number'
      ? `Mostra ${resultCount} risultati`
      : 'Mostra risultati',
  rangeMinPlaceholder: 'Min',
  rangeMaxPlaceholder: 'Max',
} satisfies TableToolbarLabelsInput;

export function buildItalianAllOptionLabel(label: string): string {
  return `Tutti: ${label}`;
}

export const associationPickerLabels = {
  allTypesLabel: 'Tutti',
  createLabel: 'Crea',
  createEntityLabel: (entityTypeLabel) => `Crea ${entityTypeLabel.toLocaleLowerCase('it-IT')}`,
  entityTypeLabels: {
    contact: 'Contatto',
    opportunity: 'Opportunita',
    document: 'Documento',
    note: 'Nota',
    activity: 'Attivita',
  },
} satisfies AssociationPickerLabelsInput;

export const smartTableActionLabels = {
  view: 'Visualizza',
  edit: 'Modifica',
  delete: 'Elimina',
};

export const notesCrudLabels = {
  addNoteLabel: 'Aggiungi nota',
  searchPlaceholder: 'Cerca note...',
  addSheetTitle: 'Aggiungi nota',
  editSheetTitle: 'Modifica nota',
  addConfirmLabel: 'Aggiungi',
  saveConfirmLabel: 'Salva modifiche',
  deleteLabel: 'Elimina',
  titleFieldLabel: 'Titolo',
  titlePlaceholder: 'Titolo della nota',
  bodyFieldLabel: 'Corpo',
  bodyPlaceholder: 'Scrivi la nota...',
  grid: {
    noResultsTitle: 'Nessuna nota trovata',
    noResultsSubtitle: 'Prova a modificare ricerca o filtri.',
    emptyTitle: 'Nessuna nota',
    emptySubtitle: 'Aggiungi una nota per raccogliere contesto utile.',
    addNoteLabel: 'Aggiungi nota',
  },
} satisfies NotesCrudLabelsInput;

export const createOrganizationLabels = {
  triggerLabel: 'Crea organizzazione',
  title: 'Crea organizzazione',
  description: 'Crea una nuova organizzazione per invitare il tuo team e collaborare.',
  confirmLabel: 'Crea',
} satisfies CreateOrganizationLabelsInput;

export const documentCardLabels = {
  pendingTitle: 'Documento in preparazione',
  pendingDescription: 'Il documento sara disponibile appena il caricamento termina.',
  activePublicLinkLabel: 'Link pubblico attivo',
  uploadedFileLabel: (fileCount) => `${fileCount} file caricati`,
  documentFallbackLabel: 'Documento',
  linkSourceLabel: 'Link',
  editActionLabel: 'Modifica',
  copyLinkActionLabel: 'Copia link',
  downloadActionLabel: 'Scarica file',
  deleteActionLabel: 'Elimina',
  locale: 'it-IT',
} satisfies DocumentCardLabelsInput;

export const fileUploadSheetLabels = {
  title: 'Carica file',
  confirmLabel: 'Carica',
  browseLabel: 'Sfoglia file',
  dropzoneTitle: 'Trascina qui il file o scegli dal computer',
  previewAlt: 'Anteprima file',
  helperText: 'PDF, immagini o documenti.',
};
