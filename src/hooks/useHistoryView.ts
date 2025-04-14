
import { useState, useEffect, useCallback } from 'react';
import { getEntries } from '@/services/storageService';
import { EntryData } from '@/hooks/useEntryData';

export type ViewType = 'calendar' | 'list' | 'nutrition';

export const useHistoryView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewType>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<EntryData[]>([]);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  
  // Chargement initial des entrées
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const storedEntries = await getEntries();
        setEntries(storedEntries);
        setFilteredEntries(storedEntries);
      } catch (error) {
        console.error('Erreur lors du chargement des entrées:', error);
        setEntries([]);
        setFilteredEntries([]);
      }
    };
    
    loadEntries();
  }, []);

  // Mise à jour des entrées filtrées lorsque les entrées changent
  useEffect(() => {
    if (activeFilter === null) {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(entry => entry.type === activeFilter);
      setFilteredEntries(filtered);
    }
  }, [entries, activeFilter]);

  const handleMonthChange = useCallback((increment: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + increment);
    setDate(newDate);
  }, [date]);

  const handleFilterSelect = useCallback((type: number | null) => {
    setActiveFilter(type);
    
    if (type === null) {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(entry => entry.type === type);
      setFilteredEntries(filtered);
    }
  }, [entries]);

  return {
    date,
    view,
    selectedDate,
    entries: filteredEntries,
    allEntries: entries,
    activeFilter,
    setView,
    setSelectedDate,
    handleMonthChange,
    handleFilterSelect,
    setEntries
  };
};
