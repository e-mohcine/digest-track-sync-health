
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Maximize2, Minimize2, X, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChatBot } from './ChatBot';
import { useAuth } from '@/hooks/useAuth';
import Draggable from 'react-draggable';

export const FloatingPoop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [chatSize, setChatSize] = useState({ width: 350, height: 450 });
  const [isDragging, setIsDragging] = useState(false);
  const { user } = useAuth();
  const animationRef = useRef<number | null>(null);
  const chatBubbleRef = useRef<HTMLDivElement>(null);
  
  // Couleur basée sur les dernières selles (simulé - à connecter à vos données réelles)
  const [poopColor, setPoopColor] = useState("#8B4513"); // Couleur marron par défaut
  
  useEffect(() => {
    // Récupérer la couleur des dernières selles si disponible
    const getLastStoolColor = async () => {
      try {
        // Cette logique doit être remplacée par votre logique réelle pour obtenir la couleur basée sur les données de l'utilisateur
        // Exemple simple avec des couleurs basées sur le type Bristol
        const bristolColors: Record<number, string> = {
          1: "#5D4037", // Brun foncé
          2: "#6D4C41", // Brun
          3: "#795548", // Brun moyen
          4: "#8D6E63", // Brun clair
          5: "#A1887F", // Beige foncé
          6: "#BCAAA4", // Beige clair
          7: "#D7CCC8"  // Gris beige
        };
        
        // Simuler un type Bristol aléatoire pour la démonstration
        // Remplacer par la vraie logique pour obtenir le dernier type Bristol de l'utilisateur
        const lastBristolType = Math.floor(Math.random() * 7) + 1;
        setPoopColor(bristolColors[lastBristolType] || "#8B4513");
      } catch (error) {
        console.error("Erreur lors de la récupération de la couleur des selles:", error);
      }
    };
    
    getLastStoolColor();
  }, [user]);
  
  useEffect(() => {
    // Animation de flottement
    const animate = () => {
      // Animation de lévitation douce
      const time = Date.now() / 1000;
      const newY = Math.sin(time * 1.5) * 10;
      const newRotation = Math.sin(time * 0.8) * 5;
      
      setPosition(prev => ({ ...prev, y: newY }));
      setRotation(newRotation);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Positionner initialement le chatbot en bas à droite
    const updateInitialPosition = () => {
      setPosition({
        x: window.innerWidth > 768 ? 20 : 10,
        y: 0
      });
    };
    
    updateInitialPosition();
    window.addEventListener('resize', updateInitialPosition);
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateInitialPosition);
    };
  }, []);
  
  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };
  
  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
    if (!isExpanded) {
      setChatSize({ width: window.innerWidth > 768 ? 600 : window.innerWidth * 0.9, height: window.innerHeight * 0.8 });
    } else {
      setChatSize({ width: 350, height: 450 });
    }
  };
  
  const onDragStart = () => {
    setIsDragging(true);
  };
  
  const onDragStop = () => {
    setIsDragging(false);
  };

  const handleMaximize = () => {
    setChatSize({ 
      width: window.innerWidth > 768 ? window.innerWidth * 0.7 : window.innerWidth * 0.95, 
      height: window.innerHeight * 0.8 
    });
    setIsExpanded(true);
  };
  
  return (
    <div className="fixed z-50 bottom-20 right-5 md:bottom-10 md:right-10">
      {/* Chatbot ouvert */}
      {isOpen && (
        <Draggable
          handle=".drag-handle"
          onStart={onDragStart}
          onStop={onDragStop}
          bounds="body"
        >
          <Card 
            ref={chatBubbleRef}
            className={`fixed z-50 bottom-32 right-5 md:right-10 shadow-lg transition-all duration-300 overflow-hidden`}
            style={{ 
              width: `${chatSize.width}px`, 
              height: `${chatSize.height}px`,
              resize: 'both',
              overflow: 'hidden'
            }}
          >
            <div className="drag-handle absolute top-0 left-0 right-0 h-10 bg-intestitrack-blue/10 cursor-move flex items-center justify-between px-3">
              <div className="flex items-center">
                <Move className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">Assistant IntestiTrack</span>
              </div>
              <div className="flex items-center space-x-1">
                {!isExpanded ? (
                  <Button size="icon" variant="ghost" onClick={handleMaximize} className="h-8 w-8">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button size="icon" variant="ghost" onClick={toggleExpand} className="h-8 w-8">
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={toggleChat} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="w-full h-full pt-10 overflow-hidden">
              <ChatBot expanded={isExpanded} />
            </div>
          </Card>
        </Draggable>
      )}
      
      {/* Bouton flottant crotte animée */}
      <button
        onClick={toggleChat}
        className="relative focus:outline-none group"
        aria-label="Ouvrir le chat"
      >
        <div 
          className="relative flex items-center justify-center h-16 w-16 rounded-full transition-transform hover:scale-110"
          style={{ 
            transform: `translateY(${position.y}px) rotate(${rotation}deg)`,
          }}
        >
          {/* Emoji crotte animé SVG */}
          <svg 
            viewBox="0 0 512 512" 
            className="w-full h-full drop-shadow-lg"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}
          >
            <path 
              d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z" 
              fill={poopColor} 
            />
            <path 
              d="M169.6 420.1c-11.9-8.3-22.5-18.3-31.8-29.4c-15.5-18.3-35.4-33.9-49.4-54.3c-13.1-19-18.6-41.5-17.5-64.3c0.9-19.7 7.2-38.7 18.4-53.5c7.7-10.2 26.3-13.5 34.6-3.5c3.4 4.2 9.5 5.9 14.5 2.8c2.9-1.8 5.7-3.7 8.6-5.4c1.7-0.9 2.1-1.9 1.8-3.8c-0.5-2.8-0.8-5.7-1.7-8.4c-5.4-16.6-2.8-32 9.2-45.2c5.5-6.1 13.8-7 21.3-3.7c6.5 2.8 13.7 5.3 20.6 5.4c12.4 0.2 23-6.3 31.1-15.8c9.5-11.2 22.6-13.9 35.8-7.4c12.2 5.9 19.8 15.8 23.3 28.7c0.6 2.1 1.4 2.5 3.4 2.5c4.4-0.1 8.9-0.4 13.3-0.2c8.4 0.4 15.1 4.4 20.1 11.1c4.2 5.6 4.9 12.1 4.9 18.8c0 1.5 0.4 2.1 1.9 2.1c8.5 0.4 17 1.5 24.5 8.1c5.7 5 8.8 11.5 9.7 19c1.1 8.6-1.3 16.8-3.9 24.8c-1.9 5.6-2.4 11-0.7 16.7c2.4 8.1 7.3 14.8 12.8 21.1c10.2 11.8 13.6 25.7 14.1 40.5c0.5 14.5-3.5 28-9.2 41.1c-7.8 17.7-22.8 24.9-41.3 25.5c-3.3 0.1-5.1 1.4-6.4 4.4c-6.7 15-17.1 26.9-31.1 35.4c-7 4.3-14.5 7.3-22.6 9c-35.7 7.6-71.4 6-107-0.8c-0.5-0.1-1-0.3-1.5-0.4zM256 192c-17.7 0-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32s-14.3-32-32-32zm-96 32c0-8.8-7.2-16-16-16s-16 7.2-16 16s7.2 16 16 16s16-7.2 16-16zm192 0c0-8.8-7.2-16-16-16s-16 7.2-16 16s7.2 16 16 16s16-7.2 16-16z" 
              fill="#5D4037" 
              fillOpacity="0.3"
            />
            <circle cx="336" cy="224" r="16" fill="white" />
            <circle cx="336" cy="224" r="8" fill="black" />
            <circle cx="176" cy="224" r="16" fill="white" />
            <circle cx="176" cy="224" r="8" fill="black" />
            <path 
              d="M256 288c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z" 
              fill="white" 
            />
          </svg>
          
          {/* Indicateur de nouveau message */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 flex items-center justify-center h-6 w-6 bg-red-500 rounded-full text-white text-xs font-bold animate-pulse">
              1
            </div>
          )}
        </div>
        
        {/* Bulle d'indication */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
              Cliquez pour discuter
            </div>
          </div>
        )}
      </button>
    </div>
  );
};
