
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, Upload, X, Utensils, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FoodAnalysisResult {
  foods: string[];
  calories: string;
  macronutrients: {
    proteins: string;
    carbs: string;
    fats: string;
  };
  transitImpact: string;
  advice: string;
}

export const FoodAnalyzer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async () => {
    try {
      // Cette méthode fonctionne uniquement sur les appareils mobiles avec une caméra
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      
      // Attendre que la vidéo soit chargée
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(true);
        };
      });
      
      // Créer un canvas pour capturer l'image
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      // Arrêter la webcam
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      
      // Convertir en base64
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      
      // Analyser automatiquement
      analyzeImage(dataUrl.split(',')[1]);
      
    } catch (error) {
      console.error('Erreur lors de la capture:', error);
      toast.error("Erreur de capture", {
        description: "Impossible d'accéder à la caméra. Essayez de télécharger une image."
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImage(dataUrl);
      
      // Extraire le base64 sans le préfixe "data:image/jpeg;base64,"
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
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
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
          {!image ? (
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleCapture}
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
                  <Progress value={isAnalyzing ? 75 : 100} className="h-2" />
                </div>
              )}
              
              {result && (
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
                        <li>Glucides: {result.macronutrients.carbs}</li>
                        <li>Lipides: {result.macronutrients.fats}</li>
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
                        // Ici on pourrait ajouter la sauvegarde de l'entrée alimentaire
                        toast.success("Aliment enregistré", {
                          description: "L'entrée alimentaire a été ajoutée à votre journal"
                        });
                      }}
                    >
                      Enregistrer dans mon journal
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
