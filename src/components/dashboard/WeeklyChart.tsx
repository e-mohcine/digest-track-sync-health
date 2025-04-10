
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklyChart = () => {
  // Placeholder data
  const data = [
    { day: 'Lun', type1: 0, type2: 0, type3: 1, type4: 2, type5: 0, type6: 0, type7: 0 },
    { day: 'Mar', type1: 0, type2: 0, type3: 0, type4: 1, type5: 1, type6: 0, type7: 0 },
    { day: 'Mer', type1: 0, type2: 1, type3: 1, type4: 0, type5: 0, type6: 0, type7: 0 },
    { day: 'Jeu', type1: 0, type2: 0, type3: 0, type4: 2, type5: 0, type6: 0, type7: 0 },
    { day: 'Ven', type1: 0, type2: 0, type3: 1, type4: 1, type5: 0, type6: 0, type7: 0 },
    { day: 'Sam', type1: 0, type2: 0, type3: 0, type4: 0, type5: 0, type6: 2, type7: 1 },
    { day: 'Dim', type1: 0, type2: 0, type3: 0, type4: 1, type5: 2, type6: 0, type7: 0 },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          barSize={20}
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => {
              const typeNumber = name.toString().substring(4);
              return [`Type ${typeNumber}: ${value}`, 'Selles'];
            }}
          />
          <Bar dataKey="type1" stackId="a" fill="#8B4513" />
          <Bar dataKey="type2" stackId="a" fill="#A0522D" />
          <Bar dataKey="type3" stackId="a" fill="#B87333" />
          <Bar dataKey="type4" stackId="a" fill="#CD853F" />
          <Bar dataKey="type5" stackId="a" fill="#DAA520" />
          <Bar dataKey="type6" stackId="a" fill="#E6C27F" />
          <Bar dataKey="type7" stackId="a" fill="#F5DEB3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
