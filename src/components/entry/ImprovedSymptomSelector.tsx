
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SelectedSymptom } from '@/hooks/useSymptomEntryData';
import { Plus, X } from 'lucide-react';

interface SymptomOption {
  id: number;
  name: string;
  icon?: React.ReactNode;
}

const commonSymptoms: SymptomOption[] = [
  { id: 1, name: 'Douleur abdominale' },
  { id: 2, name: 'Ballonnements' },
  { id: 3, name: 'Nausées' },
  { id: 4, name: 'Fatigue' },
  { id: 5, name: 'Gaz' },
  { id: 6, name: 'Crampes' },
  { id: 7, name: 'Brûlures d\'estomac' },
  { id: 8, name: 'Reflux acide' },
  { id: 9, name: 'Perte d\'appétit' },
  { id: 10, name: 'Fièvre' },
];

interface ImprovedSymptomSelectorProps {
  selectedSymptoms: SelectedSymptom[];
  onChange: (symptoms: SelectedSymptom[]) => void;
}

export const ImprovedSymptomSelector: React.FC<ImprovedSymptomSelectorProps> = ({
  selectedSymptoms,
  onChange
}) => {
  const [selectedSymptomId, setSelectedSymptomId] = useState<number | null>(null);
  const [intensity, setIntensity] = useState<number>(2);

  const handleSymptomSelect = (symptom: SymptomOption) => {
    setSelectedSymptomId(symptom.id);
    setIntensity(2); // Réinitialiser l'intensité à une valeur moyenne
  };

  const handleAddSymptom = () => {
    if (selectedSymptomId) {
      const symptomToAdd = commonSymptoms.find(s => s.id === selectedSymptomId);
      if (symptomToAdd && !selectedSymptoms.some(s => s.id === selectedSymptomId)) {
        onChange([...selectedSymptoms, { id: symptomToAdd.id, name: symptomToAdd.name, intensity }]);
        setSelectedSymptomId(null);
        setIntensity(2);
      }
    }
  };

  const handleRemoveSymptom = (id: number) => {
    onChange(selectedSymptoms.filter(s => s.id !== id));
  };

  const handleIntensityChange = (value: number[]) => {
    setIntensity(value[0]);
  };

  const getIntensityLabel = (value: number) => {
    if (value === 1) return 'Légère';
    if (value === 2) return 'Modérée';
    if (value === 3) return 'Sévère';
    return '';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Symptômes associés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedSymptoms.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Symptômes sélectionnés:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <div 
                  key={symptom.id}
                  className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm"
                >
                  <span>{symptom.name}</span>
                  <span className="text-xs px-1.5 py-0.5 bg-intestitrack-blue text-white rounded-full">
                    {getIntensityLabel(symptom.intensity)}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5"
                    onClick={() => handleRemoveSymptom(symptom.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun symptôme sélectionné. Ajoutez des symptômes pour suivre votre santé.
          </p>
        )}

        <div className="space-y-3 pt-3 border-t">
          <h4 className="text-sm font-medium">Ajouter un symptôme:</h4>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map((symptom) => (
              <Button
                key={symptom.id}
                variant={selectedSymptomId === symptom.id ? "default" : "outline"}
                className="text-sm"
                onClick={() => handleSymptomSelect(symptom)}
                disabled={selectedSymptoms.some(s => s.id === symptom.id)}
              >
                {symptom.name}
              </Button>
            ))}
          </div>

          {selectedSymptomId && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Intensité:</span>
                <span className="text-sm font-medium">{getIntensityLabel(intensity)}</span>
              </div>
              <Slider
                value={[intensity]}
                min={1}
                max={3}
                step={1}
                onValueChange={handleIntensityChange}
                className="py-2"
              />
              <Button 
                onClick={handleAddSymptom}
                className="w-full mt-2 bg-intestitrack-blue hover:bg-intestitrack-blue/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter ce symptôme
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
