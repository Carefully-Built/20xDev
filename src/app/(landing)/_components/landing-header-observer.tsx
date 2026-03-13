'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function LandingHeaderObserver(): React.ReactElement | null {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!theme) {
      return undefined;
    }

    const root = document.documentElement;
    const hero = document.querySelector('[data-landing-hero]');
    const previousTheme = theme;

    setTheme('light');

    if (!hero) {
      root.dataset.landingHeaderSolid = 'true';
      return () => {
        delete root.dataset.landingHeaderSolid;
        setTheme(previousTheme);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        root.dataset.landingHeaderSolid = entry?.isIntersecting ? 'false' : 'true';
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(hero);

    return () => {
      observer.disconnect();
      delete root.dataset.landingHeaderSolid;
      setTheme(previousTheme);
    };
  }, [setTheme, theme]);

  return null;
}
