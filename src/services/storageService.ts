
import { EntryData } from '@/hooks/useEntryData';

const ENTRIES_KEY = 'intestitrack_entries';

export const saveEntry = (entry: EntryData): void => {
  const existingEntries = getEntries();
  const newEntries = [...existingEntries, entry];
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(newEntries));
};

export const getEntries = (): EntryData[] => {
  const storedEntries = localStorage.getItem(ENTRIES_KEY);
  
  if (!storedEntries) {
    return [];
  }
  
  try {
    const entries = JSON.parse(storedEntries);
    
    // Convert string dates back to Date objects
    return entries.map((entry: any) => ({
      ...entry,
      time: new Date(entry.time)
    }));
  } catch (error) {
    console.error('Error parsing entries from localStorage:', error);
    return [];
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
};
