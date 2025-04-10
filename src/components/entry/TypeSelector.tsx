
import React from 'react';
import { BristolType } from '@/components/stool/BristolType';

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
      <div className="grid grid-cols-1 gap-4 mb-4">
        {[1, 2, 3, 4, 5, 6, 7].map(type => (
          <div key={type} onClick={() => onTypeSelect(type)}>
            <BristolType 
              type={type} 
              selected={selectedType === type}
              size="lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
