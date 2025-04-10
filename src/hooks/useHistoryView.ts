
import { useState, useEffect } from 'react';
import { getEntries } from '@/services/storageService';
import { EntryData } from '@/hooks/useEntryData';

export type ViewType = 'calendar' | 'list';

export const useHistoryView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<ViewType>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<EntryData[]>([]);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  
  // Load entries from localStorage when component mounts
  useEffect(() => {
    const storedEntries = getEntries();
    setEntries(storedEntries);
    setFilteredEntries(storedEntries);
  }, []);

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + increment);
    setDate(newDate);
  };

  const handleFilterSelect = (type: number | null) => {
    setActiveFilter(type);
    
    if (type === null) {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(entry => entry.type === type);
      setFilteredEntries(filtered);
    }
  };

  return {
    date,
    view,
    selectedDate,
    entries: filteredEntries,
    activeFilter,
    setView,
    setSelectedDate,
    handleMonthChange,
    handleFilterSelect
  };
};
