
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Clé d'API GSK - utilise un secret Supabase
const GSK_API_KEY = Deno.env.get("GSK_API_KEY") || "";

const DISALLOWED_TOPICS = [
  "cancer",
  "chimiothérapie",
  "radiothérapie",
  "diagnostic",
  "médicaments",
  "ordonnance",
  "prescription",
  "posologie",
  "traitement spécifique",
  "douleurs aigues",
  "chirurgie"
];

// Heures d'opération: 8h-22h
const isWithinOperationalHours = () => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 8 && hour < 22;
};

// Vérifie si la demande contient des sujets interdits
const containsDisallowedTopics = (input: string): boolean => {
  const lowerInput = input.toLowerCase();
  return DISALLOWED_TOPICS.some(topic => lowerInput.includes(topic.toLowerCase()));
};

// Génère un avertissement médical
const generateMedicalDisclaimer = (): string => {
  return "IMPORTANT: Je ne suis pas un professionnel médical et ne peux pas fournir de conseil médical personnalisé. " +
    "Les informations que je fournis sont générales et éducatives. " +
    "Pour tout problème de santé, veuillez consulter un médecin.";
};

// Fonction principale du chatbot
async function processChat(userMessage: string): Promise<string> {
  // Vérification des heures d'opération
  if (!isWithinOperationalHours()) {
    return "Je suis désolé, je ne suis disponible que de 8h à 22h. Merci de revenir pendant mes heures d'ouverture.";
  }

  // Vérification des sujets interdits
  if (containsDisallowedTopics(userMessage)) {
    return "Je ne peux pas répondre à cette question car elle semble concerner un sujet médical spécifique qui nécessite l'avis d'un professionnel de santé. " +
      "Veuillez consulter votre médecin pour ce type de demande. " +
      "Je peux vous aider sur des sujets généraux liés à la maladie de Crohn, aux MICI, aux troubles digestifs ou à la nutrition.";
  }

  // Pour cette version, nous simulons une réponse
  // Dans une implémentation réelle, nous utiliserions l'API GSK avec la clé sécurisée
  const simulatedResponse = "Merci pour votre question sur " + 
    (userMessage.length > 20 ? userMessage.substring(0, 20) + "..." : userMessage) + 
    ". En tant qu'assistant IntestiTrack, je peux vous fournir des informations sur la maladie de Crohn, les MICI, " +
    "les troubles digestifs et la nutrition. " + 
    "\n\n" + generateMedicalDisclaimer();

  return simulatedResponse;
}

serve(async (req) => {
  // Gestion des requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  // Vérification de la méthode
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Récupération du contenu de la requête
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      throw new Error('Le message est requis et doit être une chaîne de caractères');
    }

    // Traitement du message
    const response = await processChat(message);

    // Retour de la réponse
    return new Response(JSON.stringify({ 
      response,
      operationalHours: isWithinOperationalHours()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur dans la fonction chatbot:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Une erreur est survenue lors du traitement de votre demande',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
