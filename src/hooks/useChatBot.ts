
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
      // Appel de l'Edge Function Supabase
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { message: content }
      });
      
      if (error) throw error;
      
      // Ajouter la réponse de l'assistant
      addMessage(data.response, 'assistant');
      
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la communication avec le chatbot.");
      toast.error("Erreur du chatbot", {
        description: err.message || "Une erreur est survenue lors de la communication avec le chatbot."
      });
    } finally {
      setIsLoading(false);
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
