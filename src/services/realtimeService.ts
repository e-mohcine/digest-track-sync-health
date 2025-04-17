
import { supabase } from '@/integrations/supabase/client';

export interface RealtimeSubscriptionConfig {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
}

export const subscribeToRealtimeChanges = (config: RealtimeSubscriptionConfig) => {
  const { table, event, callback } = config;
  
  const channelId = `realtime_${table}_${event}_${Date.now()}`;
  
  // Create subscription with the correct API format
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes', // This is the event source
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
  
  return () => {
    supabase.removeChannel(channel);
  };
};
