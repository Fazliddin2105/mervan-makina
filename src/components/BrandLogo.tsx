import React from 'react';

/**
 * Brand wordmark rendered as typography instead of a bitmap.
 *
 * Manufacturer logos are trademarked and hotlinking them from the vendors' own
 * sites breaks (referrer blocking / 404s), so we render a clean, consistent
 * wordmark per brand: a colored monogram tile plus the brand name. Every brand
 * looks deliberate and nothing can 404.
 */

type Tone = { bg: string; fg: string };

// Each brand gets a stable tone loosely echoing its real corporate color.
const BRAND_TONES: Record<string, Tone> = {
  'mervan-makina': { bg: '#2563EB', fg: '#FFFFFF' },
  'clean-core': { bg: '#2563EB', fg: '#0B1D3F' },
  karcher: { bg: '#FFD500', fg: '#1A1A1A' },
  nilfisk: { bg: '#003DA5', fg: '#FFFFFF' },
  tennant: { bg: '#00843D', fg: '#FFFFFF' },
  comac: { bg: '#E4002B', fg: '#FFFFFF' },
  hako: { bg: '#F5A800', fg: '#1A1A1A' },
  taski: { bg: '#005EB8', fg: '#FFFFFF' },
  ipc: { bg: '#00A0DF', fg: '#FFFFFF' },
  numatic: { bg: '#00539B', fg: '#FFFFFF' },
};

const FALLBACK_TONE: Tone = { bg: '#0B1D3F', fg: '#FFFFFF' };

/** "Mervan Makina" -> "MM", "Kärcher" -> "KA", "IPC" -> "IPC" */
function monogramFor(name: string): string {
  const words = name.replace(/[^\p{L}\p{N}\s-]/gu, '').trim().split(/[\s-]+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0];
  // Short all-caps names (IPC, MK) read better whole than abbreviated.
  if (words.length === 1) {
    return first.length <= 3 ? first.toUpperCase() : first.slice(0, 2).toUpperCase();
  }
  return (first[0] + words[1][0]).toUpperCase();
}

interface BrandLogoProps {
  brandId: string;
  name: string;
  /** 'tile' = monogram only; 'full' = monogram + wordmark. */
  variant?: 'tile' | 'full';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TILE_SIZE = { sm: 'w-8 h-8 text-[11px]', md: 'w-11 h-11 text-sm', lg: 'w-16 h-16 text-xl' };
const WORD_SIZE = { sm: 'text-xs', md: 'text-sm', lg: 'text-lg' };

export const BrandLogo: React.FC<BrandLogoProps> = ({
  brandId,
  name,
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const tone = BRAND_TONES[brandId] ?? FALLBACK_TONE;
  const monogram = monogramFor(name);

  const tile = (
    <span
      aria-hidden="true"
      className={`${TILE_SIZE[size]} shrink-0 rounded-xl flex items-center justify-center font-black tracking-tight shadow-sm ring-1 ring-black/5`}
      style={{ backgroundColor: tone.bg, color: tone.fg }}
    >
      {monogram}
    </span>
  );

  if (variant === 'tile') {
    return (
      <span className={`inline-flex ${className}`} title={name}>
        {tile}
        <span className="sr-only">{name}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 min-w-0 ${className}`}>
      {tile}
      <span
        className={`${WORD_SIZE[size]} font-extrabold tracking-tight text-current truncate leading-tight`}
      >
        {name}
      </span>
    </span>
  );
};
