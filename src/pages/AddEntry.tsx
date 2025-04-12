import React, { useState } from 'react';
import { Check, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { TypeSelector } from '@/components/entry/TypeSelector';
import { QuantitySelector } from '@/components/entry/QuantitySelector';
import { NotesSection } from '@/components/entry/NotesSection';
import { SymptomSelector } from '@/components/entry/SymptomSelector';
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
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const AddEntry = () => {
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
  
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);

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

      <Tabs defaultValue="type" className="w-full">
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
            />
            
            <QuantitySelector 
              selectedQuantity={entryData.stoolQuantity} 
              onQuantitySelect={handleStoolQuantitySelect} 
            />
            
            <div className="space-y-3">
              <h2 className="text-lg font-medium mb-3">Détails cliniques</h2>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>Présence de sang</span>
                  </div>
                  <Switch 
                    checked={entryData.hasBlood}
                    onCheckedChange={handleToggleBlood}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span>Présence de mucus</span>
                  </div>
                  <Switch 
                    checked={entryData.hasMucus}
                    onCheckedChange={handleToggleMucus}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="symptoms">
          <SymptomSelector
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
    </div>
  );
};

export default AddEntry;
