
import Cookies from 'js-cookie';
import { EntryData } from '@/hooks/useEntryData';

const ENTRIES_COOKIE_KEY = 'intestitrack_entries';
const USER_PROFILE_COOKIE_KEY = 'intestitrack_user_profile';
const COOKIE_EXPIRATION = 30; // jours

export const saveEntryToCookies = (entry: EntryData): void => {
  try {
    const existingEntries = getEntriesFromCookies();
    const newEntries = [...existingEntries, entry];
    Cookies.set(ENTRIES_COOKIE_KEY, JSON.stringify(newEntries), { expires: COOKIE_EXPIRATION });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des entrées dans les cookies:', error);
  }
};

export const getEntriesFromCookies = (): EntryData[] => {
  try {
    const entriesCookie = Cookies.get(ENTRIES_COOKIE_KEY);
    
    if (!entriesCookie) {
      return [];
    }
    
    const entries = JSON.parse(entriesCookie);
    
    // Convertir les chaînes de date en objets Date
    return entries.map((entry: any) => ({
      ...entry,
      time: new Date(entry.time)
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des entrées depuis les cookies:', error);
    return [];
  }
};

export const saveUserProfileToCookies = (profile: any): void => {
  try {
    Cookies.set(USER_PROFILE_COOKIE_KEY, JSON.stringify(profile), { expires: COOKIE_EXPIRATION });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du profil dans les cookies:', error);
  }
};

export const getUserProfileFromCookies = (): any => {
  try {
    const profileCookie = Cookies.get(USER_PROFILE_COOKIE_KEY);
    
    if (!profileCookie) {
      return null;
    }
    
    return JSON.parse(profileCookie);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil depuis les cookies:', error);
    return null;
  }
};

export const clearCookies = (): void => {
  Cookies.remove(ENTRIES_COOKIE_KEY);
  Cookies.remove(USER_PROFILE_COOKIE_KEY);
};
