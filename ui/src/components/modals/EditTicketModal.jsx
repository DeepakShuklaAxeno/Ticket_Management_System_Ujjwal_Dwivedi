import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export default function EditTicketModal({ isOpen, ticket, onClose, onUpdated }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (ticket) {
      setSubject(ticket.subject || '');
      setDescription(ticket.description || '');
      setPriority(ticket.priority || 'medium');
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      toast.error('Subject is required');
      return;
    }

    try {
      setLoading(true);
      const updated = await api.updateTicket(ticket.id, {
        subject: subject.trim(),
        description: description.trim(),
        priority
      });
      toast.success('Ticket updated successfully');
      onUpdated?.(updated);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Edit Ticket #{ticket.ticket_number}
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Modify ticket subject, description, or priority
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
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['low', 'medium', 'high', 'urgent'].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    priority === p
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
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
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
