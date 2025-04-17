
import { useEffect, useRef } from 'react';
import { subscribeToRealtimeChanges, RealtimeSubscriptionConfig } from '@/services/realtimeService';

export const useRealtimeSubscription = (config: RealtimeSubscriptionConfig) => {
  // Stocker la configuration dans une référence pour éviter les réabonnements inutiles
  const configRef = useRef(config);
  
  useEffect(() => {
    // Mettre à jour la référence si la configuration change
    configRef.current = config;
    
    // S'abonner aux changements
    const unsubscribe = subscribeToRealtimeChanges(configRef.current);
    
    // Se désabonner lorsque le composant se démonte
    return () => {
      unsubscribe();
    };
  }, [config.table, config.event]);  // Ne pas inclure callback dans les dépendances pour éviter les réabonnements inutiles
};
