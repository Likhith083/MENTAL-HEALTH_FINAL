'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { 
  Brain, 
  Menu, 
  X, 
  User, 
  LogOut,
  Settings,
  Heart,
  BookOpen,
  Target,
  MessageCircle,
  Phone
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export function Navbar() {
  const { user, login, register, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password);
      toast.success('Welcome back!');
      setIsAuthModalOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      setIsAuthModalOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleDemoLogin = async () => {
    try {
      await login('demo@mind.app', 'demo123');
      toast.success('Welcome to the demo account! Explore all the features.');
    } catch (error) {
      toast.error('Demo login failed. Please try again.');
      console.error('Demo login error:', error);
    }
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Mind
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {user ? (
                <>
                  <Link href="/mood" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors group">
                    <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Mood</span>
                  </Link>
                  <Link href="/meditation" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors group">
                    <Brain className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Meditation</span>
                  </Link>
                  <Link href="/goals" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors group">
                    <Target className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Goals</span>
                  </Link>
                  <Link href="/ai-chat" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors group">
                    <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>AI Chat</span>
                  </Link>
                </>
              ) : (
                <>
                  <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Features
                  </a>
                  <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors">
                    About
                  </a>
                  <a href="#contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                    Contact
                  </a>
                </>
              )}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {user.name?.split(' ')[0]}
                      </span>
                      <span className="text-xs text-gray-500">Welcome back</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    onClick={handleDemoLogin}
                    className="text-gray-600 hover:text-primary-600"
                  >
                    Try Demo
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-gray-600 hover:text-primary-600"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => setIsAuthModalOpen(true)}
                    size="sm"
                    variant="gradient"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </a>
                
                {user ? (
                  <>
                    <div className="space-y-2">
                      <Link href="/mood" className="block text-gray-600 hover:text-gray-900 transition-colors">
                        Mood Tracking
                      </Link>
                      <Link href="/meditation" className="block text-gray-600 hover:text-gray-900 transition-colors">
                        Meditation
                      </Link>
                      <Link href="/goals" className="block text-gray-600 hover:text-gray-900 transition-colors">
                        Goals
                      </Link>
                      <Link href="/ai-chat" className="block text-gray-600 hover:text-gray-900 transition-colors">
                        AI Chat
                      </Link>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {user.name?.split(' ')[0]}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsAuthModalOpen(true)}
                      className="justify-start"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => setIsAuthModalOpen(true)}
                      size="sm"
                      className="justify-start"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Welcome to Mind"
        description="Sign in to your account or create a new one to get started."
        size="md"
      >
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                />
              </div>
              <Button type="submit" className="w-full" loading={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="label">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Create a password"
                />
              </div>
              <Button type="submit" className="w-full" loading={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Modal>

    </>
  );
}
