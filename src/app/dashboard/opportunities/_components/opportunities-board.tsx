'use client';

import { DashboardPageLayout, ResponsivePageActions } from '@carefully-built/saas-kit/app-shell';
import { buildKanbanColumns, KanbanBoard, type KanbanItem } from '@carefully-built/saas-kit/kanban';
import { TableToolbar } from '@carefully-built/saas-kit';
import { Plus, UserRound, Workflow } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { opportunities as initialOpportunities, pipeline } from '../_data';
import { OpportunityEditSheet } from '../[id]/_components/opportunity-edit-sheet';
import type { OpportunityFormValues } from '../[id]/_components/opportunity-types';

const emptyOpportunityValues: OpportunityFormValues = {
  assignedUserName: '',
  notes: '',
  stageKey: pipeline.stages.at(0)?.key ?? '',
  status: 'open',
  title: '',
  value: '',
};

export function OpportunitiesBoard(): React.ReactElement {
  const router = useRouter();
  const [items, setItems] = useState<KanbanItem[]>(() => [...initialOpportunities]);
  const [draggedItem, setDraggedItem] = useState<KanbanItem | null>(null);
  const [dropStageKey, setDropStageKey] = useState<string | null>(null);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedOwner, setSelectedOwner] = useState('all');
  const ownerOptions = useMemo(
    () =>
      [
        ...new Set(items.flatMap((item) => (item.assignedUserName ? [item.assignedUserName] : []))),
      ].map((owner) => ({
        label: owner,
        value: owner,
      })),
    [items],
  );
  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const normalizedSearch = search.trim().toLocaleLowerCase();
        const matchesSearch =
          !normalizedSearch ||
          [item.title, item.assignedUserName, item.notes]
            .flatMap((value) => (value ? [value] : []))
            .some((value) => value.toLocaleLowerCase().includes(normalizedSearch));
        const matchesStage = selectedStage === 'all' || item.stageKey === selectedStage;
        const matchesOwner =
          selectedOwner === 'all' || item.assignedUserName === selectedOwner;

        return matchesSearch && matchesStage && matchesOwner;
      }),
    [items, search, selectedOwner, selectedStage],
  );
  const columns = useMemo(
    () => buildKanbanColumns({ items: filteredItems, pipeline }),
    [filteredItems],
  );

  function moveOpportunity(itemId: string, stageKey: string): void {
    setItems((current) =>
      current.map((item) => (item._id === itemId ? { ...item, stageKey } : item)),
    );
  }

  function createOpportunity(values: OpportunityFormValues): void {
    const value = Number(values.value);

    setItems((currentItems) => [
      {
        _id: `opp-${Date.now()}`,
        assignedUserName: values.assignedUserName.trim() || undefined,
        associations: [],
        notes: values.notes.trim(),
        pipelineKey: pipeline.key,
        stageKey: values.stageKey,
        status: values.status,
        title: values.title.trim(),
        value: Number.isFinite(value) ? value : 0,
      },
      ...currentItems,
    ]);
  }

  return (
    <DashboardPageLayout
      title="Opportunities"
      actions={
        <ResponsivePageActions
          primaryAction={{
            icon: <Plus className="size-4" />,
            label: 'Add opportunity',
            onClick: () => setIsCreateSheetOpen(true),
          }}
        />
      }
    >
      <TableToolbar
        search={{ value: search, onChange: setSearch, placeholder: 'Search opportunities...' }}
        filters={[
          {
            config: {
              key: 'stage',
              label: 'Stage',
              icon: Workflow,
              options: pipeline.stages.map((stage) => ({
                label: stage.name,
                value: stage.key,
              })),
            },
            value: selectedStage,
            onChange: setSelectedStage,
          },
          {
            config: {
              key: 'owner',
              label: 'Owner',
              icon: UserRound,
              options: ownerOptions,
            },
            value: selectedOwner,
            onChange: setSelectedOwner,
          },
        ]}
        onClearAll={() => {
          setSearch('');
          setSelectedStage('all');
          setSelectedOwner('all');
        }}
        getDraftResultCount={(draftValues) =>
          items.filter((item) => {
            const draftStage = draftValues.stage ?? selectedStage;
            const draftOwner = draftValues.owner ?? selectedOwner;
            return (
              (draftStage === 'all' || item.stageKey === draftStage) &&
              (draftOwner === 'all' || item.assignedUserName === draftOwner)
            );
          }).length
        }
      />
      <KanbanBoard
        columns={columns}
        draggedItemId={draggedItem?._id ?? null}
        dragSourceStageKey={draggedItem?.stageKey ?? null}
        dropStageKey={dropStageKey}
        onDragStart={(item) => {
          setDraggedItem(item);
        }}
        onDragEnd={() => {
          setDraggedItem(null);
          setDropStageKey(null);
        }}
        onEdit={(id) => {
          router.push(`/dashboard/opportunities/${id}`);
        }}
        onMoveItem={moveOpportunity}
        onStageDragOver={(stageKey) => {
          setDropStageKey(stageKey);
        }}
        onStageDragLeave={(stageKey) => {
          setDropStageKey((current) => (current === stageKey ? null : current));
        }}
        onStageDrop={(stageKey) => {
          if (draggedItem) {
            moveOpportunity(draggedItem._id, stageKey);
          }
          setDraggedItem(null);
          setDropStageKey(null);
        }}
        itemLabel="opportunity"
        totalLabel="Pipeline"
      />
      <OpportunityEditSheet
        initialValues={emptyOpportunityValues}
        open={isCreateSheetOpen}
        title="Add opportunity"
        description="Create a new opportunity on the board."
        confirmLabel="Add"
        onOpenChange={setIsCreateSheetOpen}
        onSave={createOpportunity}
      />
    </DashboardPageLayout>
  );
}
