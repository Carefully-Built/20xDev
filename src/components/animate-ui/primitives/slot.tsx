'use client';

import { motion, isMotionComponent, type HTMLMotionProps } from 'motion/react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type AnyProps = Record<string, unknown>;

type DOMMotionProps = Omit<
  HTMLMotionProps<'div'>,
  'ref'
> & { ref?: React.Ref<HTMLElement> };

type WithAsChild<Base extends object> =
  | (Base & { asChild: true; children: React.ReactElement })
  | (Base & { asChild?: false | undefined });

type SlotProps = {
  children?: React.ReactNode;
} & DOMMotionProps;

function mergeRefs(
  ...refs: Array<React.Ref<HTMLElement> | undefined>
): React.RefCallback<HTMLElement> {
  return (node: HTMLElement | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    });
  };
}

function mergeProps(childProps: AnyProps, slotProps: DOMMotionProps): AnyProps {
  const merged: AnyProps = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(
      childProps.className as string,
      slotProps.className,
    );
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...(childProps.style as React.CSSProperties),
      ...(slotProps.style as React.CSSProperties),
    };
  }

  return merged;
}

function Slot({
  children,
  ref,
  ...props
}: SlotProps): React.ReactElement | null {
  if (!React.isValidElement(children)) return null;

  const isAlreadyMotion =
    typeof children.type === 'object' &&
    isMotionComponent(children.type);

  const Base = isAlreadyMotion
    ? (children.type as React.ElementType)
    : motion.create(children.type as React.ElementType);

  const { ref: childRef, ...childProps } = children.props as AnyProps & {
    ref?: React.Ref<HTMLElement>;
  };

  const mergedProps = mergeProps(childProps, props);

  return (
    <Base {...mergedProps} ref={mergeRefs(childRef, ref)} />
  );
}

export {
  Slot,
  type SlotProps,
  type WithAsChild,
  type DOMMotionProps,
  type AnyProps,
};
