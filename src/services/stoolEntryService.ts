
import { supabase } from '@/integrations/supabase/client';
import { StoolEntry } from '@/types/database.types';
import { toast } from 'sonner';

// Fonctions pour les entrées de selles
export const fetchStoolEntries = async (): Promise<StoolEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('stool_entries')
      .select('*')
      .order('occurred_at', { ascending: false });
      
    if (error) throw error;
    
    return (data || []) as StoolEntry[];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des entrées de selles:', error.message);
    return [];
  }
};

export const createStoolEntry = async (entry: Omit<StoolEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<StoolEntry | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast.error('Vous devez être connecté pour enregistrer une entrée');
      return null;
    }
    
    const { data, error } = await supabase
      .from('stool_entries')
      .insert({
        ...entry,
        user_id: user.user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Entrée enregistrée avec succès');
    return data as StoolEntry;
  } catch (error: any) {
    toast.error('Erreur lors de l\'enregistrement de l\'entrée', {
      description: error.message
    });
    return null;
  }
};
