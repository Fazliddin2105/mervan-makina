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
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-xl sm:text-xl font-bold text-white tabular truncate">
        {numeric ? counted : value}
      </dd>
    </div>
  );
};
