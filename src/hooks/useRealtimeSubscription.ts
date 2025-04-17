
import { useEffect, useRef } from 'react';
import { subscribeToRealtimeChanges, RealtimeSubscriptionConfig } from '@/services/realtimeService';

export const useRealtimeSubscription = (config: RealtimeSubscriptionConfig) => {
  // Utiliser useRef pour stocker la configuration et éviter les re-abonnements inutiles
  const configRef = useRef(config);
  
  useEffect(() => {
    // Mettre à jour la référence si la configuration change
    configRef.current = config;
    
    // S'abonner aux changements
    const unsubscribe = subscribeToRealtimeChanges(configRef.current);
    
    // Se désabonner lors du démontage
    return () => {
      unsubscribe();
    };
  }, [config.table, config.event, config.callback]);
};
