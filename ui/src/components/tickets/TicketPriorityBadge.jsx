import React from 'react';

export const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    bg: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  },
  medium: {
    label: 'Medium',
    bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
  },
  high: {
    label: 'High',
    bg: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
  },
  urgent: {
    label: 'Urgent',
    bg: 'bg-red-600 text-white dark:bg-red-600 dark:text-white'
  }
};

export default function TicketPriorityBadge({ priority = 'medium', size = 'md' }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center rounded-lg font-bold uppercase tracking-wider ${config.bg} ${sizeClasses}`}>
      {config.label}
    </span>
  );
}
