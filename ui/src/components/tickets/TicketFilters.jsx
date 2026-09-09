import React from 'react';
import { Search, LayoutGrid, List, Kanban, X } from 'lucide-react';

export default function TicketFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  scopeFilter,
  setScopeFilter,
  viewMode,
  setViewMode
}) {
  const statuses = [
    { key: 'all', label: 'All Statuses' },
    { key: 'created', label: 'Queue' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'done', label: 'For Review' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'reopened', label: 'Reopened' },
  ];

  const priorities = [
    { key: 'all', label: 'All Priorities' },
    { key: 'low', label: 'Low' },
    { key: 'medium', label: 'Medium' },
    { key: 'high', label: 'High' },
    { key: 'urgent', label: 'Urgent' },
  ];

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || scopeFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setScopeFilter('all');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span>Kanban</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All Visible Tickets</option>
            <option value="created_by_me">Created by Me</option>
            <option value="assigned_to_me">Assigned to Me</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {statuses.map(s => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {priorities.map(p => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
