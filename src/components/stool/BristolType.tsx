
import React from 'react';
import { cn } from '@/lib/utils';

interface BristolTypeProps {
  type: number;
  selected?: boolean;
  onClick?: () => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BristolType: React.FC<BristolTypeProps> = ({ 
  type, 
  selected = false, 
  onClick,
  showLabel = true,
  size = 'md'
}) => {
  const descriptions = {
    1: "Crottes dures et séparées",
    2: "Saucisse compacte et grumeleuse",
    3: "Saucisse avec craquelures",
    4: "Saucisse lisse et molle",
    5: "Morceaux mous aux bords nets",
    6: "Morceaux pâteux aux bords irréguliers",
    7: "Entièrement liquide"
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return 'p-2 text-xs';
      case 'lg': return 'p-4 text-base';
      default: return 'p-3 text-sm';
    }
  };

  const getBristolColor = () => {
    switch (type) {
      case 1:
      case 2:
        return 'bg-amber-100';
      case 3:
      case 4:
        return 'bg-green-100';
      case 5:
      case 6:
      case 7:
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div 
      className={cn(
        "bristol-scale-card border rounded-lg transition-all",
        getSize(),
        getBristolColor(),
        selected && "ring-2 ring-offset-2 ring-intestitrack-blue bg-blue-50",
        onClick && "cursor-pointer hover:bg-muted",
        `bristol-type-${type}`
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mr-3",
          `bristol-type-${type} border`
        )}>
          <span className="font-bold">{type}</span>
        </div>
        <div className="flex-1">
          <span className="font-bold text-lg block">Type {type}</span>
          {showLabel && <p className="text-sm">{descriptions[type as keyof typeof descriptions]}</p>}
        </div>
      </div>
    </div>
  );
};
