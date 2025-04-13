import { useEffect, useState } from 'react';
import { getEntries } from '@/services/storageService';

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'hydration' | 'nutrition' | 'activity' | 'medical' | 'general';
  importance: 'low' | 'medium' | 'high';
}

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  useEffect(() => {
    generateSuggestions();
  }, []);
  
  const generateSuggestions = async () => {
    try {
      const entries = await getEntries();
      
      const lastWeekEntries = entries.filter(entry => {
        const entryDate = new Date(entry.time);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return entryDate >= oneWeekAgo;
      });
      
      // Compte de types spécifiques sur la semaine dernière
      const type1Count = lastWeekEntries.filter(entry => entry.type === 1).length;
      const type2Count = lastWeekEntries.filter(entry => entry.type === 2).length;
      const type3Count = lastWeekEntries.filter(entry => entry.type === 3).length;
      const type4Count = lastWeekEntries.filter(entry => entry.type === 4).length;
      const type5Count = lastWeekEntries.filter(entry => entry.type === 5).length;
      const type6Count = lastWeekEntries.filter(entry => entry.type === 6).length;
      const type7Count = lastWeekEntries.filter(entry => entry.type === 7).length;
      
      const liquidStools = type6Count + type7Count;
      const hardStools = type1Count + type2Count;
      const normalStools = type3Count + type4Count;
      
      const newSuggestions: Suggestion[] = [];
      
      // Suggestion basée sur des selles trop liquides
      if (liquidStools > 3) {
        newSuggestions.push({
          id: 'liquid-stools',
          title: 'Attention aux selles liquides',
          description: 'Vous avez eu plusieurs selles liquides cette semaine. Pensez à bien vous hydrater et à éviter les aliments irritants.',
          icon: 'droplets',
          category: 'hydration',
          importance: 'high'
        });
      }
      
      // Suggestion basée sur des selles trop dures
      if (hardStools > 3) {
        newSuggestions.push({
          id: 'hard-stools',
          title: 'Améliorer le transit',
          description: 'Vos selles semblent dures. Essayez d\'augmenter votre consommation de fibres et d\'eau.',
          icon: 'apple',
          category: 'nutrition',
          importance: 'medium'
        });
      }
      
      // Toujours ajouter au moins une suggestion générale
      newSuggestions.push({
        id: 'regular-tracking',
        title: 'Continuez le suivi régulier',
        description: 'Un suivi régulier vous aide à mieux comprendre votre système digestif et à identifier les tendances.',
        icon: 'calendar',
        category: 'general',
        importance: 'low'
      });
      
      // Après l'intégration de Supabase, nous pourrons faire des suggestions plus personnalisées
      // basées sur plus de données (humeur, poids, etc.)
      
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Erreur lors de la génération des suggestions:', error);
      // Ajouter au moins une suggestion générale en cas d'erreur
      setSuggestions([{
        id: 'regular-tracking',
        title: 'Continuez le suivi régulier',
        description: 'Un suivi régulier vous aide à mieux comprendre votre système digestif et à identifier les tendances.',
        icon: 'calendar',
        category: 'general',
        importance: 'low'
      }]);
    }
  };
  
  return { suggestions, refreshSuggestions: generateSuggestions };
};
