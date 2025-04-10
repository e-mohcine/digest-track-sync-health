
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

import { TypeSelector } from '@/components/entry/TypeSelector';
import { QuantitySelector } from '@/components/entry/QuantitySelector';
import { NotesSection } from '@/components/entry/NotesSection';
import { useEntryData } from '@/hooks/useEntryData';
import { saveEntry } from '@/services/storageService';

const AddEntry = () => {
  const navigate = useNavigate();
  const { 
    entryData, 
    handleTypeSelect, 
    handleQuantitySelect, 
    handleNotesChange, 
    handleAddPhoto,
    resetEntryData,
    isValid 
  } = useEntryData();

  const handleSubmit = () => {
    if (!isValid) {
      toast.error("Information manquante", {
        description: "Veuillez remplir les champs obligatoires",
      });
      return;
    }

    // Generate a unique ID for this entry
    const entryWithId = {
      ...entryData,
      id: `entry_${Date.now()}`
    };
    
    // Save the entry to localStorage
    saveEntry(entryWithId);
    
    console.log("Saving entry:", entryWithId);
    
    toast.success("Entrée enregistrée", {
      description: "Votre entrée a été enregistrée avec succès",
    });
    
    // Reset the form
    resetEntryData();
    
    // Navigate back to the home page after a brief delay
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <section>
        <h1 className="text-2xl font-semibold mb-4">Ajouter une entrée</h1>

        <Tabs defaultValue="type" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="type">Type</TabsTrigger>
            <TabsTrigger value="quantity">Quantité</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="type">
            <TypeSelector 
              selectedType={entryData.type} 
              onTypeSelect={handleTypeSelect} 
            />
          </TabsContent>

          <TabsContent value="quantity">
            <QuantitySelector 
              selectedQuantity={entryData.quantity} 
              onQuantitySelect={handleQuantitySelect} 
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
      </section>

      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-background to-transparent pt-8">
        <Button 
          onClick={handleSubmit}
          className="w-full bg-intestitrack-blue hover:bg-intestitrack-blue/90" 
          size="lg"
          disabled={!isValid}
        >
          <Check className="mr-2 h-5 w-5" />
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default AddEntry;
