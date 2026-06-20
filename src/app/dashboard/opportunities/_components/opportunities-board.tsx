'use client';

import { DashboardPageLayout } from '@carefully-built/app-shell';
import { buildKanbanColumns, KanbanBoard, type KanbanItem } from '@carefully-built/kanban';
import { TableToolbar } from '@carefully-built/ui';
import { UserRound, Workflow } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { opportunities as initialOpportunities, pipeline } from '../_data';

export function OpportunitiesBoard(): React.ReactElement {
  const router = useRouter();
  const [items, setItems] = useState<KanbanItem[]>(() => [...initialOpportunities]);
  const [draggedItem, setDraggedItem] = useState<KanbanItem | null>(null);
  const [dropStageKey, setDropStageKey] = useState<string | null>(null);
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

  return (
    <DashboardPageLayout title="Opportunities">
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
    </DashboardPageLayout>
  );
}
