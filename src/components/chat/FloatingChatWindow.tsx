
import React, { useRef } from 'react';
import { Maximize2, Minimize2, X, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChatBot } from './ChatBot';
import Draggable from 'react-draggable';

interface FloatingChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  toggleExpand: () => void;
  chatSize: { width: number; height: number };
  onDragStart: () => void;
  onDragStop: () => void;
  handleMaximize: () => void;
}

export const FloatingChatWindow: React.FC<FloatingChatWindowProps> = ({
  isOpen,
  onClose,
  isExpanded,
  toggleExpand,
  chatSize,
  onDragStart,
  onDragStop,
  handleMaximize
}) => {
  const chatBubbleRef = useRef<HTMLDivElement>(null);
  
  if (!isOpen) return null;
  
  return (
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
            <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="w-full h-full pt-10 overflow-hidden">
          <ChatBot expanded={isExpanded} />
        </div>
      </Card>
    </Draggable>
  );
};
