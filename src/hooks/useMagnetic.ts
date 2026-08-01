import type React from 'react';
import { useCallback, useRef } from 'react';

/**
 * Makes an element drift toward the pointer while it is hovered.
 *
 * The offset is written straight to the node's transform rather than to React
 * state — a magnetic button updates on every pointer move, and re-rendering
 * that often would cost far more than the effect is worth.
 *
 * `strength` is the fraction of the distance from centre the element travels;
 * 0.25 is noticeable without feeling loose.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(
  strength = 0.25,
  max = 12
) {
  const ref = useRef<T | null>(null);
  const reduced = useRef<boolean | null>(null);

  const isReduced = () => {
    if (reduced.current === null) {
      reduced.current = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    }
    return reduced.current;
  };

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = ref.current;
      if (!el || isReduced() || e.pointerType === 'touch') return;

      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);

      const x = Math.max(-max, Math.min(max, dx * strength));
      const y = Math.max(-max, Math.min(max, dy * strength));

      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
    [strength, max]
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // The CSS transition on the element handles the spring back.
    el.style.transform = 'translate3d(0, 0, 0)';
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
