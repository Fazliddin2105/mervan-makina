import React, { useMemo } from 'react';

interface SplitTextProps {
  text: string;
  /** Milliseconds before the first word starts. */
  delay?: number;
  /** Milliseconds between consecutive words. */
  stagger?: number;
  className?: string;
}

/**
 * Reveals a headline word by word from behind a mask.
 *
 * Each word sits in an overflow-hidden span and slides up into place, which
 * reads as deliberate typesetting rather than a generic fade. Words — not
 * letters — because letter-by-letter on a Latin headline of this size looks
 * like a loading glitch, and it breaks text selection and screen readers.
 *
 * The whole string is exposed to assistive tech as one label; the animated
 * spans are hidden from it.
 */
export const SplitText: React.FC<SplitTextProps> = ({
  text,
  delay = 0,
  stagger = 70,
  className = ''
}) => {
  const words = useMemo(() => text.split(' ').filter(Boolean), [text]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
        >
          <span
            className="split-word inline-block"
            style={{ animationDelay: `${delay + i * stagger}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
};
