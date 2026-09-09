import React from 'react';
import TicketCard from './TicketCard';

const COLUMNS = [
  {
    id: 'queue',
    title: 'Queue',
    statuses: ['created', 'reopened'],
    badgeColor: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    statuses: ['in_progress', 'assigned'],
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
  },
  {
    id: 'done',
    title: 'For Review',
    statuses: ['done'],
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
  },
  {
    id: 'resolved',
    title: 'Resolved',
    statuses: ['resolved'],
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
  }
];

export default function TicketKanban({
  tickets = [],
  users = [],
  onSelect
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch w-full">
      {COLUMNS.map((col) => {
        const columnTickets = tickets.filter(t => col.statuses.includes(t.status));

        return (
          <div
            key={col.id}
            className="bg-slate-200/60 dark:bg-slate-900/60 rounded-2xl p-4 flex flex-col h-[650px] max-h-[75vh]"
          >
            <div className="flex items-center justify-between px-1 mb-3 shrink-0">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {col.title}
              </h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${col.badgeColor}`}>
                {columnTickets.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1 min-h-0">
              {columnTickets.length === 0 ? (
                <div className="h-24 rounded-xl flex items-center justify-center text-xs font-bold text-slate-400">
                  No tickets
                </div>
              ) : (
                columnTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    users={users}
                    onSelect={onSelect}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
