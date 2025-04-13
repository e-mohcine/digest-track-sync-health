
import { useEffect, useCallback } from 'react';
import { subscribeToRealTimeUpdates } from '@/services/realtimeService';

interface UseRealtimeSubscriptionProps {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
  enabled?: boolean;
}

export const useRealtimeSubscription = ({
  table,
  event,
  callback,
  enabled = true
}: UseRealtimeSubscriptionProps) => {
  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    if (!enabled) return;
    
    // S'abonner aux modifications en temps réel
    const unsubscribe = subscribeToRealTimeUpdates(table, event, memoizedCallback);
    
    // Se désabonner lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, [table, event, memoizedCallback, enabled]);
};
