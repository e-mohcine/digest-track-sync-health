
import { useEffect } from 'react';
import { subscribeToRealTimeUpdates } from '@/services/realtimeService';

/**
 * Hook to subscribe to realtime updates for a table
 * @param table The table to subscribe to
 * @param event The event to listen for (INSERT, UPDATE, DELETE, or *)
 * @param callback The callback to execute when the event occurs
 */
export const useRealtimeSubscription = (
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
) => {
  useEffect(() => {
    // Set up subscription
    const unsubscribe = subscribeToRealTimeUpdates(table, event, callback);
    
    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [table, event, callback]);
};
