
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const RecentEntriesList = () => {
  // Placeholder data
  const entries = [
    { id: 1, date: new Date(2025, 3, 10, 10, 30), type: 4, quantity: 'normal', hasNotes: true },
    { id: 2, date: new Date(2025, 3, 10, 8, 0), type: 5, quantity: 'small', hasNotes: false },
    { id: 3, date: new Date(2025, 3, 9, 19, 45), type: 6, quantity: 'large', hasNotes: true },
    { id: 4, date: new Date(2025, 3, 9, 14, 15), type: 3, quantity: 'normal', hasNotes: false },
  ];

  return (
    <div className="space-y-3">
      {entries.map(entry => (
        <Card key={entry.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardContent className="p-3">
            <div className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                `bristol-type-${entry.type}`
              )}>
                <span className="font-semibold">{entry.type}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">Type {entry.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(entry.date, { addSuffix: true, locale: fr })}
                  </p>
                </div>
                <div className="flex items-center mt-0.5">
                  <span className={cn(
                    "inline-block px-2 py-0.5 rounded-full text-xs mr-2",
                    entry.quantity === 'small' && "bg-intestitrack-blue-light text-intestitrack-blue",
                    entry.quantity === 'normal' && "bg-intestitrack-green-light text-intestitrack-green",
                    entry.quantity === 'large' && "bg-intestitrack-alert-light text-intestitrack-alert",
                  )}>
                    {entry.quantity === 'small' ? 'Faible' : 
                     entry.quantity === 'normal' ? 'Normale' : 'Abondante'}
                  </span>
                  {entry.hasNotes && (
                    <span className="text-xs text-muted-foreground">Avec notes</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentEntriesList;
