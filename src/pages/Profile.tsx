
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { User, CalendarClock, Weight, Pill, Stethoscope, HeartPulse, Medal } from 'lucide-react';
import { fetchUserProfile, updateUserProfile, fetchUserBadges } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge as UiBadge } from '@/components/ui/badge';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const savePersonalInfo = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        first_name: personalInfo.first_name,
        last_name: personalInfo.last_name,
        birth_date: personalInfo.birth_date ? new Date(personalInfo.birth_date).toISOString() : null,
        height: personalInfo.height ? parseFloat(personalInfo.height) : null,
        weight: personalInfo.weight ? parseFloat(personalInfo.weight) : null,
        diagnosis_type: personalInfo.diagnosis_type || null,
        diagnosis_date: personalInfo.diagnosis_date ? new Date(personalInfo.diagnosis_date).toISOString() : null
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-semibold mb-6">Mon Profil</h1>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Personnel</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            <span className="hidden md:inline">Rendez-vous</span>
          </TabsTrigger>
          <TabsTrigger value="weights" className="flex items-center gap-2">
            <Weight className="h-4 w-4" />
            <span className="hidden md:inline">Poids</span>
          </TabsTrigger>
          <TabsTrigger value="treatments" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="hidden md:inline">Traitements</span>
          </TabsTrigger>
          <TabsTrigger value="moods" className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4" />
            <span className="hidden md:inline">Humeurs</span>
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
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input 
                        id="first_name" 
                        name="first_name" 
                        value={personalInfo.first_name} 
                        onChange={handlePersonalInfoChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom</Label>
                      <Input 
                        id="last_name" 
                        name="last_name" 
                        value={personalInfo.last_name} 
                        onChange={handlePersonalInfoChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={personalInfo.email} 
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birth_date">Date de naissance</Label>
                      <Input 
                        id="birth_date" 
                        name="birth_date" 
                        type="date" 
                        value={personalInfo.birth_date} 
                        onChange={handlePersonalInfoChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="height">Taille (cm)</Label>
                      <Input 
                        id="height" 
                        name="height" 
                        type="number" 
                        value={personalInfo.height} 
                        onChange={handlePersonalInfoChange} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight">Poids (kg)</Label>
                      <Input 
                        id="weight" 
                        name="weight" 
                        type="number" 
                        value={personalInfo.weight} 
                        onChange={handlePersonalInfoChange} 
                      />
                    </div>
                  </div>

                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis_type">Type de diagnostic</Label>
                      <Input 
                        id="diagnosis_type" 
                        name="diagnosis_type" 
                        value={personalInfo.diagnosis_type} 
                        onChange={handlePersonalInfoChange}
                        placeholder="Ex: Maladie de Crohn, RCH, SII..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis_date">Date de diagnostic</Label>
                      <Input 
                        id="diagnosis_date" 
                        name="diagnosis_date" 
                        type="date" 
                        value={personalInfo.diagnosis_date} 
                        onChange={handlePersonalInfoChange} 
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={savePersonalInfo} disabled={loading || saving}>
                {saving ? 'Sauvegarde en cours...' : 'Sauvegarder les modifications'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Mes Rendez-vous médicaux</CardTitle>
              <CardDescription>
                Suivez vos rendez-vous médicaux importants.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Cette fonctionnalité sera bientôt disponible.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vous pourrez ajouter, modifier et supprimer vos rendez-vous médicaux.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weights">
          <Card>
            <CardHeader>
              <CardTitle>Suivi de poids</CardTitle>
              <CardDescription>
                Suivez l'évolution de votre poids dans le temps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Weight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Cette fonctionnalité sera bientôt disponible.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vous pourrez enregistrer votre poids et visualiser son évolution sur un graphique.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="treatments">
          <Card>
            <CardHeader>
              <CardTitle>Mes Traitements</CardTitle>
              <CardDescription>
                Gérez vos traitements médicaux actuels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Cette fonctionnalité sera bientôt disponible.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vous pourrez ajouter vos traitements avec les posologies et recevoir des rappels.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="moods">
          <Card>
            <CardHeader>
              <CardTitle>Journal d'humeur</CardTitle>
              <CardDescription>
                Suivez votre humeur et identifiez des tendances.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <HeartPulse className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Cette fonctionnalité sera bientôt disponible.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vous pourrez enregistrer votre humeur quotidienne et l'associer à vos entrées intestinales.
                </p>
              </div>
            </CardContent>
          </Card>
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
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-40 w-full rounded-lg" />
                  ))}
                </div>
              ) : userBadges.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {userBadges.map((badge) => (
                    <div key={badge.id} className="bg-intestitrack-blue-light rounded-lg p-4 flex flex-col items-center text-center">
                      <div className="text-4xl mb-2">{badge.badge.icon}</div>
                      <h3 className="font-semibold">{badge.badge.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{badge.badge.description}</p>
                      <UiBadge className="mt-2 bg-intestitrack-blue">Obtenu</UiBadge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Medal className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Vous n'avez pas encore obtenu de badges.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Continuez à utiliser l'application pour débloquer des badges.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
