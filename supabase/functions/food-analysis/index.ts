
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Clé d'API GROQ
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") || "";

// Fonction pour convertir une image base64 en analyse nutritionnelle
async function analyzeFoodImage(imageBase64: string): Promise<any> {
  try {
    // Appel à l'API GROQ avec vision
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
            content: `Tu es un nutritionniste spécialisé dans l'analyse d'images de nourriture. 
            Pour chaque image, identifie précisément les aliments visibles et fournis les informations suivantes:
            1. Nom des aliments identifiés
            2. Estimation approximative des calories (pour 100g)
            3. Macronutriments principaux (protéines, glucides, lipides)
            4. Impact potentiel sur le transit intestinal (favorable, neutre, défavorable)
            5. Conseils pour les personnes atteintes de troubles digestifs
            
            Réponds sous forme d'un objet JSON structuré avec ces champs.`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyse cette image de nourriture et donne-moi les détails nutritionnels. Format ton résultat en JSON." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
            ]
          }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error("Erreur lors de l'analyse de l'image:", error);
    throw error;
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
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      throw new Error('Image requise sous format base64');
    }

    // Analyse de l'image
    const analysisResult = await analyzeFoodImage(imageBase64);

    // Retour de la réponse
    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur dans la fonction d\'analyse alimentaire:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Une erreur est survenue lors de l\'analyse de l\'image',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
