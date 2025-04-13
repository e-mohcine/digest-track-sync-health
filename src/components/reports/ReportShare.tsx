
import React, { useState } from 'react';
import { Calendar, Mail, Download, Share2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface ReportShareProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeRange?: 'week' | 'month' | 'year';
}

export const ReportShare: React.FC<ReportShareProps> = ({ 
  open, 
  onOpenChange,
  timeRange = 'month'
}) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [includePhotos, setIncludePhotos] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);
  const [includeMood, setIncludeMood] = useState(true);
  
  const handleShare = () => {
    // Ici, on simulerait l'envoi du rapport
    toast.success("Rapport envoyé avec succès", {
      description: `Le rapport a été envoyé à ${email}`
    });
    onOpenChange(false);
  };
  
  const handleDownload = () => {
    // Ici, on simulerait le téléchargement du rapport
    toast.success("Rapport téléchargé", {
      description: "Le rapport est en cours de téléchargement"
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Partager le rapport médical</DialogTitle>
          <DialogDescription>
            Envoyez vos données à votre médecin ou téléchargez-les pour une consultation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-intestitrack-blue" />
            <span>Période : {timeRange === 'week' ? 'Dernière semaine' : timeRange === 'month' ? 'Dernier mois' : 'Dernière année'}</span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email du destinataire</Label>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input 
                id="email" 
                placeholder="docteur@example.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message (optionnel)</Label>
            <Textarea 
              id="message" 
              placeholder="Information supplémentaire pour votre médecin..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <div className="space-y-3 pt-2">
            <Label>Inclure dans le rapport :</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includePhotos" 
                checked={includePhotos} 
                onCheckedChange={(checked) => setIncludePhotos(checked as boolean)} 
              />
              <Label htmlFor="includePhotos" className="text-sm cursor-pointer">Photos (si disponibles)</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeNotes" 
                checked={includeNotes} 
                onCheckedChange={(checked) => setIncludeNotes(checked as boolean)} 
              />
              <Label htmlFor="includeNotes" className="text-sm cursor-pointer">Notes personnelles</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeMedications" 
                checked={includeMedications} 
                onCheckedChange={(checked) => setIncludeMedications(checked as boolean)} 
              />
              <Label htmlFor="includeMedications" className="text-sm cursor-pointer">Médicaments</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeMood" 
                checked={includeMood} 
                onCheckedChange={(checked) => setIncludeMood(checked as boolean)} 
              />
              <Label htmlFor="includeMood" className="text-sm cursor-pointer">Données d'humeur et stress</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleShare} disabled={!email}>
            <Mail className="h-4 w-4 mr-2" />
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
