'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Navbar } from '@/components/Navbar';
import { 
  Brain, 
  Wind, 
  Moon, 
  Focus, 
  Quote, 
  Play, 
  Pause, 
  RotateCcw,
  Clock,
  CheckCircle
} from 'lucide-react';
import { BreathingExercise } from '@/types';
import { toast } from 'react-hot-toast';

const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Breathing',
    description: 'Calm your nervous system with this relaxing breathing pattern',
    pattern: { inhale: 4, hold: 7, exhale: 8, holdAfter: 0 },
    duration: 5,
    benefits: ['Reduces anxiety', 'Improves sleep', 'Calms the mind'],
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Equal breathing pattern for focus and stress relief',
    pattern: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    duration: 5,
    benefits: ['Increases focus', 'Reduces stress', 'Balances emotions'],
  },
  {
    id: 'deep-belly',
    name: 'Deep Belly Breathing',
    description: 'Full diaphragmatic breathing for relaxation',
    pattern: { inhale: 4, hold: 2, exhale: 6, holdAfter: 0 },
    duration: 8,
    benefits: ['Activates parasympathetic nervous system', 'Reduces tension', 'Improves oxygen flow'],
  },
  {
    id: 'alternate-nostril',
    name: 'Alternate Nostril Breathing',
    description: 'Balancing breath work for mental clarity',
    pattern: { inhale: 4, hold: 4, exhale: 4, holdAfter: 0 },
    duration: 10,
    benefits: ['Balances left and right brain', 'Reduces anxiety', 'Improves focus'],
  },
];

const SLEEP_TOOLS = [
  {
    id: 'progressive-relaxation',
    name: 'Progressive Muscle Relaxation',
    description: '15-minute guided relaxation to prepare for sleep',
    duration: 15,
    icon: Moon,
  },
  {
    id: 'body-scan',
    name: 'Body Scan Meditation',
    description: '20-minute mindfulness practice for deep relaxation',
    duration: 20,
    icon: Brain,
  },
  {
    id: 'white-noise',
    name: 'White Noise Generator',
    description: 'Soothing sounds to mask distractions',
    duration: 30,
    icon: Wind,
  },
  {
    id: 'sleep-story',
    name: 'Sleep Story',
    description: '30-minute calming narrative to drift off',
    duration: 30,
    icon: Quote,
  },
];

const FOCUS_TOOLS = [
  {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    description: '25-minute focused work sessions with 5-minute breaks',
    duration: 25,
    icon: Clock,
  },
  {
    id: 'concentration',
    name: 'Concentration Meditation',
    description: '10-minute mindfulness practice for focus',
    duration: 10,
    icon: Focus,
  },
  {
    id: 'ambient-sounds',
    name: 'Ambient Focus Sounds',
    description: 'Background sounds to enhance concentration',
    duration: 60,
    icon: Wind,
  },
  {
    id: 'mindful-break',
    name: 'Mindful Work Break',
    description: '5-minute refresher to reset your focus',
    duration: 5,
    icon: Brain,
  },
];

const DAILY_QUOTES = [
  {
    text: "The present moment is the only time over which we have dominion.",
    author: "Thích Nhất Hạnh",
    category: "mindfulness",
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    category: "peace",
  },
  {
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    category: "wisdom",
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
    category: "mindfulness",
  },
];

