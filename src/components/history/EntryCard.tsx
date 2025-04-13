
import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { EntryData } from '@/hooks/useEntryData';
import { BristolIllustration } from '@/components/stool/BristolIllustration';
import { Droplet, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EntryCardProps {
  entry: EntryData;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry }) => {
  return (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardContent className="p-3">
        <div className="flex items-center">
          <div className="mr-3">
            <BristolIllustration type={entry.type} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="font-medium">Type {entry.type}</p>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(entry.time, { addSuffix: true, locale: fr })}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(entry.time, 'HH:mm', { locale: fr })}
            </div>
            
            <div className="flex items-center mt-2">
              <span className={cn(
                "inline-block px-2 py-0.5 rounded-full text-xs mr-2",
                entry.quantity === 'small' && "bg-intestitrack-blue-light text-intestitrack-blue",
                entry.quantity === 'normal' && "bg-intestitrack-green-light text-intestitrack-green",
                entry.quantity === 'large' && "bg-intestitrack-alert-light text-intestitrack-alert",
              )}>
                {entry.quantity === 'small' ? 'Faible' : 
                 entry.quantity === 'normal' ? 'Normale' : 'Abondante'}
              </span>
              
              {(entry.hasBlood || entry.hasMucus) && (
                <div className="flex gap-2 text-xs">
                  {entry.hasBlood && (
                    <span className="flex items-center text-red-500">
                      <Droplet className="h-3 w-3 mr-0.5" />
                      Sang
                    </span>
                  )}
                  
                  {entry.hasMucus && (
                    <span className="flex items-center text-amber-500">
                      <AlertTriangle className="h-3 w-3 mr-0.5" />
                      Mucus
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {entry.notes && (
              <p className="text-xs text-muted-foreground mt-2">
                {entry.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
