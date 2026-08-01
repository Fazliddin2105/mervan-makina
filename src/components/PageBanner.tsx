import React from 'react';
import { SplitText } from './SplitText';

/**
 * The dark page header was copy-pasted into nine pages and had already drifted:
 * two dropped the larger padding, one swapped the flat navy for a gradient, and
 * the h1 had three different size/weight combinations. One component keeps them
 * identical — and gives every inner page the same entrance.
 */
interface PageBannerProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Rendered below the text — used for the search field on Products and FAQ. */
  children?: React.ReactNode;
}

export const PageBanner: React.FC<PageBannerProps> = ({ eyebrow, title, subtitle, children }) => (
  <div className="relative overflow-hidden bg-[#0B1D3F] text-white rounded-lg p-8 sm:p-12 shadow-lg border border-white/10 text-center sm:text-left">
    {/* Single soft wash for depth. No pattern — it would compete with the copy. */}
    <div className="pointer-events-none absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-blue-600/15 blur-[140px]" />

    <div className="relative">
      <span className="rise-in pill bg-blue-600 text-white">{eyebrow}</span>

      <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-white">
        <SplitText text={title} delay={120} />
      </h1>

      {subtitle && (
        <p
          className="rise-in mt-4 text-sm text-slate-300/85 max-w-2xl"
          style={{ animationDelay: '260ms' }}
        >
          {subtitle}
        </p>
      )}

      {children && (
        <div className="rise-in pt-6" style={{ animationDelay: '340ms' }}>
          {children}
        </div>
      )}
    </div>
  </div>
);
