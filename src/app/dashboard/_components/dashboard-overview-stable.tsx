'use client';

import { SharedActivityCalendarWidget, type ActivityListItem } from '@carefully-built/agenda';
import { DashboardPageLayout } from '@carefully-built/app-shell';
import { EmptyStateCard, SmartTable, type Column } from '@carefully-built/ui';
import { DashboardWidget } from '@carefully-built/widgets';
import {
  Activity,
  CircleDollarSign,
  FileText,
  KanbanSquare,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { smartTableActionLabels } from '@/lib/toolkit-labels';

interface LeadRow {
  readonly id: string;
  readonly name: string;
  readonly company: string;
  readonly status: string;
  readonly owner: string;
}

const leadRows: LeadRow[] = [
  { id: 'lead-1', company: 'Northstar', name: 'Maya Chen', owner: 'Alessandro', status: 'Discovery' },
  { id: 'lead-2', company: 'Valeo', name: 'Jon Bell', owner: 'Sofia', status: 'Proposal' },
  { id: 'lead-3', company: 'Motive Works', name: 'Andre Martin', owner: 'Elena', status: 'Closing' },
];

const leadColumns: Column<LeadRow>[] = [
  { accessor: 'name', header: 'Name' },
  { accessor: 'company', header: 'Company' },
  { accessor: 'status', header: 'Status' },
  { accessor: 'owner', header: 'Owner' },
];

const pipelineStages = [
  { label: 'Discovery', value: 1 },
  { label: 'Proposal', value: 1 },
  { label: 'Closing', value: 1 },
];

const weeklyActivity = [
  { label: 'Mon', value: 3 },
  { label: 'Tue', value: 6 },
  { label: 'Wed', value: 4 },
  { label: 'Thu', value: 7 },
  { label: 'Fri', value: 5 },
];

const chartColors = ['#0ea5e9', '#14b8a6', '#22c55e', '#f59e0b'] as const;
const now = Date.now();
const hour = 60 * 60 * 1000;
const day = 24 * hour;

const dashboardActivities: ActivityListItem[] = [
  {
    _id: 'activity-1',
    activityTypeColor: '#0ea5e9',
    activityTypeId: 'call',
    activityTypeLabel: 'Call',
    associations: [
      {
        entityId: 'opp-1',
        entityType: 'opportunity',
        label: 'Northstar component rollout',
        typeLabel: 'Opportunity',
        value: 'opportunity:opp-1',
      },
    ],
    assignedUserId: 'user-1',
    assignedUserName: 'Alessandro',
    description: 'Review the dashboard foundation and component usage.',
    dueAt: now + 2 * hour,
    endAt: now + 3 * hour,
    participantUserIds: ['user-1'],
    participantUserNames: ['Alessandro'],
    startAt: now + 2 * hour,
    status: 'scheduled',
    title: 'Dashboard review',
    visibility: 'team',
  },
  {
    _id: 'activity-2',
    activityTypeColor: '#14b8a6',
    activityTypeId: 'demo',
    activityTypeLabel: 'Demo',
    associations: [],
    assignedUserId: 'user-2',
    assignedUserName: 'Sofia',
    description: 'Show searchable CRM, files, notes, and dashboard cards.',
    dueAt: now + day + 4 * hour,
    endAt: now + day + 5 * hour,
    participantUserIds: ['user-1', 'user-2'],
    participantUserNames: ['Alessandro', 'Sofia'],
    startAt: now + day + 4 * hour,
    status: 'scheduled',
    title: 'SaaS kit demo',
    visibility: 'team',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

function getChartColor(index: number): string {
  return chartColors[index % chartColors.length] ?? chartColors[0];
}

function PipelineStagesWidget(): React.ReactElement {
  return (
    <DashboardWidget icon={TrendingUp} title="Pipeline stages" contentClassName="pt-3">
      <div className="grid min-h-[292px] grid-cols-1 items-center gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
        <div className="h-[240px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  borderColor: 'var(--border)',
                  borderRadius: 10,
                  boxShadow: 'none',
                }}
              />
              <Pie
                cx="50%"
                cy="50%"
                data={pipelineStages}
                dataKey="value"
                innerRadius="58%"
                nameKey="label"
                outerRadius="82%"
                strokeWidth={0}
              >
                {pipelineStages.map((stage, index) => (
                  <Cell key={stage.label} fill={getChartColor(index)} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-2 text-sm">
          {pipelineStages.map((stage, index) => (
            <div key={stage.label} className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: getChartColor(index) }}
                />
                <span className="truncate">{stage.label}</span>
              </span>
              <span className="text-muted-foreground font-medium">{stage.value}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardWidget>
  );
}

function WeeklyActivityWidget(): React.ReactElement {
  return (
    <DashboardWidget icon={Activity} title="Weekly activity" contentClassName="pt-3">
      <div className="h-[292px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyActivity} margin={{ top: 8, right: 8, left: -24, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(20, 184, 166, 0.08)' }}
              contentStyle={{
                borderColor: 'var(--border)',
                borderRadius: 10,
                boxShadow: 'none',
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {weeklyActivity.map((entry, index) => (
                <Cell key={entry.label} fill={getChartColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardWidget>
  );
}

export function DashboardOverviewStable(): React.ReactElement {
  const pipelineValue = 123000;

  return (
    <DashboardPageLayout fillViewport={false} title="Dashboard">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <DashboardWidget icon={UsersRound} title="Contacts" value={leadRows.length} />
        <DashboardWidget icon={KanbanSquare} title="Opportunities" value={3} />
        <DashboardWidget
          icon={CircleDollarSign}
          title="Pipeline"
          value={currencyFormatter.format(pipelineValue)}
        />
        <DashboardWidget icon={FileText} title="Files" value={7} />
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <PipelineStagesWidget />
        <WeeklyActivityWidget />
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
        <DashboardWidget icon={UsersRound} title="Lead status" contentClassName="p-0">
          <SmartTable
            columns={leadColumns}
            data={leadRows}
            isLoading={false}
            getRowKey={(lead) => lead.id}
            actionLabels={smartTableActionLabels}
            noDataMessage="No contacts yet"
            noDataContent={
              <EmptyStateCard
                icon={<UsersRound className="size-7" />}
                title="No contacts yet"
                subtitle="Add contacts to see the newest lead status here."
                actionLabel="Open contacts"
                actionHref="/dashboard/contacts"
              />
            }
          />
        </DashboardWidget>
        <SharedActivityCalendarWidget activities={dashboardActivities} />
      </div>
    </DashboardPageLayout>
  );
}
