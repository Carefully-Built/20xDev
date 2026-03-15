'use client';

import { DesktopView } from './DesktopView';
import { MobileView } from './MobileView';

import type { SmartTableProps } from './types';

import { useIsMobile } from '@/hooks/use-mobile';

export function SmartTable<T extends Record<string, unknown>>({
  data,
  columns,
  isLoading,
  skeletonRows = 5,
  actions,
  actionHandlers,
  renderActions,
  noDataMessage = 'No data available',
  getRowKey = (item) => {
    // Default: try _id, id, or index
    const record = item as Record<string, unknown>;
    if ('_id' in record) return String(record._id);
    if ('id' in record) return String(record.id);
    return data.indexOf(item);
  },
  onRowClick,
  renderMobileCard,
  pagination,
  stickyHeader,
  maxHeight,
  fullHeight,
}: SmartTableProps<T>): React.ReactElement {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileView
        data={data}
        columns={columns}
        isLoading={isLoading}
        skeletonRows={skeletonRows}
        actions={actions}
        actionHandlers={actionHandlers}
        renderActions={renderActions}
        noDataMessage={noDataMessage}
        getRowKey={getRowKey}
        onRowClick={onRowClick}
        renderMobileCard={renderMobileCard}
        pagination={pagination}
        fullHeight={fullHeight}
      />
    );
  }

  return (
    <DesktopView
      data={data}
      columns={columns}
      isLoading={isLoading}
      skeletonRows={skeletonRows}
      actions={actions}
      actionHandlers={actionHandlers}
      renderActions={renderActions}
      noDataMessage={noDataMessage}
      getRowKey={getRowKey}
      onRowClick={onRowClick}
      pagination={pagination}
      stickyHeader={stickyHeader}
      maxHeight={maxHeight}
      fullHeight={fullHeight}
    />
  );
}
