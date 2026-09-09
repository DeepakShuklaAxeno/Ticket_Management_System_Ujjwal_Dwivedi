import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export default function ConfirmDeleteModal({ isOpen, ticket, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!isOpen || !ticket) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.deleteTicket(ticket.id);
      toast.success(`Ticket #${ticket.ticket_number} deleted successfully`);
      onDeleted?.(ticket.id);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to delete ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-red-50 dark:bg-red-950/60">
          <div>
            <h2 className="text-lg font-extrabold text-red-700 dark:text-red-300">
              Delete Ticket #{ticket.ticket_number}
            </h2>
            <p className="text-xs font-semibold text-red-600/80 dark:text-red-400">
              This action soft-deletes the ticket
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Are you sure you want to delete <span className="font-extrabold text-slate-900 dark:text-white">"{ticket.subject}"</span>?
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl shadow"
            >
              <Trash2 className="w-4 h-4" />
              <span>{loading ? 'Deleting...' : 'Delete Ticket'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
