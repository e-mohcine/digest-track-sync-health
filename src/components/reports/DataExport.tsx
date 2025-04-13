
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarRange, Download, FileText } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { EntryData } from '@/hooks/useEntryData';
import { getEntries } from '@/services/storageService';
import { toast } from 'sonner';

export const DataExport: React.FC = () => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subMonths(new Date(), 1),
    to: new Date()
  });

  const exportData = async () => {
    setIsLoading(true);
    
    try {
      // Récupérer les entrées
      const allEntries = await getEntries();
      
      // Filtrer par date
      const filteredEntries = allEntries.filter(entry => {
        const entryDate = new Date(entry.time);
        return entryDate >= dateRange.from && entryDate <= dateRange.to;
      });
      
      if (filteredEntries.length === 0) {
        toast.warning('Aucune donnée à exporter', {
          description: 'Il n\'y a pas d\'entrées dans la période sélectionnée.'
        });
        return;
      }
      
      if (exportFormat === 'csv') {
        downloadCSV(filteredEntries);
      } else {
        // Pour PDF, nous simulons juste le téléchargement
        // Dans une implémentation réelle, nous utiliserions une bibliothèque comme jsPDF
        toast.success('Export PDF préparé', {
          description: 'Dans une version complète, le PDF serait généré ici.'
        });
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'exportation des données:', error);
      toast.error('Erreur d\'exportation', {
        description: 'Une erreur est survenue lors de l\'exportation des données.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadCSV = (entries: EntryData[]) => {
    // Créer les en-têtes CSV
    const headers = [
      'Date', 
      'Heure', 
      'Type Bristol', 
      'Quantité', 
      'Sang', 
      'Mucus', 
      'Notes'
    ];
    
    // Convertir les entrées en lignes CSV
    const rows = entries.map(entry => [
      format(entry.time, 'dd/MM/yyyy'),
      format(entry.time, 'HH:mm'),
      entry.type || '',
      entry.quantity || '',
      entry.hasBlood ? 'Oui' : 'Non',
      entry.hasMucus ? 'Oui' : 'Non',
      entry.notes
    ]);
    
    // Combiner les en-têtes et les lignes
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(','))
    ].join('\n');
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `intestitrack_export_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Données exportées avec succès', {
      description: 'Le fichier CSV a été téléchargé.'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exporter vos données</CardTitle>
        <CardDescription>
          Téléchargez un rapport de vos entrées pour le partager avec votre médecin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs
          value={exportFormat}
          onValueChange={(value) => setExportFormat(value as 'pdf' | 'csv')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pdf" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              PDF
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              CSV
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Période :</label>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
        
        <Button 
          className="w-full"
          onClick={exportData}
          disabled={isLoading}
        >
          {isLoading ? 'Exportation...' : 'Exporter les données'}
        </Button>
      </CardContent>
    </Card>
  );
};
