const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Import models using dynamic import
let User, MoodEntry, JournalEntry, Goal, MeditationSession;

async function importModels() {
  const userModule = await import('../lib/models/User.js');
  const moodModule = await import('../lib/models/MoodEntry.js');
  const journalModule = await import('../lib/models/JournalEntry.js');
  const goalModule = await import('../lib/models/Goal.js');
  const meditationModule = await import('../lib/models/MeditationSession.js');
  
  User = userModule.default;
  MoodEntry = moodModule.default;
  JournalEntry = journalModule.default;
  Goal = goalModule.default;
  MeditationSession = meditationModule.default;
}

// Demo data
const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@mind.app',
  password: 'demo123',
  preferences: {
    theme: 'system',
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
    name: 'Daily Meditation Practice',
    description: 'Meditate for at least 10 minutes every day to improve mindfulness and reduce stress.',
    category: 'wellness',
    priority: 'high',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    progress: 65,
    status: 'active',
    milestones: [
      { name: 'Week 1: Establish routine', completed: true },
      { name: 'Week 2: Increase to 15 minutes', completed: true },
      { name: 'Week 3: Try different techniques', completed: false },
      { name: 'Week 4: Maintain consistency', completed: false },
    ],
  },
  {
    name: 'Improve Sleep Quality',
    description: 'Get 7-8 hours of quality sleep each night by maintaining a consistent bedtime routine.',
    category: 'health',
    priority: 'high',
    targetDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    progress: 40,
    status: 'active',
    milestones: [
      { name: 'Week 1: Set consistent bedtime', completed: true },
      { name: 'Week 2: Create bedtime routine', completed: false },
      { name: 'Week 3: Limit screen time before bed', completed: false },
    ],
  },
  {
    name: 'Exercise 3 Times a Week',
    description: 'Maintain physical health by exercising at least 3 times per week.',
    category: 'health',
    priority: 'medium',
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    progress: 25,
    status: 'active',
    milestones: [
      { name: 'Week 1-2: Start with light exercises', completed: true },
      { name: 'Week 3-4: Increase intensity', completed: false },
      { name: 'Week 5-8: Maintain routine', completed: false },
    ],
  },
];

const DEMO_MEDITATION_SESSIONS = [
  {
    type: 'breathing',
    duration: 10,
    notes: 'Focused on deep breathing. Felt very relaxed afterward.',
    moodBefore: 3,
    moodAfter: 4,
  },
  {
    type: 'mindfulness',
    duration: 15,
    notes: 'Body scan meditation. Helped me release tension in my shoulders.',
    moodBefore: 2,
    moodAfter: 4,
  },
  {
    type: 'guided',
    duration: 20,
    notes: 'Used a guided meditation app. Very helpful for staying focused.',
    moodBefore: 3,
    moodAfter: 5,
  },
];

async function setupDemo() {
  try {
    // Import models first
    await importModels();
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
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
      await createDemoData(demoUser);
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

async function createDemoData(user) {
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
