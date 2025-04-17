
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeSubscriptionConfig {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
}

export const subscribeToRealtimeChanges = (config: RealtimeSubscriptionConfig): () => void => {
  const { table, event, callback } = config;
  
  const channelId = `realtime_${table}_${event}_${Date.now()}`;
  
  // Using the correct type assertion to fix the TypeScript error
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes' as any,
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
