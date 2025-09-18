'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { 
  Heart, 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp, 
  Calendar,
  Plus,
  ArrowRight,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BarChart3,
  Zap
} from 'lucide-react';
import { getMoodEmoji, getMoodColor, getMoodLabel, formatDate } from '@/lib/utils';
import { DashboardStats } from '@/types';
import Link from 'next/link';

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Track Mood',
      description: 'How are you feeling today?',
      icon: Heart,
      href: '/mood',
      color: 'from-red-500 to-pink-500',
      bgColor: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200',
    },
    {
      title: 'Write Journal',
      description: 'Express your thoughts',
      icon: BookOpen,
      href: '/journal',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Meditate',
      description: 'Find your calm',
      icon: Brain,
      href: '/meditation',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Set Goals',
      description: 'Plan your progress',
      icon: Target,
      href: '/goals',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-200',
    },
  ];

  const recentActivities = [
    {
      type: 'mood',
      title: 'Mood Entry',
      description: 'You logged your mood as Happy',
      time: '2 hours ago',
      icon: Heart,
    },
    {
      type: 'journal',
      title: 'Journal Entry',
      description: 'You wrote about your day',
      time: '1 day ago',
      icon: BookOpen,
    },
    {
      type: 'meditation',
      title: 'Meditation Session',
      description: 'You completed a 10-minute breathing exercise',
      time: '2 days ago',
      icon: Brain,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-gray-900 animate-fade-in-up">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                  </h1>
                  {user?.email === 'demo@mind.app' && (
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full animate-pulse">
                      DEMO ACCOUNT
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-lg">
                  {formatDate(new Date())} • Ready to focus on your mental wellness?
                </p>
                {user?.email === 'demo@mind.app' && (
                  <p className="text-sm text-purple-600 mt-2 font-medium">
                    🎉 This is a demo account with sample data to showcase all features!
                  </p>
                )}
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center animate-float">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="animate-fade-in-up">
                <h2 className="text-4xl font-bold mb-3">
                  How are you feeling today?
                </h2>
                <p className="text-blue-100 mb-6 text-lg">
                  Take a moment to check in with yourself and track your current mood.
                </p>
                <Link href="/mood">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Heart className="h-5 w-5 mr-2" />
                    Track My Mood
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="text-8xl opacity-30 animate-bounce-gentle">
                  {stats?.currentMood ? getMoodEmoji(stats.currentMood) : '😊'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Current Mood</CardTitle>
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center mb-2">
                <span className="text-4xl mr-3">
                  {stats?.currentMood ? getMoodEmoji(stats.currentMood) : '😊'}
                </span>
                <span className={getMoodColor(stats?.currentMood || 3)}>
                  {stats?.currentMood ? getMoodLabel(stats.currentMood) : 'Neutral'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Last updated 2 hours ago
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Journal Entries</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats?.journalEntriesThisWeek || 0}
              </div>
              <p className="text-xs text-gray-500">
                This week
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Meditation Streak</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Brain className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats?.meditationStreak || 0} days
              </div>
              <p className="text-xs text-gray-500 flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                Keep it up! 🔥
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Goals</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats?.activeGoals || 0}
              </div>
              <p className="text-xs text-gray-500">
                In progress
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Zap className="h-5 w-5 mr-2 text-primary-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-base">
                  Get started with these common activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      href={action.href}
                      className="group block p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-br hover:scale-105"
                      style={{ 
                        background: `linear-gradient(135deg, ${action.bgColor.split(' ')[0]}, ${action.bgColor.split(' ')[2]})`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 rounded-xl bg-gradient-to-r ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-lg">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-2 transition-all duration-300" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Activity className="h-5 w-5 mr-2 text-primary-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-base">
                  Your latest wellness activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="p-3 rounded-xl bg-primary-100 shadow-sm">
                        <activity.icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-2 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button variant="ghost" className="w-full text-primary-600 hover:text-primary-700">
                    View All Activity
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mood Trend Chart */}
        {stats?.moodTrend && stats.moodTrend.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Mood Trend</CardTitle>
                <CardDescription>
                  Your mood over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end space-x-2">
                  {stats.moodTrend.map((mood, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div
                        className="w-8 bg-blue-500 rounded-t"
                        style={{ height: `${(mood / 5) * 200}px` }}
                      />
                      <div className="text-2xl">{getMoodEmoji(mood)}</div>
                      <div className="text-xs text-gray-500">
                        Day {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Insights */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-500" />
                AI Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">
                      Great job on your meditation streak!
                    </p>
                    <p className="text-sm text-blue-700">
                      You've meditated for 5 days in a row. Consider trying a longer session today.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <Activity className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">
                      Mood pattern detected
                    </p>
                    <p className="text-sm text-green-700">
                      Your mood tends to be higher on weekends. Try to maintain this positive energy throughout the week.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">
                      Goal reminder
                    </p>
                    <p className="text-sm text-yellow-700">
                      You have 2 goals due this week. Consider breaking them into smaller tasks.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
