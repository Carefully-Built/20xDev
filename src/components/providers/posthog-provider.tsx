'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { initPostHog, capturePageView, isPostHogEnabled, posthog } from '@/lib/posthog';

export function PostHogProvider({
  children,
}: {
  readonly children: React.ReactNode;
}): React.ReactElement {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef<string | null>(null);

  // Initialize PostHog on mount
  useEffect(() => {
    initPostHog();
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (!isPostHogEnabled || typeof globalThis.window === 'undefined') return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    // Only capture if path actually changed (avoid duplicate captures)
    if (previousPath.current !== url) {
      capturePageView(globalThis.window.location.href);
      previousPath.current = url;
    }
  }, [pathname, searchParams]);

  // Capture page leave on unmount
  useEffect(() => {
    return () => {
      if (isPostHogEnabled && typeof globalThis.window !== 'undefined') {
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
export function PostHogPageView(): React.ReactElement {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && isPostHogEnabled) {
      let url = globalThis.window.origin + pathname;
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString();
      }
      posthog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null as unknown as React.ReactElement;
}
