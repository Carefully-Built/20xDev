export const defaultActivityType = { _id: 'meeting', label: 'Meeting', color: '#0EA5E9' } as const;

export const activityTypes = [
  defaultActivityType,
  { _id: 'call', label: 'Call', color: '#06B6D4' },
  { _id: 'review', label: 'Review', color: '#22C55E' },
] as const;

export type CalendarActivityType = (typeof activityTypes)[number];
