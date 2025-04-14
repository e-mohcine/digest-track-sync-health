
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * S'abonne aux modifications en temps réel d'une table PostgreSQL dans Supabase.
 * @param tableName - Nom de la table à observer
 * @param event - Type d'événement ('INSERT', 'UPDATE', 'DELETE' ou '*')
 * @param callback - Fonction à exécuter lors de la réception d'un événement
 * @returns Une fonction pour se désabonner
 */
export function subscribeToRealTimeUpdates(
  tableName: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
): () => void {
  // Pour la version récente de Supabase, nous devons utiliser cette syntaxe
  const channel = supabase.channel(`table-changes-${tableName}`);
  
  // Configuration du channel pour écouter les changements Postgres
  channel
    .on(
      'postgres_changes', 
      {
        event: event, 
        schema: 'public', 
        table: tableName 
      }, 
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  // Retourner une fonction pour se désabonner
  return () => {
    supabase.removeChannel(channel);
  };
}
