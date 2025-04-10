
import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EntryData } from '@/hooks/useEntryData';

interface EntryCardProps {
  entry: EntryData;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry }) => {
  return (
    <Card key={entry.id} className="p-3 hover:bg-muted/50 cursor-pointer">
      <div className="flex items-center">
        <div className={`bristol-type-${entry.type} w-10 h-10 rounded-full flex items-center justify-center mr-3`}>
          <span className="font-semibold">{entry.type}</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <span className="font-medium">Type {entry.type}</span>
            <span className="text-sm text-muted-foreground">
              {format(new Date(entry.time), 'HH:mm')}
            </span>
          </div>
          <div className="flex items-center mt-1">
            <span className={cn(
              "inline-block px-2 py-0.5 rounded-full text-xs mr-2",
              entry.quantity === 'small' ? 'bg-intestitrack-blue-light text-intestitrack-blue' :
              entry.quantity === 'normal' ? 'bg-intestitrack-green-light text-intestitrack-green' :
              'bg-intestitrack-alert-light text-intestitrack-alert'
            )}>
              {entry.quantity === 'small' ? 'Faible' : 
              entry.quantity === 'normal' ? 'Normale' : 'Abondante'}
            </span>
            {entry.notes && (
              <span className="text-xs text-muted-foreground">Avec notes</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
