import React from 'react';

export const STATUS_CONFIG = {
  created: {
    label: 'Created',
    bg: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    dot: 'bg-slate-500'
  },
  assigned: {
    label: 'Assigned',
    bg: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
    dot: 'bg-sky-500'
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    dot: 'bg-blue-500'
  },
  done: {
    label: 'Done',
    bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    dot: 'bg-purple-500'
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    dot: 'bg-emerald-500'
  },
  reopened: {
    label: 'Reopened',
    bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
    dot: 'bg-rose-500'
  }
};

export default function TicketStatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.created;
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg font-bold ${config.bg} ${sizeClasses}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
