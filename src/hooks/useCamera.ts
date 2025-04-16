
import { useState, useRef } from 'react';

export const useCamera = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
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
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'accès à la caméra:', error);
      return false;
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    if (brightness !== 100 || contrast !== 100) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const brightnessRatio = brightness / 100;
      const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] * brightnessRatio;
        data[i + 1] = data[i + 1] * brightnessRatio;
        data[i + 2] = data[i + 2] * brightnessRatio;
        
        data[i] = contrastFactor * (data[i] - 128) + 128;
        data[i + 1] = contrastFactor * (data[i + 1] - 128) + 128;
        data[i + 2] = contrastFactor * (data[i + 2] - 128) + 128;
      }
      
      ctx.putImageData(imageData, 0, 0);
    }
    
    return canvas.toDataURL('image/jpeg');
  };

  return {
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
  };
};
