
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Send, AlertTriangle, Heart, Smile } from 'lucide-react';
import { useChatBot } from '@/hooks/useChatBot';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

export const ChatBot: React.FC = () => {
  const { messages, isLoading, sendMessage, isOperationalHours } = useChatBot();
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions] = useState([
    "Comment fonctionne l'échelle de Bristol ?",
    "Quels symptômes dois-je surveiller ?",
    "Que signifie un type 6 ou 7 ?",
    "Comment partager mes données avec mon médecin ?"
  ]);
  
  // Auto-focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
    toast.success("Question envoyée !");
  };
  
  // Génère une animation aléatoire pour les bulles de messages
  const getRandomAnimation = () => {
    const animations = [
      'animate-fade-in',
      'animate-scale-in',
      'animate-slide-in-right'
    ];
    return animations[Math.floor(Math.random() * animations.length)];
  };
  
  return (
    <div className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          Assistant IntestiTrack
          {!isOperationalHours() && (
            <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" /> Fermé
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Je peux vous aider avec des questions sur la maladie de Crohn, les MICI, 
          les troubles digestifs et la nutrition 💩✨
        </CardDescription>
      </CardHeader>
      
      <div className="bg-muted/30 px-4 py-2 text-sm flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <span>Cet assistant ne remplace pas l'avis d'un médecin.</span>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="mb-4 inline-block">
                  <Smile className="h-12 w-12 text-intestitrack-blue animate-bounce-small" />
                </div>
                <p className="text-muted-foreground">Posez une question ou choisissez une suggestion ci-dessous.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button 
                    key={index} 
                    variant="outline"
                    className="justify-start h-auto py-2 text-left hover:bg-intestitrack-blue-light"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${getRandomAnimation()}`}
              >
                <div 
                  className={`
                    max-w-[80%] rounded-lg px-4 py-2
                    ${msg.role === 'user' 
                      ? 'bg-intestitrack-blue text-white ml-auto' 
                      : 'bg-muted mr-auto'
                    }
                  `}
                >
                  <div className="text-sm">{msg.content}</div>
                  <div className="text-xs mt-1 opacity-70 flex items-center gap-1">
                    {format(msg.timestamp, 'HH:mm', { locale: fr })}
                    {msg.role === 'assistant' && (
                      <Heart className="h-3 w-3 ml-1 text-red-400 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="max-w-[80%] bg-muted rounded-lg p-4 mr-auto">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez votre message..."
            className="border-intestitrack-blue/30 focus:border-intestitrack-blue"
            disabled={!isOperationalHours() || isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!isOperationalHours() || isLoading}
            className="bg-intestitrack-blue hover:bg-intestitrack-blue/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </div>
  );
};
