import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../lib/models/User';
import MoodEntry from '../lib/models/MoodEntry';
import JournalEntry from '../lib/models/JournalEntry';
import Goal from '../lib/models/Goal';
import MeditationSession from '../lib/models/MeditationSession';

// Demo data
const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@mind.app',
  password: 'demo123',
  preferences: {
    theme: 'system' as const,
    language: 'en',
    notifications: {
      email: true,
      push: true,
    },
    accessibility: {
      largeText: false,
      highContrast: false,
      dyslexiaFont: false,
      reduceMotion: false,
    },
    privacy: {
      aiConsent: true,
      dataSharing: false,
      crisisLogging: true,
    },
  },
};

const DEMO_MOOD_ENTRIES = [
  {
    mood: 4,
    notes: 'Feeling great today! Had a productive morning and feeling optimistic about the week ahead.',
    tags: ['productive', 'optimistic', 'energetic'],
    activities: ['work', 'exercise', 'social'],
  },
  {
    mood: 3,
    notes: 'A bit stressed about the upcoming presentation, but overall okay.',
    tags: ['stressed', 'work', 'nervous'],
    activities: ['work', 'preparation'],
  },
  {
    mood: 5,
    notes: 'Amazing day! Spent time with friends and felt really connected.',
    tags: ['happy', 'social', 'connected'],
    activities: ['social', 'friends', 'fun'],
  },
  {
    mood: 2,
    notes: 'Feeling a bit down today. Maybe need some self-care time.',
    tags: ['sad', 'tired', 'self-care'],
    activities: ['rest', 'reflection'],
  },
  {
    mood: 4,
    notes: 'Good day overall. Completed some tasks and feeling accomplished.',
    tags: ['accomplished', 'productive', 'satisfied'],
    activities: ['work', 'achievement'],
  },
];

const DEMO_JOURNAL_ENTRIES = [
  {
    title: 'Reflecting on Growth',
    content: 'Today I realized how much I\'ve grown over the past few months. I used to get overwhelmed by small challenges, but now I approach them with more confidence. It\'s not always easy, but I\'m learning to trust my ability to handle whatever comes my way. I\'m grateful for the support system I have and the tools I\'ve learned to manage my mental health.',
    mood: 4,
    tags: ['growth', 'gratitude', 'reflection'],
    isPrivate: false,
  },
  {
    title: 'Work Stress and Coping',
    content: 'The presentation tomorrow is making me anxious, but I\'m trying to use the breathing techniques I learned. I prepared well, and I know I can do this. Sometimes I forget that feeling nervous is normal and doesn\'t mean I\'m not capable. I\'ll take it one step at a time.',
    mood: 3,
    tags: ['work', 'anxiety', 'coping'],
    isPrivate: true,
  },
  {
    title: 'Grateful Moments',
    content: 'Had coffee with Sarah today and it reminded me how important human connection is. We talked about our struggles and supported each other. It\'s easy to feel isolated sometimes, but moments like these remind me that I\'m not alone. I want to make more time for these meaningful connections.',
    mood: 5,
    tags: ['gratitude', 'connection', 'friendship'],
    isPrivate: false,
  },
];

const DEMO_GOALS = [
  {
    title: 'Daily Meditation Practice',
    description: 'Meditate for at least 10 minutes every day to improve mindfulness and reduce stress.',
    category: 'health' as const,
    type: 'habit' as const,
    priority: 'high' as const,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    progress: 65,
    status: 'in-progress' as const,
  },
  {
    title: 'Improve Sleep Quality',
    description: 'Get 7-8 hours of quality sleep each night by maintaining a consistent bedtime routine.',
    category: 'health' as const,
    type: 'habit' as const,
    priority: 'high' as const,
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    progress: 40,
    status: 'in-progress' as const,
  },
  {
    title: 'Exercise 3 Times a Week',
    description: 'Maintain physical health by exercising at least 3 times per week.',
    category: 'health' as const,
    type: 'habit' as const,
    priority: 'medium' as const,
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    progress: 25,
    status: 'in-progress' as const,
  },
];

const DEMO_MEDITATION_SESSIONS = [
  {
    type: 'breathing' as const,
    duration: 10,
    completed: true,
  },
  {
    type: 'body-scan' as const,
    duration: 15,
    completed: true,
  },
  {
    type: 'concentration' as const,
    duration: 20,
    completed: true,
  },
];

async function setupDemo() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: DEMO_USER.email });
    if (existingUser) {
      console.log('Demo user already exists. Updating data...');
      
      // Delete existing demo data
      await MoodEntry.deleteMany({ userId: existingUser._id });
      await JournalEntry.deleteMany({ userId: existingUser._id });
      await Goal.deleteMany({ userId: existingUser._id });
      await MeditationSession.deleteMany({ userId: existingUser._id });
      
      // Update user
      const hashedPassword = await bcrypt.hash(DEMO_USER.password, 12);
      await User.findByIdAndUpdate(existingUser._id, {
        ...DEMO_USER,
        password: hashedPassword,
      });
      
      const demoUser = await User.findById(existingUser._id);
      await createDemoData(demoUser!);
    } else {
      // Create demo user
      const hashedPassword = await bcrypt.hash(DEMO_USER.password, 12);
      const demoUser = new User({
        ...DEMO_USER,
        password: hashedPassword,
      });
      await demoUser.save();
      console.log('Demo user created');
      
      await createDemoData(demoUser);
    }

    console.log('Demo account setup complete!');
    console.log('Email: demo@mind.app');
    console.log('Password: demo123');
    
  } catch (error) {
    console.error('Error setting up demo account:', error);
  } finally {
    await mongoose.disconnect();
  }
}

async function createDemoData(user: any) {
  // Create mood entries
  for (let i = 0; i < DEMO_MOOD_ENTRIES.length; i++) {
    const entry = new MoodEntry({
      ...DEMO_MOOD_ENTRIES[i],
      userId: user._id,
      createdAt: new Date(Date.now() - (DEMO_MOOD_ENTRIES.length - i) * 24 * 60 * 60 * 1000),
    });
    await entry.save();
  }

  // Create journal entries
  for (let i = 0; i < DEMO_JOURNAL_ENTRIES.length; i++) {
    const entry = new JournalEntry({
      ...DEMO_JOURNAL_ENTRIES[i],
      userId: user._id,
      createdAt: new Date(Date.now() - (DEMO_JOURNAL_ENTRIES.length - i) * 2 * 24 * 60 * 60 * 1000),
    });
    await entry.save();
  }

  // Create goals
  for (const goalData of DEMO_GOALS) {
    const goal = new Goal({
      ...goalData,
      userId: user._id,
    });
    await goal.save();
  }

  // Create meditation sessions
  for (let i = 0; i < DEMO_MEDITATION_SESSIONS.length; i++) {
    const session = new MeditationSession({
      ...DEMO_MEDITATION_SESSIONS[i],
      userId: user._id,
      createdAt: new Date(Date.now() - (DEMO_MEDITATION_SESSIONS.length - i) * 3 * 24 * 60 * 60 * 1000),
    });
    await session.save();
  }

  console.log('Demo data created successfully');
}

// Run the setup
setupDemo();
