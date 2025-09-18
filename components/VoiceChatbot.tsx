'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  X, 
  Minimize2,
  Maximize2,
  Settings,
  AlertTriangle,
  Heart,
  Phone,
  PhoneOff
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { toast } from 'react-hot-toast';
import { audioService, VoiceSettings } from '@/lib/audio-service';
import { VoiceSettings as VoiceSettingsComponent } from '@/components/VoiceSettings';

interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  duration?: number;
}

interface VoiceChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceChatbot({ isOpen, onClose }: VoiceChatbotProps) {
  const { user } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama3.1:latest');
  const [showSettings, setShowSettings] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(audioService.getDefaultSettings());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          handleVoiceInput(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Speech recognition failed');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
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

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;

    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: transcript.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

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
      
      const assistantMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response if not muted
      if (!isMuted && 'speechSynthesis' in window) {
        speakText(data.response);
      }

    } catch (error) {
      console.error('Voice chat error:', error);
      toast.error('Failed to get AI response');
      
      const errorMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting to the AI service. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const speakText = async (text: string) => {
    if (!isMuted) {
      await audioService.speak(
        text,
        voiceSettings,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  const toggleListening = () => {
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

  const toggleCall = () => {
    if (isInCall) {
      // End call
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      setIsInCall(false);
      setIsListening(false);
      setIsSpeaking(false);
    } else {
      // Start call
      setIsInCall(true);
      if (!isListening) {
        toggleListening();
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCrisisDetected(false);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-6 left-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
    }`}>
      <Card className="h-full flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-md">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <CardTitle className="text-lg">Voice Assistant</CardTitle>
            {crisisDetected && (
              <Badge variant="destructive" className="bg-red-500">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Crisis
              </Badge>
            )}
            {isInCall && (
              <Badge className="bg-green-500 animate-pulse">
                Live
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
              onClick={onClose}
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
                      <option value="llama3.1:latest">Llama 3.1 (Recommended)</option>
                      <option value="deepseek-r1:8b">DeepSeek R1</option>
                      <option value="qwen3:8b">Qwen3</option>
                      <option value="llama3.2:3b">Llama 3.2 (Fast)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Voice Output</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowVoiceSettings(true)}
                        className="text-primary-600"
                        title="Voice Settings"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className={isMuted ? 'text-gray-500' : 'text-primary-600'}
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>
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
                  <Phone className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Voice Assistant Ready</p>
                      <p className="text-sm">Click the microphone to start talking</p>
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
                            ? 'bg-green-600 text-white'
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
                  
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Controls */}
                <div className="p-4 border-t">
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={toggleCall}
                      size="lg"
                      className={`h-12 w-12 rounded-full ${
                        isInCall 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isInCall ? <PhoneOff className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
                    </Button>
                    
                    <Button
                      onClick={toggleListening}
                      disabled={isInCall}
                      size="lg"
                      className={`h-12 w-12 rounded-full ${
                        isListening 
                          ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                          : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </Button>
                  </div>
                  
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-500">
                      {isInCall ? 'Live conversation active' : 
                       isListening ? 'Listening...' : 
                       'Click microphone to start'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

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

        {/* Voice Settings Modal */}
        <VoiceSettingsComponent
          isOpen={showVoiceSettings}
          onClose={() => setShowVoiceSettings(false)}
          onSettingsChange={setVoiceSettings}
        />
      </div>
    );
  }
