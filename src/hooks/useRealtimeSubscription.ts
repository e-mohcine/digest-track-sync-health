
import { useEffect, useRef } from 'react';
import { subscribeToRealtimeChanges, RealtimeSubscriptionConfig } from '@/services/realtimeService';

export const useRealtimeSubscription = (config: RealtimeSubscriptionConfig) => {
  // Store the configuration in a ref to avoid unnecessary re-subscriptions
  const configRef = useRef(config);
  
  useEffect(() => {
    // Update the reference if config changes
    configRef.current = config;
    
    // Subscribe to changes
    const unsubscribe = subscribeToRealtimeChanges(configRef.current);
    
    // Unsubscribe when component unmounts
    return () => {
      unsubscribe();
    };
  }, [config.table, config.event, config.callback]);
};
