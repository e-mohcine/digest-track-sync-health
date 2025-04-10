
import React from 'react';
import { Award, Gift, ArrowUp, Check, Lock, TrendingUp, Calendar, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface BadgeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  date?: string;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  unlocked, 
  date 
}) => {
  return (
    <Card className={`relative overflow-hidden transition-all ${
      unlocked ? 'border-2 shadow-md' : 'opacity-70'
    }`} style={{ borderColor: unlocked ? color : '' }}>
      <CardContent className="p-4 flex items-center">
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center mr-4"
          style={{ backgroundColor: `${color}30`, color: color }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium">{title}</h3>
            {unlocked ? (
              <Check className="h-5 w-5 text-intestitrack-green" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-1">{description}</p>
          {unlocked && date && (
            <Badge variant="outline" className="text-xs">
              Débloqué le {date}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ChallengeCardProps {
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  color: string;
  target: number;
  current: number;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  title, 
  description, 
  progress, 
  icon, 
  color, 
  target, 
  current 
}) => {
  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: `${color}30`, color: color }}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span className="font-medium">{current}/{target}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

const Rewards = () => {
  // Placeholder badge data
  const badges = [
    {
      title: "Premier pas",
      description: "Enregistrez votre première selle",
      icon: <Award className="h-6 w-6" />,
      color: "#4A9DD6",
      unlocked: true,
      date: "01/04/2025"
    },
    {
      title: "Semaine parfaite",
      description: "Enregistrez vos selles tous les jours pendant une semaine",
      icon: <Calendar className="h-6 w-6" />,
      color: "#5BBE88",
      unlocked: true,
      date: "08/04/2025"
    },
    {
      title: "Niveau Bristol",
      description: "Utilisez tous les types de l'échelle de Bristol",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "#F59E6A",
      unlocked: true,
      date: "05/04/2025"
    },
    {
      title: "Régularité",
      description: "Maintenez une fréquence régulière pendant 2 semaines",
      icon: <Droplets className="h-6 w-6" />,
      color: "#6E7CF9",
      unlocked: false
    },
    {
      title: "Maître analyste",
      description: "Consultez toutes les sections des statistiques",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "#A881AF",
      unlocked: false
    },
    {
      title: "Observateur médical",
      description: "Ajoutez 10 notes détaillées à vos entrées",
      icon: <Award className="h-6 w-6" />,
      color: "#ECA86A",
      unlocked: false
    },
  ];

  // Placeholder challenge data
  const challenges = [
    {
      title: "Routine matinale",
      description: "Enregistrez une selle matinale 5 jours de suite",
      progress: 60,
      icon: <Calendar className="h-5 w-5" />,
      color: "#4A9DD6",
      target: 5,
      current: 3
    },
    {
      title: "Hydratation champion",
      description: "Notez votre niveau d'hydratation pendant 7 jours",
      progress: 28,
      icon: <Droplets className="h-5 w-5" />,
      color: "#5BBE88",
      target: 7,
      current: 2
    },
    {
      title: "Suivi complet",
      description: "Suivez tous les paramètres (type, quantité, heure) pendant 10 jours",
      progress: 0,
      icon: <Check className="h-5 w-5" />,
      color: "#F59E6A",
      target: 10,
      current: 0
    },
  ];

  // Stats for level progress
  const currentLevel = 3;
  const currentLevelProgress = 65;
  const pointsToNextLevel = 150;
  const currentPoints = 350;

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <section className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Récompenses</h1>
      </section>

      <Card className="bg-gradient-to-r from-intestitrack-blue to-intestitrack-green overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white text-lg font-semibold">Niveau {currentLevel}</h2>
              <p className="text-white/80 text-sm">Suivi expert</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Award className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-white/90 text-sm">
              <span>Progression</span>
              <span>{currentPoints} points</span>
            </div>
            <div className="bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full" 
                style={{ width: `${currentLevelProgress}%` }}
              ></div>
            </div>
            <p className="text-white/80 text-xs">
              {pointsToNextLevel} points jusqu'au niveau {currentLevel + 1}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="badges">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="challenges">Défis</TabsTrigger>
        </TabsList>

        <TabsContent value="badges">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <BadgeCard 
                key={index}
                title={badge.title}
                description={badge.description}
                icon={badge.icon}
                color={badge.color}
                unlocked={badge.unlocked}
                date={badge.date}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-3">Défis actifs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.map((challenge, index) => (
                  <ChallengeCard 
                    key={index}
                    title={challenge.title}
                    description={challenge.description}
                    progress={challenge.progress}
                    icon={challenge.icon}
                    color={challenge.color}
                    target={challenge.target}
                    current={challenge.current}
                  />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-3">Récompenses disponibles</h2>
              <Card className="bg-intestitrack-beige/50">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="bg-intestitrack-beige-dark rounded-full p-3 mr-4">
                      <Gift className="h-6 w-6 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">Exportation avancée des données</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Débloquez l'option pour exporter vos données détaillées au format PDF pour votre médecin.
                      </p>
                      <Button variant="outline" className="text-amber-700 border-amber-700">
                        Débloquer avec 500 points
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rewards;
