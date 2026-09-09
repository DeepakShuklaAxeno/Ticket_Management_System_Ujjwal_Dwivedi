import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export default function ReopenTicketModal({ isOpen, onClose, ticket, onReopened }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await api.reopenTicket(ticket.id, {
        message: message.trim() || 'Ticket reopened for further work'
      });
      toast.success('Ticket reopened and returned to admin queue');
      setMessage('');
      onReopened?.(updated);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to reopen ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Reopen Ticket #{ticket.ticket_number}
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Send this ticket back to the admin queue
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Reason for Reopening (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Explain why the ticket needs rework..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none"
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
              className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow"
            >
              {loading ? 'Reopening...' : 'Reopen Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
