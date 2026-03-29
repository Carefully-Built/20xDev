'use client';

import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, GripVertical, Pencil, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { Opportunity, OpportunityStage, OpportunityStageDefinition } from '../_lib';

import { formatCurrency } from './crm-utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { opportunityStages } from '../_lib';

interface OpportunityBoardProps {
  readonly opportunities: readonly Opportunity[];
}

export function OpportunityBoard({ opportunities }: OpportunityBoardProps): React.ReactElement {
  const [search, setSearch] = useState('');
  const [boardOpportunities, setBoardOpportunities] = useState<Opportunity[]>(() => [...opportunities]);
  const [activeOpportunityId, setActiveOpportunityId] = useState<string | null>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return boardOpportunities;
    }

    return boardOpportunities.filter((opportunity) =>
      [opportunity.title, opportunity.company, opportunity.contactName, opportunity.owner]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [boardOpportunities, search]);

  const groupedOpportunities = useMemo(
    () =>
      opportunityStages.map((stage) => ({
        ...stage,
        items: filteredOpportunities.filter((opportunity) => opportunity.stage === stage.id),
      })),
    [filteredOpportunities]
  );

  const handleDragStart = (event: DragStartEvent): void => {
    setActiveOpportunityId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;

    setActiveOpportunityId(null);

    if (!overId || activeId === overId) {
      return;
    }

    const targetStage = getStageFromId(overId, boardOpportunities);

    if (!targetStage) {
      return;
    }

    setBoardOpportunities((current) => moveOpportunity(current, activeId, targetStage, overId));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[18px] border border-border/70 bg-card px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[295px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Search"
              className="h-8 rounded-[11px] border-border bg-background pl-9 text-[13px] shadow-none"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-8 justify-between rounded-[11px] border-border px-3 text-[13px] font-normal shadow-none"
          >
            <span className="flex items-center gap-2">
              <span>Pipeline 1</span>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {groupedOpportunities.length}
              </span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-[18px] px-1 py-2">
            {groupedOpportunities.map((stage) => (
              <OpportunityColumn
                key={stage.id}
                stage={stage}
                selectedOpportunityId={selectedOpportunityId}
                activeOpportunityId={activeOpportunityId}
                onSelect={setSelectedOpportunityId}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}

interface OpportunityColumnProps {
  readonly stage: OpportunityStageDefinition & { readonly items: readonly Opportunity[] };
  readonly selectedOpportunityId: string | null;
  readonly activeOpportunityId: string | null;
  readonly onSelect: (opportunityId: string) => void;
}

function OpportunityColumn({
  stage,
  selectedOpportunityId,
  activeOpportunityId,
  onSelect,
}: OpportunityColumnProps): React.ReactElement {
  const droppable = useDroppable({
    id: getColumnId(stage.id),
  });

  return (
    <section className="w-[242px] shrink-0">
      <div className="mb-3 flex h-5 items-center gap-1.5 px-2">
        <span className={cn('size-[13px] rounded-full', stage.dotClassName)} />
        <span className="text-[13px] font-semibold tracking-[-0.02em] text-foreground">{stage.label}</span>
        <span className="rounded-md border border-border bg-muted px-1 text-[11px] leading-4 text-muted-foreground">
          {stage.items.length}
        </span>
      </div>

      <div
        ref={droppable.setNodeRef}
        className={cn(
          'min-h-[136px] rounded-[14px] transition-colors',
          droppable.isOver && 'bg-muted/40'
        )}
      >
        <SortableContext items={stage.items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {stage.items.map((opportunity) => (
              <SortableOpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                isSelected={selectedOpportunityId === opportunity.id}
                isDragging={activeOpportunityId === opportunity.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </section>
  );
}

interface SortableOpportunityCardProps {
  readonly opportunity: Opportunity;
  readonly isSelected: boolean;
  readonly isDragging: boolean;
  readonly onSelect: (opportunityId: string) => void;
}

function SortableOpportunityCard({
  opportunity,
  isSelected,
  isDragging,
  onSelect,
}: SortableOpportunityCardProps): React.ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: opportunity.id,
  });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        'rounded-[12px] border border-[#eeeff1] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all',
        'hover:-translate-y-px hover:border-border hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]',
        'cursor-pointer',
        isSelected && 'border-primary/40 ring-2 ring-primary/10',
        isDragging && 'opacity-70'
      )}
      onClick={() => {
        onSelect(opportunity.id);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(opportunity.id);
        }
      }}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          className="min-w-0 flex-1 truncate text-left text-[14px] font-medium tracking-[-0.02em] text-foreground underline decoration-border underline-offset-4"
          onClick={() => {
            onSelect(opportunity.id);
          }}
        >
          {opportunity.title}
        </button>
        <button
          type="button"
          aria-label={`Reorder ${opportunity.title}`}
          className="flex size-4 items-center justify-center text-muted-foreground"
          onClick={(event) => {
            event.stopPropagation();
          }}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label={`Edit ${opportunity.title}`}
          className="flex size-4 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(opportunity.id);
          }}
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label={`Delete ${opportunity.title}`}
          className="flex size-4 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 px-2 py-1.5 text-[11px] text-foreground">
        <div className="flex min-w-0 items-center gap-1.5 rounded-md px-1 py-0.5">
          <span className="flex size-3 items-center justify-center rounded-full bg-orange-500 text-[8px] font-semibold uppercase text-orange-50 ring-1 ring-black/5">
            {opportunity.contactInitials.slice(0, 1)}
          </span>
          <span className="truncate">{opportunity.contactName}</span>
        </div>
        <span className="shrink-0 text-[11px] text-muted-foreground">{formatCurrency(opportunity.amount)}</span>
      </div>
    </article>
  );
}

function getColumnId(stage: OpportunityStage): string {
  return `column-${stage}`;
}

function getStageFromId(id: string, opportunities: readonly Opportunity[]): OpportunityStage | null {
  if (id.startsWith('column-')) {
    return id.replace('column-', '') as OpportunityStage;
  }

  return opportunities.find((opportunity) => opportunity.id === id)?.stage ?? null;
}

function moveOpportunity(
  opportunities: readonly Opportunity[],
  activeId: string,
  targetStage: OpportunityStage,
  overId: string
): Opportunity[] {
  const next = opportunities.map((opportunity) =>
    opportunity.id === activeId ? { ...opportunity, stage: targetStage } : { ...opportunity }
  );

  const activeIndex = next.findIndex((opportunity) => opportunity.id === activeId);

  if (activeIndex === -1) {
    return [...opportunities];
  }

  const [activeOpportunity] = next.splice(activeIndex, 1);

  if (!activeOpportunity) {
    return [...opportunities];
  }

  const insertAtEnd = overId === getColumnId(targetStage);

  if (insertAtEnd) {
    const insertionIndex = findLastStageIndex(next, targetStage);
    next.splice(insertionIndex + 1, 0, activeOpportunity);
    return next;
  }

  const overIndex = next.findIndex((opportunity) => opportunity.id === overId);

  if (overIndex === -1) {
    next.push(activeOpportunity);
    return next;
  }

  next.splice(overIndex, 0, activeOpportunity);
  return next;
}

function findLastStageIndex(opportunities: readonly Opportunity[], stage: OpportunityStage): number {
  for (let index = opportunities.length - 1; index >= 0; index -= 1) {
    if (opportunities[index]?.stage === stage) {
      return index;
    }
  }

  return opportunities.length - 1;
}
