
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeSubscriptionConfig {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
}

export const subscribeToRealtimeChanges = (config: RealtimeSubscriptionConfig) => {
  const { table, event, callback } = config;
  
  const channelId = `realtime_${table}_${event}_${Date.now()}`;
  
  // Utiliser la syntaxe correcte pour s'abonner aux changements
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes', 
      {
        event: event,
        schema: 'public',
        table: table
      },
      callback
    )
    .subscribe();
  
  // Retourner une fonction pour se désabonner
  return () => {
    supabase.removeChannel(channel);
  };
};
