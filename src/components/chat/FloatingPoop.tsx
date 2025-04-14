
import React, { useState } from 'react';
import { FloatingChatButton } from './FloatingChatButton';
import { FloatingChatWindow } from './FloatingChatWindow';

export const FloatingPoop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatSize, setChatSize] = useState({ width: 350, height: 450 });
  const [isDragging, setIsDragging] = useState(false);
  
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
      {/* Fenêtre de chat flottante */}
      <FloatingChatWindow 
        isOpen={isOpen}
        onClose={toggleChat}
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
        chatSize={chatSize}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        handleMaximize={handleMaximize}
      />
      
      {/* Bouton flottant crotte animée */}
      <FloatingChatButton
        onClick={toggleChat}
        isOpen={isOpen}
      />
    </div>
  );
};
