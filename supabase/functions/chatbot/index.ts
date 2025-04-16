
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Clé d'API GROQ 
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") || "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";

// Fonction principale du chatbot avec GROQ
async function processChat(userMessage: string): Promise<string> {
  try {
    // Appel à l'API GROQ
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: `Tu es un assistant spécialisé dans la santé digestive, l'alimentation et la maladie de Crohn pour l'application IntestiTrack. 
            Fournis des informations précises et bienveillantes sur la nutrition, les troubles digestifs et le suivi des selles.
            Sois concis, empathique et adapté à un public qui peut inclure des enfants.`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erreur avec l'API GROQ:", error);
    return "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.";
  }
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
      response
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
