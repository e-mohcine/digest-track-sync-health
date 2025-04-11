
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { StoolEntry } from '@/types/database.types';
import { Droplet, AlertTriangle } from 'lucide-react';

interface RecentEntriesListProps {
  entries: StoolEntry[];
}

const RecentEntriesList: React.FC<RecentEntriesListProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Aucune entrée récente</p>
        <p className="text-sm text-muted-foreground mt-2">
          Ajoutez votre première entrée en utilisant le bouton +
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {entries.map(entry => (
        <Card key={entry.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardContent className="p-3">
            <div className="flex items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                `bristol-type-${entry.bristol_type}`
              )}>
                <span className="font-semibold">{entry.bristol_type}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">Type {entry.bristol_type}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.occurred_at), { addSuffix: true, locale: fr })}
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
                  
                  {(entry.has_blood || entry.has_mucus || entry.notes) && (
                    <div className="flex gap-1 text-xs text-muted-foreground">
                      {entry.has_blood && (
                        <span className="flex items-center text-red-500">
                          <Droplet className="h-3 w-3 mr-0.5" />
                          Sang
                        </span>
                      )}
                      
                      {entry.has_mucus && (
                        <span className="flex items-center text-amber-500">
                          <AlertTriangle className="h-3 w-3 mr-0.5" />
                          Mucus
                        </span>
                      )}
                      
                      {entry.notes && <span>Notes</span>}
                    </div>
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
