
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, User } from 'lucide-react';

interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
}

export const ProfileAvatar = ({ firstName, lastName }: ProfileAvatarProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const getInitials = () => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };
  
  // Cette fonction serait implémentée pour gérer le téléchargement d'avatar
  const handleAvatarUpload = () => {
    // Fonctionnalité à implémenter ultérieurement
    console.log('Téléchargement d\'avatar à implémenter');
  };
  
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-intestitrack-blue">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="Photo de profil" />
          ) : (
            <AvatarFallback className="bg-intestitrack-blue-light text-intestitrack-blue text-xl">
              {getInitials() || <User className="h-12 w-12" />}
            </AvatarFallback>
          )}
        </Avatar>
        <Button 
          size="icon" 
          variant="outline" 
          className="absolute bottom-0 right-0 rounded-full" 
          onClick={handleAvatarUpload}
          title="Changer votre photo de profil"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
      <h2 className="mt-4 font-semibold text-xl">
        {firstName} {lastName}
      </h2>
    </div>
  );
};
