import { useEffect, useRef, useState } from 'react';

/**
 * Scroll offset for a parallax layer, in pixels.
 *
 * Reads scroll position inside a requestAnimationFrame so the value is sampled
 * once per painted frame rather than once per scroll event — scroll events can
 * fire far more often than the screen refreshes, and doing layout work in each
 * one is what makes parallax feel heavy.
 *
 * Returns 0 when the visitor prefers reduced motion.
 */
export function useParallax(strength = 0.25, max = 160): number {
  const [offset, setOffset] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const update = () => {
      ticking.current = false;
      setOffset(Math.min(window.scrollY * strength, max));
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [strength, max]);

  return offset;
}
