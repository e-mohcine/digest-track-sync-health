import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Calendar, ChevronDown, Download, Share2, Utensils, Heart, Brain, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportShare } from '@/components/reports/ReportShare';
import { FoodAnalyzer } from '@/components/food/FoodAnalyzer';
import { supabase } from '@/integrations/supabase/client';
import { fetchMoodEntries } from '@/services/moodService';

const mockFrequencyData = [
  { day: 'Lun', count: 2 },
  { day: 'Mar', count: 2 },
  { day: 'Mer', count: 1 },
  { day: 'Jeu', count: 3 },
  { day: 'Ven', count: 2 },
  { day: 'Sam', count: 2 },
  { day: 'Dim', count: 3 },
];

const mockTypeDistribution = [
  { name: 'Type 1', value: 5 },
  { name: 'Type 2', value: 8 },
  { name: 'Type 3', value: 12 },
  { name: 'Type 4', value: 25 },
  { name: 'Type 5', value: 18 },
  { name: 'Type 6', value: 10 },
  { name: 'Type 7', value: 7 },
];

const typeColors = [
  '#8B4513', // Type 1
  '#A0522D', // Type 2
  '#B87333', // Type 3
  '#CD853F', // Type 4
  '#DAA520', // Type 5
  '#E6C27F', // Type 6
  '#F5DEB3', // Type 7
];

const mockTimeOfDayData = [
  { name: 'Matin', count: 25 },
  { name: 'Midi', count: 15 },
  { name: 'Après-midi', count: 10 },
  { name: 'Soir', count: 20 },
  { name: 'Nuit', count: 5 },
];

const mockTrendData = [
  { day: 'Lun', type: 4 },
  { day: 'Mar', type: 4 },
  { day: 'Mer', type: 3 },
  { day: 'Jeu', type: 5 },
  { day: 'Ven', type: 6 },
  { day: 'Sam', type: 6 },
  { day: 'Dim', type: 5 },
];

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, trend, icon }) => {
  const trendColor = trend === 'up' ? 'text-intestitrack-green' : 
                    trend === 'down' ? 'text-destructive' : 'text-muted-foreground';
  
  const trendIcon = trend === 'up' ? '↑' : 
                  trend === 'down' ? '↓' : '→';
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">{title}</p>
          <div className="flex items-end">
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend && (
              <span className={`ml-2 ${trendColor} text-sm`}>
                {trendIcon}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Stats = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const [moodData, setMoodData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMoodData = async () => {
      setIsLoading(true);
      try {
        const entries = await fetchMoodEntries();
        
        const formattedEntries = entries.map(entry => ({
          date: new Date(entry.occurred_at).toLocaleDateString('fr-FR'),
          mood: entry.mood_level,
          stress: entry.stress_level || 0,
          sleep: entry.sleep_quality || 0,
          timestamp: new Date(entry.occurred_at).getTime()
        }));
        
        formattedEntries.sort((a, b) => a.timestamp - b.timestamp);
        
        setMoodData(formattedEntries);
      } catch (error) {
        console.error("Erreur lors du chargement des données d'humeur:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMoodData();
  }, []);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <section className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Statistiques & Analyses</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{timeRange === 'week' ? 'Cette semaine' : timeRange === 'month' ? 'Ce mois' : 'Cette année'}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setTimeRange('week')}>
                Cette semaine
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('month')}>
                Ce mois
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('year')}>
                Cette année
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={() => setShowShareDialog(true)}>
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="stats">
            <BarChart className="w-4 h-4 mr-2" />
            Selles
          </TabsTrigger>
          <TabsTrigger value="mood">
            <Heart className="w-4 h-4 mr-2" />
            Humeur & Bien-être
          </TabsTrigger>
          <TabsTrigger value="nutrition">
            <Utensils className="w-4 h-4 mr-2" />
            Nutrition
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatsCard 
              title="Fréquence moyenne" 
              value="2.1" 
              description="selles par jour" 
              trend="up"
            />
            <StatsCard 
              title="Type le plus fréquent" 
              value="Type 4" 
              description="saucisse molle" 
              trend="stable"
            />
            <StatsCard 
              title="Consistance" 
              value="85%" 
              description="dans la normale (types 3-5)" 
              trend="up"
            />
            <StatsCard 
              title="Heure habituelle" 
              value="Matin" 
              description="entre 7h et 10h" 
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Fréquence par jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockFrequencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4A9DD6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Distribution des types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={typeColors[index % typeColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Évolution du type (dernière semaine)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="day" />
                    <YAxis domain={[1, 7]} ticks={[1, 2, 3, 4, 5, 6, 7]} />
                    <Tooltip 
                      formatter={(value) => [`Type ${value}`, 'Type']}
                      labelFormatter={(label) => `Jour: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="type" 
                      stroke="#4A9DD6" 
                      strokeWidth={2}
                      dot={{ r: 6, stroke: '#4A9DD6', fill: 'white', strokeWidth: 2 }}
                      activeDot={{ r: 8, stroke: '#4A9DD6', strokeWidth: 2, fill: '#4A9DD6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatsCard 
              title="Humeur moyenne" 
              value="3.7/5" 
              description="derniers 7 jours" 
              trend="up"
              icon={<Heart className="h-4 w-4 text-red-500" />}
            />
            <StatsCard 
              title="Niveau de stress" 
              value="2.5/5" 
              description="en baisse" 
              trend="down"
              icon={<Brain className="h-4 w-4 text-purple-500" />}
            />
            <StatsCard 
              title="Qualité du sommeil" 
              value="3.2/5" 
              description="stable" 
              trend="stable"
              icon={<Moon className="h-4 w-4 text-blue-500" />}
            />
            <StatsCard 
              title="Corrélation humeur-symptômes" 
              value="Modérée" 
              description="impact observé" 
              icon={<Share2 className="h-4 w-4 text-green-500" />}
            />
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Évolution de l'humeur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={moodData.length > 0 ? moodData : [
                    { date: '01/04', mood: 3, stress: 4, sleep: 2 },
                    { date: '02/04', mood: 2, stress: 5, sleep: 2 },
                    { date: '03/04', mood: 3, stress: 3, sleep: 3 },
                    { date: '04/04', mood: 4, stress: 2, sleep: 4 },
                    { date: '05/04', mood: 5, stress: 1, sleep: 4 },
                    { date: '06/04', mood: 4, stress: 2, sleep: 3 },
                    { date: '07/04', mood: 3, stress: 3, sleep: 3 },
                  ]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="mood" name="Humeur" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="stress" name="Stress" stroke="#ff7300" fill="#ff7300" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="sleep" name="Sommeil" stroke="#2C82C9" fill="#2C82C9" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Corrélation Humeur-Symptômes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { name: 'J-3', humeur: 2, symptomes: 4 },
                      { name: 'J-2', humeur: 3, symptomes: 3 },
                      { name: 'J-1', humeur: 3, symptomes: 2 },
                      { name: 'J', humeur: 4, symptomes: 1 },
                      { name: 'J+1', humeur: 4, symptomes: 1 },
                      { name: 'J+2', humeur: 5, symptomes: 0 },
                      { name: 'J+3', humeur: 4, symptomes: 1 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="humeur" name="Niveau d'humeur" fill="#8884d8" />
                    <Bar dataKey="symptomes" name="Intensité des symptômes" fill="#FF9F43" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition">
          <FoodAnalyzer />
        </TabsContent>
      </Tabs>

      <ReportShare 
        onOpenChange={setShowShareDialog} 
        timeRange={timeRange as 'week' | 'month' | 'year'} 
      />
    </div>
  );
};

export default Stats;
