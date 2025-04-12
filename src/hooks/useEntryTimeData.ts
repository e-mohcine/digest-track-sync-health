
import { useState } from 'react';

export interface EntryTimeData {
  entryTime: Date;
}

export const useEntryTimeData = (initialData?: Partial<EntryTimeData>) => {
  const [entryTime, setEntryTime] = useState<Date>(initialData?.entryTime ?? new Date());

  const handleSetEntryTime = (time: Date) => {
    setEntryTime(time);
  };

  const resetEntryTime = () => {
    setEntryTime(new Date());
  };

  return {
    entryTime,
    handleSetEntryTime,
    resetEntryTime
  };
};
