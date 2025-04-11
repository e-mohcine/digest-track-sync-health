
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, TrendingUp, AlertTriangle, Droplets, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DailyStatusCard from '@/components/dashboard/DailyStatusCard';
import WeeklyChart from '@/components/dashboard/WeeklyChart';
import RecentEntriesList from '@/components/dashboard/RecentEntriesList';
import RecommendationCard from '@/components/dashboard/RecommendationCard';
import { fetchStoolEntries, fetchSymptomEntries, fetchMoodEntries, subscribeToRealTimeUpdates } from '@/services/supabaseService';
import { StoolEntry, SymptomEntry, MoodEntry } from '@/types/database.types';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();
  const [stoolEntries, setStoolEntries] = useState<StoolEntry[]>([]);
  const [symptomEntries, setSymptomEntries] = useState<SymptomEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Chargement des données
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      const [stoolData, symptomData, moodData] = await Promise.all([
        fetchStoolEntries(),
        fetchSymptomEntries(),
        fetchMoodEntries()
      ]);
      
      setStoolEntries(stoolData);
      setSymptomEntries(symptomData);
      setMoodEntries(moodData);
      setLoading(false);
    };
    
    loadData();
  }, []);
  
  // Abonnement aux mises à jour en temps réel
  useEffect(() => {
    // Mise à jour des entrées de selles en temps réel
    const unsubscribeStool = subscribeToRealTimeUpdates('stool_entries', '*', (payload) => {
      console.log('Mise à jour stool_entries:', payload);
      
      if (payload.eventType === 'INSERT') {
        setStoolEntries(prev => [payload.new as StoolEntry, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setStoolEntries(prev => 
          prev.map(entry => entry.id === payload.new.id ? payload.new as StoolEntry : entry)
        );
      } else if (payload.eventType === 'DELETE') {
        setStoolEntries(prev => 
          prev.filter(entry => entry.id !== payload.old.id)
        );
      }
    });
    
    // Mise à jour des entrées de symptômes en temps réel
    const unsubscribeSymptom = subscribeToRealTimeUpdates('symptom_entries', '*', (payload) => {
      console.log('Mise à jour symptom_entries:', payload);
      
      if (payload.eventType === 'INSERT') {
        setSymptomEntries(prev => [payload.new as SymptomEntry, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setSymptomEntries(prev => 
          prev.map(entry => entry.id === payload.new.id ? payload.new as SymptomEntry : entry)
        );
      } else if (payload.eventType === 'DELETE') {
        setSymptomEntries(prev => 
          prev.filter(entry => entry.id !== payload.old.id)
        );
      }
    });
    
    // Mise à jour des entrées d'humeur en temps réel
    const unsubscribeMood = subscribeToRealTimeUpdates('mood_entries', '*', (payload) => {
      console.log('Mise à jour mood_entries:', payload);
      
      if (payload.eventType === 'INSERT') {
        setMoodEntries(prev => [payload.new as MoodEntry, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setMoodEntries(prev => 
          prev.map(entry => entry.id === payload.new.id ? payload.new as MoodEntry : entry)
        );
      } else if (payload.eventType === 'DELETE') {
        setMoodEntries(prev => 
          prev.filter(entry => entry.id !== payload.old.id)
        );
      }
    });
    
    return () => {
      unsubscribeStool();
      unsubscribeSymptom();
      unsubscribeMood();
    };
  }, []);
  
  // Données pour l'affichage
  const getLastEntry = () => {
    if (stoolEntries.length === 0) {
      return { type: 0, time: "jamais", quantity: "normal" };
    }
    
    const lastEntry = stoolEntries[0];
    const entryDate = new Date(lastEntry.occurred_at);
    const timeSince = format(entryDate, 'PPp', { locale: fr });
    
    return {
      type: lastEntry.bristol_type,
      time: timeSince,
      quantity: lastEntry.quantity
    };
  };
  
  // Statistiques
  const dailyStreak = 7; // À calculer en fonction des données réelles
  const badgesCount = 3; // À récupérer de la base de données
  const totalEntries = stoolEntries.length + symptomEntries.length + moodEntries.length;
  const lastEntry = getLastEntry();
  
  // Détection des problèmes potentiels
  const liquidStools = stoolEntries.filter(entry => 
    entry.bristol_type >= 6 && 
    new Date(entry.occurred_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;
  
  const showAlert = liquidStools >= 3;
  
  return (
    <div className="space-y-6 pt-2 pb-20 animate-fade-in">
      {/* Section de bienvenue */}
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Bonjour, {user?.user_metadata?.first_name || 'Utilisateur'}</h1>
          <p className="text-muted-foreground">{format(new Date(), 'EEEE d MMMM, yyyy', { locale: fr })}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="bg-intestitrack-green-light text-intestitrack-green px-3 py-1 rounded-full text-sm font-medium">
            <span>{dailyStreak} jours de suivi</span>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="space-y-4 py-10">
          <p className="text-center text-muted-foreground">Chargement des données...</p>
          <Progress value={40} className="w-1/2 mx-auto" />
        </div>
      ) : (
        <>
          {/* Carte d'état quotidien */}
          <DailyStatusCard lastEntry={lastEntry} />

          {/* Statistiques rapides */}
          <section className="grid grid-cols-3 gap-3">
            <Card className="bg-intestitrack-blue-light border-none">
              <CardContent className="p-3 flex flex-col items-center">
                <Droplets className="h-6 w-6 text-intestitrack-blue mb-1" />
                <p className="text-xs text-center">Dernière selle</p>
                <p className="font-semibold text-sm">
                  {stoolEntries.length > 0 
                    ? format(new Date(stoolEntries[0].occurred_at), 'HH:mm', { locale: fr }) 
                    : 'Aucune'}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-intestitrack-green-light border-none">
              <CardContent className="p-3 flex flex-col items-center">
                <Calendar className="h-6 w-6 text-intestitrack-green mb-1" />
                <p className="text-xs text-center">Entrées total</p>
                <p className="font-semibold text-sm">{totalEntries}</p>
              </CardContent>
            </Card>
            <Card className="bg-intestitrack-beige border-none">
              <CardContent className="p-3 flex flex-col items-center">
                <Award className="h-6 w-6 text-amber-600 mb-1" />
                <p className="text-xs text-center">Badges</p>
                <p className="font-semibold text-sm">{badgesCount}</p>
              </CardContent>
            </Card>
          </section>

          {/* Graphique hebdomadaire */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-intestitrack-blue" />
                Activité de la semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyChart stoolEntries={stoolEntries} />
            </CardContent>
          </Card>

          {/* Alertes médicales si nécessaire */}
          {showAlert && (
            <section>
              <Card className="bg-intestitrack-alert-light border-intestitrack-alert">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="text-intestitrack-alert h-6 w-6 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-base">Possible poussée détectée</h3>
                      <p className="text-sm mb-2">{liquidStools} selles liquides en 24h, consultez votre médecin.</p>
                      <Button size="sm" variant="outline" className="border-intestitrack-alert text-intestitrack-alert hover:bg-intestitrack-alert hover:text-white">
                        Contacter mon médecin
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Recommandations */}
          <RecommendationCard 
            title="Restez hydraté" 
            description="N'oubliez pas de bien vous hydrater, surtout en cas de selles molles ou liquides."
            icon={<Droplets className="h-5 w-5" />}
          />

          {/* Entrées récentes */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Entrées récentes</h2>
              <Link to="/history">
                <Button variant="link" className="text-intestitrack-blue p-0">Voir tout</Button>
              </Link>
            </div>
            <RecentEntriesList entries={stoolEntries.slice(0, 5)} />
          </section>
        </>
      )}
      
      {/* Bouton d'ajout flottant */}
      <Link to="/add" className="fixed bottom-24 right-4 z-10">
        <Button size="lg" className="rounded-full h-14 w-14 bg-intestitrack-blue hover:bg-intestitrack-blue/90 shadow-lg">
          <PlusCircle className="h-6 w-6" />
          <span className="sr-only">Ajouter une entrée</span>
        </Button>
      </Link>
    </div>
  );
};

export default Index;

function Award(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
