'use client';

import { useEffect } from 'react';

import type { ReactNode } from 'react';

import {
  getIntercomAppId,
  loadIntercomScript,
  bootIntercom,
  shutdownIntercom,
} from '@/lib/intercom';

interface IntercomProviderProps {
  readonly children: ReactNode;
}

export function IntercomProvider({
  children,
}: IntercomProviderProps): React.ReactElement {
  useEffect(() => {
    const appId = getIntercomAppId();
    if (!appId) return;

    loadIntercomScript(appId);

    // Wait for script to load, then boot
    const handleLoad = (): void => {
      bootIntercom();
    };

    const script = document.getElementById('intercom-script');
    if (script) {
      script.addEventListener('load', handleLoad);
    }

    // If Intercom is already available (script cached), boot immediately
    if (window.Intercom) {
      bootIntercom();
    }

    return () => {
      shutdownIntercom();
      if (script) {
        script.removeEventListener('load', handleLoad);
      }
    };
  }, []);

  return <>{children}</>;
}
