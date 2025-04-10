
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const RGPD = () => {
  return (
    <div className="container max-w-4xl mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-semibold mb-6">Politique de Confidentialité et RGPD</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent className="prose">
          <p>
            Chez IntestiTrack, nous prenons la protection de vos données personnelles très au sérieux. 
            Cette politique de confidentialité explique quelles données nous collectons, comment nous les utilisons, 
            et quels sont vos droits conformément au Règlement Général sur la Protection des Données (RGPD).
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Données collectées</CardTitle>
        </CardHeader>
        <CardContent className="prose">
          <p>Nous collectons les types de données suivants :</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Informations personnelles (nom, email, âge)</li>
            <li>Données médicales (type de selles, symptômes, traitements)</li>
            <li>Données de santé (poids, rendez-vous médicaux, humeur)</li>
            <li>Informations techniques (cookies, adresse IP, type de navigateur)</li>
          </ul>
          
          <Separator className="my-4" />
          
          <p className="font-medium">Finalités du traitement</p>
          <p>
            Nous utilisons vos données uniquement pour vous fournir nos services : suivi de votre santé intestinale, 
            suggestions personnalisées, et amélioration de notre application. Aucune donnée n'est vendue à des tiers.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Stockage et sécurité</CardTitle>
        </CardHeader>
        <CardContent className="prose">
          <p>
            Vos données sont stockées sur des serveurs sécurisés gérés par Supabase et localement dans des cookies 
            comme solution de secours. Nous utilisons des protocoles de cryptage modernes pour protéger vos informations.
          </p>
          <p>
            Nous conservons vos données aussi longtemps que votre compte est actif. Vous pouvez demander la suppression 
            de vos données à tout moment.
          </p>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Vos droits RGPD</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-3">
              <h3 className="font-medium mb-1">Droit d'accès</h3>
              <p className="text-sm text-muted-foreground">
                Vous pouvez demander une copie de toutes vos données personnelles que nous détenons.
              </p>
            </div>
            
            <div className="border rounded-md p-3">
              <h3 className="font-medium mb-1">Droit de rectification</h3>
              <p className="text-sm text-muted-foreground">
                Vous pouvez corriger toute information inexacte vous concernant.
              </p>
            </div>
            
            <div className="border rounded-md p-3">
              <h3 className="font-medium mb-1">Droit à l'effacement</h3>
              <p className="text-sm text-muted-foreground">
                Vous pouvez demander la suppression de toutes vos données personnelles.
              </p>
            </div>
            
            <div className="border rounded-md p-3">
              <h3 className="font-medium mb-1">Droit à la limitation</h3>
              <p className="text-sm text-muted-foreground">
                Vous pouvez demander de limiter l'utilisation de vos données.
              </p>
            </div>
            
            <div className="border rounded-md p-3">
              <h3 className="font-medium mb-1">Droit à la portabilité</h3>
              <p className="text-sm text-muted-foreground">
                Vous pouvez demander le transfert de vos données vers un autre service.
              </p>
            </div>
            
            <div className="border rounded-md p-3">
              <h3 className="font-medium mb-1">Droit d'opposition</h3>
              <p className="text-sm text-muted-foreground">
                Vous pouvez vous opposer au traitement de vos données.
              </p>
            </div>
          </div>
          
          <p className="mt-4">
            Pour exercer ces droits, veuillez nous contacter à privacy@intestitrack.com.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Nous utilisons des cookies pour sauvegarder localement vos données comme solution de secours et améliorer 
            votre expérience utilisateur. Vous pouvez configurer votre navigateur pour refuser les cookies, mais 
            certaines fonctionnalités de notre service pourraient ne pas fonctionner correctement.
          </p>
          <p>
            Cette politique de confidentialité a été mise à jour le 10 avril 2025.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RGPD;
