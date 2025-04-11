
import { useState } from 'react';
import { 
  createStoolEntry, 
  createSymptomEntry, 
  createMoodEntry 
} from '@/services/supabaseService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface SelectedSymptom {
  id: number;
  name: string;
  intensity: number;
}

export interface CompleteEntryData {
  // Données de selles
  stoolType: number | null;
  stoolQuantity: string | null;
  hasBlood: boolean;
  hasMucus: boolean;
  notes: string;
  hasPhoto: boolean;
  
  // Données de symptômes
  symptoms: SelectedSymptom[];
  
  // Données d'humeur
  moodLevel: number;
  stressLevel: number;
  sleepQuality: number;
  
  // Métadonnées
  entryTime: Date;
}

export const useCompleteEntryData = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [entryData, setEntryData] = useState<CompleteEntryData>({
    stoolType: null,
    stoolQuantity: null,
    hasBlood: false,
    hasMucus: false,
    notes: '',
    hasPhoto: false,
    symptoms: [],
    moodLevel: 3,
    stressLevel: 3,
    sleepQuality: 3,
    entryTime: new Date()
  });

  const handleStoolTypeSelect = (type: number) => {
    setEntryData(prev => ({ ...prev, stoolType: type }));
  };

  const handleStoolQuantitySelect = (quantity: string) => {
    setEntryData(prev => ({ ...prev, stoolQuantity: quantity }));
  };
  
  const handleToggleBlood = (value: boolean) => {
    setEntryData(prev => ({ ...prev, hasBlood: value }));
  };
  
  const handleToggleMucus = (value: boolean) => {
    setEntryData(prev => ({ ...prev, hasMucus: value }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntryData(prev => ({ ...prev, notes: e.target.value }));
  };

  const handleAddPhoto = () => {
    setEntryData(prev => ({ ...prev, hasPhoto: true }));
  };
  
  const handleSetSymptoms = (symptoms: SelectedSymptom[]) => {
    setEntryData(prev => ({ ...prev, symptoms }));
  };
  
  const handleSetMoodLevel = (level: number) => {
    setEntryData(prev => ({ ...prev, moodLevel: level }));
  };
  
  const handleSetStressLevel = (level: number) => {
    setEntryData(prev => ({ ...prev, stressLevel: level }));
  };
  
  const handleSetSleepQuality = (level: number) => {
    setEntryData(prev => ({ ...prev, sleepQuality: level }));
  };
  
  const handleSetEntryTime = (time: Date) => {
    setEntryData(prev => ({ ...prev, entryTime: time }));
  };

  const resetEntryData = () => {
    setEntryData({
      stoolType: null,
      stoolQuantity: null,
      hasBlood: false,
      hasMucus: false,
      notes: '',
      hasPhoto: false,
      symptoms: [],
      moodLevel: 3,
      stressLevel: 3,
      sleepQuality: 3,
      entryTime: new Date()
    });
  };

  const saveCompleteEntry = async () => {
    setIsSubmitting(true);
    
    try {
      // 1. Sauvegarder l'entrée de selles
      if (entryData.stoolType !== null && entryData.stoolQuantity !== null) {
        const stoolEntry = await createStoolEntry({
          bristol_type: entryData.stoolType,
          quantity: entryData.stoolQuantity, // Pas besoin de cast, accepte maintenant un string générique
          notes: entryData.notes,
          has_photo: entryData.hasPhoto,
          has_blood: entryData.hasBlood,
          has_mucus: entryData.hasMucus,
          occurred_at: entryData.entryTime.toISOString()
        });
        
        if (!stoolEntry) {
          throw new Error("Échec de l'enregistrement des données de selles");
        }
      }
      
      // 2. Sauvegarder les symptômes
      const symptomPromises = entryData.symptoms.map(symptom => 
        createSymptomEntry({
          symptom_type_id: symptom.id,
          intensity: symptom.intensity,
          notes: null,
          occurred_at: entryData.entryTime.toISOString()
        })
      );
      
      if (symptomPromises.length > 0) {
        await Promise.all(symptomPromises);
      }
      
      // 3. Sauvegarder l'humeur
      await createMoodEntry({
        mood_level: entryData.moodLevel,
        stress_level: entryData.stressLevel,
        sleep_quality: entryData.sleepQuality,
        notes: null,
        occurred_at: entryData.entryTime.toISOString()
      });
      
      toast.success("Entrée complète enregistrée avec succès");
      resetEntryData();
      
      // Rediriger vers la page d'accueil
      setTimeout(() => navigate('/'), 1000);
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement", {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEntry = () => {
    // Vérifie si l'entrée est valide pour être enregistrée
    // Dans cette version simplifiée, on vérifie juste si au moins une des données principales est présente
    return (
      entryData.stoolType !== null ||
      entryData.symptoms.length > 0 ||
      entryData.notes.trim().length > 0
    );
  };

  return {
    entryData,
    isSubmitting,
    handleStoolTypeSelect,
    handleStoolQuantitySelect,
    handleToggleBlood,
    handleToggleMucus,
    handleNotesChange,
    handleAddPhoto,
    handleSetSymptoms,
    handleSetMoodLevel,
    handleSetStressLevel,
    handleSetSleepQuality,
    handleSetEntryTime,
    resetEntryData,
    saveCompleteEntry,
    isValidEntry
  };
};
