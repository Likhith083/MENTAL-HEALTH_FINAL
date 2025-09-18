'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  X, 
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Settings,
  AlertTriangle,
  Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface OllamaModel {
  name: string;
  size: string;
  description: string;
  recommended: boolean;
}

const OLLAMA_MODELS: OllamaModel[] = [
  { name: 'llama3.1:latest', size: '4.9 GB', description: 'Latest Llama 3.1 model - best for general conversation', recommended: true },
  { name: 'deepseek-r1:8b', size: '5.2 GB', description: 'DeepSeek R1 - excellent for reasoning and analysis', recommended: true },
  { name: 'qwen3:8b', size: '5.2 GB', description: 'Qwen3 - great for multilingual support', recommended: false },
  { name: 'llama3.2:3b', size: '2.0 GB', description: 'Lightweight Llama 3.2 - fast responses', recommended: false },
  { name: 'gemma3:4b', size: '3.3 GB', description: 'Google Gemma 3 - good for creative tasks', recommended: false },
  { name: 'phi4:latest', size: '9.1 GB', description: 'Microsoft Phi-4 - advanced reasoning', recommended: false },
];

export function AIChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama3.1:latest');
  const [showSettings, setShowSettings] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Speech recognition failed');
      };
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Crisis detection keywords
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'not worth living', 'want to die',
    'hurt myself', 'self harm', 'cutting', 'overdose', 'jump off', 'hang myself',
    'crisis', 'emergency', 'help me', 'can\'t go on', 'give up', 'hopeless'
  ];

  const detectCrisis = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return crisisKeywords.some(keyword => lowerText.includes(keyword));
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Check for crisis language
    const isCrisis = detectCrisis(userMessage.content);
    if (isCrisis) {
      setCrisisDetected(true);
      toast.error('Crisis detected! Please seek immediate help.');
    }

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          model: selectedModel,
          isCrisis,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response if not muted
      if (!isMuted && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        synthesisRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting to the AI service. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCrisisDetected(false);
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
          <Card className="h-full flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-md">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                {crisisDetected && (
                  <Badge variant="destructive" className="bg-red-500">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Crisis
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {!isMinimized && (
              <>
                {/* Settings Panel */}
                {showSettings && (
                  <div className="p-4 border-b bg-gray-50">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">AI Model</label>
                        <select
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                        >
                          {OLLAMA_MODELS.map((model) => (
                            <option key={model.name} value={model.name}>
                              {model.name} ({model.size}) {model.recommended ? '⭐' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Voice Output</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsMuted(!isMuted)}
                          className={isMuted ? 'text-gray-500' : 'text-primary-600'}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearChat}
                        className="w-full"
                      >
                        Clear Chat
                      </Button>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Hi! I'm your AI mental health assistant.</p>
                      <p className="text-sm">How can I help you today?</p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                          {message.role === 'user' && (
                            <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 min-h-[40px] max-h-24 resize-none"
                      disabled={isLoading}
                    />
                    <div className="flex flex-col space-y-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleVoiceInput}
                        disabled={isLoading}
                        className={`h-10 w-10 ${isListening ? 'bg-red-100 text-red-600' : ''}`}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isLoading}
                        size="icon"
                        className="h-10 w-10"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {/* Crisis Resources */}
      {crisisDetected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-red-50 border-red-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <Heart className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-red-800">Crisis Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-red-700">
                I'm concerned about your safety. Please reach out for immediate help:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
                <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                <p><strong>Emergency:</strong> 911</p>
              </div>
              <Button
                onClick={() => setCrisisDetected(false)}
                variant="outline"
                className="w-full"
              >
                I understand
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}