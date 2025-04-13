
import { supabase } from '@/integrations/supabase/client';

// Fonctions pour gérer les abonnements en temps réel
export const subscribeToRealTimeUpdates = (
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
): () => void => {
  const channel = supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes', 
      { 
        event, 
        schema: 'public', 
        table 
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
