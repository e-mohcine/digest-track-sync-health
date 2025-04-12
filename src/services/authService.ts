
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile } from '@/types/database.types';

// Fonctions d'authentification
export const signUp = async (email: string, password: string, userData: { first_name: string, last_name: string }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    
    toast.success('Compte créé avec succès', {
      description: 'Veuillez vérifier votre email pour confirmer votre compte'
    });
    
    return data;
  } catch (error: any) {
    toast.error('Erreur lors de la création du compte', {
      description: error.message
    });
    return null;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    toast.success('Connexion réussie');
    return data;
  } catch (error: any) {
    toast.error('Erreur de connexion', {
      description: error.message
    });
    return null;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    toast.success('Déconnexion réussie');
    return true;
  } catch (error: any) {
    toast.error('Erreur lors de la déconnexion', {
      description: error.message
    });
    return false;
  }
};
