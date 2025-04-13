
import { useState } from 'react';

export interface EntryData {
  id?: string;
  type: number | null;
  quantity: string | null;
  notes: string;
  time: Date;
  hasPhoto: boolean;
  hasBlood?: boolean;
  hasMucus?: boolean;
}

export const useEntryData = () => {
  const [entryData, setEntryData] = useState<EntryData>({
    type: null,
    quantity: null,
    notes: '',
    time: new Date(),
    hasPhoto: false,
    hasBlood: false,
    hasMucus: false
  });

  const handleTypeSelect = (type: number) => {
    setEntryData(prev => ({ ...prev, type }));
  };

  const handleQuantitySelect = (quantity: string) => {
    setEntryData(prev => ({ ...prev, quantity }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntryData(prev => ({ ...prev, notes: e.target.value }));
  };

  const handleAddPhoto = () => {
    setEntryData(prev => ({ ...prev, hasPhoto: true }));
  };
  
  const handleToggleBlood = (value: boolean) => {
    setEntryData(prev => ({ ...prev, hasBlood: value }));
  };
  
  const handleToggleMucus = (value: boolean) => {
    setEntryData(prev => ({ ...prev, hasMucus: value }));
  };

  const resetEntryData = () => {
    setEntryData({
      type: null,
      quantity: null,
      notes: '',
      time: new Date(),
      hasPhoto: false,
      hasBlood: false,
      hasMucus: false
    });
  };

  const isValid = entryData.type !== null && entryData.quantity !== null;

  return {
    entryData,
    handleTypeSelect,
    handleQuantitySelect,
    handleNotesChange,
    handleAddPhoto,
    handleToggleBlood,
    handleToggleMucus,
    resetEntryData,
    isValid
  };
};
