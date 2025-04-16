
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, Upload, X, Utensils, Check, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';

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
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setCameraStream(stream);
      setCameraActive(true);
      setTempImage(null);
      
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra:', error);
      toast.error("Erreur de caméra", {
        description: "Impossible d'accéder à la caméra. Essayez de télécharger une image."
      });
    }
  };
  
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Définir les dimensions du canvas pour correspondre à la vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Dessiner l'image de la vidéo sur le canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Appliquer les filtres si nécessaire
    if (brightness !== 100 || contrast !== 100) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const brightnessRatio = brightness / 100;
      const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      
      for (let i = 0; i < data.length; i += 4) {
        // Appliquer la luminosité
        data[i] = data[i] * brightnessRatio;     // Rouge
        data[i + 1] = data[i + 1] * brightnessRatio; // Vert
        data[i + 2] = data[i + 2] * brightnessRatio; // Bleu
        
        // Appliquer le contraste
        data[i] = contrastFactor * (data[i] - 128) + 128;
        data[i + 1] = contrastFactor * (data[i + 1] - 128) + 128;
        data[i + 2] = contrastFactor * (data[i + 2] - 128) + 128;
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    // Obtenir l'image en base64
    const dataUrl = canvas.toDataURL('image/jpeg');
    setTempImage(dataUrl);
  };
  
  const handleConfirmPhoto = () => {
    if (tempImage) {
      setImage(tempImage);
      stopCamera();
      
      // Extraire le base64 sans le préfixe "data:image/jpeg;base64,"
      const base64Data = tempImage.split(',')[1];
      analyzeImage(base64Data);
    }
  };
  
  const handleRetakePhoto = () => {
    setTempImage(null);
  };
  
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setCameraActive(false);
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
    setTempImage(null);
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
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm mb-1">Luminosité: {brightness}%</p>
                      <Slider
                        value={[brightness]}
                        min={50}
                        max={150}
                        step={1}
                        onValueChange={(values) => setBrightness(values[0])}
                      />
                    </div>
                    
                    <div>
                      <p className="text-sm mb-1">Contraste: {contrast}%</p>
                      <Slider
                        value={[contrast]}
                        min={50}
                        max={150}
                        step={1}
                        onValueChange={(values) => setContrast(values[0])}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        stopCamera();
                        resetAnalysis();
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleCapturePhoto}
                      className="bg-intestitrack-blue hover:bg-intestitrack-blue/90"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Prendre la photo
                    </Button>
                  </div>
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
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handleRetakePhoto}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reprendre
                    </Button>
                    <Button 
                      onClick={handleConfirmPhoto}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Confirmer
                    </Button>
                  </div>
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
