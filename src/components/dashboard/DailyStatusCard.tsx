
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SmileIcon, MehIcon, FrownIcon } from 'lucide-react';
import { BristolType } from '@/components/stool/BristolType';

interface DailyStatusCardProps {
  lastEntry: {
    type: number;
    time: string;
    quantity: string;
  };
}

const DailyStatusCard: React.FC<DailyStatusCardProps> = ({ lastEntry }) => {
  // Logic to determine mood icon based on recent entries
  const getMoodIcon = () => {
    // This would be based on multiple factors in a real app
    if (lastEntry.type >= 3 && lastEntry.type <= 5) {
      return <SmileIcon className="h-8 w-8 text-intestitrack-green" />;
    } else if (lastEntry.type === 2 || lastEntry.type === 6) {
      return <MehIcon className="h-8 w-8 text-intestitrack-alert" />;
    } else {
      return <FrownIcon className="h-8 w-8 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (lastEntry.type >= 3 && lastEntry.type <= 5) {
      return "Tout va bien aujourd'hui !";
    } else if (lastEntry.type === 2 || lastEntry.type === 6) {
      return "Surveillance recommandée";
    } else {
      return "Consultez votre médecin";
    }
  };

  return (
    <Card className="bg-gradient-to-r from-intestitrack-blue-light to-intestitrack-green-light border-none overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Comment ça va aujourd'hui ?</h2>
            <p className="text-sm">{getStatusText()}</p>
            <div className="flex mt-2 space-x-2">
              <span className="bg-white bg-opacity-50 px-2 py-1 rounded-md text-xs">
                Dernière: Type {lastEntry.type}
              </span>
              <span className="bg-white bg-opacity-50 px-2 py-1 rounded-md text-xs">
                Il y a {lastEntry.time}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            {getMoodIcon()}
            <span className="text-xs mt-1">Status</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyStatusCard;
