'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { audioService, VoiceSettings, AudioServiceOptions } from '@/lib/audio-service';
import { Volume2, VolumeX, Play, Square, Settings, Mic, Globe, Languages } from 'lucide-react';

interface VoiceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: VoiceSettings) => void;
}

export function VoiceSettings({ isOpen, onClose, onSettingsChange }: VoiceSettingsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>(audioService.getDefaultSettings());
  const [options, setOptions] = useState<AudioServiceOptions>({
    enableSSML: true,
    addPauses: true,
    emphasizeKeywords: true,
    naturalRhythm: true,
    autoDetectLanguage: true
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [testText, setTestText] = useState("Hello! I'm your AI assistant. How can I help you today?");
  
  // Multilingual test examples
  const testExamples = {
    'en-US': "Hello! I'm your AI assistant. How can I help you today?",
    'hi-IN': "नमस्ते! मैं आपकी AI सहायक हूँ। आज मैं आपकी कैसे मदद कर सकती हूँ?",
    'te-IN': "నమస్కారం! నేను మీ AI సహాయకురాలిని. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?",
    'ta-IN': "வணக்கம்! நான் உங்கள் AI உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?"
  };
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  useEffect(() => {
    const loadVoices = async () => {
      // Wait a bit for voices to load
      setTimeout(() => {
        const availableLanguages = audioService.getSupportedLanguages();
        setLanguages(availableLanguages);
        
        const availableVoices = audioService.getAvailableVoices(selectedLanguage);
        setVoices(availableVoices);
        
        // Auto-select first voice if none selected
        if (!settings.voice && availableVoices.length > 0) {
          const newSettings = { ...settings, voice: availableVoices[0].name, lang: selectedLanguage };
          setSettings(newSettings);
          onSettingsChange?.(newSettings);
        }
      }, 500);
    };

    loadVoices();
  }, [selectedLanguage]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const availableVoices = audioService.getAvailableVoices(language);
    setVoices(availableVoices);
    
    // Update test text for the selected language
    const exampleText = testExamples[language as keyof typeof testExamples] || testExamples['en-US'];
    setTestText(exampleText);
    
    // Auto-select first voice for the language
    if (availableVoices.length > 0) {
      const newSettings = { ...settings, voice: availableVoices[0].name, lang: language };
      setSettings(newSettings);
      onSettingsChange?.(newSettings);
    }
  };

  const handleVoiceChange = (voiceName: string) => {
    const newSettings = { ...settings, voice: voiceName };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handleRateChange = (rate: number) => {
    const newSettings = { ...settings, rate };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handlePitchChange = (pitch: number) => {
    const newSettings = { ...settings, pitch };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handleVolumeChange = (volume: number) => {
    const newSettings = { ...settings, volume };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const handleOptionChange = (option: keyof AudioServiceOptions, value: boolean) => {
    const newOptions = { ...options, [option]: value };
    setOptions(newOptions);
    audioService.updateOptions(newOptions);
  };

  const playTestAudio = async () => {
    if (isPlaying) {
      audioService.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    await audioService.speak(
      testText,
      { ...settings, lang: selectedLanguage },
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  };

  const resetToDefaults = () => {
    const defaultSettings = audioService.getDefaultSettings();
    setSettings(defaultSettings);
    onSettingsChange?.(defaultSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Voice Settings
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {audioService.getLanguageDisplayName(lang)}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              <Languages className="h-4 w-4" />
              Voice
            </label>
            <select
              value={settings.voice}
              onChange={(e) => handleVoiceChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Speech Rate */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Speech Rate: {settings.rate.toFixed(2)}x
            </label>
            <Slider
              value={[settings.rate]}
              onValueChange={([value]) => handleRateChange(value)}
              min={0.5}
              max={1.5}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          {/* Pitch */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Pitch: {settings.pitch.toFixed(2)}
            </label>
            <Slider
              value={[settings.pitch]}
              onValueChange={([value]) => handlePitchChange(value)}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Lower</span>
              <span>Higher</span>
            </div>
          </div>

          {/* Volume */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Volume: {Math.round(settings.volume * 100)}%
            </label>
            <Slider
              value={[settings.volume]}
              onValueChange={([value]) => handleVolumeChange(value)}
              min={0.1}
              max={1.0}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Quiet</span>
              <span>Loud</span>
            </div>
          </div>

          {/* Advanced Options */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Advanced Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.addPauses}
                  onChange={(e) => handleOptionChange('addPauses', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Add natural pauses</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.emphasizeKeywords}
                  onChange={(e) => handleOptionChange('emphasizeKeywords', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Emphasize important words</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.naturalRhythm}
                  onChange={(e) => handleOptionChange('naturalRhythm', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Natural speech rhythm</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={options.autoDetectLanguage}
                  onChange={(e) => handleOptionChange('autoDetectLanguage', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Auto-detect language from text</span>
              </label>
            </div>
          </div>

          {/* Test Audio */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Test Audio ({audioService.getLanguageDisplayName(selectedLanguage)})
            </label>
            <div className="space-y-2">
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
                rows={3}
                placeholder="Enter text to test the voice settings..."
              />
              <div className="flex gap-2">
                <Button
                  onClick={playTestAudio}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Stop' : 'Play Test'}
                </Button>
                <Button
                  onClick={resetToDefaults}
                  variant="ghost"
                  size="sm"
                >
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
