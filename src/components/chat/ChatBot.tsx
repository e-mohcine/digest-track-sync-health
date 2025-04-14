
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Send, Heart, Smile, Clock, Brain, Info, HelpCircle, Sparkles } from 'lucide-react';
import { useChatBot } from '@/hooks/useChatBot';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChatBotProps {
  expanded?: boolean;
}

export const ChatBot: React.FC<ChatBotProps> = ({ expanded = false }) => {
  const { messages, isLoading, sendMessage, isOperationalHours, clearMessages } = useChatBot();
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('chat');
  
  const suggestions = [
    {
      category: "Échelle de Bristol",
      items: [
        "Comment fonctionne l'échelle de Bristol ?",
        "Que signifie un type 6 ou 7 ?",
        "Est-ce normal d'avoir des selles de type 1 ?",
        "Comment interpréter les changements de type de selles ?"
      ]
    },
    {
      category: "Maladie de Crohn",
      items: [
        "Quels sont les symptômes typiques de la maladie de Crohn ?",
        "Comment gérer une poussée de Crohn ?",
        "Quels aliments éviter avec la maladie de Crohn ?",
        "Quels sont les traitements actuels pour le Crohn ?"
      ]
    },
    {
      category: "Nutrition",
      items: [
        "Quels aliments sont bons pour le transit ?",
        "Comment augmenter mon apport en fibres ?",
        "Quels aliments éviter en cas de diarrhée ?",
        "Que manger pour améliorer ma flore intestinale ?"
      ]
    },
    {
      category: "Utilisation de l'app",
      items: [
        "Comment partager mes données avec mon médecin ?",
        "Comment interpréter les graphiques de l'application ?",
        "Comment configurer des rappels pour les saisies ?",
        "Comment exporter mes données en PDF ?"
      ]
    }
  ];
  
  // Articles d'aide rapides
  const quickHelp = [
    {
      title: "Comprendre l'échelle de Bristol",
      description: "L'échelle de Bristol est un outil médical conçu pour classer la forme des selles humaines en 7 catégories.",
      icon: <Info className="h-5 w-5 text-intestitrack-blue" />
    },
    {
      title: "Comment suivre efficacement",
      description: "Pour un suivi optimal, essayez d'enregistrer vos selles au moment où elles se produisent pour plus de précision.",
      icon: <HelpCircle className="h-5 w-5 text-intestitrack-green" />
    },
    {
      title: "Conseils nutritionnels",
      description: "Une alimentation riche en fibres et en eau est généralement recommandée pour un transit intestinal sain.",
      icon: <Sparkles className="h-5 w-5 text-amber-500" />
    },
    {
      title: "Quand consulter un médecin",
      description: "Consultez si vous observez du sang dans les selles, des douleurs persistantes ou des changements durables.",
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />
    }
  ];
  
  // Auto-focus input on component mount
  useEffect(() => {
    if (inputRef.current && activeTab === 'chat') {
      inputRef.current.focus();
    }
  }, [activeTab]);
  
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

  const resetChat = () => {
    clearMessages();
    toast.success("Conversation réinitialisée");
  };
  
  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="chat" className="w-full h-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="chat" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            <span>Aide</span>
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>Suggestions</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex flex-col h-full border-none p-0 m-0">
          <div className="bg-muted/30 px-4 py-2 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Cet assistant ne remplace pas l'avis d'un médecin.</span>
            </div>
            
            {!isOperationalHours() && (
              <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" /> Fermé
              </span>
            )}
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
                    {suggestions[0].items.slice(0, 3).map((suggestion, index) => (
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
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetChat} 
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Réinitialiser la conversation
                    </Button>
                  </div>
                  {messages.map((msg) => (
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
                  ))}
                </>
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
        </TabsContent>
        
        <TabsContent value="help" className="h-full overflow-auto">
          <div className="p-4 space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Brain className="h-5 w-5 text-intestitrack-blue" />
              Aide rapide
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {quickHelp.map((item, index) => (
                <Card key={index} className="bg-muted/50 hover:bg-muted transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{item.icon}</div>
                      <div>
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setActiveTab('chat')}
              >
                Retour au chat
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="suggestions" className="h-full overflow-auto">
          <div className="p-4 space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-intestitrack-blue" />
              Questions populaires
            </h3>
            
            <div className="space-y-6">
              {suggestions.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">{category.category}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {category.items.map((suggestion, index) => (
                      <Button 
                        key={index} 
                        variant="outline"
                        className="justify-start h-auto py-2 text-left hover:bg-intestitrack-blue-light text-sm"
                        onClick={() => {
                          handleSuggestionClick(suggestion);
                          setActiveTab('chat');
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setActiveTab('chat')}
              >
                Retour au chat
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
