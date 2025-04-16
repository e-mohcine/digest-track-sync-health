
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Share, 
  Mail, 
  FileText, 
  Download, 
  Copy 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const ReportShare = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    // Simuler la génération de PDF
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Rapport PDF généré avec succès");
    }, 2000);
  };
  
  const handleCopyToClipboard = () => {
    const reportURL = window.location.href;
    navigator.clipboard.writeText(reportURL);
    toast.success("Lien copié dans le presse-papier");
  };
  
  const handleEmailShare = () => {
    const subject = encodeURIComponent("Mon rapport IntestiTrack");
    const body = encodeURIComponent("Voici mon rapport IntestiTrack: " + window.location.href);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share className="mr-2 h-4 w-4" />
          Partager
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Options de partage</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={generatePDF} disabled={isGenerating}>
          <FileText className="mr-2 h-4 w-4" />
          <span>{isGenerating ? "Génération en cours..." : "Générer un PDF"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmailShare}>
          <Mail className="mr-2 h-4 w-4" />
          <span>Envoyer par email</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyToClipboard}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copier le lien</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={generatePDF} disabled={isGenerating}>
          <Download className="mr-2 h-4 w-4" />
          <span>Télécharger</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
