
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, Info, MessageSquare, CornerDownLeft } from 'lucide-react';
import { useChatBot } from '@/hooks/useChatBot';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatBotProps {
  expanded?: boolean;
}

export const ChatBot: React.FC<ChatBotProps> = ({ expanded = false }) => {
  const { messages, isLoading, sendMessage, clearMessages } = useChatBot();
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Suggestions rapides
  const suggestions = [
    "Comment fonctionne l'échelle de Bristol ?",
    "Quels aliments sont bons pour le transit ?",
    "Comment gérer une poussée de Crohn ?",
    "Quels conseils pour éviter la constipation ?",
    "Quels sont les symptômes courants des MICI ?",
    "Comment l'alimentation affecte-t-elle les selles ?"
  ];
  
  // Auto-focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);
  
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
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const resetChat = () => {
    clearMessages();
    toast.success("Conversation réinitialisée");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-muted/30 px-4 py-2 text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-intestitrack-blue" />
          <span>Assistant santé digestive</span>
        </div>
        {messages.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetChat} 
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Nouvelle conversation
          </Button>
        )}
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="mb-4 inline-block p-4 bg-intestitrack-blue/10 rounded-full">
                  <MessageSquare className="h-12 w-12 text-intestitrack-blue" />
                </div>
                <h3 className="text-lg font-medium mb-2">Comment puis-je vous aider ?</h3>
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
            <>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div 
                    className={`
                      max-w-[85%] rounded-lg px-4 py-3
                      ${msg.role === 'user' 
                        ? 'bg-intestitrack-blue text-white ml-auto rounded-br-none' 
                        : 'bg-muted mr-auto rounded-bl-none'
                      }
                    `}
                  >
                    <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                    <div className="text-xs mt-1 opacity-70 flex justify-end">
                      {format(msg.timestamp, 'HH:mm', { locale: fr })}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="max-w-[80%] bg-muted rounded-lg p-4 mr-auto rounded-bl-none">
                <div className="flex items-center gap-2">
                  <div className="bg-muted-foreground/30 h-2 w-2 rounded-full animate-bounce" />
                  <div className="bg-muted-foreground/30 h-2 w-2 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="bg-muted-foreground/30 h-2 w-2 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full gap-2 items-center">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tapez votre message..."
            className="border-intestitrack-blue/30 focus-visible:ring-intestitrack-blue focus-visible:ring-offset-0"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            className="bg-intestitrack-blue hover:bg-intestitrack-blue/90 transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              input.trim() ? <Send className="h-4 w-4" /> : <CornerDownLeft className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
