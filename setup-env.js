const fs = require('fs');
const path = require('path');

const envContent = `# Database
MONGODB_URI=mongodb://localhost:27017/mental-health-app

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here-change-in-production-${Math.random().toString(36).substring(2, 15)}
NEXTAUTH_URL=http://localhost:3000

# OpenAI (optional for now)
OPENAI_API_KEY=your-openai-api-key-here

# Crisis Detection
CRISIS_DETECTION_ENABLED=true
CRISIS_LOG_RETENTION_DAYS=30

# Therapist Directory
THERAPIST_VERIFICATION_ENABLED=true
`;

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file with default configuration');
  console.log('📝 Please update MONGODB_URI if you have a different MongoDB setup');
  console.log('🔑 The NEXTAUTH_SECRET has been auto-generated for security');
} else {
  console.log('ℹ️  .env.local already exists, skipping creation');
}

console.log('\n🚀 Your mental health app is ready!');
console.log('🌐 Open http://localhost:3000 in your browser');
console.log('\n📋 Next steps:');
console.log('1. Set up MongoDB (local or cloud)');
console.log('2. Update MONGODB_URI in .env.local if needed');
console.log('3. Add your OpenAI API key for AI features (optional)');
console.log('4. Start exploring the app!');
