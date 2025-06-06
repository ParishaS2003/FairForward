import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

// Mock legal questions and answers for demonstration
const legalResponses = {
  "harassment": "Harassment is any unwelcome conduct based on a protected characteristic. You have the right to file a complaint with local authorities or your workplace HR. Would you like information on how to report?",
  "domestic violence": "If you're experiencing domestic violence, your safety is the priority. There are shelters and support services available. Would you like to see safe spaces near you?",
  "discrimination": "Discrimination in employment, housing, or public services based on gender, race, or other protected characteristics is illegal in most regions. You can file a complaint with the appropriate commission.",
  "rights": "Everyone has basic human rights that cannot be violated. These include the right to safety, equality, and dignity. Specific legal rights vary by country and region.",
  "default": "I'm here to help with basic legal guidance. Please ask about harassment, discrimination, your rights, or other legal concerns. Remember, I provide information but not formal legal advice."
};

type Message = {
  id: number;
  content: string;
  isUser: boolean;
  type?: 'normal' | 'suggestions' | 'error';
  timestamp: Date;
};

const LegalBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your AI Legal Assistant. I can help you with questions about Canadian legal rights, workplace issues, discrimination, and more. How can I assist you today?",
      isUser: false,
      type: 'normal',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Test API connection on component mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/test');
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
    
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      isUser: true,
      type: 'normal',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: messages.length + 2,
        content: data.response,
        isUser: false,
        type: 'normal',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);

      if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        const suggestionsMessage: Message = {
          id: messages.length + 3,
          content: data.suggestions.join('\n'),
          isUser: false,
          type: 'suggestions',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, suggestionsMessage]);
      }
    } catch (error) {
      console.error('Error in handleSend:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        content: `I apologize, but I'm having trouble connecting to my knowledge base. Please try again in a moment.`,
        isUser: false,
        type: 'error',
        timestamp: new Date()
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
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-gray-50">
      <AnimatePresence>
        {!isApiConnected && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4"
            role="alert"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <div>
                <strong className="font-bold">Connection Error: </strong>
                <span className="block sm:inline">Unable to connect to the AI assistant. Please make sure the backend server is running.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isThinking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-sgc-neutral"
          >
            <span className="bg-sgc-purple-light p-2 rounded-full">
              <Bot size={18} className="text-sgc-purple" />
            </span>
            <div className="flex space-x-1">
              <span className="h-2 w-2 bg-sgc-purple rounded-full animate-bounce"></span>
              <span className="h-2 w-2 bg-sgc-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="h-2 w-2 bg-sgc-purple rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-border bg-white shadow-lg">
        <div className="flex items-end space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Canadian legal rights, workplace issues, discrimination..."
            className="min-h-[60px] resize-none focus:ring-2 focus:ring-sgc-purple"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isThinking || !isApiConnected}
            size="icon"
            className="bg-sgc-purple hover:bg-sgc-purple-dark h-[60px] w-[60px] transition-all duration-200 transform hover:scale-105"
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
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
          message.isUser ? 'bg-sgc-blue-light ml-2' : 'bg-sgc-purple-light mr-2'
        }`}>
          {message.isUser ? (
            <User size={16} className="text-sgc-blue" />
          ) : (
            <Bot size={16} className="text-sgc-purple" />
          )}
        </div>
        <div className="flex flex-col">
          <Card className={`${
            message.isUser ? 'bg-sgc-blue text-white' : 
            message.type === 'suggestions' ? 'bg-sgc-purple-light' :
            message.type === 'error' ? 'bg-red-100 text-red-700' :
            'bg-white'
          } shadow-md hover:shadow-lg transition-shadow duration-200`}>
            <CardContent className="p-3">
              {message.type === 'suggestions' ? (
                <>
                  <p className="text-sm font-semibold mb-2">You might also be interested in:</p>
                  <div className="space-y-1">
                    {message.content.split('\n').map((suggestion, index) => (
                      <motion.p 
                        key={index} 
                        className="text-sm py-1 hover:bg-sgc-purple/10 rounded px-2 cursor-pointer transition-colors duration-200"
                        whileHover={{ x: 5 }}
                      >
                        • {suggestion}
                      </motion.p>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              )}
            </CardContent>
          </Card>
          <span className="text-xs text-gray-500 mt-1 px-2">
            {format(message.timestamp, 'h:mm a')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LegalBot;
