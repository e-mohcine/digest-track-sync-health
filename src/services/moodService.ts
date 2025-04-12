
import { supabase } from '@/integrations/supabase/client';
import { MoodEntry } from '@/types/database.types';
import { toast } from 'sonner';

// Fonctions pour les entrées d'humeur
export const createMoodEntry = async (entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<MoodEntry | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast.error('Vous devez être connecté pour enregistrer une humeur');
      return null;
    }
    
    const { data, error } = await supabase
      .from('mood_entries')
      .insert({
        ...entry,
        user_id: user.user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Humeur enregistrée avec succès');
    return data;
  } catch (error: any) {
    toast.error('Erreur lors de l\'enregistrement de l\'humeur', {
      description: error.message
    });
    return null;
  }
};

export const fetchMoodEntries = async (): Promise<MoodEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .order('occurred_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des entrées d\'humeur:', error.message);
    return [];
  }
};
