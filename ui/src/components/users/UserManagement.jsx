import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, User, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function UserManagement({ tickets = [] }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers(searchQuery.trim(), { exclude_admin: true });
      setUsers(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load user list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const filteredUsers = users.filter(u => {
    if (u.role === 'admin') return false;
    if (!trimmedQuery) return true;
    return (
      (u.full_name || '').toLowerCase().includes(trimmedQuery) ||
      (u.email || '').toLowerCase().includes(trimmedQuery) ||
      (u.category || '').toLowerCase().includes(trimmedQuery) ||
      (u.id || '').toLowerCase().includes(trimmedQuery)
    );
  });

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Users Directory
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            View active users, roles, and workload distribution.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {filteredUsers.length} Users
        </span>
      </div>

      {loading && users.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-sm font-bold">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center shadow-sm text-slate-500 text-sm font-bold">
          No users match the search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((u) => {
            const userAssignedTickets = tickets.filter(t => t.current_assignee_id === u.id && !t.deleted_at);
            const userCreatedTickets = tickets.filter(t => t.creator_id === u.id && !t.deleted_at);
            const isAdmin = u.role === 'admin';

            return (
              <div
                key={u.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold shrink-0">
                        {isAdmin ? <Shield className="w-6 h-6 text-purple-600" /> : <User className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {u.full_name}
                        </h3>
                        <span className="text-xs font-semibold text-slate-400 block mt-0.5">
                          {u.email}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {u.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                      <div className="text-xs font-bold text-slate-400">Assigned</div>
                      <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                        {userAssignedTickets.length}
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                      <div className="text-xs font-bold text-slate-400">Created</div>
                      <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {userCreatedTickets.length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>ID: {u.id}</span>
                  <span>Joined {formatDate(u.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
