
import { EntryData } from '@/hooks/useEntryData';
import { saveEntryToCookies, getEntriesFromCookies } from './cookieService';
import { supabase } from '@/integrations/supabase/client';
import { StoolEntry } from '@/types/database.types';

const ENTRIES_KEY = 'intestitrack_entries';

// Convertir les entrées Supabase en format EntryData
const convertSupabaseEntriesToEntryData = (entries: StoolEntry[]): EntryData[] => {
  return entries.map(entry => ({
    id: entry.id,
    type: entry.bristol_type,
    quantity: entry.quantity,
    notes: entry.notes || '',
    time: new Date(entry.occurred_at),
    hasPhoto: entry.has_photo || false,
    hasBlood: entry.has_blood || false,
    hasMucus: entry.has_mucus || false
  }));
};

export const saveEntry = (entry: EntryData): void => {
  // Sauvegarde dans localStorage
  const existingEntries = JSON.parse(localStorage.getItem(ENTRIES_KEY) || '[]');
  const newEntries = [...existingEntries, entry];
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(newEntries));
  
  // Sauvegarde secondaire dans les cookies
  saveEntryToCookies(entry);
};

export const getEntries = async (): Promise<EntryData[]> => {
  // Essayer d'abord de récupérer les entrées depuis Supabase
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (user.user) {
      const { data: stoolEntries, error } = await supabase
        .from('stool_entries')
        .select('*')
        .order('occurred_at', { ascending: false });
        
      if (!error && stoolEntries.length > 0) {
        return convertSupabaseEntriesToEntryData(stoolEntries);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des entrées depuis Supabase:', error);
  }
  
  // Si on ne peut pas récupérer depuis Supabase, on utilise le localStorage
  const storedEntries = localStorage.getItem(ENTRIES_KEY);
  
  if (!storedEntries) {
    // Si pas d'entrées dans localStorage, on essaie de récupérer depuis les cookies
    return getEntriesFromCookies();
  }
  
  try {
    const entries = JSON.parse(storedEntries);
    
    // Convertir les chaînes de date en objets Date
    return entries.map((entry: any) => ({
      ...entry,
      time: new Date(entry.time),
      hasBlood: entry.hasBlood || false,
      hasMucus: entry.hasMucus || false
    }));
  } catch (error) {
    console.error('Error parsing entries from localStorage:', error);
    
    // En cas d'erreur, on essaie de récupérer depuis les cookies
    return getEntriesFromCookies();
  }
};

export const getEntriesByDate = async (date: Date): Promise<EntryData[]> => {
  const entries = await getEntries();
  return entries.filter((entry) => {
    const entryDate = new Date(entry.time);
    return (
      entryDate.getDate() === date.getDate() &&
      entryDate.getMonth() === date.getMonth() &&
      entryDate.getFullYear() === date.getFullYear()
    );
  });
};

export const clearEntries = (): void => {
  localStorage.removeItem(ENTRIES_KEY);
  // Aussi supprimer des cookies quand on efface les entrées
  // Note: Quand Supabase sera intégré, nous ajouterons ici la suppression dans Supabase
};
