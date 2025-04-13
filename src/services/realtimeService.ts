
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Fonctions pour gérer les abonnements en temps réel
export const subscribeToRealTimeUpdates = (
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
): () => void => {
  // Create the channel
  const channel = supabase.channel('schema-db-changes');
  
  // Subscribe to specific changes on the channel
  channel
    .on(
      'postgres_changes', 
      { 
        event: event, 
        schema: 'public', 
        table: table 
      },
      (payload) => callback(payload)
    )
    .subscribe();

  // Return a function to unsubscribe
  return () => {
    supabase.removeChannel(channel);
  };
};
