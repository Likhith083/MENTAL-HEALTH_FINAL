# Mind - Mental Health Companion App

A comprehensive mental health web application built with Next.js, TypeScript, and MongoDB. Features mood tracking, journaling, meditation tools, assessments, goal setting, and AI-powered crisis detection.

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
   # Database
   MONGODB_URI=mongodb://localhost:27017/
   
   # Authentication
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # AI Features (Optional)
   OPENAI_API_KEY=your-openai-api-key-here
   
   # Crisis Detection
   CRISIS_DETECTION_ENABLED=true
   CRISIS_LOG_RETENTION_DAYS=30
   
   # Therapist Features
   THERAPIST_VERIFICATION_ENABLED=true
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

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
- English (en)
- Hindi (hi)
- Tamil (ta)
- Bengali (bn)
- Telugu (te)
- And more...

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
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Static export with API routes
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mental-health-app
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
OPENAI_API_KEY=your-openai-api-key
CRISIS_DETECTION_ENABLED=true
THERAPIST_VERIFICATION_ENABLED=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

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

Built with ❤️ for mental health awareness and support.
