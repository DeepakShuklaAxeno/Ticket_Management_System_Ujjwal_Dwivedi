import React from 'react';
import { User, ChevronRight } from 'lucide-react';
import TicketStatusBadge from './TicketStatusBadge';
import TicketPriorityBadge from './TicketPriorityBadge';

export default function TicketTable({
  tickets = [],
  users = [],
  onSelect
}) {
  const getUser = (id) => users.find(u => u.id === id);

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(d);
    } catch {
      return '';
    }
  };

  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center shadow-sm">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">No tickets match the selected filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-extrabold text-xs uppercase tracking-wider">
            <tr>
              <th className="py-4 px-5"># ID</th>
              <th className="py-4 px-5">Subject</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-5">Priority</th>
              <th className="py-4 px-5">Assignee</th>
              <th className="py-4 px-5">Creator</th>
              <th className="py-4 px-5">Created</th>
              <th className="py-4 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tickets.map((t) => {
              const creator = getUser(t.creator_id);
              const assignee = getUser(t.current_assignee_id);

              return (
                <tr
                  key={t.id}
                  onClick={() => onSelect?.(t)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-5 font-mono font-bold text-xs text-slate-500">
                    #{t.ticket_number}
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                    {t.subject}
                  </td>
                  <td className="py-4 px-5">
                    <TicketStatusBadge status={t.status} size="sm" />
                  </td>
                  <td className="py-4 px-5">
                    <TicketPriorityBadge priority={t.priority} size="sm" />
                  </td>
                  <td className="py-4 px-5">
                    {assignee ? (
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-700 dark:text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="truncate max-w-[120px]">{assignee.full_name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg">Unassigned</span>
                    )}
                  </td>
                  <td className="py-4 px-5 font-bold text-xs text-slate-600 dark:text-slate-400 truncate max-w-[100px]">
                    {creator ? creator.full_name : 'User'}
                  </td>
                  <td className="py-4 px-5 text-xs font-bold text-slate-400 whitespace-nowrap">
                    {formatDate(t.created_at)}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(t);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                    >
                      View <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
