
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, Check, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface CameraControlsProps {
  isCapturing: boolean;
  brightness: number;
  contrast: number;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onCapture: () => void;
  onCancel: () => void;
  onRetake: () => void;
  onConfirm: () => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  isCapturing,
  brightness,
  contrast,
  onBrightnessChange,
  onContrastChange,
  onCapture,
  onCancel,
  onRetake,
  onConfirm,
}) => {
  if (!isCapturing) {
    return (
      <div className="flex justify-between">
        <Button variant="outline" onClick={onRetake}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reprendre
        </Button>
        <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700">
          <Check className="mr-2 h-4 w-4" />
          Confirmer
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <div>
          <p className="text-sm mb-1">Luminosité: {brightness}%</p>
          <Slider
            value={[brightness]}
            min={50}
            max={150}
            step={1}
            onValueChange={(values) => onBrightnessChange(values[0])}
          />
        </div>
        
        <div>
          <p className="text-sm mb-1">Contraste: {contrast}%</p>
          <Slider
            value={[contrast]}
            min={50}
            max={150}
            step={1}
            onValueChange={(values) => onContrastChange(values[0])}
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Annuler
        </Button>
        <Button onClick={onCapture} className="bg-intestitrack-blue hover:bg-intestitrack-blue/90">
          <Camera className="mr-2 h-4 w-4" />
          Prendre la photo
        </Button>
      </div>
    </>
  );
};
