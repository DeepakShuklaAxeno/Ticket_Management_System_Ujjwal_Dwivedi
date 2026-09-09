import React, { useState } from 'react';
import { X, UserX } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export default function RequestReassignModal({ isOpen, ticket, onClose, onRequested }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await api.requestReassignment(ticket.id, {
        message: reason.trim() || 'Reassignment requested by user'
      });
      toast.success('Reassignment request sent to Admin');
      setReason('');
      onRequested?.(updated);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-amber-50 dark:bg-amber-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Request Reassignment
              </h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Ticket #{ticket.ticket_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Reason / Context (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Blocked due to external dependency or requires different domain expert..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl shadow"
            >
              {loading ? 'Submitting...' : 'Send Request to Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
