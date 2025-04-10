
import { EntryData } from '@/hooks/useEntryData';
import { saveEntryToCookies, getEntriesFromCookies } from './cookieService';

const ENTRIES_KEY = 'intestitrack_entries';

export const saveEntry = (entry: EntryData): void => {
  // Sauvegarde dans localStorage
  const existingEntries = getEntries();
  const newEntries = [...existingEntries, entry];
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(newEntries));
  
  // Sauvegarde secondaire dans les cookies
  saveEntryToCookies(entry);
  
  // Note: Quand Supabase sera intégré, nous ajouterons ici la sauvegarde dans Supabase
};

export const getEntries = (): EntryData[] => {
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
      time: new Date(entry.time)
    }));
  } catch (error) {
    console.error('Error parsing entries from localStorage:', error);
    
    // En cas d'erreur, on essaie de récupérer depuis les cookies
    return getEntriesFromCookies();
  }
};

export const getEntriesByDate = (date: Date): EntryData[] => {
  const entries = getEntries();
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
