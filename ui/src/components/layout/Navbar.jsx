import React, { useState } from 'react';
import { Ticket, Users, Plus, Sun, Moon, LogOut, ChevronDown, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ activeTab, setActiveTab, onOpenCreateModal, onOpenRulesModal }) {
  const { user, role, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2.5" onClick={() => setActiveTab('tickets')}>
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">NexDesk</span>
          </button>

          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'tickets'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Ticket className="w-4 h-4" /> Tickets
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'users'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" /> Users Directory
              </button>
            )}

            <button
              onClick={onOpenRulesModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" /> Access Rules
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/70 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">{user?.full_name}</div>
                <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">{role}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-2 z-50">
                <div className="px-3 py-2 text-xs font-bold text-slate-500 truncate">{user?.email}</div>
                <button
                  onClick={async () => {
                    setShowMenu(false);
                    await logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
