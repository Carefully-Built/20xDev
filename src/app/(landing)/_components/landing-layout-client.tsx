'use client';

import { MotionConfig } from 'motion/react';

interface LandingLayoutClientProps {
  readonly children: React.ReactNode;
}

export function LandingLayoutClient({ children }: LandingLayoutClientProps): React.ReactElement {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
