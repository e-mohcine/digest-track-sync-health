
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Download, Mail, Copy, FileText, FilePdf } from 'lucide-react';
import { toast } from 'sonner';

interface ReportShareProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeRange: 'week' | 'month' | 'year';
}

export const ReportShare: React.FC<ReportShareProps> = ({ 
  open, 
  onOpenChange,
  timeRange 
}) => {
  const [email, setEmail] = useState('');
  const [sharing, setSharing] = useState(false);
  const [includeData, setIncludeData] = useState({
    stool: true,
    symptom: true,
    mood: true,
    nutrition: false,
    medication: false
  });
  const [generatingPdf, setGeneratingPdf] = useState(false);
  
  const handleEmailShare = async () => {
    setSharing(true);
    
    // Simuler l'envoi d'un rapport
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Rapport envoyé avec succès', {
      description: `Le rapport a été envoyé à ${email}`
    });
    
    setSharing(false);
    onOpenChange(false);
  };
  
  const handleCopyLink = () => {
    // Simule la copie d'un lien
    navigator.clipboard.writeText(`https://intestitrack.app/shared/report/${Date.now()}`);
    
    toast.success('Lien copié dans le presse-papier');
  };
  
  const handleGeneratePdf = async () => {
    setGeneratingPdf(true);
    
    // Simuler la génération d'un PDF
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('PDF généré avec succès', {
      description: 'Le rapport a été téléchargé sur votre appareil'
    });
    
    setGeneratingPdf(false);
  };
  
  const getTimeRangeDescription = () => {
    switch(timeRange) {
      case 'week':
        return 'de la dernière semaine';
      case 'month':
        return 'du dernier mois';
      case 'year':
        return 'de l\'année';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Partager vos données {getTimeRangeDescription()}</DialogTitle>
          <DialogDescription>
            Générez un rapport de vos données pour le partager avec votre médecin ou le télécharger pour vos archives.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="email">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="email" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-1">
              <Copy className="h-4 w-4" />
              <span>Lien</span>
            </TabsTrigger>
            <TabsTrigger value="download" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Télécharger</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="space-y-4 mb-4">
            <h3 className="text-sm font-medium">Inclure dans le rapport :</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="stool" 
                  checked={includeData.stool}
                  onCheckedChange={(checked) => 
                    setIncludeData(prev => ({ ...prev, stool: !!checked }))
                  }
                />
                <Label htmlFor="stool">Entrées de selles</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="symptom" 
                  checked={includeData.symptom}
                  onCheckedChange={(checked) => 
                    setIncludeData(prev => ({ ...prev, symptom: !!checked }))
                  }
                />
                <Label htmlFor="symptom">Symptômes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mood" 
                  checked={includeData.mood}
                  onCheckedChange={(checked) => 
                    setIncludeData(prev => ({ ...prev, mood: !!checked }))
                  }
                />
                <Label htmlFor="mood">Humeur</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="nutrition" 
                  checked={includeData.nutrition}
                  onCheckedChange={(checked) => 
                    setIncludeData(prev => ({ ...prev, nutrition: !!checked }))
                  }
                />
                <Label htmlFor="nutrition">Nutrition</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="medication" 
                  checked={includeData.medication}
                  onCheckedChange={(checked) => 
                    setIncludeData(prev => ({ ...prev, medication: !!checked }))
                  }
                />
                <Label htmlFor="medication">Médicaments</Label>
              </div>
            </div>
          </div>
          
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input 
                id="email" 
                placeholder="docteur@exemple.fr" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleEmailShare} 
                disabled={!email || sharing}
              >
                {sharing ? "Envoi en cours..." : "Envoyer par email"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="link" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Générez un lien sécurisé qui expire après 7 jours. Ce lien peut être partagé avec votre médecin ou vos proches.
            </p>
            
            <div className="flex justify-end">
              <Button onClick={handleCopyLink}>
                Copier le lien
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="download" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 justify-center h-20"
                onClick={() => toast.success('Données CSV téléchargées')}
              >
                <FileText className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-medium">Format CSV</div>
                  <div className="text-xs text-muted-foreground">Pour analyse détaillée</div>
                </div>
              </Button>
              
              <Button
                className="flex items-center gap-2 justify-center h-20 bg-intestitrack-blue hover:bg-intestitrack-blue/90"
                onClick={handleGeneratePdf}
                disabled={generatingPdf}
              >
                <FilePdf className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-medium">Document PDF</div>
                  <div className="text-xs">Avec graphiques et analyse IA</div>
                </div>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-4 text-xs text-muted-foreground">
          <p>Rappel: Ces données ne remplacent pas un diagnostic médical professionnel.</p>
          <p>Les suggestions IA sont basées sur vos données mais ne constituent pas un avis médical.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
