/**
 * Authentication Hook
 * 
 * Custom hook for managing authentication state and operations
 */

import { getSession, signIn, signOut, signUp } from '@/services/auth';
import { supabase } from '@/services/supabase';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(session?.user ?? null);

  useEffect(() => {
    // Get initial session
    getSession().then(({ data }) => {
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update user when session changes
  useEffect(() => {
    setUser(session?.user ?? null);
  }, [session]);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!session,
  };
}

