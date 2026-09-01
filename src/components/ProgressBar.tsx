import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  colorVariant?: 'auto' | 'emerald' | 'blue' | 'amber';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  showLabel = true,
  label,
  size = 'md',
  colorVariant = 'auto',
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));

  let barColor = 'bg-blue-600';
  if (colorVariant === 'auto') {
    if (clamped >= 80) barColor = 'bg-emerald-600';
    else if (clamped >= 50) barColor = 'bg-blue-600';
    else if (clamped > 0) barColor = 'bg-amber-500';
    else barColor = 'bg-slate-300';
  } else if (colorVariant === 'emerald') {
    barColor = 'bg-emerald-600';
  } else if (colorVariant === 'blue') {
    barColor = 'bg-blue-600';
  } else if (colorVariant === 'amber') {
    barColor = 'bg-amber-500';
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-slate-700">
          <span>{label || 'Progress'}</span>
          <span className="font-mono text-slate-900">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[size]} border border-slate-200/60`}>
        <div
          className={`${barColor} ${heightClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
