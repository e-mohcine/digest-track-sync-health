
import React from 'react';
import { Camera, Clock, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface NotesSectionProps {
  notes: string;
  hasPhoto: boolean;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAddPhoto: () => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ 
  notes, 
  hasPhoto, 
  onNotesChange, 
  onAddPhoto 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-3">Notes et détails</h2>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Informations complémentaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="notes" className="block mb-2 text-sm font-medium">
              Notes (optionnel)
            </label>
            <Textarea
              id="notes"
              placeholder="Ajoutez des détails sur votre état ou ce que vous avez mangé..."
              value={notes}
              onChange={onNotesChange}
              className="min-h-32 resize-none"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={onAddPhoto}
              variant="outline" 
              className="flex-1 flex items-center justify-center h-10"
            >
              <Camera className="mr-2 h-4 w-4" />
              <span>{hasPhoto ? "Changer la photo" : "Ajouter une photo"}</span>
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 flex items-center justify-center h-10">
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
                  <p className="text-center text-muted-foreground">
                    Fonctionnalité à implementer
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="w-full">
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
            <p className="text-center text-muted-foreground">
              Fonctionnalité à implementer
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
