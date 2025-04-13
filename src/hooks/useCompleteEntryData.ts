
import { useStoolEntryData, StoolEntryData } from './useStoolEntryData';
import { useSymptomEntryData, SymptomEntryData, SelectedSymptom } from './useSymptomEntryData';
import { useMoodEntryData, MoodEntryData } from './useMoodEntryData';
import { useEntryTimeData } from './useEntryTimeData';
import { useEntrySaving } from './useEntrySaving';

export interface CompleteEntryData extends StoolEntryData, SymptomEntryData, MoodEntryData {
  entryTime: Date;
}

// Export the SelectedSymptom type explicitly
export type { SelectedSymptom };

export const useCompleteEntryData = () => {
  const {
    stoolData,
    handleStoolTypeSelect,
    handleStoolQuantitySelect,
    handleToggleBlood,
    handleToggleMucus,
    handleNotesChange,
    handleAddPhoto,
    resetStoolData,
    isStoolEntryValid
  } = useStoolEntryData();

  const {
    symptomData,
    handleSetSymptoms,
    resetSymptomData,
    hasSymptoms
  } = useSymptomEntryData();

  const {
    moodData,
    handleSetMoodLevel,
    handleSetStressLevel,
    handleSetSleepQuality,
    resetMoodData
  } = useMoodEntryData();

  const {
    entryTime,
    handleSetEntryTime,
    resetEntryTime
  } = useEntryTimeData();

  const {
    isSubmitting,
    saveCompleteEntry
  } = useEntrySaving();

  // Combine all data for easier access
  const entryData: CompleteEntryData = {
    ...stoolData,
    ...symptomData,
    ...moodData,
    entryTime
  };

  const resetEntryData = () => {
    resetStoolData();
    resetSymptomData();
    resetMoodData();
    resetEntryTime();
  };

  const isValidEntry = () => {
    // Vérifie si l'entrée est valide pour être enregistrée
    // Dans cette version, on vérifie si au moins une des données principales est présente
    return (
      isStoolEntryValid() ||
      hasSymptoms() ||
      stoolData.notes.trim().length > 0
    );
  };

  const handleSaveCompleteEntry = async () => {
    await saveCompleteEntry({
      stoolData,
      symptomData,
      moodData,
      entryTime,
      onSuccess: resetEntryData
    });
  };

  return {
    // Expose combined data
    entryData,
    
    // Expose submit state
    isSubmitting,
    
    // Expose all handlers
    handleStoolTypeSelect,
    handleStoolQuantitySelect,
    handleToggleBlood,
    handleToggleMucus,
    handleNotesChange,
    handleAddPhoto,
    handleSetSymptoms,
    handleSetMoodLevel,
    handleSetStressLevel,
    handleSetSleepQuality,
    handleSetEntryTime,
    
    // Expose utility functions
    resetEntryData,
    saveCompleteEntry: handleSaveCompleteEntry,
    isValidEntry
  };
};
