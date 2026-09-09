import React from 'react';
import { Clock, User, MessageSquare, ChevronRight } from 'lucide-react';
import TicketStatusBadge from './TicketStatusBadge';
import TicketPriorityBadge from './TicketPriorityBadge';

export default function TicketCard({
  ticket,
  users = [],
  onSelect
}) {
  const assignee = users.find(u => u.id === ticket.current_assignee_id);

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(d);
    } catch {
      return '';
    }
  };

  const logsCount = ticket.ticket_logs?.length || 0;

  return (
    <div
      onClick={() => onSelect?.(ticket)}
      className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              #{ticket.ticket_number}
            </span>
            <TicketPriorityBadge priority={ticket.priority} size="sm" />
          </div>

          <TicketStatusBadge status={ticket.status} size="sm" />
        </div>

        <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 mb-1.5">
          {ticket.subject}
        </h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {ticket.description || 'No description provided.'}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {assignee ? (
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                <User className="w-3 h-3" />
              </div>
              <span className="truncate max-w-[130px]">{assignee.full_name}</span>
            </div>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 font-bold text-xs bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg">
              Unassigned
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-bold text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(ticket.created_at)}
          </span>

          {logsCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              {logsCount}
            </span>
          )}

          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
}
