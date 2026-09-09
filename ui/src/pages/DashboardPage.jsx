import React, { useState, useMemo } from 'react';
import { Plus, Inbox } from 'lucide-react';
import TicketCard from '../components/tickets/TicketCard';
import TicketTable from '../components/tickets/TicketTable';
import TicketKanban from '../components/tickets/TicketKanban';
import TicketFilters from '../components/tickets/TicketFilters';

export default function DashboardPage({
  tickets = [],
  users = [],
  currentUserId,
  isAdmin,
  loading,
  onOpenCreate,
  onSelectTicket,
  onOpenAssign,
  onOpenEdit,
  onOpenComplete,
  onOpenResolve,
  onOpenReopen,
  onOpenDelete,
  onOpenChangePriority,
  onStartTicket
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [scopeFilter, setScopeFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const metrics = useMemo(() => {
    return {
      total: tickets.length,
      queue: tickets.filter(t => t.status === 'created' || t.status === 'reopened').length,
      inProgress: tickets.filter(t => t.status === 'in_progress' || t.status === 'assigned').length,
      done: tickets.filter(t => t.status === 'done').length,
      resolved: tickets.filter(t => t.status === 'resolved').length
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (scopeFilter === 'created_by_me' && t.creator_id !== currentUserId) return false;
      if (scopeFilter === 'assigned_to_me' && t.current_assignee_id !== currentUserId) return false;

      if (statusFilter !== 'all') {
        if (statusFilter === 'in_progress') {
          if (t.status !== 'in_progress' && t.status !== 'assigned') return false;
        } else if (t.status !== statusFilter) {
          return false;
        }
      }

      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;

      const trimmed = searchQuery.trim().toLowerCase();
      if (trimmed) {
        const matchNumber = t.ticket_number?.toString().includes(trimmed);
        const matchSubject = t.subject?.toLowerCase().includes(trimmed);
        const matchDesc = t.description?.toLowerCase().includes(trimmed);
        if (!matchNumber && !matchSubject && !matchDesc) return false;
      }

      return true;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter, scopeFilter, currentUserId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer p-5 rounded-2xl transition-all ${
            statusFilter === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm hover:shadow'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Total Tickets</div>
          <div className="text-3xl font-extrabold mt-1">{metrics.total}</div>
        </div>

        <div
          onClick={() => setStatusFilter('created')}
          className={`cursor-pointer p-5 rounded-2xl transition-all ${
            statusFilter === 'created'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm hover:shadow'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Admin Queue</div>
          <div className="text-3xl font-extrabold mt-1">{metrics.queue}</div>
        </div>

        <div
          onClick={() => setStatusFilter('in_progress')}
          className={`cursor-pointer p-5 rounded-2xl transition-all ${
            statusFilter === 'in_progress'
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm hover:shadow'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">In Progress</div>
          <div className="text-3xl font-extrabold mt-1">{metrics.inProgress}</div>
        </div>

        <div
          onClick={() => setStatusFilter('done')}
          className={`cursor-pointer p-5 rounded-2xl transition-all ${
            statusFilter === 'done'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm hover:shadow'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">For Review</div>
          <div className="text-3xl font-extrabold mt-1">{metrics.done}</div>
        </div>

        <div
          onClick={() => setStatusFilter('resolved')}
          className={`cursor-pointer p-5 rounded-2xl transition-all ${
            statusFilter === 'resolved'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm hover:shadow'
          }`}
        >
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Resolved</div>
          <div className="text-3xl font-extrabold mt-1">{metrics.resolved}</div>
        </div>
      </div>

      <TicketFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        scopeFilter={scopeFilter}
        setScopeFilter={setScopeFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isAdmin={isAdmin}
      />

      {loading ? (
        <div className="p-16 text-center text-slate-400 font-bold">
          Loading tickets...
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-16 text-center shadow-sm">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
            No tickets found
          </h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
            Try adjusting your search filters or create a new ticket.
          </p>
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow transition-all"
          >
            <Plus className="w-4 h-4" /> Create Ticket
          </button>
        </div>
      ) : viewMode === 'kanban' ? (
        <TicketKanban
          tickets={filteredTickets}
          users={users}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onSelect={onSelectTicket}
          onStart={onStartTicket}
          onAssign={onOpenAssign}
          onComplete={onOpenComplete}
          onResolve={onOpenResolve}
          onReopen={onOpenReopen}
          onDelete={onOpenDelete}
          onEdit={onOpenEdit}
        />
      ) : viewMode === 'table' ? (
        <TicketTable
          tickets={filteredTickets}
          users={users}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onSelect={onSelectTicket}
          onAssign={onOpenAssign}
          onStart={onStartTicket}
          onComplete={onOpenComplete}
          onResolve={onOpenResolve}
          onReopen={onOpenReopen}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              users={users}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onSelect={onSelectTicket}
              onStart={onStartTicket}
              onComplete={onOpenComplete}
              onAssign={onOpenAssign}
              onResolve={onOpenResolve}
              onReopen={onOpenReopen}
              onDelete={onOpenDelete}
              onEdit={onOpenEdit}
              onChangePriority={onOpenChangePriority}
            />
          ))}
        </div>
      )}
    </div>
  );
}
