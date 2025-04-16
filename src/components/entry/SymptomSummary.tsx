
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SelectedSymptom {
  id: number;
  name: string;
  intensity: number;
}

interface SymptomSummaryProps {
  symptoms: SelectedSymptom[];
}

const SymptomSummary: React.FC<SymptomSummaryProps> = ({ symptoms }) => {
  return (
    <Card className="bg-intestitrack-blue-light border-none mb-4">
      <CardContent className="p-4 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <p className="font-medium">Symptômes récents:</p>
          <Link to="/add">
            <Button 
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Ajouter</span>
            </Button>
          </Link>
        </div>
        
        {symptoms.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-1">
            {symptoms.slice(0, 3).map((symptom) => (
              <Badge 
                key={symptom.id} 
                variant="outline" 
                className="py-1 px-2"
              >
                {symptom.name} ({symptom.intensity})
              </Badge>
            ))}
            {symptoms.length > 3 && (
              <Badge variant="outline" className="py-1 px-2">
                +{symptoms.length - 3} autres
              </Badge>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Aucun symptôme enregistré récemment
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SymptomSummary;
