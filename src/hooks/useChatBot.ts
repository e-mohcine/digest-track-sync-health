
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
        // Générer une réponse plus pertinente basée sur la question
        let response = "";
        
        if (content.toLowerCase().includes("bristol") || content.toLowerCase().includes("échelle")) {
          response = "L'échelle de Bristol est une classification médicale des selles humaines en 7 types, allant des plus dures (type 1) aux plus liquides (type 7). Le type 3-4 est considéré comme optimal. C'est un excellent indicateur de la santé digestive et du temps de transit intestinal.";
        } else if (content.toLowerCase().includes("crohn") || content.toLowerCase().includes("mici")) {
          response = "La maladie de Crohn est une maladie inflammatoire chronique qui peut affecter n'importe quelle partie du tube digestif. Les symptômes courants incluent douleurs abdominales, diarrhée, fatigue et perte de poids. Le suivi régulier des selles peut aider à gérer les symptômes et à anticiper les crises.";
        } else if (content.toLowerCase().includes("transit") || content.toLowerCase().includes("constipation")) {
          response = "Pour améliorer votre transit intestinal, essayez d'augmenter votre consommation de fibres (fruits, légumes, céréales complètes), de boire suffisamment d'eau et de pratiquer une activité physique régulière. L'application IntestiTrack peut vous aider à suivre l'évolution de votre transit.";
        } else if (content.toLowerCase().includes("partager") || content.toLowerCase().includes("médecin")) {
          response = "Pour partager vos données avec votre médecin, rendez-vous dans la section 'Profil' puis 'Partage médical'. Vous pourrez générer un rapport PDF ou donner un accès temporaire à votre profil via un code sécurisé que vous transmettrez à votre médecin.";
        } else {
          response = "Je suis votre assistant IntestiTrack. Je peux vous aider concernant la maladie de Crohn, les MICI, les troubles digestifs et la nutrition. N'hésitez pas à me poser des questions précises sur ces sujets ou sur l'utilisation de l'application.";
        }
        
        addMessage(response, 'assistant');
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
