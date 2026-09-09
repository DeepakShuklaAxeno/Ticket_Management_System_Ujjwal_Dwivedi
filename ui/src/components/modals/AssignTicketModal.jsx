import React, { useState, useEffect } from 'react';
import { X, Search, Check, User } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export default function AssignTicketModal({ isOpen, onClose, ticket, currentUserId, onAssigned }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      if (ticket) {
        setSelectedUserId(ticket.current_assignee_id || '');
        setMessage('');
      }
    }
  }, [isOpen, ticket]);

  const loadUsers = async () => {
    try {
      setFetchingUsers(true);
      const userList = await api.getAssignableUsers(ticket?.id);
      setUsers(userList || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingUsers(false);
    }
  };

  if (!isOpen || !ticket) return null;

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const filteredUsers = users.filter(u => {
    if (u.role === 'admin') return false;
    if (currentUserId && u.id === currentUserId) return false;
    if (!trimmedQuery) return true;
    return (
      (u.full_name || '').toLowerCase().includes(trimmedQuery) ||
      (u.email || '').toLowerCase().includes(trimmedQuery) ||
      (u.role || '').toLowerCase().includes(trimmedQuery)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error('Please select an assignee.');
      return;
    }

    try {
      setLoading(true);
      const updated = await api.assignTicket(ticket.id, {
        assigneeId: selectedUserId,
        message: message.trim() || undefined
      });
      toast.success('Ticket assigned successfully!');
      onAssigned?.(updated);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to assign ticket');
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
              {ticket.current_assignee_id ? 'Reassign Ticket' : 'Assign Ticket'} #{ticket.ticket_number}
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Select an agent for this ticket
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
              Select Assignee *
            </label>

            <div className="relative mb-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1 pr-1 rounded-xl p-2 bg-slate-100 dark:bg-slate-800/60">
              {fetchingUsers ? (
                <div className="text-center py-4 text-xs font-bold text-slate-400">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-4 text-xs font-bold text-slate-400">No users found</div>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = selectedUserId === u.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setSelectedUserId(u.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow'
                          : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-extrabold flex items-center gap-1.5">
                            {u.full_name}
                            <span className="text-[10px] uppercase font-bold opacity-80">
                              {u.role}
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold opacity-75">
                            {u.email}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Handoff Note (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add instructions or notes..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
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
              disabled={loading || !selectedUserId}
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow"
            >
              {loading ? 'Assigning...' : 'Assign Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
