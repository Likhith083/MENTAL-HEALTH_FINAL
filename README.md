# Mind - Mental Health Companion App

A comprehensive mental health web application built with Next.js, TypeScript, and MongoDB. Features mood tracking, journaling, meditation tools, assessments, goal setting, AI-powered crisis detection, and **advanced multilingual voice support**.

## 🌟 Features

### Core Features
- **Mood Tracking**: Track daily mood with activities, notes, and tags
- **Journaling**: Rich text journaling with guided templates
- **Meditation & Wellness**: Breathing exercises, sleep tools, focus tools, and daily quotes
- **Goal Management**: Set and track personal goals with progress monitoring
- **Mental Health Assessments**: PHQ-9, GAD-7, and other standardized assessments
- **AI Chatbot**: Intelligent companion with crisis detection and multilingual support
- **Therapist Directory**: Find and connect with verified mental health professionals
- **Crisis Support**: Immediate crisis detection with helpline connections

### 🎤 Advanced Voice Features
- **Multilingual TTS**: Natural speech synthesis in 100+ languages
- **Auto-Language Detection**: Automatically detects Hindi, Telugu, Tamil, and other languages
- **Voice Customization**: Adjustable speech rate, pitch, volume, and voice selection
- **Natural Speech Processing**: Language-specific pauses, emphasis, and rhythm
- **Free & Local**: No API costs, works completely offline
- **High-Quality Voices**: Neural voices for natural, human-like speech

