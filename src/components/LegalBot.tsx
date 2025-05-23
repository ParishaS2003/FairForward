import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Search, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import BackButton from './BackButton';
import { ScrollArea } from "@/components/ui/scroll-area";

const API_BASE_URL = 'http://localhost:5001';

type Message = {
  id: number;
  content: string;
  isUser: boolean;
  type?: 'normal' | 'suggestions' | 'error' | 'resources';
};

type Resource = {
  id: number;
  name: string;
  type: string;
  description: string;
  url?: string;
};

const LegalBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResources, setShowResources] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/test`);
        const data = await response.json();
        setInitialMessage("👋 Hello! I'm Mr. Hootsworth, your friendly legal assistant. I'm here to help you understand your rights and find the support you need.\n\n**You can ask me about:**\n\n• **Workplace Rights** and discrimination\n• **Legal Resources** and support services\n• **Filing Complaints** and documentation\n• **Legal Aid** options\n\nHow can I assist you today?");
      } catch (error) {
        console.error('Error fetching initial message:', error);
        setInitialMessage('Hello! I am your legal assistant. How can I help you today?');
      }
    };
    fetchInitialMessage();
  }, []);

  useEffect(() => {
    if (initialMessage) {
      setMessages([{ id: 1, content: initialMessage, isUser: false, type: 'normal' }]);
    }
  }, [initialMessage]);

  // Test API connection on component mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/test`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
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
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
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
      
      // Add the bot response
      const botMessage: Message = {
        id: messages.length + 2,
        content: data.response,
        isUser: false,
        type: 'normal'
      };
      
      setMessages(prev => [...prev, botMessage]);

      // Add topic suggestions if available
      if (data.suggestions && Array.isArray(data.suggestions)) {
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
        content: `I apologize, but I'm having trouble connecting to my knowledge base. Please try again in a moment.`,
        isUser: false,
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSearchResources = async () => {
    if (!searchQuery.trim()) return;
    
    setIsThinking(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources/search?q=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const resources = await response.json();
      
      const resourcesMessage: Message = {
        id: messages.length + 1,
        content: formatResources(resources),
        isUser: false,
        type: 'resources'
      };
      
      setMessages(prev => [...prev, resourcesMessage]);
    } catch (error) {
      console.error('Error searching resources:', error);
      const errorMessage: Message = {
        id: messages.length + 1,
        content: `Sorry, I couldn't find any resources matching your search.`,
        isUser: false,
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const formatResources = (resources: Resource[]): string => {
    if (!resources.length) return 'No resources found.';
    
    return resources.map(resource => 
      `📚 ${resource.name}\n` +
      `Type: ${resource.type}\n` +
      `${resource.description}\n` +
      (resource.url ? `🔗 ${resource.url}\n` : '') +
      '---'
    ).join('\n');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <BackButton to="/app" />
      
      <div className="space-y-4">
      {/* Header with mascot */}
      <div className="w-full max-w-2xl mx-auto mt-8 mb-4">
        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-sgc-purple-light">
          <img 
            src="/mr-hootsworth.png" 
            alt="Mr. Hootsworth" 
            className="h-16 w-16 md:h-20 md:w-20 animate-sway"
            style={{ animation: 'sway 2.5s ease-in-out infinite' }}
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-sgc-purple mb-1">Ask Mr. Hootsworth!</h1>
            <p className="text-sgc-neutral-dark text-sm md:text-base">Your friendly legal assistant for Canadian rights, workplace issues, and more.</p>
          </div>
        </div>
        <style>{`
          @keyframes sway {
            0% { transform: translateX(0) rotate(-3deg); }
            25% { transform: translateX(10px) rotate(3deg); }
            50% { transform: translateX(0) rotate(-3deg); }
            75% { transform: translateX(-10px) rotate(3deg); }
            100% { transform: translateX(0) rotate(-3deg); }
          }
        `}</style>
      </div>

      {/* Chat area with glassmorphism */}
      <div className="w-full max-w-2xl flex-1 flex flex-col mx-auto rounded-3xl shadow-2xl bg-white/70 backdrop-blur-lg border border-sgc-purple-light overflow-hidden">
        {/* Resources Search Section */}
        <div className="p-4 border-b bg-gradient-to-r from-sgc-purple-light/40 to-white">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search legal resources..."
              className="flex-1 rounded-full bg-white/80 border-sgc-purple-light focus:ring-2 focus:ring-sgc-purple"
            />
            <Button 
              onClick={handleSearchResources}
              className="bg-sgc-purple hover:bg-sgc-purple-dark rounded-full shadow-md"
            >
              <Search size={18} />
            </Button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-white/80 to-sgc-purple-light/30">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <MessageBubble message={message} />
              </motion.div>
            ))}
          </AnimatePresence>
          {isThinking && (
            <div className="flex items-center space-x-2 text-sgc-neutral mt-2">
              <span className="bg-sgc-purple-light p-2 rounded-full">
                <img 
                  src="/mr-hootsworth.png" 
                  alt="Mr. Hootsworth" 
                  className="h-6 w-6 rounded-full animate-bounce-bot"
                  style={{ animation: 'bounce-bot 1.2s infinite' }}
                />
              </span>
              <div className="flex space-x-1">
                <span className="h-2 w-2 bg-sgc-purple rounded-full animate-bounce"></span>
                <span className="h-2 w-2 bg-sgc-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="h-2 w-2 bg-sgc-purple rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
              <style>{`
                @keyframes bounce-bot {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-8px); }
                }
              `}</style>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t bg-white/80">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your legal question here..."
              className="flex-1 rounded-2xl border-sgc-purple-light focus:ring-2 focus:ring-sgc-purple bg-white/90 shadow-sm resize-none"
              rows={1}
            />
            <Button 
              onClick={handleSend} 
              disabled={isThinking || !input.trim()}
              className="bg-sgc-purple hover:bg-sgc-purple-dark rounded-full shadow-lg transition-transform duration-200 active:scale-95"
              style={{ minHeight: 48, minWidth: 48 }}
            >
              <Send size={22} />
            </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatMessage = (content: string) => {
    // Split content into paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      // Handle bullet points
      if (paragraph.startsWith('•')) {
        const items = paragraph.split('\n');
        return (
          <div key={pIndex} className="space-y-2">
            {items.map((item, iIndex) => {
              // Format bold text within bullet points
              const parts = item.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={iIndex} className="text-sm">
                  {parts.map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={partIndex} className="font-semibold text-sgc-purple">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>
        );
      }

      // Format regular paragraphs with bold text
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={pIndex} className="text-sm mb-4">
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={partIndex} className="font-semibold text-sgc-purple">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

const MessageBubble = ({ message }: { message: Message }) => {
  // Speech bubble tail styles
  const tail = message.isUser
    ? 'after:content-[""] after:absolute after:right-[-10px] after:top-3 after:border-8 after:border-transparent after:border-l-sgc-purple'
    : 'after:content-[""] after:absolute after:left-[-10px] after:top-3 after:border-8 after:border-transparent after:border-r-sgc-purple-light';

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} relative`}>
      <div className={`flex max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${message.isUser ? 'bg-gradient-to-br from-sgc-purple to-sgc-purple-dark ml-2' : 'bg-sgc-purple-light mr-2'}`}>
          {message.isUser ? (
            <User size={20} className="text-white" />
          ) : (
            <img 
              src="/mr-hootsworth.png" 
              alt="Mr. Hootsworth" 
              className="h-10 w-10 rounded-full animate-bounce-bot"
              style={{ animation: 'bounce-bot 1.2s infinite' }}
            />
          )}
        </div>
        <div className={`relative ${tail} ${message.isUser ? 'ml-2' : 'mr-2'}`}> 
          <Card className={`shadow-lg ${
            message.isUser ? 'bg-gradient-to-br from-sgc-purple to-sgc-purple-dark text-white' : 
            message.type === 'suggestions' ? 'bg-sgc-purple-light' :
            message.type === 'resources' ? 'bg-sgc-purple-light' :
            message.type === 'error' ? 'bg-red-100 text-red-700' :
            'bg-white'
          }`}>
            <CardContent className={`p-4 ${message.isUser ? 'pb-3' : ''}`}>
              {message.type === 'suggestions' ? (
                <>
                  <p className="text-sm font-semibold mb-3 text-sgc-purple">You might also be interested in:</p>
                  {message.content.split('\n').map((suggestion, index) => (
                    <p key={index} className="text-sm py-1.5">• {suggestion}</p>
                  ))}
                </>
              ) : message.type === 'resources' ? (
                <div className="text-sm whitespace-pre-line space-y-2">
                  {message.content.split('\n').map((line, index) => {
                    if (line.startsWith('🔗')) {
                      const url = line.replace('🔗', '').trim();
                      return (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sgc-purple hover:underline break-all"
                        >
                          {url}
                        </a>
                      );
                    }
                    return <p key={index} className="mb-2">{line}</p>;
                  })}
                </div>
              ) : (
                <div className={`text-sm ${message.isUser ? 'text-white' : 'text-gray-800'} space-y-2`}>
                  {formatMessage(message.content)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LegalBot;
