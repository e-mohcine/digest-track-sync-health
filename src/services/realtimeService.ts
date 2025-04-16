
import { supabase } from '@/integrations/supabase/client';

export interface RealtimeSubscriptionConfig {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
}

/**
 * Crée un canal Supabase pour s'abonner aux changements en temps réel d'une table spécifique.
 * 
 * @param config Configuration de l'abonnement en temps réel
 * @returns Fonction pour se désabonner du canal
 */
export const subscribeToRealtimeChanges = (config: RealtimeSubscriptionConfig) => {
  const { table, event, callback } = config;
  
  // Création d'un canal unique pour cette souscription
  const channelId = `realtime_${table}_${event}_${Date.now()}`;
  
  // S'abonner aux changements en temps réel avec la syntaxe correcte
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes', 
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
  
  // Renvoyer une fonction de nettoyage pour se désabonner
  return () => {
    supabase.removeChannel(channel);
  };
};
