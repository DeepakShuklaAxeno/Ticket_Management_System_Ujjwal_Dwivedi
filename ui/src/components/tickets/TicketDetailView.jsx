import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserPlus, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  Clock, 
  User, 
  History, 
  Flame,
  UserX
} from 'lucide-react';
import TicketStatusBadge from './TicketStatusBadge';
import TicketPriorityBadge from './TicketPriorityBadge';
import TicketLifecycleStepper from './TicketLifecycleStepper';
import ActivityTimeline from './ActivityTimeline';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function TicketDetailView({
  ticketId,
  onClose,
  currentUserId,
  isAdmin,
  users = [],
  onOpenAssign,
  onOpenEdit,
  onOpenComplete,
  onOpenResolve,
  onOpenReopen,
  onOpenDelete,
  onOpenChangePriority,
  onOpenRequestReassign
}) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadTicket = async () => {
    try {
      setLoading(true);
      const data = await api.getTicketById(ticketId);
      setTicket(data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch ticket details');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  if (!ticketId) return null;

  const creator = users.find(u => u.id === ticket?.creator_id);
  const assignee = users.find(u => u.id === ticket?.current_assignee_id);
  const isCreator = ticket?.creator_id === currentUserId;
  const isAssignee = ticket?.current_assignee_id === currentUserId;

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-slate-900/60 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-2xl h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 flex items-start justify-between gap-4 bg-slate-50 dark:bg-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
                #{ticket?.ticket_number || '...'}
              </span>
              {ticket && <TicketStatusBadge status={ticket.status} size="md" />}
              {ticket && <TicketPriorityBadge priority={ticket.priority} size="md" />}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white line-clamp-2">
              {ticket?.subject || 'Loading ticket...'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12 text-slate-400 font-bold">
            Loading ticket details...
          </div>
        ) : ticket ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <TicketLifecycleStepper status={ticket.status} />

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mr-1">
                Actions:
              </span>

              {(ticket.status === 'created' || ticket.status === 'reopened') && isAdmin && (
                <button
                  onClick={() => onOpenAssign?.(ticket)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Assign Agent
                </button>
              )}

              {(ticket.status === 'created' || ticket.status === 'reopened') && (isCreator || isAdmin) && (
                <button
                  onClick={() => onOpenEdit?.(ticket)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-100 rounded-xl shadow-sm transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              )}

              {(ticket.status === 'in_progress' || ticket.status === 'assigned') && isAdmin && (
                <button
                  onClick={() => onOpenAssign?.(ticket)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-100 rounded-xl shadow-sm transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Reassign
                </button>
              )}

              {(ticket.status === 'in_progress' || ticket.status === 'assigned') && (isAssignee || isAdmin) && (
                <button
                  onClick={() => onOpenComplete?.(ticket)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete Work
                </button>
              )}

              {(ticket.status === 'in_progress' || ticket.status === 'assigned') && (isAssignee || isCreator) && (
                <button
                  onClick={() => onOpenRequestReassign?.(ticket)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 rounded-xl transition-all"
                >
                  <UserX className="w-3.5 h-3.5" /> Request Reassignment
                </button>
              )}

              {ticket.status === 'done' && isAdmin && (
                <button
                  onClick={() => onOpenResolve?.(ticket)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Accept & Resolve
                </button>
              )}

              {ticket.status === 'resolved' && (isCreator || isAdmin) && (
                <>
                  <button
                    onClick={() => onOpenReopen?.(ticket)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reopen Ticket
                  </button>
                  <button
                    onClick={() => onOpenDelete?.(ticket)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/60 rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </>
              )}

              {isAdmin && (
                <button
                  onClick={() => onOpenChangePriority?.(ticket)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 rounded-xl transition-all ml-auto"
                >
                  <Flame className="w-3.5 h-3.5" /> Change Priority
                </button>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Description
              </h4>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {ticket.description || 'No description provided.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Creator</span>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">
                    {creator ? creator.full_name : 'User'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Assignee</span>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 truncate">
                    {assignee ? assignee.full_name : 'Unassigned'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Created At</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 truncate">
                    {formatDate(ticket.created_at)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Resolved At</span>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 truncate">
                    {formatDate(ticket.resolved_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600" />
                  Activity History
                </h4>
                <span className="text-xs font-bold text-slate-400">
                  {ticket.ticket_logs?.length || 0} events
                </span>
              </div>

              <ActivityTimeline logs={ticket.ticket_logs || []} users={users} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
