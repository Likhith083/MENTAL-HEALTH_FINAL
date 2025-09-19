// Simple Voice Language Detection Integration
// Easy to integrate with existing voice components

export interface VoiceLanguageDetection {
  detectedLanguage: string;
  confidence: number;
  method: 'text' | 'acoustic' | 'hybrid';
}

// Simple text-based language detection (immediate)
export function detectLanguageFromText(text: string): string {
  // Hindi (Devanagari)
  if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
  
  // Telugu
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
  
  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';
  
  // Gujarati
  if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN';
  
  // Bengali
  if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN';
  
  // Odia
  if (/[\u0B00-\u0B7F]/.test(text)) return 'or-IN';
  
  // Punjabi
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa-IN';
  
  // Marathi
  if (/[\u0900-\u097F]/.test(text) && /[\u092E\u0930\u093E\u0920\u0940]/.test(text)) return 'mr-IN';
  
  // Kannada
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN';
  
  // Malayalam
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN';
  
  // Default to English
  return 'en-US';
}

// Enhanced language detection with confidence scoring
export function detectLanguageWithConfidence(text: string): VoiceLanguageDetection {
  const language = detectLanguageFromText(text);
  
  // Calculate confidence based on text characteristics
  let confidence = 0.5; // Base confidence
  
  // Higher confidence for longer text
  if (text.length > 10) confidence += 0.2;
  if (text.length > 20) confidence += 0.1;
  
  // Higher confidence for text with spaces (proper sentences)
  if (text.includes(' ')) confidence += 0.2;
  
  // Higher confidence for text with punctuation
  if (/[.!?]/.test(text)) confidence += 0.1;
  
  // Cap at 1.0
  confidence = Math.min(confidence, 1.0);
  
  return {
    detectedLanguage: language,
    confidence,
    method: 'text'
  };
}

// Language-specific keywords for better detection
const LANGUAGE_KEYWORDS = {
  'hi-IN': ['नमस्ते', 'है', 'हैं', 'मैं', 'आप', 'कैसे', 'क्या', 'कहाँ', 'कब', 'क्यों'],
  'te-IN': ['నమస్కారం', 'అవును', 'కాదు', 'ఎలా', 'ఏమి', 'ఎక్కడ', 'ఎప్పుడు', 'ఎందుకు'],
  'ta-IN': ['வணக்கம்', 'ஆம்', 'இல்லை', 'எப்படி', 'என்ன', 'எங்கே', 'எப்போது', 'ஏன்'],
  'gu-IN': ['નમસ્તે', 'હા', 'ના', 'કેમ', 'શું', 'ક્યાં', 'ક્યારે', 'કેમ'],
  'bn-IN': ['নমস্কার', 'হ্যাঁ', 'না', 'কেমন', 'কী', 'কোথায়', 'কখন', 'কেন']
};

// Enhanced detection using keywords
export function detectLanguageWithKeywords(text: string): VoiceLanguageDetection {
  const lowerText = text.toLowerCase();
  let bestLanguage = 'en-US';
  let bestScore = 0;
  
  for (const [lang, keywords] of Object.entries(LANGUAGE_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestLanguage = lang;
    }
  }
  
  // If no keywords found, fall back to character detection
  if (bestScore === 0) {
    return detectLanguageWithConfidence(text);
  }
  
  const confidence = Math.min(bestScore / 3, 1.0); // Normalize confidence
  
  return {
    detectedLanguage: bestLanguage,
    confidence,
    method: 'text'
  };
}

// Integration helper for existing voice components
export function enhanceVoiceRecognition(
  recognition: SpeechRecognition,
  onLanguageDetected?: (language: string) => void,
  onTranscript?: (transcript: string, language: string) => void
) {
  const originalOnResult = recognition.onresult;
  
  recognition.onresult = (event: any) => {
    // Call original handler first
    if (originalOnResult) {
      originalOnResult.call(recognition, event);
    }
    
    // Add language detection
    const results = Array.from(event.results);
    const finalResults = results.filter((result: any) => result.isFinal);
    
    if (finalResults.length > 0) {
      const transcript = finalResults[0][0].transcript;
      const detection = detectLanguageWithKeywords(transcript);
      
      // Call callbacks
      onLanguageDetected?.(detection.detectedLanguage);
      onTranscript?.(transcript, detection.detectedLanguage);
      
      console.log(`Language detected: ${detection.detectedLanguage} (${Math.round(detection.confidence * 100)}% confidence)`);
    }
  };
  
  return recognition;
}

// Simple hook for React components
export function useVoiceLanguageDetection() {
  const [detectedLanguage, setDetectedLanguage] = useState('en-US');
  const [confidence, setConfidence] = useState(0);
  
  const detectLanguage = (text: string) => {
    const detection = detectLanguageWithKeywords(text);
    setDetectedLanguage(detection.detectedLanguage);
    setConfidence(detection.confidence);
    return detection;
  };
  
  return {
    detectedLanguage,
    confidence,
    detectLanguage
  };
}

// Language display utilities
export function getLanguageDisplayName(languageCode: string): string {
  const names: { [key: string]: string } = {
    'en-US': 'English',
    'hi-IN': 'हिन्दी (Hindi)',
    'te-IN': 'తెలుగు (Telugu)',
    'ta-IN': 'தமிழ் (Tamil)',
    'gu-IN': 'ગુજરાતી (Gujarati)',
    'bn-IN': 'বাংলা (Bengali)',
    'or-IN': 'ଓଡ଼ିଆ (Odia)',
    'pa-IN': 'ਪੰਜਾਬੀ (Punjabi)',
    'mr-IN': 'मराठी (Marathi)',
    'kn-IN': 'ಕನ್ನಡ (Kannada)',
    'ml-IN': 'മലയാളം (Malayalam)'
  };
  
  return names[languageCode] || languageCode;
}

export function getLanguageColor(languageCode: string): string {
  const colors: { [key: string]: string } = {
    'en-US': 'bg-blue-100 text-blue-800',
    'hi-IN': 'bg-orange-100 text-orange-800',
    'te-IN': 'bg-green-100 text-green-800',
    'ta-IN': 'bg-purple-100 text-purple-800',
    'gu-IN': 'bg-yellow-100 text-yellow-800',
    'bn-IN': 'bg-pink-100 text-pink-800',
    'or-IN': 'bg-indigo-100 text-indigo-800',
    'pa-IN': 'bg-red-100 text-red-800',
    'mr-IN': 'bg-amber-100 text-amber-800',
    'kn-IN': 'bg-emerald-100 text-emerald-800',
    'ml-IN': 'bg-cyan-100 text-cyan-800'
  };
  
  return colors[languageCode] || 'bg-gray-100 text-gray-800';
}
