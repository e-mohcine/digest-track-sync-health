
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { User, CalendarClock, Weight, Pill, Stethoscope, HeartPulse, Medal } from 'lucide-react';
import { fetchUserProfile, useProfileUpdates } from '@/services/profileService';
import { fetchUserBadges } from '@/services/badgeService';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm';
import { ProfileBadges } from '@/components/profile/ProfileBadges';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { ComingSoonCard } from '@/components/profile/ComingSoonCard';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [personalInfo, setPersonalInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    birth_date: '',
    height: '',
    weight: '',
    diagnosis_type: '',
    diagnosis_date: ''
  });
  const [userBadges, setUserBadges] = useState<any[]>([]);

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      const profile = await fetchUserProfile();
      const badges = await fetchUserBadges();
      
      if (profile) {
        setPersonalInfo({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: user?.email || '',
          birth_date: profile.birth_date ? new Date(profile.birth_date).toISOString().split('T')[0] : '',
          height: profile.height?.toString() || '',
          weight: profile.weight?.toString() || '',
          diagnosis_type: profile.diagnosis_type || '',
          diagnosis_date: profile.diagnosis_date ? new Date(profile.diagnosis_date).toISOString().split('T')[0] : ''
        });
      }
      
      setUserBadges(badges);
      setLoading(false);
    };
    
    loadProfileData();
  }, [user]);

  // Écouter les mises à jour du profil en temps réel
  useProfileUpdates(user?.id || '', (updatedProfile) => {
    setPersonalInfo(prev => ({
      ...prev,
      first_name: updatedProfile.first_name || '',
      last_name: updatedProfile.last_name || '',
      birth_date: updatedProfile.birth_date ? new Date(updatedProfile.birth_date).toISOString().split('T')[0] : '',
      height: updatedProfile.height?.toString() || '',
      weight: updatedProfile.weight?.toString() || '',
      diagnosis_type: updatedProfile.diagnosis_type || '',
      diagnosis_date: updatedProfile.diagnosis_date ? new Date(updatedProfile.diagnosis_date).toISOString().split('T')[0] : ''
    }));
  });

  return (
    <div className="container max-w-5xl mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-semibold mb-6">Mon Profil</h1>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
      ) : (
        <ProfileAvatar 
          firstName={personalInfo.first_name} 
          lastName={personalInfo.last_name} 
        />
      )}
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Informations</span>
          </TabsTrigger>
          <TabsTrigger value="medical" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden md:inline">Médical</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Medal className="h-4 w-4" />
            <span className="hidden md:inline">Badges</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles. Ces informations seront utilisées pour personnaliser votre expérience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <PersonalInfoForm 
                  loading={loading}
                  personalInfo={personalInfo}
                  setPersonalInfo={setPersonalInfo}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Rendez-vous médicaux</CardTitle>
                <CardDescription>
                  Suivez vos rendez-vous avec vos médecins.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComingSoonCard 
                  icon={CalendarClock}
                  title="Cette fonctionnalité sera bientôt disponible."
                  description="Vous pourrez ajouter, modifier et supprimer vos rendez-vous médicaux."
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Suivi de poids</CardTitle>
                <CardDescription>
                  Suivez l'évolution de votre poids.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComingSoonCard 
                  icon={Weight}
                  title="Cette fonctionnalité sera bientôt disponible."
                  description="Vous pourrez visualiser l'évolution de votre poids sur un graphique."
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Traitements</CardTitle>
                <CardDescription>
                  Gérez vos traitements médicaux.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComingSoonCard 
                  icon={Pill}
                  title="Cette fonctionnalité sera bientôt disponible."
                  description="Vous pourrez ajouter vos traitements et recevoir des rappels."
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Journal d'humeur</CardTitle>
                <CardDescription>
                  Suivez votre humeur quotidienne.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComingSoonCard 
                  icon={HeartPulse}
                  title="Cette fonctionnalité sera bientôt disponible."
                  description="Vous pourrez enregistrer votre humeur et l'associer à vos entrées intestinales."
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Mes Badges</CardTitle>
              <CardDescription>
                Consultez vos accomplissements et débloquez de nouveaux badges.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileBadges loading={loading} userBadges={userBadges} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
