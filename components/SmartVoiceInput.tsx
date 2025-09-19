'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Mic, 
  MicOff, 
  Languages, 
  Volume2, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { audioService } from '@/lib/audio-service';

interface SmartVoiceInputProps {
  onTranscript: (transcript: string, language: string) => void;
  onLanguageDetected?: (language: string) => void;
  supportedLanguages?: string[];
  showLanguageIndicator?: boolean;
  className?: string;
}

const LANGUAGE_NAMES = {
  'en-US': 'English',
  'hi-IN': 'हिन्दी',
  'te-IN': 'తెలుగు',
  'ta-IN': 'தமிழ்',
  'gu-IN': 'ગુજરાતી',
  'bn-IN': 'বাংলা'
};

const LANGUAGE_COLORS = {
  'en-US': 'bg-blue-100 text-blue-800',
  'hi-IN': 'bg-orange-100 text-orange-800',
  'te-IN': 'bg-green-100 text-green-800',
  'ta-IN': 'bg-purple-100 text-purple-800',
  'gu-IN': 'bg-yellow-100 text-yellow-800',
  'bn-IN': 'bg-pink-100 text-pink-800'
};

export function SmartVoiceInput({ 
  onTranscript, 
  onLanguageDetected,
  supportedLanguages = ['en-US', 'hi-IN', 'te-IN', 'ta-IN'],
  showLanguageIndicator = true,
  className = ''
}: SmartVoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en-US');
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const recognitionInstances = useRef<Map<string, SpeechRecognition>>(new Map());

  // Initialize recognition for multiple languages
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // Create recognition instances for each supported language
      supportedLanguages.forEach(lang => {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = lang;
        recognition.maxAlternatives = 3;
        
        recognition.onresult = (event: any) => {
          const results = Array.from(event.results);
          const finalResults = results.filter((result: any) => result.isFinal);
          
          if (finalResults.length > 0) {
            handleRecognitionResult(finalResults, lang);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error(`Recognition error for ${lang}:`, event.error);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognitionInstances.current.set(lang, recognition);
      });
    }
  }, [supportedLanguages]);

  // Handle recognition results with language detection
  const handleRecognitionResult = (results: any[], language: string) => {
    const transcripts = results.map((result: any) => result[0].transcript);
    const bestTranscript = transcripts[0];
    const confidence = results[0][0].confidence || 0.8;
    
    setTranscript(bestTranscript);
    setConfidence(confidence);
    setDetectedLanguage(language);
    setIsProcessing(false);
    
    // Call callbacks
    onTranscript(bestTranscript, language);
    onLanguageDetected?.(language);
  };

  // Start listening with language detection
  const startListening = () => {
    if (isListening) return;
    
    setIsListening(true);
    setIsProcessing(true);
    
    // Start recognition for all supported languages
    recognitionInstances.current.forEach((recognition, lang) => {
      try {
        recognition.start();
      } catch (error) {
        console.warn(`Failed to start recognition for ${lang}:`, error);
      }
    });
  };

  // Stop listening
  const stopListening = () => {
    if (!isListening) return;
    
    recognitionInstances.current.forEach(recognition => {
      try {
        recognition.stop();
      } catch (error) {
        console.warn('Error stopping recognition:', error);
      }
    });
    
    setIsListening(false);
    setIsProcessing(false);
  };

  // Test the detected language with TTS
  const testLanguage = async () => {
    if (!transcript) return;
    
    const testPhrases = {
      'en-US': 'Hello! I detected English.',
      'hi-IN': 'नमस्ते! मैंने हिन्दी पहचानी।',
      'te-IN': 'నమస్కారం! నేను తెలుగు గుర్తించాను।',
      'ta-IN': 'வணக்கம்! நான் தமிழை கண்டறிந்தேன்।',
      'gu-IN': 'નમસ્તે! મેં ગુજરાતી ઓળખી।',
      'bn-IN': 'নমস্কার! আমি বাংলা চিনেছি।'
    };
    
    const testText = testPhrases[detectedLanguage as keyof typeof testPhrases] || testPhrases['en-US'];
    
    await audioService.speak(testText, { lang: detectedLanguage });
  };

  // Clear transcript
  const clearTranscript = () => {
    setTranscript('');
    setConfidence(0);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Smart Voice Input
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Language Detection Indicator */}
        {showLanguageIndicator && (
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Detected Language:</span>
            <Badge className={LANGUAGE_COLORS[detectedLanguage as keyof typeof LANGUAGE_COLORS] || 'bg-gray-100 text-gray-800'}>
              {LANGUAGE_NAMES[detectedLanguage as keyof typeof LANGUAGE_NAMES] || detectedLanguage}
            </Badge>
            {confidence > 0 && (
              <span className="text-xs text-gray-500">
                ({Math.round(confidence * 100)}% confidence)
              </span>
            )}
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between">
              <p className="text-sm text-gray-700 flex-1">{transcript}</p>
              <div className="flex gap-2 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={testLanguage}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearTranscript}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
            className="flex items-center gap-2"
            disabled={isProcessing}
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                Start Listening
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Detecting language...
            </div>
          )}
        </div>

        {/* Supported Languages */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Supported:</span>
          {supportedLanguages.map(lang => (
            <Badge
              key={lang}
              variant="outline"
              className={`text-xs ${
                lang === detectedLanguage 
                  ? LANGUAGE_COLORS[lang as keyof typeof LANGUAGE_COLORS] || 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {LANGUAGE_NAMES[lang as keyof typeof LANGUAGE_NAMES] || lang}
            </Badge>
          ))}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            {isListening ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <AlertCircle className="h-3 w-3 text-gray-400" />
            )}
            {isListening ? 'Listening' : 'Ready'}
          </div>
          
          <div className="flex items-center gap-1">
            <Volume2 className="h-3 w-3 text-blue-500" />
            TTS Ready
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
