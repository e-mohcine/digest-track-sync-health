
import { useState } from 'react';

export interface SelectedSymptom {
  id: number;
  name: string;
  intensity: number;
}

export interface SymptomEntryData {
  symptoms: SelectedSymptom[];
}

export const useSymptomEntryData = (initialData?: Partial<SymptomEntryData>) => {
  const [symptomData, setSymptomData] = useState<SymptomEntryData>({
    symptoms: initialData?.symptoms ?? [],
  });

  const handleSetSymptoms = (symptoms: SelectedSymptom[]) => {
    setSymptomData({ symptoms });
  };

  const resetSymptomData = () => {
    setSymptomData({ symptoms: [] });
  };

  const hasSymptoms = () => {
    return symptomData.symptoms.length > 0;
  };

  return {
    symptomData,
    handleSetSymptoms,
    resetSymptomData,
    hasSymptoms
  };
};
