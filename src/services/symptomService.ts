
import { supabase } from '@/integrations/supabase/client';
import { SymptomType, SymptomEntry } from '@/types/database.types';
import { toast } from 'sonner';

// Fonctions pour les symptômes
export const fetchSymptomTypes = async (): Promise<SymptomType[]> => {
  try {
    const { data, error } = await supabase
      .from('symptom_types')
      .select('*')
      .order('category', { ascending: true });
      
    if (error) throw error;
    
    return (data || []) as SymptomType[];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des types de symptômes:', error.message);
    return [];
  }
};

export const createSymptomEntry = async (entry: Omit<SymptomEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<SymptomEntry | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast.error('Vous devez être connecté pour enregistrer un symptôme');
      return null;
    }
    
    const { data, error } = await supabase
      .from('symptom_entries')
      .insert({
        ...entry,
        user_id: user.user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Symptôme enregistré avec succès');
    return data;
  } catch (error: any) {
    toast.error('Erreur lors de l\'enregistrement du symptôme', {
      description: error.message
    });
    return null;
  }
};

export const fetchSymptomEntries = async (): Promise<SymptomEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('symptom_entries')
      .select('*')
      .order('occurred_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des entrées de symptômes:', error.message);
    return [];
  }
};
