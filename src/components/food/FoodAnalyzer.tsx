
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, Upload, X, Utensils } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CameraControls } from './CameraControls';
import { AnalysisResults } from './AnalysisResults';
import { useCamera } from '@/hooks/useCamera';
import type { FoodAnalysisResult } from './types';

export const FoodAnalyzer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    cameraActive,
    videoRef,
    canvasRef,
    brightness,
    contrast,
    setBrightness,
    setContrast,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useCamera();

  const handleStartCamera = async () => {
    const success = await startCamera();
    if (!success) {
      toast.error("Erreur de caméra", {
        description: "Impossible d'accéder à la caméra. Essayez de télécharger une image."
      });
    }
  };
  
  const handleCapturePhoto = () => {
    const dataUrl = capturePhoto();
    if (dataUrl) {
      setTempImage(dataUrl);
    }
  };
  
  const handleConfirmPhoto = () => {
    if (tempImage) {
      setImage(tempImage);
      stopCamera();
      const base64Data = tempImage.split(',')[1];
      analyzeImage(base64Data);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImage(dataUrl);
      const base64Data = dataUrl.split(',')[1];
      analyzeImage(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('food-analysis', {
        body: { imageBase64: base64Image }
      });
      
      if (error) throw error;
      
      setResult(data);
      toast.success("Analyse terminée", {
        description: "Votre nourriture a été analysée avec succès."
      });
      
    } catch (err: any) {
      console.error('Erreur lors de l\'analyse:', err);
      toast.error("Erreur d'analyse", {
        description: "Impossible d'analyser cette image. Veuillez réessayer."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setTempImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-intestitrack-blue" />
          Analyseur Nutritionnel
        </CardTitle>
        <CardDescription>
          Prenez une photo de votre repas pour obtenir une analyse nutritionnelle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!image && !cameraActive ? (
          <div className="flex flex-col gap-4">
            <Button
              onClick={handleStartCamera}
              className="bg-intestitrack-blue hover:bg-intestitrack-blue/90"
            >
              <Camera className="mr-2 h-4 w-4" />
              Prendre une photo
            </Button>
            
            <div className="relative">
              <Button
                variant="outline"
                className="w-full border-dashed border-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Télécharger une image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        ) : cameraActive ? (
          <div className="space-y-4">
            {!tempImage ? (
              <>
                <div className="relative border rounded-md overflow-hidden aspect-video">
                  <video 
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    style={{
                      filter: `brightness(${brightness}%) contrast(${contrast}%)`
                    }}
                  ></video>
                  <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
                
                <CameraControls
                  isCapturing={true}
                  brightness={brightness}
                  contrast={contrast}
                  onBrightnessChange={setBrightness}
                  onContrastChange={setContrast}
                  onCapture={handleCapturePhoto}
                  onCancel={() => {
                    stopCamera();
                    resetAnalysis();
                  }}
                  onRetake={() => setTempImage(null)}
                  onConfirm={handleConfirmPhoto}
                />
              </>
            ) : (
              <>
                <div className="relative border rounded-md overflow-hidden">
                  <img 
                    src={tempImage}
                    alt="Aperçu de la photo"
                    className="w-full object-cover"
                  />
                </div>
                
                <CameraControls
                  isCapturing={false}
                  brightness={brightness}
                  contrast={contrast}
                  onBrightnessChange={setBrightness}
                  onContrastChange={setContrast}
                  onCapture={handleCapturePhoto}
                  onCancel={() => {
                    stopCamera();
                    resetAnalysis();
                  }}
                  onRetake={() => setTempImage(null)}
                  onConfirm={handleConfirmPhoto}
                />
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={image} 
                alt="Nourriture à analyser" 
                className="w-full h-48 object-cover rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={resetAnalysis}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyse en cours...</span>
                  <span>Veuillez patienter</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            )}
            
            {result && <AnalysisResults result={result} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
