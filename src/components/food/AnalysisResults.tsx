
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FoodAnalysisResult } from './types';

interface AnalysisResultsProps {
  result: FoodAnalysisResult;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-medium">Aliments détectés:</h3>
          <p className="text-sm">{result.foods.join(', ')}</p>
        </div>
        
        <div>
          <h3 className="font-medium">Calories (estimées):</h3>
          <p className="text-sm">{result.calories}</p>
        </div>
        
        <div>
          <h3 className="font-medium">Macronutriments:</h3>
          <ul className="text-sm list-disc pl-5">
            <li>Protéines: {result.macronutrients.proteins}</li>
            <li>Glucides: {result.macronutriments.carbs}</li>
            <li>Lipides: {result.macronutriments.fats}</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium">Impact sur le transit:</h3>
          <p className="text-sm">{result.transitImpact}</p>
        </div>
        
        <div>
          <h3 className="font-medium">Conseils:</h3>
          <p className="text-sm">{result.advice}</p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={() => {
            toast.success("Aliment enregistré", {
              description: "L'entrée alimentaire a été ajoutée à votre journal"
            });
          }}
        >
          Enregistrer dans mon journal
        </Button>
      </CardContent>
    </Card>
  );
};
