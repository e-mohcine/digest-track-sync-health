
import React, { useEffect, useState } from 'react';
import { PlusCircle, Minus, Plus, X, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SymptomType } from '@/types/database.types';
import { fetchSymptomTypes } from '@/services';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';

interface SelectedSymptom {
  id: number;
  name: string;
  intensity: number;
}

interface SymptomSelectorProps {
  selectedSymptoms: SelectedSymptom[];
  onSymptomSelect: (symptoms: SelectedSymptom[]) => void;
}

export const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  selectedSymptoms,
  onSymptomSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [symptomTypes, setSymptomTypes] = useState<SymptomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('digestive');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const loadSymptomTypes = async () => {
      setLoading(true);
      const types = await fetchSymptomTypes();
      setSymptomTypes(types);
      setLoading(false);
    };
    
    loadSymptomTypes();
  }, []);

  const handleAddSymptom = (symptomType: SymptomType) => {
    const exists = selectedSymptoms.find(s => s.id === symptomType.id);
    
    if (exists) {
      return; // Déjà ajouté
    }
    
    const newSymptom: SelectedSymptom = {
      id: symptomType.id,
      name: symptomType.name,
      intensity: 3 // Valeur par défaut
    };
    
    onSymptomSelect([...selectedSymptoms, newSymptom]);
  };

  const handleRemoveSymptom = (symptomId: number) => {
    const updatedSymptoms = selectedSymptoms.filter(s => s.id !== symptomId);
    onSymptomSelect(updatedSymptoms);
  };

  const handleIntensityChange = (symptomId: number, change: number) => {
    const updatedSymptoms = selectedSymptoms.map(symptom => {
      if (symptom.id === symptomId) {
        const newIntensity = Math.max(1, Math.min(5, symptom.intensity + change));
        return { ...symptom, intensity: newIntensity };
      }
      return symptom;
    });
    onSymptomSelect(updatedSymptoms);
  };

  const getSymptomsByCategory = (category: string) => {
    return symptomTypes.filter(symptom => symptom.category === category);
  };
  
  const getFilteredSymptoms = () => {
    if (!searchTerm.trim()) {
      return getSymptomsByCategory(selectedCategory);
    }
    
    return symptomTypes.filter(symptom => 
      symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const categories = [
    { value: 'digestive', label: 'Digestif' },
    { value: 'articular', label: 'Articulaire' },
    { value: 'dermatological', label: 'Cutané' },
    { value: 'general', label: 'Général' },
    { value: 'other', label: 'Autre' }
  ];

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Symptômes associés</h2>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedSymptoms.map(symptom => (
          <Badge 
            key={symptom.id} 
            variant="outline" 
            className="flex items-center gap-1 py-1.5 pl-3 pr-2"
          >
            <span>{symptom.name} ({symptom.intensity})</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 rounded-full hover:bg-destructive/20 ml-1"
              onClick={() => handleRemoveSymptom(symptom.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        
        {selectedSymptoms.length === 0 && (
          <div className="text-center w-full p-4 bg-muted/20 rounded-md">
            <p className="text-muted-foreground">Aucun symptôme sélectionné</p>
          </div>
        )}
      </div>
      
      {selectedSymptoms.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-medium">Ajuster l'intensité</h3>
            {selectedSymptoms.map(symptom => (
              <div key={symptom.id} className="flex items-center justify-between">
                <span className="text-sm">{symptom.name}</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => handleIntensityChange(symptom.id, -1)}
                    disabled={symptom.intensity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div 
                        key={index}
                        className={`h-4 w-4 rounded-full mx-0.5 ${
                          index < symptom.intensity 
                            ? 'bg-intestitrack-blue' 
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => handleIntensityChange(symptom.id, 1)}
                    disabled={symptom.intensity >= 5}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Ajouter des symptômes</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full max-w-md sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Ajouter des symptômes</SheetTitle>
          </SheetHeader>
          
          <div className="mt-4">
            <Input
              placeholder="Rechercher un symptôme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            
            <Tabs defaultValue="digestive" value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid grid-cols-5 mb-4">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.value} 
                    value={category.value}
                    className="text-xs"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="mt-4">
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto pb-8">
                    {getFilteredSymptoms().map(symptom => {
                      const isSelected = selectedSymptoms.some(s => s.id === symptom.id);
                      return (
                        <Button
                          key={symptom.id}
                          variant={isSelected ? "default" : "outline"}
                          className={`justify-start ${isSelected ? 'bg-intestitrack-blue hover:bg-intestitrack-blue/90' : ''}`}
                          onClick={() => handleAddSymptom(symptom)}
                          disabled={isSelected}
                        >
                          <span>{symptom.name}</span>
                          {isSelected && (
                            <Badge className="ml-auto">Ajouté</Badge>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
