
import { useState } from 'react';

export interface StoolEntryData {
  stoolType: number | null;
  stoolQuantity: string | null;
  hasBlood: boolean;
  hasMucus: boolean;
  notes: string;
  hasPhoto: boolean;
}

export const useStoolEntryData = (initialData?: Partial<StoolEntryData>) => {
  const [stoolData, setStoolData] = useState<StoolEntryData>({
    stoolType: initialData?.stoolType ?? null,
    stoolQuantity: initialData?.stoolQuantity ?? null,
    hasBlood: initialData?.hasBlood ?? false,
    hasMucus: initialData?.hasMucus ?? false,
    notes: initialData?.notes ?? '',
    hasPhoto: initialData?.hasPhoto ?? false,
  });

  const handleStoolTypeSelect = (type: number) => {
    setStoolData(prev => ({ ...prev, stoolType: type }));
  };

  const handleStoolQuantitySelect = (quantity: string) => {
    setStoolData(prev => ({ ...prev, stoolQuantity: quantity }));
  };
  
  const handleToggleBlood = (value: boolean) => {
    setStoolData(prev => ({ ...prev, hasBlood: value }));
  };
  
  const handleToggleMucus = (value: boolean) => {
    setStoolData(prev => ({ ...prev, hasMucus: value }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStoolData(prev => ({ ...prev, notes: e.target.value }));
  };

  const handleAddPhoto = () => {
    setStoolData(prev => ({ ...prev, hasPhoto: true }));
  };

  const resetStoolData = () => {
    setStoolData({
      stoolType: null,
      stoolQuantity: null,
      hasBlood: false,
      hasMucus: false,
      notes: '',
      hasPhoto: false,
    });
  };

  const isStoolEntryValid = () => {
    return stoolData.stoolType !== null && stoolData.stoolQuantity !== null;
  };

  return {
    stoolData,
    handleStoolTypeSelect,
    handleStoolQuantitySelect,
    handleToggleBlood,
    handleToggleMucus,
    handleNotesChange,
    handleAddPhoto,
    resetStoolData,
    isStoolEntryValid
  };
};
