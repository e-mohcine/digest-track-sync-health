
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database.types';
import { toast } from 'sonner';

// Fonctions pour le profil utilisateur
export const fetchUserProfile = async (): Promise<Profile | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil:', error.message);
    return null;
  }
};

export const updateUserProfile = async (profile: Partial<Profile>): Promise<Profile | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Profil mis à jour avec succès');
    return data;
  } catch (error: any) {
    toast.error('Erreur lors de la mise à jour du profil', {
      description: error.message
    });
    return null;
  }
};
