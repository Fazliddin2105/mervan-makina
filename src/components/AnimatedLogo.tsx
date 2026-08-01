import React from 'react';

/**
 * The brand mark, animated.
 *
 * The logo is a ride-on scrubber, so it arrives the way the machine would: it
 * drives in from the right, the drive wheel turns, the scrub disc keeps
 * spinning, and only then does the wordmark assemble letter by letter behind
 * it. Everything is CSS keyframes on SVG groups — no animation library — and
 * the whole thing is inert under prefers-reduced-motion, which index.css
 * neutralises globally.
 */

interface AnimatedLogoProps {
  className?: string;
  /** Render at rest, no entrance — for the header and footer. */
  static?: boolean;
  /** Mark only, no wordmark. */
  markOnly?: boolean;
}

const WORD = 'MERVAN';
const SUB = 'MAKINA';

/** Machine settles first, then the letters land one after another. */
const DRIVE_MS = 1100;
const LETTER_STEP_MS = 55;

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  className = '',
  static: isStatic = false,
  markOnly = false
}) => {
  const letters = (word: string, base: number, cls: string) => {
    const chars = word.split('');
    return chars.map((ch, i) => (
      <span
        key={`${word}-${i}`}
        className={isStatic ? cls : `${cls} logo-letter`}
        // Right-most letter lands first, so the word resolves back toward the
        // machine arriving from the left.
        style={
          isStatic
            ? undefined
            : { animationDelay: `${base + (chars.length - 1 - i) * LETTER_STEP_MS}ms` }
        }
      >
        {ch}
      </span>
    ));
  };

  return (
    <span className={`inline-flex items-center gap-6 ${className}`}>
      <svg
        viewBox="0 0 96 80"
        className={`h-full w-auto shrink-0 ${isStatic ? '' : 'logo-drive'}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="mm-body" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor="#7DB3FF" />
            <stop offset="55%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="mm-dark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E4FA8" />
            <stop offset="100%" stopColor="#0B1D3F" />
          </linearGradient>
        </defs>

        {/* Pool of light the machine stands in */}
        <ellipse
          cx="48"
          cy="72"
          rx="42"
          ry="4"
          fill="#3B82F6"
          opacity="0.5"
          className={isStatic ? '' : 'logo-glow'}
          style={{ filter: 'blur(5px)', transformOrigin: '48px 72px' }}
        />

        {/* Floor the machine travels along */}
        <rect
          x="2"
          y="72"
          width="92"
          height="2.5"
          rx="1.25"
          fill="#3B82F6"
          opacity="0.28"
          className={isStatic ? '' : 'logo-floor'}
        />

        {/* Seat: one shape, backrest and cushion joined, so it reads as a seat
            rather than two floating blocks at small sizes. */}
        <path
          d="M15 14a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v22h14a4 4 0 0 1 0 8H20a5 5 0 0 1-5-5V14Z"
          fill="url(#mm-body)"
        />

        {/* Steering column and wheel */}
        <path d="M55 22a4 4 0 0 1 8 0v28h-8V22Z" fill="url(#mm-body)" transform="rotate(9 59 36)" />
        <path
          d="M46 16.5a3 3 0 0 1 3-3h18a3 3 0 0 1 0 6H49a3 3 0 0 1-3-3Z"
          fill="url(#mm-body)"
          transform="rotate(-24 58 16.5)"
        />

        {/* Body */}
        <path
          d="M12 40h34a7 7 0 0 1 7 7v8a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5V45a5 5 0 0 1 0-5Z"
          fill="url(#mm-body)"
        />
        <rect x="18" y="45" width="17" height="2.5" rx="1.25" fill="#1D4ED8" opacity="0.5" />
        <rect x="18" y="50.5" width="11" height="2.5" rx="1.25" fill="#1D4ED8" opacity="0.5" />

        {/* Drive wheel. Concentric rings echo the printed logo; a solid hub
            instead of crossed spokes, which collapsed into an x at small sizes. */}
        <g className={isStatic ? '' : 'logo-wheel'} style={{ transformOrigin: '25px 62px' }}>
          <circle cx="25" cy="62" r="12" fill="url(#mm-dark)" />
          <circle cx="25" cy="62" r="8.5" fill="none" stroke="#93B4E8" strokeWidth="1.6" opacity="0.55" />
          <circle cx="25" cy="62" r="5" fill="#0B1D3F" />
          {/* One marker so the rotation is readable without clutter */}
          <circle cx="25" cy="55.5" r="1.9" fill="#93B4E8" />
        </g>

        {/* Scrub disc. It lies flat on the floor, so it turns about a vertical
            axis, not in the picture plane. Rotating the whole ellipse would make
            it tumble sideways. The marks orbit inside a group squashed on Y,
            which is what a spinning circle in perspective actually looks like. */}
        <ellipse cx="66" cy="66" rx="16" ry="5.5" fill="#1D4ED8" />
        <ellipse cx="66" cy="63.5" rx="16" ry="5.5" fill="#3B82F6" />
        <g transform="translate(66 63.5) scale(1 0.34)">
          <g className={isStatic ? '' : 'logo-disc'}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <circle
                  key={i}
                  cx={Math.cos(a) * 31}
                  cy={Math.sin(a) * 31}
                  r="5.5"
                  fill="#0B1D3F"
                  opacity="0.4"
                />
              );
            })}
          </g>
        </g>
        <ellipse cx="66" cy="63.5" rx="4" ry="1.5" fill="#0B1D3F" opacity="0.55" />

        {/* Deck arm linking body to disc */}
        <path d="M50 52h14a3 3 0 0 1 0 7H50v-7Z" fill="url(#mm-body)" />
      </svg>

      {!markOnly && (
        <span className="leading-none text-left">
          <span className="block text-2xl font-bold tracking-[-0.02em] text-white">
            {letters(WORD, DRIVE_MS, 'inline-block')}
          </span>
          <span className="mt-2.5 block text-xs font-bold tracking-[0.46em] text-blue-400">
            {letters(SUB, DRIVE_MS + WORD.length * LETTER_STEP_MS + 60, 'inline-block')}
          </span>
          <span
            className={`mt-3.5 block h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-blue-500 to-blue-400 ${
              isStatic ? '' : 'logo-rule'
            }`}
          />
        </span>
      )}
    </span>
  );
};
