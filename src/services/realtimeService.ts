
import { supabase } from '@/integrations/supabase/client';

export interface RealtimeSubscriptionConfig {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
}

export const subscribeToRealtimeChanges = (config: RealtimeSubscriptionConfig) => {
  const { table, event, callback } = config;
  
  const channelId = `realtime_${table}_${event}_${Date.now()}`;
  
  // Create subscription with the correct Supabase Realtime API format
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes', 
      {
        event: event,
        schema: 'public',
        table: table
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
  
  // Return an unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};
