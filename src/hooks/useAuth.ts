
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurer l'écouteur d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state change:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    // Vérifier s'il y a une session existante
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    // Nettoyer l'écouteur lors du démontage
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    signedIn: !!user,
  };
};
