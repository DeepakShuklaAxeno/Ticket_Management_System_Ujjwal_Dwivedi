import React from 'react';
import { 
  PlusCircle, 
  Edit3, 
  UserPlus, 
  Play, 
  CheckCircle, 
  ShieldCheck, 
  RotateCcw, 
  Trash2, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import TicketStatusBadge from './TicketStatusBadge';
import TicketPriorityBadge from './TicketPriorityBadge';

const ACTION_CONFIG = {
  created: { label: 'Ticket Created', icon: PlusCircle, color: 'text-blue-600 bg-blue-100 dark:bg-blue-950' },
  updated: { label: 'Details Updated', icon: Edit3, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800' },
  assigned: { label: 'Assignee Changed', icon: UserPlus, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950' },
  started: { label: 'Work Started', icon: Play, color: 'text-sky-600 bg-sky-100 dark:bg-sky-950' },
  completed: { label: 'Work Completed', icon: CheckCircle, color: 'text-purple-600 bg-purple-100 dark:bg-purple-950' },
  resolved: { label: 'Ticket Resolved', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950' },
  reopened: { label: 'Ticket Reopened', icon: RotateCcw, color: 'text-rose-600 bg-rose-100 dark:bg-rose-950' },
  deleted: { label: 'Ticket Deleted', icon: Trash2, color: 'text-red-600 bg-red-100 dark:bg-red-950' },
  priority_changed: { label: 'Priority Changed', icon: AlertCircle, color: 'text-amber-600 bg-amber-100 dark:bg-amber-950' }
};

export default function ActivityTimeline({ logs = [], users = [] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 font-bold text-sm">
        No activity logs recorded yet.
      </div>
    );
  }

  const sortedLogs = [...logs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const getUser = (id) => users.find(u => u.id === id);

  const formatTimestamp = (iso) => {
    try {
      const date = new Date(iso);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    } catch {
      return iso;
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-6">
        {sortedLogs.map((log, logIdx) => {
          const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.updated;
          const Icon = config.icon;
          const performer = getUser(log.performed_by);
          const toUser = getUser(log.to_assignee_id);
          const isLast = logIdx === sortedLogs.length - 1;

          return (
            <li key={log.id || logIdx}>
              <div className="relative pb-6">
                {!isLast && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3.5">
                  <div className={`relative flex h-8 w-8 items-center justify-center rounded-xl font-bold ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {performer ? performer.full_name : 'System'}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {config.label}
                        </span>
                      </div>

                      <time className="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTimestamp(log.created_at)}
                      </time>
                    </div>

                    {(log.from_status || log.to_status) && log.action !== 'created' && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                        {log.from_status && <TicketStatusBadge status={log.from_status} size="sm" />}
                        {log.from_status && log.to_status && <ArrowRight className="w-3 h-3 text-slate-400" />}
                        {log.to_status && <TicketStatusBadge status={log.to_status} size="sm" />}
                      </div>
                    )}

                    {log.action === 'assigned' && toUser && (
                      <div className="mt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                        Assigned to: <span className="text-blue-600 dark:text-blue-400">{toUser.full_name}</span>
                      </div>
                    )}

                    {log.action === 'priority_changed' && log.data?.from && log.data?.to && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <TicketPriorityBadge priority={log.data.from} size="sm" />
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <TicketPriorityBadge priority={log.data.to} size="sm" />
                      </div>
                    )}

                    {log.message && (
                      <div className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                        "{log.message}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
