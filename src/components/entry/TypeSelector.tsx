
import React from 'react';
import { BristolType } from '@/components/stool/BristolType';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TypeSelectorProps {
  selectedType: number | null;
  onTypeSelect: (type: number) => void;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({ 
  selectedType, 
  onTypeSelect 
}) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Sélectionnez le type selon l'échelle de Bristol</h2>
      <ScrollArea className="h-[450px] rounded-md border p-4">
        <div className="grid grid-cols-1 gap-4 mb-4">
          {[1, 2, 3, 4, 5, 6, 7].map(type => (
            <div key={type} onClick={() => onTypeSelect(type)} className="mb-3 last:mb-0">
              <BristolType 
                type={type} 
                selected={selectedType === type}
                size="lg"
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
