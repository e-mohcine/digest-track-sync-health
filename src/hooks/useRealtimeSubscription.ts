
import { useEffect } from 'react';
import { subscribeToRealtimeChanges, RealtimeSubscriptionConfig } from '@/services/realtimeService';

export const useRealtimeSubscription = (config: RealtimeSubscriptionConfig) => {
  useEffect(() => {
    // S'abonner aux changements
    const unsubscribe = subscribeToRealtimeChanges(config);
    
    // Se désabonner lors du démontage
    return () => {
      unsubscribe();
    };
  }, [config.table, config.event]);
};
