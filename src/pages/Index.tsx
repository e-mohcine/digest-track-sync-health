
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
import HealthSuggestion from '@/components/dashboard/HealthSuggestion';
import { MoodSelector } from '@/components/entry/MoodSelector';
import SymptomSummary from '@/components/entry/SymptomSummary';
import { useMoodEntryData } from '@/hooks/useMoodEntryData';
import { useSymptomEntryData } from '@/hooks/useSymptomEntryData';
import { createMoodEntry } from '@/services/moodService';
import { fetchStoolEntries, fetchSymptomEntries, fetchMoodEntries } from '@/services/supabaseService';
import { subscribeToRealtimeChanges } from '@/services/realtimeService';
import { StoolEntry, SymptomEntry, MoodEntry } from '@/types/database.types';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Index = () => {
  const { user } = useAuth();
  const [stoolEntries, setStoolEntries] = useState<StoolEntry[]>([]);
  const [symptomEntries, setSymptomEntries] = useState<SymptomEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [showSymptomsSummary, setShowSymptomsSummary] = useState(true);
  const { moodData, handleSetMoodLevel, handleSetStressLevel, handleSetSleepQuality, resetMoodData } = useMoodEntryData();
  const { symptomData } = useSymptomEntryData();
  const [suggestionType, setSuggestionType] = useState<'hydration' | 'nutrition' | 'stress' | 'sleep'>('hydration');
  
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
  
  useEffect(() => {
    // Sélectionner un type de suggestion aléatoire chaque jour
    const suggestionTypes: Array<'hydration' | 'nutrition' | 'stress' | 'sleep'> = [
      'hydration', 'nutrition', 'stress', 'sleep'
    ];
    const today = new Date().getDate();
    setSuggestionType(suggestionTypes[today % suggestionTypes.length]);
    
    const unsubscribeStool = subscribeToRealtimeChanges({
      table: 'stool_entries',
      event: '*',
      callback: (payload) => {
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
      }
    });
    
    const unsubscribeSymptom = subscribeToRealtimeChanges({
      table: 'symptom_entries',
      event: '*',
      callback: (payload) => {
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
      }
    });
    
    const unsubscribeMood = subscribeToRealtimeChanges({
      table: 'mood_entries',
      event: '*',
      callback: (payload) => {
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
      }
    });
    
    return () => {
      unsubscribeStool();
      unsubscribeSymptom();
      unsubscribeMood();
    };
  }, []);
  
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
  
  const handleSaveMood = async () => {
    try {
      const result = await createMoodEntry({
        mood_level: moodData.moodLevel,
        stress_level: moodData.stressLevel,
        sleep_quality: moodData.sleepQuality,
        notes: null, // Ajout de la propriété manquante 'notes'
        occurred_at: new Date().toISOString()
      });
      
      if (result) {
        toast.success("Humeur enregistrée avec succès");
        setShowMoodForm(false);
        resetMoodData();
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'humeur:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  // Extraire les symptômes pour la vue sommaire
  const getRecentSymptoms = () => {
    if (symptomEntries.length === 0) return [];
    
    // Calculer la date d'il y a 24h
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    // Filtrer les entrées des dernières 24h
    return symptomEntries
      .filter(entry => new Date(entry.occurred_at) >= oneDayAgo)
      .slice(0, 5)
      .map(entry => ({
        id: entry.symptom_type_id,
        name: entry.symptom_type_id.toString(), // Idéalement, on récupérerait le nom depuis symptom_types
        intensity: entry.intensity
      }));
  };
  
  const dailyStreak = 7;
  const badgesCount = 3;
  const totalEntries = stoolEntries.length + symptomEntries.length + moodEntries.length;
  const lastEntry = getLastEntry();
  
  const liquidStools = stoolEntries.filter(entry => 
    entry.bristol_type >= 6 && 
    new Date(entry.occurred_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;
  
  const showAlert = liquidStools >= 3;
  
  return (
    <div className="space-y-6 pt-2 pb-20 animate-fade-in">
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
          <DailyStatusCard lastEntry={lastEntry} />

          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Comment vous sentez-vous aujourd'hui ?</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowMoodForm(!showMoodForm)} 
                className="text-intestitrack-blue"
              >
                {showMoodForm ? "Masquer" : "Modifier"}
              </Button>
            </div>
            
            {showMoodForm ? (
              <div className="space-y-4">
                <MoodSelector
                  moodLevel={moodData.moodLevel}
                  stressLevel={moodData.stressLevel}
                  sleepQuality={moodData.sleepQuality}
                  onMoodChange={handleSetMoodLevel}
                  onStressChange={handleSetStressLevel}
                  onSleepChange={handleSetSleepQuality}
                />
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowMoodForm(false);
                      resetMoodData();
                    }}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleSaveMood}
                    className="bg-intestitrack-blue hover:bg-intestitrack-blue/90"
                  >
                    Enregistrer
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="bg-intestitrack-blue-light border-none mb-4">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dernière humeur :</p>
                    <p className="text-sm">
                      {moodEntries.length > 0 
                        ? `Niveau ${moodEntries[0].mood_level}/5 - ${format(new Date(moodEntries[0].occurred_at), 'HH:mm', { locale: fr })}`
                        : "Pas encore d'enregistrement aujourd'hui"}
                    </p>
                  </div>
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowMoodForm(true)}
                  >
                    Mettre à jour
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Symptômes récents</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowSymptomsSummary(!showSymptomsSummary)} 
                className="text-intestitrack-blue"
              >
                {showSymptomsSummary ? "Masquer" : "Afficher"}
              </Button>
            </div>
            
            {showSymptomsSummary && <SymptomSummary symptoms={getRecentSymptoms()} />}
          </section>

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
          
          <HealthSuggestion 
            type={suggestionType} 
            bristolType={lastEntry.type}
          />

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

          <Card className="bg-intestitrack-green-light border-none">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="bg-white rounded-full p-2 mr-3">
                  <AlertTriangle className="h-5 w-5 text-intestitrack-alert" />
                </div>
                <div>
                  <h3 className="font-medium text-base">Rappel important</h3>
                  <p className="text-sm text-muted-foreground">
                    L'intelligence artificielle ne peut pas se substituer à l'avis d'un médecin. 
                    Consultez un professionnel de santé pour tout problème médical.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
