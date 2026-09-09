import React, { useState } from 'react';
import { Ticket, Lock, Mail, User, ArrowRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginWithSupabase, signupWithSupabase, isSupabaseConfigured } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      if (tab === 'login') {
        await loginWithSupabase(email.trim(), password);
        toast.success('Signed in successfully');
      } else {
        if (!fullName.trim()) {
          toast.error('Please enter your full name');
          setLoading(false);
          return;
        }
        await signupWithSupabase(email.trim(), password, fullName.trim());
        toast.success('Account created successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">NexDesk</span>
            <span className="ml-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Ticket System</span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {tab === 'login' ? 'Access your tickets and dashboard' : 'Enter your details to create an account'}
            </p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'login' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'signup' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-800 dark:text-amber-200 text-xs font-semibold">
              Supabase configuration is missing. Check your .env file.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <span>{tab === 'login' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="w-full text-center py-4 text-xs font-semibold text-slate-400">
        NexDesk Ticket Management
      </footer>
    </div>
  );
}
