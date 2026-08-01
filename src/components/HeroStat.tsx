import React from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { useInView } from '../hooks/useInView';

interface HeroStatProps {
  label: string;
  /** Numbers count up; strings (a city name) render as-is. */
  value: number | string;
}

export const HeroStat: React.FC<HeroStatProps> = ({ label, value }) => {
  const numeric = typeof value === 'number';
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4, rootMargin: '0px' });
  const counted = useCountUp(numeric ? value : 0, inView);

  return (
    <div ref={ref} className="flex flex-col-reverse gap-1.5 min-w-0">
      <dt className="text-[11px] text-slate-400 leading-tight">{label}</dt>
      <dd className="text-xl sm:text-[1.7rem] font-black text-white tabular leading-none truncate">
        {numeric ? counted : value}
      </dd>
    </div>
  );
};
