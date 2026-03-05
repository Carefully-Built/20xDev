/**
 * PostHog Configuration
 * 
 * Full PostHog integration for Next.js App Router:
 * - Product Analytics
 * - Session Replay
 * - Error Tracking
 * - Console Log Capture
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
    ui_host: 'https://us.posthog.com',
    
    // ===== PAGE VIEWS =====
    capture_pageview: false, // We capture manually for better SPA support
    capture_pageleave: true,
    
    // ===== AUTOCAPTURE =====
    autocapture: true,
    
    // ===== SESSION REPLAY =====
    disable_session_recording: false,
    session_recording: {
      // Mask all text inputs by default for privacy
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
      // Capture network requests
      recordCrossOriginIframes: true,
    },
    
    // Record console logs in session replay
    enable_recording_console_log: true,
    
    // ===== ERROR TRACKING =====
    capture_exceptions: true, // Auto-capture unhandled errors
    
    // ===== PRIVACY =====
    respect_dnt: false,
    secure_cookie: true,
    
    // ===== PERSISTENCE =====
    persistence: 'localStorage+cookie',
    
    // ===== PERFORMANCE =====
    loaded: (ph) => {
      // In development, only enable if explicitly set
      if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_POSTHOG_DEV) {
        ph.opt_out_capturing();
      }
    },
  });
}

/**
 * Capture page view - call on route change
 */
export function capturePageView(url: string): void {
  if (!isPostHogEnabled || typeof window === 'undefined') return;
  posthog.capture('$pageview', { $current_url: url });
}

/**
 * Capture page leave
 */
export function capturePageLeave(): void {
  if (!isPostHogEnabled || typeof window === 'undefined') return;
  posthog.capture('$pageleave');
}

/**
 * Identify user for tracking context
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

/**
 * Get PostHog feature flag value
 */
export function getFeatureFlag(flagKey: string): boolean | string | undefined {
  if (!isPostHogEnabled || typeof window === 'undefined') return undefined;
  return posthog.getFeatureFlag(flagKey);
}

/**
 * Check if feature flag is enabled
 */
export function isFeatureEnabled(flagKey: string): boolean {
  if (!isPostHogEnabled || typeof window === 'undefined') return false;
  return posthog.isFeatureEnabled(flagKey) ?? false;
}

/**
 * Start session recording manually
 */
export function startSessionRecording(): void {
  if (!isPostHogEnabled || typeof window === 'undefined') return;
  posthog.startSessionRecording();
}

/**
 * Stop session recording
 */
export function stopSessionRecording(): void {
  if (!isPostHogEnabled || typeof window === 'undefined') return;
  posthog.stopSessionRecording();
}

export { posthog };
