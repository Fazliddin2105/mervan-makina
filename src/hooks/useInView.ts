import { useEffect, useRef, useState } from 'react';

/**
 * Fires once when the element first enters the viewport.
 *
 * Used to drive scroll reveals and counters. It disconnects after the first
 * hit, so scrolling back up does not replay the animation — replaying on every
 * pass is the thing that makes scroll animation feel cheap.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string } = {}
) {
  const { threshold = 0.15, rootMargin = '0px 0px -80px 0px' } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without IntersectionObserver, or when the visitor asks for reduced
    // motion, show the content immediately rather than animating it in.
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    // Safety net. Content that is hidden until an observer fires is content
    // that can be hidden forever if the observer never does — a stale layout,
    // a crawler, a zero-height parent. After this timeout the element shows
    // regardless; by then anything genuinely on screen has already revealed.
    const failsafe = window.setTimeout(() => {
      setInView(true);
      observer.disconnect();
    }, 2500);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { ref, inView };
}
