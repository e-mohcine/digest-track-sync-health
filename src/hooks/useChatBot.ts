
import { useState } from 'react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isOperationalHours = (): boolean => {
    const now = new Date();
    const hour = now.getHours();
    // Le chatbot est opérationnel de 8h à 22h
    return hour >= 8 && hour < 22;
  };
  
  const addMessage = (content: string, role: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content,
      role,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };
  
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Vérifier les heures d'opération
    if (!isOperationalHours()) {
      toast.error("Le chatbot est indisponible entre 22h et 8h du matin.", {
        description: "Veuillez réessayer pendant les heures d'opération."
      });
      return;
    }
    
    // Ajouter le message de l'utilisateur
    addMessage(content, 'user');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Ici, nous appellerons l'API pour obtenir une réponse
      // Pour l'instant, simulons une réponse après un délai
      setTimeout(() => {
        addMessage("Je suis votre assistant IntestiTrack. Je peux vous aider concernant la maladie de Crohn, les MICI, les troubles digestifs et la nutrition. Veuillez noter que je ne remplace pas l'avis d'un médecin.", 'assistant');
        setIsLoading(false);
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la communication avec le chatbot.");
      setIsLoading(false);
      toast.error("Erreur du chatbot", {
        description: err.message || "Une erreur est survenue lors de la communication avec le chatbot."
      });
    }
  };
  
  const clearMessages = () => {
    setMessages([]);
  };
  
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    isOperationalHours
  };
};
