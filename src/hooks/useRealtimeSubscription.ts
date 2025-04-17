
import { useEffect, useRef } from 'react';
import { subscribeToRealtimeChanges, RealtimeSubscriptionConfig } from '@/services/realtimeService';

export const useRealtimeSubscription = (config: RealtimeSubscriptionConfig) => {
  const configRef = useRef(config);
  
  useEffect(() => {
    configRef.current = config;
    
    const unsubscribe = subscribeToRealtimeChanges(configRef.current);
    
    return () => {
      unsubscribe();
    };
  }, [config.table, config.event]);
};
