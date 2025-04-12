
import { useState } from 'react';

export interface MoodEntryData {
  moodLevel: number;
  stressLevel: number;
  sleepQuality: number;
}

export const useMoodEntryData = (initialData?: Partial<MoodEntryData>) => {
  const [moodData, setMoodData] = useState<MoodEntryData>({
    moodLevel: initialData?.moodLevel ?? 3,
    stressLevel: initialData?.stressLevel ?? 3,
    sleepQuality: initialData?.sleepQuality ?? 3,
  });

  const handleSetMoodLevel = (level: number) => {
    setMoodData(prev => ({ ...prev, moodLevel: level }));
  };
  
  const handleSetStressLevel = (level: number) => {
    setMoodData(prev => ({ ...prev, stressLevel: level }));
  };
  
  const handleSetSleepQuality = (level: number) => {
    setMoodData(prev => ({ ...prev, sleepQuality: level }));
  };

  const resetMoodData = () => {
    setMoodData({
      moodLevel: 3,
      stressLevel: 3,
      sleepQuality: 3,
    });
  };

  return {
    moodData,
    handleSetMoodLevel,
    handleSetStressLevel,
    handleSetSleepQuality,
    resetMoodData
  };
};
