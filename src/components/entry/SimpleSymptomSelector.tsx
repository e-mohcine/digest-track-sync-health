
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Search, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fetchSymptomTypes } from '@/services';
import { SymptomType } from '@/types/database.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface SelectedSymptom {
  id: number;
  name: string;
  intensity: number;
}

interface SimpleSymptomSelectorProps {
  selectedSymptoms: SelectedSymptom[];
  onSymptomSelect: (symptoms: SelectedSymptom[]) => void;
}

export const SimpleSymptomSelector: React.FC<SimpleSymptomSelectorProps> = ({
  selectedSymptoms,
  onSymptomSelect
}) => {
  const [symptomTypes, setSymptomTypes] = useState<SymptomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('digestive');
  const [selectedSymptomForIntensity, setSelectedSymptomForIntensity] = useState<SelectedSymptom | null>(null);

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
      setSelectedSymptomForIntensity(exists);
      return;
    }
    
    const newSymptom: SelectedSymptom = {
      id: symptomType.id,
      name: symptomType.name,
      intensity: 3 // Valeur par défaut (moyenne)
    };
    
    onSymptomSelect([...selectedSymptoms, newSymptom]);
    setSelectedSymptomForIntensity(newSymptom);
  };

  const handleRemoveSymptom = (symptomId: number) => {
    if (selectedSymptomForIntensity?.id === symptomId) {
      setSelectedSymptomForIntensity(null);
    }
    const updatedSymptoms = selectedSymptoms.filter(s => s.id !== symptomId);
    onSymptomSelect(updatedSymptoms);
  };

  const handleIntensityChange = (symptomId: number, intensity: number) => {
    const updatedSymptoms = selectedSymptoms.map(symptom => {
      if (symptom.id === symptomId) {
        return { ...symptom, intensity };
      }
      return symptom;
    });
    onSymptomSelect(updatedSymptoms);
    
    if (selectedSymptomForIntensity?.id === symptomId) {
      setSelectedSymptomForIntensity({...selectedSymptomForIntensity, intensity});
    }
  };

  const getFilteredSymptoms = () => {
    if (!searchTerm.trim()) {
      return symptomTypes.filter(symptom => symptom.category === selectedCategory);
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

  const getIntensityLabel = (value: number) => {
    if (value <= 1) return 'Très faible';
    if (value <= 2) return 'Faible';
    if (value <= 3) return 'Modéré';
    if (value <= 4) return 'Fort';
    return 'Très fort';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-2">Symptômes associés</h2>
      
      {selectedSymptoms.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map(symptom => (
              <Badge 
                key={symptom.id} 
                variant={selectedSymptomForIntensity?.id === symptom.id ? "default" : "outline"}
                className="flex items-center gap-1 py-1.5 px-3 cursor-pointer"
                onClick={() => setSelectedSymptomForIntensity(symptom)}
              >
                <span>{symptom.name} ({symptom.intensity})</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 rounded-full hover:bg-destructive/20 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSymptom(symptom.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>

          {selectedSymptomForIntensity && (
            <Card className="p-3 border-intestitrack-blue">
              <CardContent className="p-0 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{selectedSymptomForIntensity.name}</p>
                  <span className="text-sm bg-intestitrack-blue text-white px-2 py-0.5 rounded-full">
                    {getIntensityLabel(selectedSymptomForIntensity.intensity)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Intensité:</p>
                  <Slider
                    value={[selectedSymptomForIntensity.intensity]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(values) => handleIntensityChange(selectedSymptomForIntensity.id, values[0])}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {selectedSymptoms.length === 0 && (
        <div className="text-center w-full p-4 bg-muted/20 rounded-md">
          <p className="text-muted-foreground">Aucun symptôme sélectionné</p>
        </div>
      )}
      
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un symptôme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-5 w-full mb-2">
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
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            {!loading && getFilteredSymptoms().map(symptom => {
              const isSelected = selectedSymptoms.some(s => s.id === symptom.id);
              return (
                <Button
                  key={symptom.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`justify-start text-sm h-auto py-2 ${isSelected ? 'bg-intestitrack-blue hover:bg-intestitrack-blue/90' : ''}`}
                  onClick={() => handleAddSymptom(symptom)}
                >
                  <span className="truncate">{symptom.name}</span>
                  {isSelected && (
                    <Badge className="ml-auto">{selectedSymptoms.find(s => s.id === symptom.id)?.intensity || 3}</Badge>
                  )}
                </Button>
              );
            })}
            
            {loading && (
              <div className="col-span-2 flex justify-center py-10">
                <p className="text-muted-foreground">Chargement des symptômes...</p>
              </div>
            )}
            
            {!loading && getFilteredSymptoms().length === 0 && (
              <div className="col-span-2 flex justify-center py-10">
                <p className="text-muted-foreground">Aucun symptôme trouvé</p>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};
