
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
      if (data && data.response) {
        addMessage(data.response, 'assistant');
      } else {
        throw new Error("Réponse invalide du chatbot");
      }
      
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la communication avec le chatbot.");
      toast.error("Erreur du chatbot", {
        description: err.message || "Une erreur est survenue lors de la communication avec le chatbot."
      });
      console.error("Erreur chatbot:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };
  
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
};
