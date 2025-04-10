
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, FileText, Clock, Check, PlusCircle } from 'lucide-react';
import { BristolType } from '@/components/stool/BristolType';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';

interface EntryData {
  type: number | null;
  quantity: string | null;
  notes: string;
  time: Date;
  hasPhoto: boolean;
}

const AddEntry = () => {
  const navigate = useNavigate();
  const [entryData, setEntryData] = useState<EntryData>({
    type: null,
    quantity: null,
    notes: '',
    time: new Date(),
    hasPhoto: false
  });

  const handleTypeSelect = (type: number) => {
    setEntryData(prev => ({ ...prev, type }));
  };

  const handleQuantitySelect = (quantity: string) => {
    setEntryData(prev => ({ ...prev, quantity }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntryData(prev => ({ ...prev, notes: e.target.value }));
  };

  const handleAddPhoto = () => {
    // In a real app, this would trigger the camera or file picker
    setEntryData(prev => ({ ...prev, hasPhoto: true }));
    toast("Photo ajoutée", {
      description: "La photo a été ajoutée à votre entrée",
    });
  };

  const handleSubmit = () => {
    if (!entryData.type || !entryData.quantity) {
      toast("Information manquante", {
        description: "Veuillez remplir les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Here you would save the data to your backend
    console.log("Saving entry:", entryData);
    
    toast("Entrée enregistrée", {
      description: "Votre entrée a été enregistrée avec succès",
    });
    
    // Navigate back to home
    setTimeout(() => navigate('/'), 1000);
  };

  const isValid = entryData.type !== null && entryData.quantity !== null;

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
            <h2 className="text-lg font-medium mb-3">Sélectionnez le type selon l'échelle de Bristol</h2>
            <div className="grid grid-cols-1 gap-4 mb-4">
              {[1, 2, 3, 4, 5, 6, 7].map(type => (
                <div key={type} onClick={() => handleTypeSelect(type)}>
                  <BristolType 
                    type={type} 
                    selected={entryData.type === type}
                    size="lg"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quantity">
            <h2 className="text-lg font-medium mb-3">Quantité</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div 
                className={`quantity-btn quantity-small ${entryData.quantity === 'small' ? 'ring-2 ring-intestitrack-blue' : ''}`} 
                onClick={() => handleQuantitySelect('small')}
              >
                <span className="h-6 w-6 mb-1">💧</span>
                <span>Faible</span>
              </div>
              <div 
                className={`quantity-btn quantity-normal ${entryData.quantity === 'normal' ? 'ring-2 ring-intestitrack-blue' : ''}`}
                onClick={() => handleQuantitySelect('normal')}
              >
                <span className="h-6 w-6 mb-1">💧💧</span>
                <span>Normale</span>
              </div>
              <div 
                className={`quantity-btn quantity-large ${entryData.quantity === 'large' ? 'ring-2 ring-intestitrack-blue' : ''}`}
                onClick={() => handleQuantitySelect('large')}
              >
                <span className="h-6 w-6 mb-1">💧💧💧</span>
                <span>Abondante</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <h2 className="text-lg font-medium mb-3">Notes et détails</h2>
            
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="notes" className="block mb-2 text-sm font-medium">
                      Notes (optionnel)
                    </label>
                    <Textarea
                      id="notes"
                      placeholder="Ajoutez des détails sur votre état ou ce que vous avez mangé..."
                      value={entryData.notes}
                      onChange={handleNotesChange}
                      className="min-h-32"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      onClick={handleAddPhoto}
                      variant="outline" 
                      className="flex-1 flex items-center"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      <span>{entryData.hasPhoto ? "Changer la photo" : "Ajouter une photo"}</span>
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>Changer l'heure</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Définir l'heure</DialogTitle>
                          <DialogDescription>
                            Ajustez l'heure si l'entrée ne concerne pas maintenant
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          {/* Time picker would go here */}
                          <p className="text-center text-muted-foreground">
                            Fonctionnalité à implementer
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Symptoms section would go here */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Ajouter des symptômes</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Symptômes associés</DialogTitle>
                  <DialogDescription>
                    Ajoutez les symptômes que vous ressentez
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {/* Symptoms selection would go here */}
                  <p className="text-center text-muted-foreground">
                    Fonctionnalité à implementer
                  </p>
                </div>
              </DialogContent>
            </Dialog>
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
