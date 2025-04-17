
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database.types';
import { toast } from 'sonner';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

// Fonctions pour le profil utilisateur
export const fetchUserProfile = async (): Promise<Profile | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast.error('Utilisateur non authentifié');
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();
      
    if (error) {
      toast.error('Erreur lors de la récupération du profil', {
        description: error.message
      });
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil:', error.message);
    return null;
  }
};

export const updateUserProfile = async (profile: Partial<Profile>): Promise<Profile | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast.error('Utilisateur non authentifié');
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.user.id)
      .select()
      .single();
      
    if (error) {
      toast.error('Erreur lors de la mise à jour du profil', {
        description: error.message
      });
      throw error;
    }
    
    toast.success('Profil mis à jour avec succès');
    return data;
  } catch (error: any) {
    toast.error('Erreur lors de la mise à jour du profil', {
      description: error.message
    });
    return null;
  }
};

// Hook pour écouter les mises à jour du profil en temps réel
export const useProfileUpdates = (userId: string, callback: (profile: Profile) => void) => {
  useRealtimeSubscription({
    table: 'profiles',
    event: 'UPDATE',
    callback: (payload) => {
      if (payload.new && payload.new.id === userId) {
        callback(payload.new as Profile);
      }
    }
  });
};
