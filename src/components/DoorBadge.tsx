import React from 'react';

interface DoorBadgeProps {
  emoji: string;
  label: string;
}

export const DoorBadge: React.FC<DoorBadgeProps> = ({ emoji, label }) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-700/80 text-[11px] md:text-xs font-semibold tracking-wide text-slate-200">
      <span className="text-base md:text-lg" aria-hidden="true">
        {emoji}
      </span>
      <span className="whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};

export default DoorBadge;
