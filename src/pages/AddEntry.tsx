
import React, { useState, useEffect } from 'react';
import { Check, Clock, Calendar, AlertTriangle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { TypeSelector } from '@/components/entry/TypeSelector';
import { NotesSection } from '@/components/entry/NotesSection';
import { SimpleSymptomSelector } from '@/components/entry/SimpleSymptomSelector';
import { MoodSelector } from '@/components/entry/MoodSelector';
import { useCompleteEntryData } from '@/hooks/useCompleteEntryData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { fetchStoolEntries } from '@/services/stoolEntryService';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

const AddEntry = () => {
  const [stoolEntries, setStoolEntries] = useState([]);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('type');
  
  const {
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
    saveCompleteEntry,
    isValidEntry
  } = useCompleteEntryData();
  
  // Charger les entrées initiales
  useEffect(() => {
    const loadEntries = async () => {
      const entries = await fetchStoolEntries();
      setStoolEntries(entries);
    };
    
    loadEntries();
  }, []);
  
  // S'abonner aux mises à jour en temps réel
  useRealtimeSubscription({
    table: 'stool_entries',
    event: 'INSERT',
    callback: (payload) => {
      setStoolEntries(prev => [payload.new, ...prev]);
      toast.success('Nouvelle entrée ajoutée');
    }
  });

  const handleSubmit = () => {
    if (!isValidEntry()) {
      toast.error("Information manquante", {
        description: "Veuillez remplir au moins une catégorie (selles, symptômes ou humeur)",
      });
      return;
    }
    
    saveCompleteEntry();
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <section className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Ajouter une entrée</h1>
        <Dialog open={timeDialogOpen} onOpenChange={setTimeDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span>{format(entryData.entryTime, 'dd MMM', { locale: fr })}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choisir une date</DialogTitle>
              <DialogDescription>
                Sélectionnez la date de cette entrée
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <CalendarComponent
                mode="single"
                selected={entryData.entryTime}
                onSelect={(date) => date && handleSetEntryTime(date)}
                initialFocus
              />
            </div>
          </DialogContent>
        </Dialog>
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="type">Selles</TabsTrigger>
          <TabsTrigger value="symptoms">Symptômes</TabsTrigger>
          <TabsTrigger value="mood">Humeur</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="type">
          <div className="space-y-6">
            <TypeSelector 
              selectedType={entryData.stoolType} 
              onTypeSelect={handleStoolTypeSelect} 
              hasBlood={entryData.hasBlood}
              hasMucus={entryData.hasMucus}
              onBloodToggle={handleToggleBlood}
              onMucusToggle={handleToggleMucus}
              selectedQuantity={entryData.stoolQuantity}
              onQuantitySelect={handleStoolQuantitySelect}
            />
          </div>
        </TabsContent>

        <TabsContent value="symptoms">
          <SimpleSymptomSelector
            selectedSymptoms={entryData.symptoms}
            onSymptomSelect={handleSetSymptoms}
          />
        </TabsContent>
        
        <TabsContent value="mood">
          <MoodSelector
            moodLevel={entryData.moodLevel}
            stressLevel={entryData.stressLevel}
            sleepQuality={entryData.sleepQuality}
            onMoodChange={handleSetMoodLevel}
            onStressChange={handleSetStressLevel}
            onSleepChange={handleSetSleepQuality}
          />
        </TabsContent>

        <TabsContent value="notes">
          <NotesSection 
            notes={entryData.notes}
            hasPhoto={entryData.hasPhoto}
            onNotesChange={handleNotesChange}
            onAddPhoto={handleAddPhoto}
          />
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-background to-transparent pt-8">
        <Button 
          onClick={handleSubmit}
          className="w-full bg-intestitrack-blue hover:bg-intestitrack-blue/90" 
          size="lg"
          disabled={!isValidEntry() || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Clock className="animate-spin mr-2 h-5 w-5" />
              Enregistrement...
            </span>
          ) : (
            <span className="flex items-center">
              <Check className="mr-2 h-5 w-5" />
              Enregistrer
            </span>
          )}
        </Button>
      </div>
      
      <Button
        className="fixed bottom-40 right-4 z-10 rounded-full bg-intestitrack-blue hover:bg-intestitrack-blue/90 shadow-lg h-14 w-14"
        onClick={() => {
          setActiveTab('type');
          handleStoolTypeSelect(4); // Type moyen (normal) par défaut
          handleStoolQuantitySelect('normal');
          toast.success('Selle normale ajoutée', { 
            description: 'Vous pouvez maintenant compléter les détails et enregistrer' 
          });
        }}
      >
        <PlusCircle className="h-6 w-6" />
        <span className="sr-only">Ajouter une selle normale</span>
      </Button>
    </div>
  );
};

export default AddEntry;
