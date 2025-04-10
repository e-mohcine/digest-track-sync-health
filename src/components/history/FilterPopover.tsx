
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BristolType } from '@/components/stool/BristolType';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface FilterPopoverProps {
  onFilterSelect?: (type: number) => void;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({ onFilterSelect }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2 py-2">
          <h3 className="font-medium mb-2">Filtrer par type</h3>
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map(type => (
              <div 
                key={type} 
                className="flex items-center justify-center cursor-pointer"
                onClick={() => onFilterSelect && onFilterSelect(type)}
              >
                <BristolType type={type} size="sm" showLabel={false} />
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
