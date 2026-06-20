import type { AgendaActivityMutationPayload } from '@carefully-built/agenda';

import type { AssociationPickerOption } from '@carefully-built/association-picker';
import type { Id } from '@convex/_generated/dataModel';

import { activityTypes, defaultActivityType, type CalendarActivityType } from './calendar.constants';
import type { StoredActivityAssociation, StoredActivityData } from './calendar.types';

const storedAssociationEntityTypes = ['contact', 'opportunity', 'document', 'file'] as const;

function isStoredAssociationEntityType(entityType: string): entityType is StoredActivityAssociation['entityType'] {
  return storedAssociationEntityTypes.includes(
    entityType as StoredActivityAssociation['entityType'],
  );
}

function resolveActivityType(
  activityTypeId: string,
  availableActivityTypes: readonly CalendarActivityType[] = activityTypes,
): CalendarActivityType {
  return availableActivityTypes.find((type) => type._id === activityTypeId) ?? defaultActivityType;
}

export function resolveActivityAssociations(
  payloadAssociations: AgendaActivityMutationPayload['associations'] | undefined,
  options: readonly AssociationPickerOption[],
): StoredActivityData['associations'] {
  if (!payloadAssociations) {
    return undefined;
  }

  return payloadAssociations.flatMap((association) => {
    const option = options.find(
      (candidate) =>
        candidate.entityId === association.entityId &&
        candidate.entityType === association.entityType,
    );

    if (!option || !isStoredAssociationEntityType(option.entityType)) {
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

function stripUndefinedValues(data: StoredActivityData): StoredActivityData {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as StoredActivityData;
}

export function toStoredActivityPayload(
  payload: Partial<AgendaActivityMutationPayload>,
  associationOptions: readonly AssociationPickerOption[],
  availableActivityTypes: readonly CalendarActivityType[] = activityTypes,
): StoredActivityData {
  const activityType = payload.activityTypeId
    ? resolveActivityType(payload.activityTypeId, availableActivityTypes)
    : null;

  return stripUndefinedValues({
    title: payload.title,
    activityTypeId: payload.activityTypeId,
    activityTypeLabel: activityType?.label,
    activityTypeColor: activityType?.color,
    assignedUserId: payload.assignedUserId as Id<'users'> | undefined,
    participantUserIds: payload.participantUserIds as Id<'users'>[] | undefined,
    visibility: payload.visibility,
    associations: resolveActivityAssociations(payload.associations, associationOptions),
    tagIds: payload.tagIds ? [...payload.tagIds] : undefined,
    dueAt: payload.dueAt,
    startAt: payload.startAt,
    endAt: payload.endAt,
    description: payload.description,
    status: payload.status,
  });
}

export function buildActivityTypeOptions(
  availableActivityTypes: readonly CalendarActivityType[] = activityTypes,
) {
  return availableActivityTypes.map((type) => ({
    value: type._id,
    label: type.label,
    color: type.color,
  }));
}
