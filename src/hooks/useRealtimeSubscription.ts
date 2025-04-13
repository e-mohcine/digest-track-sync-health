
import { useEffect } from 'react';
import { subscribeToRealTimeUpdates } from '@/services/realtimeService';

interface UseRealtimeSubscriptionProps {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
}

export const useRealtimeSubscription = ({
  table,
  event,
  callback
}: UseRealtimeSubscriptionProps) => {
  useEffect(() => {
    const unsubscribe = subscribeToRealTimeUpdates(table, event, callback);
    
    return () => {
      unsubscribe();
    };
  }, [table, event, callback]);
};
