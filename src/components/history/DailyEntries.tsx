
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { EntryData } from '@/hooks/useEntryData';

interface DailyEntriesProps {
  selectedDate: Date | undefined;
  entries: EntryData[];
}

export const DailyEntries: React.FC<DailyEntriesProps> = ({ selectedDate, entries }) => {
  if (!selectedDate || entries.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">
        Entrées du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
      </h3>
      <div className="space-y-2">
        {entries.map(entry => (
          <Card key={entry.id} className="p-3 hover:bg-muted/50 cursor-pointer">
            <div className="flex items-center">
              <div className={`bristol-type-${entry.type} w-10 h-10 rounded-full flex items-center justify-center mr-3`}>
                <span className="font-semibold">{entry.type}</span>
              </div>
              <div>
                <div className="font-medium">Type {entry.type}</div>
                <div className="text-sm text-muted-foreground">
                  {format(entry.time, 'HH:mm')}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
