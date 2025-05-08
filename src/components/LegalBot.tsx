import React, { useState, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const API_BASE_URL = 'http://localhost:5001';

type Message = {
  id: number;
  content: string;
  isUser: boolean;
  type?: 'normal' | 'suggestions' | 'error';
};

const LegalBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your AI Legal Assistant. I can help you with questions about Canadian legal rights, workplace issues, discrimination, and more. How can I assist you today?",
      isUser: false,
      type: 'normal'
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);

  // Test API connection on component mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/test`);
        if (response.ok) {
          setIsApiConnected(true);
        } else {
          console.error('API test failed:', await response.text());
          setIsApiConnected(false);
        }
      } catch (error) {
        console.error('API connection error:', error);
        setIsApiConnected(false);
      }
    };

    testApiConnection();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      isUser: true,
      type: 'normal'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    
    try {
      console.log('Sending message to API:', input);
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      console.log('API Response status:', response.status);
      const responseText = await response.text();
      console.log('API Response text:', responseText);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('Parsed API response:', data);
      
      // Add the main response
      const botMessage: Message = {
        id: messages.length + 2,
        content: data.response,
        isUser: false,
        type: 'normal'
      };
      
      setMessages(prev => [...prev, botMessage]);

      // Add topic suggestions if available
      if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        const suggestionsMessage: Message = {
          id: messages.length + 3,
          content: data.suggestions.join('\n'),
          isUser: false,
          type: 'suggestions'
        };
        setMessages(prev => [...prev, suggestionsMessage]);
      }
    } catch (error) {
      console.error('Error in handleSend:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        content: `I apologize, but I'm having trouble connecting to my knowledge base. Error: ${error.message}`,
        isUser: false,
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {!isApiConnected && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Warning: </strong>
          <span className="block sm:inline">Unable to connect to the AI assistant. Please make sure the backend server is running.</span>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isThinking && (
          <div className="flex items-center space-x-2 text-sgc-neutral">
            <span className="bg-sgc-purple-light p-2 rounded-full">
              <Bot size={18} className="text-sgc-purple" />
            </span>
            <div className="flex space-x-1">
              <span className="h-2 w-2 bg-sgc-purple rounded-full animate-bounce"></span>
              <span className="h-2 w-2 bg-sgc-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="h-2 w-2 bg-sgc-purple rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-border bg-white">
        <div className="flex items-end space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Canadian legal rights, workplace issues, discrimination..."
            className="min-h-[60px] resize-none"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isThinking || !isApiConnected}
            size="icon"
            className="bg-sgc-purple hover:bg-sgc-purple-dark h-[60px] w-[60px]"
          >
            <Send size={20} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Note: This AI assistant provides general legal information for Canadian rights and resources, not formal legal advice.
        </p>
      </div>
    </div>
  );
};

const MessageBubble = ({ message }: { message: Message }) => {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${message.isUser ? 'bg-sgc-blue-light ml-2' : 'bg-sgc-purple-light mr-2'}`}>
          {message.isUser ? (
            <User size={16} className="text-sgc-blue" />
          ) : (
            <Bot size={16} className="text-sgc-purple" />
          )}
        </div>
        <Card className={`${
          message.isUser ? 'bg-sgc-blue text-white' : 
          message.type === 'suggestions' ? 'bg-sgc-purple-light' :
          message.type === 'error' ? 'bg-red-100 text-red-700' :
          'bg-white'
        }`}>
          <CardContent className="p-3">
            {message.type === 'suggestions' ? (
              <>
                <p className="text-sm font-semibold mb-2">You might also be interested in:</p>
                {message.content.split('\n').map((suggestion, index) => (
                  <p key={index} className="text-sm py-1">• {suggestion}</p>
                ))}
              </>
            ) : (
              <p className="text-sm whitespace-pre-line">{message.content}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalBot;
