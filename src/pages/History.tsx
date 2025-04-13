
import React, { useEffect, useState } from 'react';
import { CalendarDays, List } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarView } from '@/components/history/CalendarView';
import { ListView } from '@/components/history/ListView';
import { FilterPopover } from '@/components/history/FilterPopover';
import { useHistoryView } from '@/hooks/useHistoryView';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { getEntries } from '@/services/storageService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/card';

const History = () => {
  const {
    date,
    view,
    selectedDate,
    entries,
    activeFilter,
    setView,
    setSelectedDate,
    handleMonthChange,
    handleFilterSelect,
    setEntries
  } = useHistoryView();
  
  const [isLoading, setIsLoading] = useState(true);

  // Chargement initial des entrées
  useEffect(() => {
    const loadEntries = async () => {
      setIsLoading(true);
      try {
        const storedEntries = await getEntries();
        setEntries(storedEntries);
      } catch (error) {
        console.error("Erreur lors du chargement des entrées:", error);
        toast.error("Erreur de chargement", {
          description: "Impossible de charger l'historique"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEntries();
  }, [setEntries]);

  // Abonnement aux mises à jour en temps réel des entrées
  useRealtimeSubscription({
    table: 'stool_entries',
    event: '*',
    callback: async (payload) => {
      console.log('Mise à jour d\'entrée reçue:', payload);
      
      // Actualiser les entrées
      const updatedEntries = await getEntries();
      setEntries(updatedEntries);
      
      if (payload.eventType === 'INSERT') {
        toast.info('Nouvelle entrée ajoutée', {
          description: 'L\'historique a été mis à jour'
        });
      }
    }
  });

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <section className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Historique</h1>
        <div className="flex space-x-2">
          <Tabs 
            value={view} 
            onValueChange={(v) => setView(v as 'calendar' | 'list')}
            className="w-[180px]"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="calendar">
                <CalendarDays className="h-4 w-4 mr-1" />
                Calendrier
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-1" />
                Liste
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <FilterPopover onFilterSelect={handleFilterSelect} />
        </div>
      </section>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground">Aucune entrée n'a été enregistrée.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Commencez par ajouter une entrée en utilisant le bouton + ci-dessous.
          </p>
        </div>
      ) : (
        <>
          {view === 'calendar' && (
            <CalendarView
              date={date}
              entries={entries}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              handleMonthChange={handleMonthChange}
            />
          )}

          {view === 'list' && (
            <ListView entries={entries} />
          )}
        </>
      )}
    </div>
  );
};

export default History;
