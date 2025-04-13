
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

  return (
    <div 
      className={cn(
        "bristol-scale-card border rounded-lg transition-all",
        getSize(),
        selected && "ring-2 ring-offset-2 ring-intestitrack-blue bg-blue-50",
        onClick && "cursor-pointer hover:bg-muted",
        `bristol-type-${type}`
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <span className="font-bold text-lg mb-1">Type {type}</span>
        {showLabel && <p className="text-center">{descriptions[type as keyof typeof descriptions]}</p>}
      </div>
    </div>
  );
};
