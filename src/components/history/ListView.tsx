
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { EntryData } from '@/hooks/useEntryData';
import { EntryCard } from './EntryCard';

interface ListViewProps {
  entries: EntryData[];
}

export const ListView: React.FC<ListViewProps> = ({ entries }) => {
  // Group entries by date for the list view
  const groupedEntries: { [date: string]: EntryData[] } = {};
  entries.forEach(entry => {
    const dateKey = format(entry.time, 'yyyy-MM-dd');
    if (!groupedEntries[dateKey]) {
      groupedEntries[dateKey] = [];
    }
    groupedEntries[dateKey].push(entry);
  });

  // Sort dates in descending order (most recent first)
  const sortedDateKeys = Object.keys(groupedEntries).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Aucune entrée à afficher</p>
        </Card>
      ) : (
        sortedDateKeys.map((dateKey) => (
          <div key={dateKey}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {format(new Date(dateKey), 'EEEE dd MMMM yyyy', { locale: fr })}
            </h3>
            <div className="space-y-2">
              {groupedEntries[dateKey].map(entry => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