export default function MeditationPage() {
  const [activeExercise, setActiveExercise] = useState<BreathingExercise | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdAfter'>('inhale');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    let phaseInterval: NodeJS.Timeout;

    if (isRunning && activeExercise) {
      const phases = [
        { name: 'inhale' as const, duration: activeExercise.pattern.inhale },
        { name: 'hold' as const, duration: activeExercise.pattern.hold },
        { name: 'exhale' as const, duration: activeExercise.pattern.exhale },
        { name: 'holdAfter' as const, duration: activeExercise.pattern.holdAfter },
      ];

      const currentPhaseIndex = phases.findIndex(phase => phase.name === currentPhase);
      const currentPhaseDuration = phases[currentPhaseIndex]?.duration || 0;

      if (phaseTimeLeft > 0) {
        phaseInterval = setInterval(() => {
          setPhaseTimeLeft(prev => {
            if (prev <= 1) {
              // Move to next phase
              const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
              const nextPhase = phases[nextPhaseIndex];
              setCurrentPhase(nextPhase.name);
              return nextPhase.duration;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

    return () => clearInterval(phaseInterval);
  }, [isRunning, activeExercise, currentPhase, phaseTimeLeft]);

  const startExercise = (exercise: BreathingExercise) => {
    setActiveExercise(exercise);
    setTimeLeft(exercise.duration * 60); // Convert minutes to seconds
    setCurrentPhase('inhale');
    setPhaseTimeLeft(exercise.pattern.inhale);
    setIsRunning(true);
  };

  const handleComplete = async () => {
    setCompletedSessions(prev => prev + 1);
    toast.success('Great job! You completed your meditation session.');
    
    // Save session to database
    try {
      await fetch('/api/meditation/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'breathing',
          duration: activeExercise?.duration || 0,
          completed: true,
        }),
      });
    } catch (error) {
      console.error('Failed to save meditation session:', error);
    }
  };

  const resetExercise = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setPhaseTimeLeft(0);
    setCurrentPhase('inhale');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out slowly...';
      case 'holdAfter':
        return 'Pause...';
      default:
        return '';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'bg-green-500';
      case 'hold':
        return 'bg-blue-500';
      case 'exhale':
        return 'bg-red-500';
      case 'holdAfter':
        return 'bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meditation & Wellness</h1>
              <p className="text-gray-600 mt-1">
                Find your calm with guided practices and mindfulness tools.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Sessions Today</div>
                <div className="text-2xl font-bold text-purple-600">{completedSessions}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="breathing" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="focus">Focus</TabsTrigger>
            <TabsTrigger value="quotes">Daily Quotes</TabsTrigger>
          </TabsList>

          {/* Breathing Exercises */}
          <TabsContent value="breathing" className="space-y-6">
            {activeExercise ? (
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{activeExercise.name}</CardTitle>
                  <CardDescription>{activeExercise.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  {/* Breathing Circle */}
                  <div className="flex justify-center">
                    <div className={`w-64 h-64 rounded-full flex items-center justify-center text-white text-2xl font-bold transition-all duration-1000 ${getPhaseColor()} breathing-circle`}>
                      {phaseTimeLeft}
                    </div>
                  </div>
                  
                  <div className="text-xl font-medium">{getPhaseInstruction()}</div>
                  
                  <div className="text-3xl font-bold text-blue-600">
                    {formatTime(timeLeft)}
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    {!isRunning ? (
                      <Button onClick={() => setIsRunning(true)} size="lg">
                        <Play className="h-5 w-5 mr-2" />
                        Start
                      </Button>
                    ) : (
                      <Button onClick={() => setIsRunning(false)} variant="outline" size="lg">
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={resetExercise} variant="outline" size="lg">
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Benefits: {activeExercise.benefits.join(' • ')}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BREATHING_EXERCISES.map((exercise) => (
                  <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Wind className="h-5 w-5 mr-2 text-blue-500" />
                        {exercise.name}
                      </CardTitle>
                      <CardDescription>{exercise.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          {exercise.duration} minutes
                        </div>
                        <div className="text-sm">
                          <div className="font-medium mb-2">Pattern:</div>
                          <div className="text-gray-600">
                            Inhale {exercise.pattern.inhale}s • Hold {exercise.pattern.hold}s • 
                            Exhale {exercise.pattern.exhale}s
                            {exercise.pattern.holdAfter > 0 && ` • Pause ${exercise.pattern.holdAfter}s`}
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium mb-2">Benefits:</div>
                          <ul className="text-gray-600 space-y-1">
                            {exercise.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button 
                          onClick={() => startExercise(exercise)} 
                          className="w-full"
                        >
                          Start Exercise
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sleep Tools */}
          <TabsContent value="sleep" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SLEEP_TOOLS.map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <tool.icon className="h-5 w-5 mr-2 text-purple-500" />
                      {tool.name}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {tool.duration} minutes
                      </div>
                      <Button variant="outline">
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Focus Tools */}
          <TabsContent value="focus" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FOCUS_TOOLS.map((tool) => (
                <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <tool.icon className="h-5 w-5 mr-2 text-green-500" />
                      {tool.name}
                    </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {tool.duration} minutes
                      </div>
                      <Button variant="outline">
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Daily Quotes */}
          <TabsContent value="quotes" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center">
                    <Quote className="h-6 w-6 mr-2 text-yellow-500" />
                    Daily Inspiration
                  </CardTitle>
                  <CardDescription>
                    Start your day with wisdom and mindfulness
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {DAILY_QUOTES.map((quote, index) => (
                      <div key={index} className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <blockquote className="text-lg italic text-gray-700 mb-4">
                          "{quote.text}"
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <cite className="text-sm font-medium text-gray-600">
                            — {quote.author}
                          </cite>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {quote.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
}
