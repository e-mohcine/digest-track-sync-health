
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface RecommendationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ title, description, icon }) => {
  return (
    <Card className="border-intestitrack-blue-light bg-gradient-to-r from-white to-intestitrack-blue-light/30 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="bg-intestitrack-blue-light rounded-full p-2 mr-3">
            {React.cloneElement(icon as React.ReactElement, { className: 'text-intestitrack-blue' })}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-intestitrack-blue">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-intestitrack-blue" />
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
