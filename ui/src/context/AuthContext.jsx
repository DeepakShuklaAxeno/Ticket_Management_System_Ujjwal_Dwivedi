import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const applySession = async (nextSession) => {
    if (!nextSession) {
      api.setAuth(null);
      setSession(null);
      setUser(null);
      localStorage.removeItem('cached_user_profile');
      return;
    }

    api.setAuth(nextSession.access_token);
    setSession(nextSession);

    try {
      const profile = await api.getProfile();
      const userObj = {
        ...profile,
        email: profile.email || nextSession.user.email
      };
      setUser(userObj);
      localStorage.setItem('cached_user_profile', JSON.stringify(userObj));
    } catch (err) {
      console.warn('Profile fetch error, falling back to session user/cache:', err);
      const cached = localStorage.getItem('cached_user_profile');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          setUser({
            id: nextSession.user.id,
            full_name: nextSession.user.user_metadata?.full_name || nextSession.user.email?.split('@')[0] || 'User',
            email: nextSession.user.email,
            role: nextSession.user.user_metadata?.role || 'user'
          });
        }
      } else {
        setUser({
          id: nextSession.user.id,
          full_name: nextSession.user.user_metadata?.full_name || nextSession.user.email?.split('@')[0] || 'User',
          email: nextSession.user.email,
          role: nextSession.user.user_metadata?.role || 'user'
        });
      }
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!active) return;
      try {
        if (currentSession) {
          await applySession(currentSession);
        }
      } catch (error) {
        console.error('Session load error', error);
      } finally {
        if (active) setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!active) return;
      try {
        await applySession(nextSession);
      } catch (error) {
        console.error('Auth state change error', error);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginWithSupabase = async (email, password) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await applySession(data.session);
    return data;
  };

  const signupWithSupabase = async (email, password, fullName) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) throw error;
    if (data.session) await applySession(data.session);
    return data;
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    await applySession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || null,
      isAdmin: user?.role === 'admin',
      token: session?.access_token || null,
      session,
      loading,
      isLiveSupabase: Boolean(session),
      isSupabaseConfigured,
      loginWithSupabase,
      signupWithSupabase,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
