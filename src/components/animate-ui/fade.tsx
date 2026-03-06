'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

import {
  useIsInView,
  type UseIsInViewOptions,
} from '@/components/animate-ui/hooks/use-is-in-view';
import {
  Slot,
  type WithAsChild,
} from '@/components/animate-ui/primitives/slot';

type FadeProps = WithAsChild<
  {
    children?: React.ReactNode;
    delay?: number;
    initialOpacity?: number;
    opacity?: number;
    ref?: React.Ref<HTMLElement>;
  } & UseIsInViewOptions &
    HTMLMotionProps<'div'>
>;

function Fade({
  ref,
  transition = { type: 'spring', stiffness: 200, damping: 20 },
  delay = 0,
  inView = false,
  inViewMargin = '0px',
  inViewOnce = true,
  initialOpacity = 0,
  opacity = 1,
  asChild = false,
  ...props
}: FadeProps) {
  const { ref: localRef, isInView } = useIsInView(
    ref as React.Ref<HTMLElement>,
    {
      inView,
      inViewOnce,
      inViewMargin,
    },
  );

  const animationProps = {
    ref: localRef as React.Ref<HTMLDivElement>,
    initial: 'hidden' as const,
    animate: isInView ? ('visible' as const) : ('hidden' as const),
    exit: 'hidden' as const,
    variants: {
      hidden: { opacity: initialOpacity },
      visible: { opacity },
    },
    transition: {
      ...transition,
      delay: (transition?.delay ?? 0) + delay / 1000,
    },
    ...props,
  };

  if (asChild) {
    return <Slot {...animationProps} />;
  }

  return <motion.div {...animationProps} />;
}

type FadeListProps = Omit<FadeProps, 'children'> & {
  children: React.ReactElement | React.ReactElement[];
  holdDelay?: number;
};

function Fades({
  children,
  delay = 0,
  holdDelay = 0,
  ...props
}: FadeListProps) {
  const array = React.Children.toArray(children) as React.ReactElement[];

  return (
    <>
      {array.map((child, index) => (
        <Fade
          key={child.key ?? index}
          delay={delay + index * holdDelay}
          {...props}
        >
          {child}
        </Fade>
      ))}
    </>
  );
}

export { Fade, Fades, type FadeProps, type FadeListProps };
