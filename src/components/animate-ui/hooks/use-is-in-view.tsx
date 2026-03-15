import { useInView, type UseInViewOptions } from 'motion/react';
import * as React from 'react';

interface UseIsInViewOptions {
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
}

function useIsInView<T extends HTMLElement = HTMLElement>(
  ref: React.Ref<T> | undefined,
  options: UseIsInViewOptions = {},
): { ref: React.RefObject<T | null>; isInView: boolean } {
  const { inView, inViewOnce = false, inViewMargin = '0px' } = options;
  const localRef = React.useRef<T | null>(null);

  React.useImperativeHandle(ref, () => localRef.current as T, []);

  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;
  return { ref: localRef, isInView };
}

export { useIsInView, type UseIsInViewOptions };
