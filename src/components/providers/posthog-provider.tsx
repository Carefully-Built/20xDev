'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initPostHog, capturePageView, isPostHogEnabled, posthog } from '@/lib/posthog';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef<string | null>(null);

  // Initialize PostHog on mount
  useEffect(() => {
    initPostHog();
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!isPostHogEnabled || typeof window === 'undefined') return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Only capture if path actually changed (avoid duplicate captures)
    if (previousPath.current !== url) {
      capturePageView(window.location.href);
      previousPath.current = url;
    }
  }, [pathname, searchParams]);

  // Capture page leave on unmount
  useEffect(() => {
    return () => {
      if (isPostHogEnabled && typeof window !== 'undefined') {
        posthog.capture('$pageleave');
      }
    };
  }, []);

  return <>{children}</>;
}

/**
 * PostHog Page View component for explicit page tracking
 * Use this in specific pages if automatic tracking isn't sufficient
 */
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && isPostHogEnabled) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + '?' + searchParams.toString();
      }
      posthog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}