### Safety Features
- **Crisis Detection**: Advanced keyword and ML-based crisis language detection
- **Multilingual Support**: Crisis detection in English, Hindi, Tamil, and more
- **Emergency Resources**: One-tap access to crisis helplines and support
- **Privacy Protection**: End-to-end encryption and privacy-first design

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MongoDB** - [MongoDB Atlas (Cloud)](https://www.mongodb.com/atlas) or [Local MongoDB](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **npm or yarn** (comes with Node.js)

### Quick Setup (5 minutes)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mental-health-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   ```
   
   **Edit `.env.local` with your configuration:**
   ```env
   # Database (Required)
   MONGODB_URI=mongodb://localhost:27017/mental-health-app
   
   # Authentication (Required)
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # AI Features (Optional - for enhanced AI responses)
   OPENAI_API_KEY=your-openai-api-key-here
   
   # Crisis Detection (Optional - enabled by default)
   CRISIS_DETECTION_ENABLED=true
   CRISIS_LOG_RETENTION_DAYS=30
   
   # Therapist Features (Optional)
   THERAPIST_VERIFICATION_ENABLED=true
   
   # Voice Features (Optional - works without these)
   NEXT_PUBLIC_AZURE_SPEECH_KEY=your-azure-speech-key
   NEXT_PUBLIC_AZURE_SPEECH_REGION=your-azure-region
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🎯 Demo Account
For quick testing, use the demo account:
- **Email**: `demo@mindapp.com`
- **Password**: `demo123`

### 🎤 Voice Features Setup
The app includes advanced multilingual voice support that works out of the box:
- **No setup required** - Uses browser's built-in voices
- **100+ languages supported** - Hindi, Telugu, Tamil, English, and more
- **Auto-detection** - Automatically detects language from text
- **Customizable** - Adjust voice settings in the app

### Database Setup

#### Option 1: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user
4. Get your connection string
5. Add it to your `.env.local` file

#### Option 2: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/mental-health-app` in your `.env.local`

### First Run Commands

```bash
# 1. Clone and navigate
git clone <repository-url>
cd mental-health-app

# 2. Install dependencies
npm install

# 3. Set up environment
cp env.example .env.local
# Edit .env.local with your settings

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:3000
```

### Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
npx kill-port 3000
# or
lsof -ti:3000 | xargs kill -9
```

**MongoDB connection issues?**
- Check your connection string in `.env.local`
- Ensure MongoDB is running (if using local)
- Verify network access (if using Atlas)

**Dependencies issues?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build issues?**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 🏗️ Project Structure

```
mental-health-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── mood/          # Mood tracking endpoints
│   │   ├── meditation/    # Meditation session endpoints
│   │   └── chat/          # AI chat endpoints
│   ├── mood/              # Mood tracking page
│   ├── meditation/        # Meditation tools page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── Dashboard.tsx     # Main dashboard
│   ├── LandingPage.tsx   # Landing page
│   └── AIChatbot.tsx     # AI chatbot component
├── contexts/             # React contexts
│   ├── AuthProvider.tsx  # Authentication context
│   └── ThemeProvider.tsx # Theme management
├── lib/                  # Utility libraries
│   ├── models/           # MongoDB models
│   ├── mongodb.ts        # Database connection
│   ├── crisis-detection.ts # Crisis detection system
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🔧 Configuration

### Database Models
- **User**: User profiles and preferences
- **MoodEntry**: Daily mood tracking data
- **JournalEntry**: Journal entries and templates
- **Goal**: Personal goals and progress
- **Assessment**: Mental health assessment results
- **Therapist**: Therapist directory entries
- **ChatMessage**: AI conversation history
- **MeditationSession**: Meditation practice sessions

### Crisis Detection
The app includes a sophisticated crisis detection system with:
- **Keyword Matching**: Immediate detection of crisis language
- **Multilingual Support**: Detection in multiple languages
- **ML Classification**: Context-aware risk assessment
- **Emergency Response**: Automatic helpline suggestions

### Supported Languages
- **English (en)** - Full support with natural voices
- **हिन्दी (Hindi)** - Complete Devanagari script support
- **తెలుగు (Telugu)** - Native Telugu voice synthesis
- **தமிழ் (Tamil)** - Tamil language support
- **বাংলা (Bengali)** - Bengali language support
- **ગુજરાતી (Gujarati)** - Gujarati language support
- **And 100+ more languages** - Automatic detection and voice selection

### 🎤 Voice Features Details
- **Auto-Language Detection**: Detects language from text input automatically
- **Natural Speech Processing**: Language-specific pause patterns and rhythm
- **Voice Customization**: Adjust rate, pitch, volume, and voice selection
- **High-Quality Voices**: Prioritizes neural and natural-sounding voices
- **Free & Local**: No API costs, works completely offline
- **Mobile Optimized**: Works on all devices and browsers

## 🛡️ Safety & Privacy

### Crisis Support
- **India**: AASRA (91-22-27546669), Vandrevala Foundation (1860 266 2345)
- **US**: Suicide & Crisis Lifeline (988)
- **UK**: Samaritans (116 123)

### Privacy Features
- End-to-end encryption for sensitive data
- User consent for data collection
- Crisis detection with privacy protection
- Secure authentication with JWT tokens

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Select the project folder

2. **Set Environment Variables**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mental-health-app
   NEXTAUTH_SECRET=your-production-secret-key-here
   NEXTAUTH_URL=https://your-domain.vercel.app
   OPENAI_API_KEY=your-openai-api-key
   CRISIS_DETECTION_ENABLED=true
   THERAPIST_VERIFICATION_ENABLED=true
   ```

3. **Deploy**
   - Click "Deploy" and wait for build to complete
   - Your app will be live at `https://your-domain.vercel.app`

### Other Platforms
- **Netlify**: Static export with API routes
- **Railway**: Full-stack deployment with database
- **DigitalOcean**: VPS deployment with Docker
- **AWS**: EC2 with RDS for database

### Production Checklist
- [ ] Set up MongoDB Atlas (cloud database)
- [ ] Configure environment variables
- [ ] Set up domain and SSL certificate
- [ ] Configure crisis detection settings
- [ ] Test voice features in production
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Environment Variables for Production
```env
# Database (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mental-health-app

# Authentication (Required)
NEXTAUTH_SECRET=your-production-secret-key-here
NEXTAUTH_URL=https://your-domain.com

# AI Features (Optional)
OPENAI_API_KEY=your-openai-api-key

# Crisis Detection (Optional)
CRISIS_DETECTION_ENABLED=true
CRISIS_LOG_RETENTION_DAYS=30

# Therapist Features (Optional)
THERAPIST_VERIFICATION_ENABLED=true

# Voice Features (Optional - works without these)
NEXT_PUBLIC_AZURE_SPEECH_KEY=your-azure-speech-key
NEXT_PUBLIC_AZURE_SPEECH_REGION=your-azure-region
```

## 🎯 Key Features Showcase

### Multilingual Voice Support
```typescript
// Auto-detects language and speaks naturally
await audioService.speak("नमस्ते! How are you today?");

// Force specific language
await audioService.speak("Hello", { lang: 'hi-IN' });

// Get available voices for a language
const hindiVoices = audioService.getAvailableVoices('hi-IN');
```

### Crisis Detection
```typescript
// Automatically detects crisis language
const crisis = detectCrisis("I'm feeling suicidal");
if (crisis.level !== 'low') {
  // Show crisis resources
  showCrisisSupport(crisis);
}
```

### Mood Tracking
```typescript
// Track mood with activities
const moodEntry = {
  mood: 4,
  activities: ['exercise', 'reading'],
  notes: 'Feeling good today!',
  timestamp: new Date()
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation for API changes
- Ensure accessibility compliance
- Test multilingual features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is not a replacement for professional mental health care. If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.

## 🆘 Crisis Resources

### International
- **Emergency Services**: 112 (India), 911 (US), 999 (UK)
- **Crisis Text Line**: Text HOME to 741741 (US)
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

### India
- **AASRA**: 91-22-27546669 / 91-22-27546667
- **Vandrevala Foundation**: 1860 266 2345 / 9999 666 555
- **Snehi**: 91-9582208181
- **iCall (TISS)**: +91 9152987821

## 📞 Support

For technical support or questions about the application, please open an issue on GitHub or contact the development team.

---

## 🌟 Why Choose Mind?

### Unique Value Propositions
- **🎤 Multilingual Voice Support**: First mental health app with natural voice synthesis in 100+ languages
- **🆓 Completely Free**: No subscription fees, no API costs for core features
- **🔒 Privacy-First**: All data stays local, no external API calls for voice features
- **🌍 Global Reach**: Supports Indian languages (Hindi, Telugu, Tamil) and international languages
- **🤖 AI-Powered**: Intelligent crisis detection and personalized support
- **📱 Mobile-First**: Works seamlessly on all devices
- **🛡️ Safety-Focused**: Advanced crisis detection with immediate support resources

### Perfect For
- **Mental Health Professionals**: Tools for client support and crisis intervention
- **Individuals**: Personal mental health tracking and support
- **Organizations**: Employee wellness programs
- **Developers**: Open-source mental health solution
- **Researchers**: Mental health data and insights

---

Built with ❤️ for mental health awareness and support. Making mental health accessible to everyone, everywhere, in every language.
