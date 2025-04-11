import { supabase } from '@/integrations/supabase/client';
import { 
  StoolEntry, 
  SymptomEntry, 
  SymptomType, 
  MoodEntry,
  Profile,
  Medication,
  MedicationLog,
  FoodEntry,
  FoodCategory,
  UserBadge,
  Badge,
  MedicalNote
} from '@/types/database.types';
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

// Fonctions pour gérer les abonnements en temps réel
export const subscribeToRealTimeUpdates = (
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
) => {
  const channel = supabase
    .channel('schema-db-changes')
    .on('postgres_changes', 
      {
        event: event,
        schema: 'public',
        table: table
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

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
