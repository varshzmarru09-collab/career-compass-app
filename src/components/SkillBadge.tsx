import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface SkillBadgeProps {
  name: string;
  type?: 'matched' | 'missing' | 'custom' | 'neutral' | 'removable';
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  name,
  type = 'neutral',
  onRemove,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  };

  const typeClasses = {
    matched: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
    missing: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    custom: 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    removable: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border transition-colors shadow-2xs ${sizeClasses[size]} ${typeClasses[type]}`}
    >
      {type === 'matched' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
      {type === 'missing' && <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
      <span className="whitespace-nowrap">{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 text-slate-400 hover:text-rose-600 rounded-full p-0.5 hover:bg-rose-100/50 transition"
          aria-label={`Remove ${name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
