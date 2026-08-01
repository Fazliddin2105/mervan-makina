import React from 'react';
import { useInView } from '../hooks/useInView';

interface RevealProps {
  children: React.ReactNode;
  /** Milliseconds to hold before starting — used to stagger siblings. */
  delay?: number;
  /** Which way the content travels in from. */
  from?: 'bottom' | 'left' | 'right';
  className?: string;
  as?: 'div' | 'section' | 'li';
}

const OFFSET: Record<NonNullable<RevealProps['from']>, string> = {
  bottom: 'translate-y-6',
  left: '-translate-x-6',
  right: 'translate-x-6'
};

/**
 * Reveals its children when they first scroll into view.
 *
 * Transform + opacity only, so the browser can keep it on the compositor and
 * the page does not reflow while animating. `useInView` already short-circuits
 * for prefers-reduced-motion, in which case this renders in its final state.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  from = 'bottom',
  className = '',
  as: Tag = 'div'
}) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`transition-[opacity,transform] duration-700 ease-out will-change-transform ${
        inView ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${OFFSET[from]}`
      } ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  );
};
