/**
 * PostHog Configuration
 * 
 * Initialize PostHog for error tracking and analytics.
 */

import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

export const isPostHogEnabled = !!POSTHOG_KEY;

/**
 * Initialize PostHog (call once in app root)
 */
export function initPostHog(): void {
  if (typeof window === 'undefined' || !POSTHOG_KEY) {
    return;
  }

  // Don't initialize twice
  if (posthog.__loaded) {
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    
    // Capture errors automatically
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    
    // Error tracking
    enable_recording_console_log: true,
    
    // Privacy settings
    respect_dnt: true,
    
    // Session recording (for debugging errors)
    disable_session_recording: false,
    
    // Performance
    loaded: (posthog) => {
      // Disable in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_POSTHOG_DEV) {
        posthog.opt_out_capturing();
      }
    },
  });
}

/**
 * Identify user for error tracking context
 */
export function identifyUser(
  userId: string,
  properties?: Record<string, unknown>
): void {
  if (!isPostHogEnabled || typeof window === 'undefined') return;
  
  posthog.identify(userId, properties);
}

/**
 * Reset user identity (on logout)
 */
export function resetUser(): void {
  if (!isPostHogEnabled || typeof window === 'undefined') return;
  
  posthog.reset();
}

/**
 * Track custom event
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  if (!isPostHogEnabled || typeof window === 'undefined') return;
  
  posthog.capture(eventName, properties);
}

export { posthog };
