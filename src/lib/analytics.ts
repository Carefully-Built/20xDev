/**
 * Analytics event constants and helpers for Plausible integration.
 *
 * Usage in client components:
 *   import { usePlausible } from 'next-plausible';
 *   import { ANALYTICS_EVENTS } from '@/lib/analytics';
 *   const plausible = usePlausible();
 *   plausible(ANALYTICS_EVENTS.CTA_CLICK, { props: { location: 'hero' } });
 */

export const ANALYTICS_EVENTS = {
  CTA_CLICK: 'cta_click',
  PRICING_CLICK: 'pricing_click',
  SIGNUP: 'signup',
  CONTACT_SUBMIT: 'contact_submit',
  LEARN_MORE: 'learn_more',
  FEATURE_REQUEST: 'feature_request',
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export interface AnalyticsEventProps {
  readonly [key: string]: string | number | boolean;
}

/** Returns true if the Plausible domain env var is configured */
export function isAnalyticsEnabled(): boolean {
  return Boolean(process.env['NEXT_PUBLIC_PLAUSIBLE_DOMAIN']);
}
