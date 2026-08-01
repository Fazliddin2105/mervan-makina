import { useEffect, useState } from 'react';

/**
 * True once the page is scrolled past `enter`, false again below `exit`.
 *
 * The two thresholds are deliberate. A single threshold feeds back on itself
 * whenever the state change alters layout height: collapsing a bar shifts the
 * content up, the scroll position re-crosses the line, the bar reopens, and the
 * header flickers on and off forever. The gap between `exit` and `enter` is
 * wider than any layout shift the header can cause, so it cannot oscillate.
 *
 * The listener is passive and only calls setState when the value actually
 * flips, so scrolling does not re-render on every frame.
 */
export function useScrolled(enter = 120, exit = 40): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(prev => {
        if (!prev && y > enter) return true;
        if (prev && y < exit) return false;
        return prev;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enter, exit]);

  return scrolled;
}
