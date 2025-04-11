
import React from 'react';
import { SmileIcon, MehIcon, FrownIcon, ThermometerIcon, BrainIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface MoodSelectorProps {
  moodLevel: number;
  stressLevel: number;
  sleepQuality: number;
  onMoodChange: (moodLevel: number) => void;
  onStressChange: (stressLevel: number) => void;
  onSleepChange: (sleepQuality: number) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  moodLevel,
  stressLevel,
  sleepQuality,
  onMoodChange,
  onStressChange,
  onSleepChange
}) => {
  const getMoodIcon = () => {
    if (moodLevel >= 4) return <SmileIcon className="h-8 w-8 text-intestitrack-green" />;
    if (moodLevel >= 2) return <MehIcon className="h-8 w-8 text-intestitrack-alert" />;
    return <FrownIcon className="h-8 w-8 text-red-500" />;
  };

  const getMoodText = () => {
    if (moodLevel >= 4) return "Très bien";
    if (moodLevel >= 2) return "Moyen";
    return "Mal";
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-3">Comment vous sentez-vous ?</h2>
      
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Label htmlFor="mood-slider" className="text-base font-medium">
                Humeur générale
              </Label>
              <p className="text-sm text-muted-foreground">
                {getMoodText()}
              </p>
            </div>
            {getMoodIcon()}
          </div>
          
          <div className="mb-6">
            <Slider
              id="mood-slider"
              min={1}
              max={5}
              step={1}
              value={[moodLevel]}
              onValueChange={(values) => onMoodChange(values[0])}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Très mal</span>
              <span>Très bien</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <ThermometerIcon className="h-5 w-5 text-intestitrack-alert" />
              <Label htmlFor="stress-slider" className="text-sm font-medium">
                Niveau de stress
              </Label>
            </div>
            <Slider
              id="stress-slider"
              min={1}
              max={5}
              step={1}
              value={[stressLevel]}
              onValueChange={(values) => onStressChange(values[0])}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Calme</span>
              <span>Très stressé</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BrainIcon className="h-5 w-5 text-intestitrack-blue" />
              <Label htmlFor="sleep-slider" className="text-sm font-medium">
                Qualité du sommeil
              </Label>
            </div>
            <Slider
              id="sleep-slider"
              min={1}
              max={5}
              step={1}
              value={[sleepQuality]}
              onValueChange={(values) => onSleepChange(values[0])}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mauvais</span>
              <span>Excellent</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
