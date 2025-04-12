
import { supabase } from '@/integrations/supabase/client';
import { UserBadge, Badge } from '@/types/database.types';

// Fonctions pour les badges
export const fetchUserBadges = async (): Promise<(UserBadge & { badge: Badge })[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) return [];
    
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badge:badge_id(*)')
      .eq('user_id', user.user.id)
      .order('earned_at', { ascending: false });
      
    if (error) throw error;
    
    return (data || []) as (UserBadge & { badge: Badge })[];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des badges:', error.message);
    return [];
  }
};

export const fetchAllBadges = async (): Promise<Badge[]> => {
  try {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('difficulty', { ascending: true });
      
    if (error) throw error;
    
    return data || [];
  } catch (error: any) {
    console.error('Erreur lors de la récupération des badges disponibles:', error.message);
    return [];
  }
};
