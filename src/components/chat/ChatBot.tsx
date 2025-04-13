
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Send, AlertTriangle } from 'lucide-react';
import { useChatBot } from '@/hooks/useChatBot';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const ChatBot: React.FC = () => {
  const { messages, isLoading, sendMessage, isOperationalHours } = useChatBot();
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
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
  
  return (
    <Card className="flex flex-col h-[75vh]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Assistant IntestiTrack
          {!isOperationalHours() && (
            <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" /> Fermé
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Cet assistant peut vous aider avec des questions sur la maladie de Crohn, les MICI, 
          les troubles digestifs et la nutrition.
        </CardDescription>
      </CardHeader>
      
      <div className="bg-muted/30 px-4 py-2 text-sm flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <span>Cet assistant ne remplace pas l'avis d'un médecin.</span>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>Posez une question pour commencer la conversation.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                  <div className="text-xs mt-1 opacity-70">
                    {format(msg.timestamp, 'HH:mm', { locale: fr })}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
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
            disabled={!isOperationalHours() || isLoading}
          />
          <Button type="submit" size="icon" disabled={!isOperationalHours() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
