
import React from 'react';
import { ChatBot } from '@/components/chat/ChatBot';

const Chat = () => {
  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <section>
        <h1 className="text-2xl font-semibold mb-6">Assistant IntestiTrack</h1>
        <ChatBot />
      </section>
    </div>
  );
};

export default Chat;
