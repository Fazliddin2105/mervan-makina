import { useEffect, useRef, useState } from 'react';

/** Decelerating ease — fast at the start, settling into the final value. */
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Animates a number from 0 to `target` once `active` becomes true.
 *
 * Driven by requestAnimationFrame against real elapsed time rather than a
 * fixed per-frame step, so the duration is the same on a 60Hz and a 120Hz
 * display. Returns the target immediately when reduced motion is requested.
 */
export function useCountUp(target: number, active: boolean, duration = 1100): number {
  const [value, setValue] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || target === 0) {
      setValue(target);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(easeOutExpo(progress) * target));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, active, duration]);

  return value;
}
