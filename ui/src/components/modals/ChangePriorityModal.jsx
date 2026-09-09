import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export default function ChangePriorityModal({ isOpen, ticket, onClose, onPriorityChanged }) {
  const [priority, setPriority] = useState(ticket?.priority || 'medium');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await api.changePriority(ticket.id, priority);
      toast.success('Priority updated successfully');
      onPriorityChanged?.(updated);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to change priority');
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
              Change Priority #{ticket.ticket_number}
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Update urgency level
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
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'low', label: 'Low' },
              { key: 'medium', label: 'Medium' },
              { key: 'high', label: 'High' },
              { key: 'urgent', label: 'Urgent' }
            ].map((p) => (
              <button
                type="button"
                key={p.key}
                onClick={() => setPriority(p.key)}
                className={`py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                  priority === p.key
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
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
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow"
            >
              {loading ? 'Updating...' : 'Update Priority'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
