
import { useState } from 'react';
import { 
  createStoolEntry, 
  createSymptomEntry, 
  createMoodEntry 
} from '@/services';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { StoolEntryData } from './useStoolEntryData';
import { SymptomEntryData } from './useSymptomEntryData';
import { MoodEntryData } from './useMoodEntryData';

interface SaveEntryProps {
  stoolData: StoolEntryData;
  symptomData: SymptomEntryData;
  moodData: MoodEntryData;
  entryTime: Date;
  onSuccess?: () => void;
}

export const useEntrySaving = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveCompleteEntry = async ({
    stoolData,
    symptomData,
    moodData,
    entryTime,
    onSuccess
  }: SaveEntryProps) => {
    setIsSubmitting(true);
    
    try {
      // 1. Sauvegarder l'entrée de selles
      if (stoolData.stoolType !== null && stoolData.stoolQuantity !== null) {
        const stoolEntry = await createStoolEntry({
          bristol_type: stoolData.stoolType,
          quantity: stoolData.stoolQuantity,
          notes: stoolData.notes,
          has_photo: stoolData.hasPhoto,
          has_blood: stoolData.hasBlood,
          has_mucus: stoolData.hasMucus,
          occurred_at: entryTime.toISOString()
        });
        
        if (!stoolEntry) {
          throw new Error("Échec de l'enregistrement des données de selles");
        }
      }
      
      // 2. Sauvegarder les symptômes
      const symptomPromises = symptomData.symptoms.map(symptom => 
        createSymptomEntry({
          symptom_type_id: symptom.id,
          intensity: symptom.intensity,
          notes: null,
          occurred_at: entryTime.toISOString()
        })
      );
      
      if (symptomPromises.length > 0) {
        await Promise.all(symptomPromises);
      }
      
      // 3. Sauvegarder l'humeur
      await createMoodEntry({
        mood_level: moodData.moodLevel,
        stress_level: moodData.stressLevel,
        sleep_quality: moodData.sleepQuality,
        notes: null,
        occurred_at: entryTime.toISOString()
      });
      
      toast.success("Entrée complète enregistrée avec succès");
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Rediriger vers la page d'accueil par défaut
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (error: any) {
      toast.error("Erreur lors de l'enregistrement", {
        description: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    saveCompleteEntry
  };
};
