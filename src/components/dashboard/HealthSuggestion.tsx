
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Droplets, Utensils, Brain, Moon } from 'lucide-react';

interface HealthSuggestionProps {
  type: 'hydration' | 'nutrition' | 'stress' | 'sleep';
  bristolType?: number;
}

const HealthSuggestion: React.FC<HealthSuggestionProps> = ({ type, bristolType = 4 }) => {
  // Générer une suggestion basée sur le type et les données
  const getSuggestion = () => {
    switch (type) {
      case 'hydration':
        return {
          title: 'Gardez une bonne hydratation',
          description: 'Buvez au moins 1,5 à 2L d\'eau par jour, en petites quantités régulières.',
          icon: <Droplets className="h-5 w-5 text-blue-500" />
        };
      case 'nutrition':
        if (bristolType <= 2) {
          return {
            title: 'Favorisez les fibres solubles',
            description: 'Les fruits, légumes cuits et céréales complètes peuvent aider à ramollir les selles.',
            icon: <Utensils className="h-5 w-5 text-green-500" />
          };
        } else if (bristolType >= 6) {
          return {
            title: 'Limitez les aliments irritants',
            description: 'Évitez momentanément le café, l\'alcool et les aliments épicés qui peuvent aggraver la diarrhée.',
            icon: <Utensils className="h-5 w-5 text-orange-500" />
          };
        } else {
          return {
            title: 'Équilibrez votre alimentation',
            description: 'Un régime varié avec des protéines, graisses saines et fibres contribue à une digestion équilibrée.',
            icon: <Utensils className="h-5 w-5 text-green-500" />
          };
        }
      case 'stress':
        return {
          title: 'Prenez du temps pour vous',
          description: 'La méditation, la respiration profonde ou une courte marche peuvent aider à réduire le stress digestif.',
          icon: <Brain className="h-5 w-5 text-purple-500" />
        };
      case 'sleep':
        return {
          title: 'Améliorez votre sommeil',
          description: 'Un bon sommeil favorise la santé digestive. Essayez d\'établir une routine régulière de coucher.',
          icon: <Moon className="h-5 w-5 text-indigo-500" />
        };
      default:
        return {
          title: 'Prenez soin de vous',
          description: 'Écoutez votre corps et n\'hésitez pas à consulter un professionnel de santé si besoin.',
          icon: <Droplets className="h-5 w-5 text-blue-500" />
        };
    }
  };

  const suggestion = getSuggestion();

  return (
    <Card className="bg-intestitrack-beige border-none">
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="mr-3 bg-white rounded-full p-2">
            {suggestion.icon}
          </div>
          <div>
            <h3 className="font-medium text-base">{suggestion.title}</h3>
            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthSuggestion;
