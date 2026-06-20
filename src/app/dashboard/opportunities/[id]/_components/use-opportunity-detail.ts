'use client';

import { useMemo, useState } from 'react';

import { getOpportunity, pipeline } from '../../_data';
import type { EditableOpportunity, OpportunityFormValues } from './opportunity-types';

function getInitialValues(opportunity: EditableOpportunity): OpportunityFormValues {
  return {
    assignedUserName: opportunity.assignedUserName ?? '',
    notes: opportunity.notes ?? '',
    stageKey: opportunity.stageKey ?? pipeline.stages.at(0)?.key ?? '',
    status: opportunity.status ?? 'open',
    title: opportunity.title,
    value: String(opportunity.value ?? 0),
  };
}

function parseCurrencyInput(value: string): number {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function useOpportunityDetail(id: string) {
  const [opportunity, setOpportunity] = useState<EditableOpportunity | undefined>(() =>
    getOpportunity(id),
  );

  const stage = useMemo(
    () => pipeline.stages.find((item) => item.key === opportunity?.stageKey),
    [opportunity?.stageKey],
  );

  const saveOpportunity = (values: OpportunityFormValues): void => {
    setOpportunity((currentOpportunity) => {
      if (!currentOpportunity) return currentOpportunity;

      return {
        ...currentOpportunity,
        assignedUserName: values.assignedUserName.trim() || undefined,
        notes: values.notes.trim(),
        stageKey: values.stageKey,
        status: values.status,
        title: values.title.trim(),
        value: parseCurrencyInput(values.value),
      };
    });
  };

  return {
    formValues: opportunity ? getInitialValues(opportunity) : null,
    opportunity,
    saveOpportunity,
    stage,
  };
}
