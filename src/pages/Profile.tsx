
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { User, CalendarClock, Weight, Pill, Stethoscope, HeartPulse } from 'lucide-react';

const Profile = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    age: '32',
    weight: '68',
    height: '172',
    moodToday: 'Bien',
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const savePersonalInfo = () => {
    // Ici nous sauvegarderons les données dans Supabase et les cookies une fois l'intégration faite
    toast.success('Informations personnelles sauvegardées');
  };

  return (
    <div className="container max-w-5xl mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-semibold mb-6">Mon Profil</h1>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={personalInfo.name} 
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
                    onChange={handlePersonalInfoChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Âge</Label>
                  <Input 
                    id="age" 
                    name="age" 
                    type="number" 
                    value={personalInfo.age} 
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
              </div>

              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="moodToday">Comment vous sentez-vous aujourd'hui?</Label>
                <Input 
                  id="moodToday" 
                  name="moodToday" 
                  value={personalInfo.moodToday} 
                  onChange={handlePersonalInfoChange} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePersonalInfo}>Sauvegarder les modifications</Button>
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
                  Cette fonctionnalité sera disponible après l'intégration avec Supabase.
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
                  Cette fonctionnalité sera disponible après l'intégration avec Supabase.
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
                  Cette fonctionnalité sera disponible après l'intégration avec Supabase.
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
                  Cette fonctionnalité sera disponible après l'intégration avec Supabase.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vous pourrez enregistrer votre humeur quotidienne et l'associer à vos entrées intestinales.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
