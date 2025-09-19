// Smart Voice Recognition with Language Detection
import { languageDetectionService, LanguageScore } from './language-detection';

export interface SmartRecognitionOptions {
  enableLanguageDetection: boolean;
  supportedLanguages: string[];
  confidenceThreshold: number;
  maxAlternatives: number;
}

export class SmartVoiceRecognition {
  private recognition: SpeechRecognition | null = null;
  private options: SmartRecognitionOptions;
  private isListening = false;
  private detectedLanguage = 'en-US';

  constructor(options: Partial<SmartRecognitionOptions> = {}) {
    this.options = {
      enableLanguageDetection: true,
      supportedLanguages: ['en-US', 'hi-IN', 'te-IN', 'ta-IN', 'gu-IN', 'bn-IN'],
      confidenceThreshold: 0.7,
      maxAlternatives: 3,
      ...options
    };
  }

  // Initialize the recognition system
  async initialize(): Promise<void> {
    if (!('webkitSpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported');
    }

    // Initialize language detection service
    if (this.options.enableLanguageDetection) {
      await languageDetectionService.initialize();
    }

    this.recognition = new (window as any).webkitSpeechRecognition();
    this.setupRecognition();
  }

  // Setup recognition with smart language detection
  private setupRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = this.detectedLanguage;
    this.recognition.maxAlternatives = this.options.maxAlternatives;

    // Handle results with language detection
    this.recognition.onresult = async (event: any) => {
      const results = Array.from(event.results);
      const finalResults = results.filter((result: any) => result.isFinal);
      
      if (finalResults.length > 0) {
        await this.handleRecognitionResult(finalResults);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  // Handle recognition results with language detection
  private async handleRecognitionResult(results: any[]): Promise<void> {
    const transcripts = results.map((result: any) => result[0].transcript);
    const bestTranscript = transcripts[0];

    // If language detection is enabled, try to detect language
    if (this.options.enableLanguageDetection) {
      try {
        const languageResults = await this.detectLanguageFromAudio(bestTranscript);
        const bestLanguage = languageDetectionService.getBestLanguage(languageResults);
        
        if (bestLanguage !== this.detectedLanguage) {
          this.detectedLanguage = bestLanguage;
          this.updateRecognitionLanguage();
          console.log(`Language detected: ${bestLanguage}`);
        }
      } catch (error) {
        console.warn('Language detection failed:', error);
      }
    }

    // Emit the result
    this.onResult?.({
      transcript: bestTranscript,
      alternatives: transcripts,
      language: this.detectedLanguage,
      confidence: results[0][0].confidence || 0.8
    });
  }

  // Detect language from audio (simplified version)
  private async detectLanguageFromAudio(transcript: string): Promise<LanguageScore[]> {
    // For now, use text-based detection as a fallback
    // In a real implementation, you'd analyze the actual audio
    const detectedLang = this.detectLanguageFromText(transcript);
    return [{
      language: detectedLang,
      confidence: 0.9,
      method: 'text'
    }];
  }

  // Text-based language detection
  private detectLanguageFromText(text: string): string {
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN'; // Devanagari
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN'; // Telugu
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN'; // Tamil
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu-IN'; // Gujarati
    if (/[\u0980-\u09FF]/.test(text)) return 'bn-IN'; // Bengali
    return 'en-US'; // Default to English
  }

  // Update recognition language
  private updateRecognitionLanguage(): void {
    if (this.recognition) {
      this.recognition.lang = this.detectedLanguage;
    }
  }

  // Start listening
  startListening(): void {
    if (!this.recognition || this.isListening) return;
    
    this.recognition.start();
    this.isListening = true;
  }

  // Stop listening
  stopListening(): void {
    if (!this.recognition || !this.isListening) return;
    
    this.recognition.stop();
    this.isListening = false;
  }

  // Set language manually
  setLanguage(language: string): void {
    this.detectedLanguage = language;
    this.updateRecognitionLanguage();
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.detectedLanguage;
  }

  // Check if listening
  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // Event handlers
  onResult?: (result: {
    transcript: string;
    alternatives: string[];
    language: string;
    confidence: number;
  }) => void;

  onError?: (error: any) => void;

  onStart?: () => void;

  onEnd?: () => void;
}

// Enhanced voice recognition hook
export function useSmartVoiceRecognition(options: Partial<SmartRecognitionOptions> = {}) {
  const [recognition, setRecognition] = useState<SmartVoiceRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState('en-US');
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const initRecognition = async () => {
      try {
        const smartRecognition = new SmartVoiceRecognition(options);
        await smartRecognition.initialize();
        
        smartRecognition.onResult = (result) => {
          setTranscript(result.transcript);
          setDetectedLanguage(result.language);
        };
        
        smartRecognition.onStart = () => setIsListening(true);
        smartRecognition.onEnd = () => setIsListening(false);
        
        setRecognition(smartRecognition);
      } catch (error) {
        console.error('Failed to initialize voice recognition:', error);
      }
    };

    initRecognition();
  }, []);

  const startListening = () => {
    recognition?.startListening();
  };

  const stopListening = () => {
    recognition?.stopListening();
  };

  const setLanguage = (language: string) => {
    recognition?.setLanguage(language);
    setDetectedLanguage(language);
  };

  return {
    recognition,
    isListening,
    detectedLanguage,
    transcript,
    startListening,
    stopListening,
    setLanguage
  };
}
