
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

const FAQ = () => {
  const faqItems = [
    {
      question: "Qu'est-ce qu'IntestiTrack?",
      answer: "IntestiTrack est une application qui vous permet de suivre vos selles et vos symptômes intestinaux pour mieux comprendre votre santé digestive. Elle est particulièrement utile pour les personnes souffrant de maladies inflammatoires chroniques de l'intestin (MICI) comme la maladie de Crohn ou la rectocolite hémorragique."
    },
    {
      question: "Comment fonctionne l'échelle de Bristol?",
      answer: "L'échelle de Bristol est un outil médical de référence qui classe les selles en 7 types différents selon leur consistance. Le type 1 correspond à des selles très dures et difficiles à évacuer, tandis que le type 7 correspond à des selles entièrement liquides sans parties solides."
    },
    {
      question: "Comment sont stockées mes données?",
      answer: "Vos données sont stockées de manière sécurisée dans une base de données Supabase et localement dans les cookies de votre navigateur comme solution de secours. Toutes les informations sont cryptées et nous respectons strictement le RGPD."
    },
    {
      question: "Puis-je exporter mes données?",
      answer: "Oui, vous pouvez exporter vos données dans différents formats (PDF, CSV) pour les partager avec votre médecin ou les conserver pour vous-même."
    },
    {
      question: "Comment IntestiTrack protège-t-il ma vie privée?",
      answer: "IntestiTrack prend très au sérieux la protection de vos données. Nous n'utilisons pas vos données à des fins commerciales et nous ne les partageons jamais avec des tiers sans votre consentement explicite. Consultez notre page RGPD pour plus d'informations."
    },
    {
      question: "IntestiTrack remplace-t-il une consultation médicale?",
      answer: "Non, IntestiTrack est un outil de suivi et ne remplace en aucun cas une consultation médicale. Les informations et suggestions fournies sont à titre indicatif et doivent toujours être validées par un professionnel de santé."
    },
    {
      question: "Comment contacter le support?",
      answer: "Vous pouvez contacter notre équipe de support à support@intestitrack.com ou via le formulaire de contact sur notre site web."
    }
  ];

  return (
    <div className="container max-w-3xl mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-semibold mb-6">Foire Aux Questions</h1>
      
      <Card className="p-6">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};

export default FAQ;
