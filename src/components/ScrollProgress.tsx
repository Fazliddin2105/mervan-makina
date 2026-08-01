import React, { useEffect, useRef } from 'react';

/**
 * Reading-progress bar pinned to the very top of the page.
 *
 * The width is written directly to the node inside a rAF callback, so the bar
 * tracks the scroll without React re-rendering anything. Sampling once per
 * painted frame — not once per scroll event — keeps it smooth on trackpads,
 * which fire far more events than the screen refreshes.
 */
export const ScrollProgress: React.FC = () => {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const el = bar.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      el.style.transform = `scaleX(${pct})`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 pointer-events-none" aria-hidden="true">
      <div
        ref={bar}
        className="h-full origin-left bg-gradient-to-r from-blue-500 to-blue-300"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};
