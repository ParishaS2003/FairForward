import React from 'react';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';

const Chat = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="sgc-container">
          <div className="text-center mb-8">
            <h1 className="sgc-heading-2 mb-4">Legal Assistant</h1>
            <p className="text-sgc-neutral max-w-2xl mx-auto">
              Get instant answers to your legal questions and access resources for gender equality and reduced inequalities.
              Our AI assistant is trained on Canadian laws and regulations to provide accurate guidance.
            </p>
          </div>
          <ChatInterface />
        </div>
      </main>
    </div>
  );
};

export default Chat; 