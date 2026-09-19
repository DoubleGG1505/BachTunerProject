import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../store/slices/userSlice';
import { clearInventory } from '../store/slices/stringsSlice';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        dispatch(loginUser({
          name: session.user.user_metadata?.first_name || 'Violinista',
          lastName: session.user.user_metadata?.last_name || '',
          email: session.user.email || '',
        }));
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        dispatch(loginUser({
          name: session.user.user_metadata?.first_name || 'Violinista',
          lastName: session.user.user_metadata?.last_name || '',
          email: session.user.email || '',
        }));
      } else {
        dispatch(logoutUser());
        dispatch(clearInventory());
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);