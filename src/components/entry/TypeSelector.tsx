
import React from 'react';
import { BristolType } from '@/components/stool/BristolType';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Droplet, AlertTriangle, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TypeSelectorProps {
  selectedType: number | null;
  onTypeSelect: (type: number) => void;
  hasBlood: boolean;
  hasMucus: boolean;
  onBloodToggle: (value: boolean) => void;
  onMucusToggle: (value: boolean) => void;
  selectedQuantity: string | null;
  onQuantitySelect: (quantity: string) => void;
  onQuickAdd?: (bristolType: number, quantity: string) => void;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({ 
  selectedType, 
  onTypeSelect,
  hasBlood,
  hasMucus,
  onBloodToggle,
  onMucusToggle,
  selectedQuantity,
  onQuantitySelect,
  onQuickAdd
}) => {
  const handleQuickAdd = (bristolType: number, quantity: string) => {
    if (onQuickAdd) {
      onQuickAdd(bristolType, quantity);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Sélectionnez le type selon l'échelle de Bristol</h2>
      
      {/* Quick Add Cards - Ajout Rapide */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Card 
          className="cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => handleQuickAdd(4, 'normal')}
        >
          <CardContent className="p-3 flex flex-col items-center">
            <BristolType type={4} size="sm" />
            <span className="text-xs mt-1 font-medium">Type 4 - Normal</span>
            <span className="text-xs mt-1 text-muted-foreground">Ajout rapide</span>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => handleQuickAdd(3, 'normal')}
        >
          <CardContent className="p-3 flex flex-col items-center">
            <BristolType type={3} size="sm" />
            <span className="text-xs mt-1 font-medium">Type 3 - Normal</span>
            <span className="text-xs mt-1 text-muted-foreground">Ajout rapide</span>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={() => handleQuickAdd(5, 'normal')}
        >
          <CardContent className="p-3 flex flex-col items-center">
            <BristolType type={5} size="sm" />
            <span className="text-xs mt-1 font-medium">Type 5 - Mou</span>
            <span className="text-xs mt-1 text-muted-foreground">Ajout rapide</span>
          </CardContent>
        </Card>
      </div>
      
      <ScrollArea className="h-[450px] rounded-md border p-4">
        <div className="grid grid-cols-1 gap-4 mb-4">
          {[1, 2, 3, 4, 5, 6, 7].map(type => (
            <div key={type} className="mb-5 last:mb-0 border rounded-lg p-3 hover:bg-muted/20 transition">
              <div onClick={() => onTypeSelect(type)} className="cursor-pointer">
                <BristolType 
                  type={type} 
                  selected={selectedType === type}
                  size="lg"
                />
              </div>
              
              {selectedType === type && (
                <div className="mt-3 border-t pt-3">
                  <div className="mb-3">
                    <h3 className="text-sm font-medium mb-2">Quantité</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors ${selectedQuantity === 'small' ? 'bg-blue-50 border-intestitrack-blue' : 'border-gray-200'}`} 
                        onClick={() => onQuantitySelect('small')}
                      >
                        <div className="mb-1 text-intestitrack-blue">
                          <Droplet className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium">Faible</span>
                      </button>
                      <button 
                        className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors ${selectedQuantity === 'normal' ? 'bg-blue-50 border-intestitrack-blue' : 'border-gray-200'}`}
                        onClick={() => onQuantitySelect('normal')}
                      >
                        <div className="mb-1 text-intestitrack-blue flex">
                          <Droplet className="h-4 w-4" />
                          <Droplet className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium">Normale</span>
                      </button>
                      <button 
                        className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors ${selectedQuantity === 'large' ? 'bg-blue-50 border-intestitrack-blue' : 'border-gray-200'}`}
                        onClick={() => onQuantitySelect('large')}
                      >
                        <div className="mb-1 text-intestitrack-blue flex">
                          <Droplet className="h-4 w-4" />
                          <Droplet className="h-4 w-4" />
                          <Droplet className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium">Abondante</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium mb-2">Détails cliniques</h3>
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Présence de sang</span>
                      </div>
                      <Switch 
                        checked={hasBlood}
                        onCheckedChange={onBloodToggle}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Présence de mucus</span>
                      </div>
                      <Switch 
                        checked={hasMucus}
                        onCheckedChange={onMucusToggle}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
