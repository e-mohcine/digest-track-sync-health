
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ComingSoonCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const ComingSoonCard = ({ icon: Icon, title, description }: ComingSoonCardProps) => {
  return (
    <div className="text-center py-8">
      <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground">
        {title}
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        {description}
      </p>
    </div>
  );
};
