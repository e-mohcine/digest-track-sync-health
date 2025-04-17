
import React from 'react';
import { ChatBot } from '@/components/chat/ChatBot';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Chat = () => {
  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <section className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Link to="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Assistant IntestiTrack</h1>
        </div>
        <Button variant="outline" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          À propos de l'assistant
        </Button>
      </section>
      
      <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4 mb-4">
        <p>Cet assistant est conçu pour répondre à vos questions sur la santé digestive. 
        Il n'est pas destiné à remplacer un avis médical professionnel. Pour toute urgence 
        ou préoccupation sérieuse, consultez votre médecin.</p>
      </div>
      
      <Card className="bg-background h-[75vh]">
        <ChatBot expanded={true} />
      </Card>
    </div>
  );
};

export default Chat;
