
import React from 'react';

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
          className={`quantity-btn quantity-small ${selectedQuantity === 'small' ? 'ring-2 ring-intestitrack-blue' : ''}`} 
          onClick={() => onQuantitySelect('small')}
        >
          <span className="h-6 w-6 mb-1">💧</span>
          <span>Faible</span>
        </div>
        <div 
          className={`quantity-btn quantity-normal ${selectedQuantity === 'normal' ? 'ring-2 ring-intestitrack-blue' : ''}`}
          onClick={() => onQuantitySelect('normal')}
        >
          <span className="h-6 w-6 mb-1">💧💧</span>
          <span>Normale</span>
        </div>
        <div 
          className={`quantity-btn quantity-large ${selectedQuantity === 'large' ? 'ring-2 ring-intestitrack-blue' : ''}`}
          onClick={() => onQuantitySelect('large')}
        >
          <span className="h-6 w-6 mb-1">💧💧💧</span>
          <span>Abondante</span>
        </div>
      </div>
    </div>
  );
};
