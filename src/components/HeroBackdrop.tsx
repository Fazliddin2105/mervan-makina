import React from 'react';
import { useParallax } from '../hooks/useParallax';
import type { Product } from '../types';

interface HeroBackdropProps {
  products: Product[];
  activeIndex: number;
}

/**
 * The hero's photo layer.
 *
 * Parallax lives here rather than in HomePage on purpose: the hook updates
 * state on every painted frame while scrolling, and if that state sat in the
 * page component the whole homepage — every product card included — would
 * re-render 60 times a second. Isolating it means only these images repaint.
 *
 * All photos stay mounted and crossfade. Swapping a single <img width={800} height={600}> made the
 * browser show a blank frame while the next file decoded, which read as a
 * flicker every time the carousel advanced.
 */
export const HeroBackdrop: React.FC<HeroBackdropProps> = React.memo(
  ({ products, activeIndex }) => {
    const parallax = useParallax(0.3, 180);

    return (
      <div className="absolute inset-0">
        {products.map((p, i) => (
          <img
            key={p.id}
            src={p.images[0]}
            alt={i === activeIndex ? p.name : ''}
            aria-hidden={i !== activeIndex}
            width={800}
            height={600}
            decoding="async"
            // The first frame is the largest thing above the fold, so it is
            // fetched at high priority; the rest wait for the carousel.
            {...(i === 0
              ? { fetchPriority: 'high' as const, loading: 'eager' as const }
              : { loading: 'lazy' as const })}
            className={`absolute inset-0 h-full w-full object-cover ${
              i === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: `scale(1.03) translate3d(0, ${parallax * -0.16}px, 0)`,
              transition: 'opacity 1100ms ease-out'
            }}
          />
        ))}
      </div>
    );
  }
);

HeroBackdrop.displayName = 'HeroBackdrop';
