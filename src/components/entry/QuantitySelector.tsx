
import React from 'react';
import { Droplet } from 'lucide-react';

interface QuantitySelectorProps {
  selectedQuantity: string | null;
  onQuantitySelect: (quantity: string) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  selectedQuantity, 
  onQuantitySelect 
}) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Quantité</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div 
          className={`quantity-btn p-4 rounded-lg border text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors ${selectedQuantity === 'small' ? 'bg-blue-50 border-intestitrack-blue' : 'border-gray-200'}`} 
          onClick={() => onQuantitySelect('small')}
        >
          <div className="mb-2 text-intestitrack-blue">
            <Droplet className="h-6 w-6" />
          </div>
          <span className="font-medium">Faible</span>
        </div>
        <div 
          className={`quantity-btn p-4 rounded-lg border text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors ${selectedQuantity === 'normal' ? 'bg-blue-50 border-intestitrack-blue' : 'border-gray-200'}`}
          onClick={() => onQuantitySelect('normal')}
        >
          <div className="mb-2 text-intestitrack-blue flex">
            <Droplet className="h-6 w-6" />
            <Droplet className="h-6 w-6" />
          </div>
          <span className="font-medium">Normale</span>
        </div>
        <div 
          className={`quantity-btn p-4 rounded-lg border text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors ${selectedQuantity === 'large' ? 'bg-blue-50 border-intestitrack-blue' : 'border-gray-200'}`}
          onClick={() => onQuantitySelect('large')}
        >
          <div className="mb-2 text-intestitrack-blue flex">
            <Droplet className="h-6 w-6" />
            <Droplet className="h-6 w-6" />
            <Droplet className="h-6 w-6" />
          </div>
          <span className="font-medium">Abondante</span>
        </div>
      </div>
    </div>
  );
};
