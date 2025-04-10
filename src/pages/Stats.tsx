
import React, { useState } from 'react';
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
} from 'recharts';
import { Calendar, ChevronDown } from 'lucide-react';
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
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, trend }) => {
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

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <section className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Statistiques</h1>
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
      </section>

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

      <Tabs defaultValue="frequency">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="frequency">Fréquence & Types</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="frequency" className="space-y-4">
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
              <CardTitle className="text-lg">Moment de la journée</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockTimeOfDayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#5BBE88" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
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

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Analyses avancées</CardTitle>
                <Select defaultValue="correlation">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="correlation">Corrélations</SelectItem>
                    <SelectItem value="patterns">Habitudes</SelectItem>
                    <SelectItem value="predictions">Prédictions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Corrélation détectée</h3>
                <p className="text-muted-foreground mb-4">
                  Nous avons détecté une corrélation entre vos repas épicés et l'apparition de selles de type 6 dans les 24h.
                </p>
                <Button variant="outline">Voir les détails</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Synthèse mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-intestitrack-green pl-4 py-1">
                  <h4 className="font-medium">Points positifs</h4>
                  <p className="text-sm text-muted-foreground">Régularité améliorée par rapport au mois dernier (+15%)</p>
                </div>
                <div className="border-l-4 border-intestitrack-alert pl-4 py-1">
                  <h4 className="font-medium">Points d'attention</h4>
                  <p className="text-sm text-muted-foreground">Augmentation des selles de type 6 (possiblement lié à l'alimentation)</p>
                </div>
                <div className="border-l-4 border-intestitrack-blue pl-4 py-1">
                  <h4 className="font-medium">Recommandation</h4>
                  <p className="text-sm text-muted-foreground">Surveillez votre consommation d'aliments irritants</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Stats;
