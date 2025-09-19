'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Languages, 
  Volume2, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { 
  detectLanguageWithKeywords, 
  getLanguageDisplayName, 
  getLanguageColor 
} from '@/lib/voice-language-detection';
import { audioService } from '@/lib/audio-service';

interface VoiceLanguageIndicatorProps {
  transcript: string;
  onLanguageChange?: (language: string) => void;
  showTestButton?: boolean;
  className?: string;
}

export function VoiceLanguageIndicator({ 
  transcript, 
  onLanguageChange,
  showTestButton = true,
  className = ''
}: VoiceLanguageIndicatorProps) {
  const [detectedLanguage, setDetectedLanguage] = useState('en-US');
  const [confidence, setConfidence] = useState(0);
  const [isTesting, setIsTesting] = useState(false);

  // Detect language when transcript changes
  useEffect(() => {
    if (transcript.trim()) {
      const detection = detectLanguageWithKeywords(transcript);
      setDetectedLanguage(detection.detectedLanguage);
      setConfidence(detection.confidence);
      onLanguageChange?.(detection.detectedLanguage);
    }
  }, [transcript, onLanguageChange]);

  // Test the detected language with TTS
  const testLanguage = async () => {
    if (!transcript || isTesting) return;
    
    setIsTesting(true);
    
    try {
      const testPhrases = {
        'en-US': 'Hello! I detected English.',
        'hi-IN': 'नमस्ते! मैंने हिन्दी पहचानी।',
        'te-IN': 'నమస్కారం! నేను తెలుగు గుర్తించాను।',
        'ta-IN': 'வணக்கம்! நான் தமிழை கண்டறிந்தேன்।',
        'gu-IN': 'નમસ્તે! મેં ગુજરાતી ઓળખી।',
        'bn-IN': 'নমস্কার! আমি বাংলা চিনেছি।',
        'or-IN': 'ନମସ୍କାର! ମୁଁ ଓଡ଼ିଆ ଚିହ୍ନିଲି।',
        'pa-IN': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਪੰਜਾਬੀ ਪਛਾਣੀ।',
        'mr-IN': 'नमस्कार! मी मराठी ओळखली।',
        'kn-IN': 'ನಮಸ್ಕಾರ! ನಾನು ಕನ್ನಡ ಗುರುತಿಸಿದೆ।',
        'ml-IN': 'നമസ്കാരം! ഞാൻ മലയാളം തിരിച്ചറിഞ്ഞു।'
      };
      
      const testText = testPhrases[detectedLanguage as keyof typeof testPhrases] || testPhrases['en-US'];
      
      await audioService.speak(testText, { lang: detectedLanguage });
    } catch (error) {
      console.error('TTS test failed:', error);
    } finally {
      setIsTesting(false);
    }
  };

  if (!transcript.trim()) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Languages className="h-4 w-4 text-gray-500" />
      
      <span className="text-sm text-gray-600">Language:</span>
      
      <Badge className={getLanguageColor(detectedLanguage)}>
        {getLanguageDisplayName(detectedLanguage)}
      </Badge>
      
      {confidence > 0 && (
        <span className="text-xs text-gray-500">
          ({Math.round(confidence * 100)}%)
        </span>
      )}
      
      {showTestButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={testLanguage}
          disabled={isTesting}
          className="text-blue-600 hover:text-blue-700"
        >
          {isTesting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      )}
      
      <div className="flex items-center gap-1">
        {confidence > 0.7 ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <AlertCircle className="h-3 w-3 text-yellow-500" />
        )}
      </div>
    </div>
  );
}
