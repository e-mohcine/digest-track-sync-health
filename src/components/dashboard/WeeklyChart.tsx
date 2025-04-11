
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { subDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StoolEntry } from '@/types/database.types';

interface WeeklyChartProps {
  stoolEntries: StoolEntry[];
}

interface ChartData {
  day: string;
  name: string;
  count: number;
  bristolAvg: number;
  bristolType1: number;
  bristolType2: number;
  bristolType3: number;
  bristolType4: number;
  bristolType5: number;
  bristolType6: number;
  bristolType7: number;
  hasBlood: number;
  hasMucus: number;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ stoolEntries }) => {
  // Prépare les données pour le graphique
  const data = useMemo(() => {
    // Génère les 7 derniers jours
    const days: ChartData[] = Array.from({ length: 7 }).map((_, index) => {
      const date = subDays(new Date(), 6 - index);
      return {
        day: format(date, 'E', { locale: fr }),
        name: format(date, 'dd/MM', { locale: fr }),
        count: 0,
        bristolAvg: 0,
        bristolType1: 0,
        bristolType2: 0,
        bristolType3: 0,
        bristolType4: 0,
        bristolType5: 0,
        bristolType6: 0,
        bristolType7: 0,
        hasBlood: 0,
        hasMucus: 0
      };
    });
    
    // Filtre les entrées pour les 7 derniers jours
    const lastWeekEntries = stoolEntries.filter(entry => {
      const entryDate = new Date(entry.occurred_at);
      const sevenDaysAgo = subDays(new Date(), 7);
      return entryDate >= sevenDaysAgo;
    });
    
    // Groupe les entrées par jour
    lastWeekEntries.forEach(entry => {
      const entryDate = new Date(entry.occurred_at);
      const dayIndex = days.findIndex(day => 
        format(entryDate, 'dd/MM') === day.name
      );
      
      if (dayIndex !== -1) {
        days[dayIndex].count++;
        
        // Mise à jour des compteurs par type Bristol
        const bristolType = `bristolType${entry.bristol_type}` as keyof ChartData;
        (days[dayIndex][bristolType] as number)++;
        
        // Calcul de la moyenne Bristol
        const bristolSum = days[dayIndex].bristolType1 * 1 +
                          days[dayIndex].bristolType2 * 2 +
                          days[dayIndex].bristolType3 * 3 +
                          days[dayIndex].bristolType4 * 4 +
                          days[dayIndex].bristolType5 * 5 +
                          days[dayIndex].bristolType6 * 6 +
                          days[dayIndex].bristolType7 * 7;
        
        days[dayIndex].bristolAvg = days[dayIndex].count > 0 
          ? bristolSum / days[dayIndex].count 
          : 0;
        
        // Mise à jour des compteurs pour sang et mucus
        if (entry.has_blood) days[dayIndex].hasBlood++;
        if (entry.has_mucus) days[dayIndex].hasMucus++;
      }
    });
    
    return days;
  }, [stoolEntries]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dayData = data.find(d => d.name === label);
      
      if (!dayData) return null;
      
      return (
        <div className="bg-white p-3 rounded shadow-md border">
          <p className="font-medium">{label}</p>
          <p>Nombre d'entrées: {dayData.count}</p>
          {dayData.count > 0 && (
            <>
              <p>Bristol moyen: {dayData.bristolAvg.toFixed(1)}</p>
              {dayData.hasBlood > 0 && (
                <p className="text-red-500">Sang: {dayData.hasBlood}x</p>
              )}
              {dayData.hasMucus > 0 && (
                <p className="text-amber-500">Mucus: {dayData.hasMucus}x</p>
              )}
            </>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }} 
          />
          <YAxis 
            tickFormatter={(value) => value === 0 ? '0' : value.toString()}
            allowDecimals={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            name="Type 1-2 (dures)" 
            dataKey={(data) => (data.bristolType1 || 0) + (data.bristolType2 || 0)} 
            stackId="a" 
            fill="#8B572A" 
          />
          <Bar 
            name="Type 3-5 (normales)" 
            dataKey={(data) => (data.bristolType3 || 0) + (data.bristolType4 || 0) + (data.bristolType5 || 0)} 
            stackId="a" 
            fill="#4CAF50" 
          />
          <Bar 
            name="Type 6-7 (liquides)" 
            dataKey={(data) => (data.bristolType6 || 0) + (data.bristolType7 || 0)} 
            stackId="a" 
            fill="#2196F3" 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
