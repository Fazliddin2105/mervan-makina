import React from 'react';

/**
 * Brand mark, drawn as SVG.
 *
 * Vector rather than a bitmap so it stays crisp at every size and needs no
 * asset file. If `siteSettings.logoUrl` is set in the admin panel the header
 * and footer use that image instead — this is the built-in default.
 *
 * The glyph is the ride-on scrubber from the company's logo: seat, steering
 * column, body, drive wheel and brush deck.
 */

const BLUE = '#2563EB';
const BLUE_LIGHT = '#3B82F6';

export const LogoMark: React.FC<{ className?: string; title?: string }> = ({
  className = 'w-9 h-9',
  title
}) => (
  <svg viewBox="0 0 64 64" className={className} role={title ? 'img' : 'presentation'} aria-hidden={!title}>
    {title && <title>{title}</title>}
    <defs>
      <linearGradient id="mm-body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={BLUE_LIGHT} />
        <stop offset="100%" stopColor={BLUE} />
      </linearGradient>
    </defs>

    {/* Seat back */}
    <rect x="10" y="14" width="7" height="15" rx="3" fill="url(#mm-body)" />
    {/* Seat base */}
    <rect x="10" y="27" width="15" height="5" rx="2.5" fill="url(#mm-body)" />

    {/* Steering column, raked forward */}
    <rect x="34" y="20" width="5" height="22" rx="2.5" fill="url(#mm-body)" transform="rotate(6 36 31)" />
    {/* Steering wheel */}
    <rect x="30" y="15" width="14" height="3.5" rx="1.75" fill="url(#mm-body)" transform="rotate(-24 37 17)" />

    {/* Chassis */}
    <path
      d="M8 32h22a4 4 0 0 1 4 4v6a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-6a4 4 0 0 1 0-4Z"
      fill="url(#mm-body)"
    />

    {/* Drive wheel */}
    <circle cx="16" cy="47" r="8" fill="#1E4FA8" />
    <circle cx="16" cy="47" r="5" fill="#0B1D3F" />
    <circle cx="16" cy="47" r="2.2" fill="#93B4E8" />

    {/* Brush deck */}
    <ellipse cx="40" cy="49" rx="10" ry="3.6" fill={BLUE} />
    <rect x="34" y="43" width="12" height="5" rx="2" fill="url(#mm-body)" />
  </svg>
);

interface LogoProps {
  /** 'dark' for navy backgrounds, 'light' for white ones. */
  tone?: 'dark' | 'light';
  className?: string;
}

/** Full lockup: mark plus the two-line wordmark. */
export const Logo: React.FC<LogoProps> = ({ tone = 'dark', className = '' }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <LogoMark className="w-9 h-9 shrink-0" />
    <span className="leading-none text-left">
      <span
        className={`block text-base font-bold tracking-tight ${
          tone === 'dark' ? 'text-white' : 'text-[#0B1D3F]'
        }`}
      >
        MERVAN
      </span>
      <span className="block text-xs font-bold tracking-[0.34em] text-blue-500 mt-0.5">
        MAKINA
      </span>
    </span>
  </span>
);
