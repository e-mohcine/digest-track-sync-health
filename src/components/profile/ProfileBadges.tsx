
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Medal } from 'lucide-react';

interface ProfileBadgesProps {
  loading: boolean;
  userBadges: any[];
}

export const ProfileBadges = ({ loading, userBadges }: ProfileBadgesProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  
  if (userBadges.length === 0) {
    return (
      <div className="text-center py-8">
        <Medal className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Vous n'avez pas encore obtenu de badges.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Continuez à utiliser l'application pour débloquer des badges.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {userBadges.map((badge) => (
        <div key={badge.id} className="bg-intestitrack-blue-light rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200">
          <div className="text-4xl mb-2">{badge.badge.icon}</div>
          <h3 className="font-semibold">{badge.badge.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{badge.badge.description}</p>
          <Badge className="mt-2 bg-intestitrack-blue">Obtenu</Badge>
        </div>
      ))}
    </div>
  );
};
