
import React from 'react';
import { Calendar, TrendingUp, AlertTriangle, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DailyStatusCard from '@/components/dashboard/DailyStatusCard';
import WeeklyChart from '@/components/dashboard/WeeklyChart';
import RecentEntriesList from '@/components/dashboard/RecentEntriesList';
import RecommendationCard from '@/components/dashboard/RecommendationCard';

const Index = () => {
  // Placeholder data
  const dailyStreak = 7;
  const badgesCount = 12;
  const totalEntries = 145;
  const lastEntry = { type: 4, time: "2h", quantity: "normal" };
  
  return (
    <div className="space-y-6 pt-2 animate-fade-in">
      {/* Welcome section */}
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Bonjour, Sophie</h1>
          <p className="text-muted-foreground">Mercredi 10 Avril, 2025</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="bg-intestitrack-green-light text-intestitrack-green px-3 py-1 rounded-full text-sm font-medium">
            <span>{dailyStreak} jours de suivi</span>
          </div>
        </div>
      </section>

      {/* Daily status card */}
      <DailyStatusCard lastEntry={lastEntry} />

      {/* Quick stats */}
      <section className="grid grid-cols-3 gap-3">
        <Card className="bg-intestitrack-blue-light border-none">
          <CardContent className="p-3 flex flex-col items-center">
            <Droplets className="h-6 w-6 text-intestitrack-blue mb-1" />
            <p className="text-xs text-center">Dernière selle</p>
            <p className="font-semibold text-sm">Il y a 2h</p>
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

      {/* Weekly chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-intestitrack-blue" />
            Activité de la semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyChart />
        </CardContent>
      </Card>

      {/* Medical alerts */}
      <section>
        <Card className="bg-intestitrack-alert-light border-intestitrack-alert">
          <CardContent className="p-4">
            <div className="flex items-start">
              <AlertTriangle className="text-intestitrack-alert h-6 w-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-base">Possible poussée détectée</h3>
                <p className="text-sm mb-2">5 selles liquides en 24h, consultez votre médecin.</p>
                <Button size="sm" variant="outline" className="border-intestitrack-alert text-intestitrack-alert hover:bg-intestitrack-alert hover:text-white">
                  Contacter mon médecin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recommendations */}
      <RecommendationCard 
        title="Restez hydraté" 
        description="Votre fréquence de selles a augmenté, pensez à boire plus d'eau pour éviter la déshydratation."
        icon={<Droplets className="h-5 w-5" />}
      />

      {/* Recent entries */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Entrées récentes</h2>
          <Button variant="link" className="text-intestitrack-blue p-0">Voir tout</Button>
        </div>
        <RecentEntriesList />
      </section>
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
