import { CrisisResponse } from '@/types';

export type { CrisisResponse };

// Crisis keywords and patterns for different languages
const CRISIS_PATTERNS = {
  en: {
    imminent: [
      /\bI want to die\b/i,
      /\bI want to kill myself\b/i,
      /\bI'm going to end it\b/i,
      /\bI want to end it\b/i,
      /\bI want to die tonight\b/i,
      /\bI don't want to live\b/i,
      /\bI'm going to jump\b/i,
      /\bI will overdose\b/i,
      /\bI'm going to hang myself\b/i,
      /\bI have a (knife|pills|rope)\b/i,
      /\bHow do I kill myself\b/i,
      /\bWhere can I get (pills|rope)\b/i,
    ],
    high: [
      /\bI don't want to see tomorrow\b/i,
      /\bWhat's the point of living\b/i,
      /\bI can't go on\b/i,
      /\bI can't do this anymore\b/i,
      /\bThere is no way out\b/i,
      /\bI want to disappear\b/i,
      /\bI wish I was dead\b/i,
      /\bI should just end it\b/i,
    ],
    moderate: [
      /\bI hate my life\b/i,
      /\bI'm worthless\b/i,
      /\bI want to give up\b/i,
      /\bI can't take it anymore\b/i,
      /\bI'm a burden\b/i,
      /\bNobody cares about me\b/i,
      /\bI'm better off dead\b/i,
    ],
  },
  hi: {
    imminent: [
      /\bमुझे मरना है\b/i,
      /\bमैं खुद को मार लूंगा\b/i,
      /\bमुझे जीना नहीं है\b/i,
      /\bआज ही खत्म करना चाहता हूं\b/i,
      /\bमैं आत्महत्या करूंगा\b/i,
    ],
    high: [
      /\bकल देखना नहीं चाहता\b/i,
      /\bजीने का कोई मतलब नहीं\b/i,
      /\bआगे नहीं बढ़ सकता\b/i,
      /\bअब और नहीं\b/i,
    ],
    moderate: [
      /\bमैं अपनी जिंदगी से नफरत करता हूं\b/i,
      /\bमैं बेकार हूं\b/i,
      /\bहार मानना चाहता हूं\b/i,
    ],
  },
  ta: {
    imminent: [
      /\bநான் இறக்க வேண்டும்\b/i,
      /\bநான் என்னை கொல்லப்போகிறேன்\b/i,
      /\bநான் வாழ விரும்பவில்லை\b/i,
    ],
    high: [
      /\bநாளை பார்க்க விரும்பவில்லை\b/i,
      /\bவாழ்வதில் அர்த்தமில்லை\b/i,
    ],
    moderate: [
      /\bநான் என் வாழ்க்கையை வெறுக்கிறேன்\b/i,
      /\bநான் பயனற்றவன்\b/i,
    ],
  },
};

// Helplines by region
const HELPLINES = {
  IN: [
    {
      name: 'AASRA',
      number: '91-22-27546669',
      text: '91-22-27546667',
      website: 'https://www.aasra.info/',
    },
    {
      name: 'Vandrevala Foundation',
      number: '1860 266 2345',
      text: '9999 666 555',
      website: 'https://www.vandrevalafoundation.com/',
    },
    {
      name: 'Snehi',
      number: '91-9582208181',
    },
    {
      name: 'iCall (TISS)',
      number: '+91 9152987821',
    },
  ],
  US: [
    {
      name: 'Suicide & Crisis Lifeline',
      number: '988',
      text: '988',
      website: 'https://suicidepreventionlifeline.org/',
    },
  ],
  UK: [
    {
      name: 'Samaritans',
      number: '116 123',
      website: 'https://www.samaritans.org/',
    },
  ],
};

export function detectCrisis(text: string, language: string = 'en'): CrisisResponse {
  const normalizedText = text.toLowerCase().trim();
  const patterns = CRISIS_PATTERNS[language as keyof typeof CRISIS_PATTERNS] || CRISIS_PATTERNS.en;
  
  // Check for imminent risk patterns
  for (const pattern of patterns.imminent) {
    if (pattern.test(normalizedText)) {
      return createCrisisResponse('imminent', language);
    }
  }
  
  // Check for high risk patterns
  for (const pattern of patterns.high) {
    if (pattern.test(normalizedText)) {
      return createCrisisResponse('high', language);
    }
  }
  
  // Check for moderate risk patterns
  for (const pattern of patterns.moderate) {
    if (pattern.test(normalizedText)) {
      return createCrisisResponse('moderate', language);
    }
  }
  
  // No crisis detected
  return createCrisisResponse('low', language);
}

function createCrisisResponse(level: 'low' | 'moderate' | 'high' | 'imminent', language: string): CrisisResponse {
  const responses = {
    en: {
      low: "I'm here to listen and support you. Would you like to talk about what's on your mind?",
      moderate: "I hear that you're going through a difficult time. You're not alone, and there are people who want to help. Would you like me to share some resources or coping strategies?",
      high: "I'm really concerned about what you're telling me. You don't have to face this alone. There are people who can help you right now. Would you like me to connect you with someone?",
      imminent: "I'm very worried about your safety. Please, if you're in immediate danger, call emergency services right now. You don't have to go through this alone - help is available.",
    },
    hi: {
      low: "मैं आपकी बात सुनने और आपका समर्थन करने के लिए यहाँ हूँ। क्या आप बात करना चाहेंगे?",
      moderate: "मैं समझता हूँ कि आप एक कठिन समय से गुजर रहे हैं। आप अकेले नहीं हैं, और ऐसे लोग हैं जो आपकी मदद करना चाहते हैं।",
      high: "मुझे आपकी बातों से बहुत चिंता हो रही है। आपको इसका सामना अकेले नहीं करना पड़ेगा। क्या आप चाहेंगे कि मैं आपको किसी से जोड़ूं?",
      imminent: "मुझे आपकी सुरक्षा की बहुत चिंता है। कृपया, अगर आप तुरंत खतरे में हैं, तो तुरंत आपातकालीन सेवाओं को कॉल करें।",
    },
    ta: {
      low: "நான் உங்கள் பேச்சைக் கேட்கவும் ஆதரிக்கவும் இங்கே இருக்கிறேன். நீங்கள் பேச விரும்புகிறீர்களா?",
      moderate: "நீங்கள் கடினமான நேரத்தை கடந்து வருகிறீர்கள் என்பதை நான் புரிகிறேன். நீங்கள் தனியாக இல்லை, உங்களுக்கு உதவ விரும்பும் மக்கள் உள்ளனர்.",
      high: "நீங்கள் சொல்வதைக் கேட்டு எனக்கு மிகவும் கவலை. நீங்கள் இதைத் தனியாக எதிர்கொள்ள வேண்டியதில்லை. நான் உங்களை யாருடனாவது இணைக்க விரும்புகிறீர்களா?",
      imminent: "உங்கள் பாதுகாப்பு குறித்து எனக்கு மிகவும் கவலை. தயவுசெய்து, நீங்கள் உடனடியாக ஆபத்தில் இருந்தால், உடனடியாக அவசர சேவைகளை அழைக்கவும்.",
    },
  };

  const responseText = responses[language as keyof typeof responses]?.[level] || responses.en[level];
  
  // Get helplines based on language/region
  const helplines = getHelplinesForLanguage(language);
  
  return {
    level,
    message: responseText,
    helplines,
    actions: {
      call: level === 'imminent' || level === 'high',
      text: level === 'imminent' || level === 'high',
      grounding: level === 'moderate' || level === 'high',
      resources: true,
    },
  };
}

function getHelplinesForLanguage(language: string) {
  // Default to India for Hindi and Tamil, US for English
  if (language === 'hi' || language === 'ta') {
    return HELPLINES.IN;
  } else if (language === 'en') {
    return HELPLINES.US;
  }
  return HELPLINES.IN; // Default fallback
}

export function extractKeywords(text: string, language: string = 'en'): string[] {
  const patterns = CRISIS_PATTERNS[language as keyof typeof CRISIS_PATTERNS] || CRISIS_PATTERNS.en;
  const keywords: string[] = [];
  
  // Check all patterns and extract matched keywords
  Object.values(patterns).forEach(patternGroup => {
    patternGroup.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        keywords.push(...matches);
      }
    });
  });
  
  return [...new Set(keywords)]; // Remove duplicates
}

export function shouldEscalate(level: 'low' | 'moderate' | 'high' | 'imminent'): boolean {
  return level === 'high' || level === 'imminent';
}

export function getCrisisActions(level: 'low' | 'moderate' | 'high' | 'imminent') {
  const actions = {
    low: ['Listen', 'Offer support', 'Suggest resources'],
    moderate: ['Listen', 'Offer support', 'Suggest resources', 'Offer crisis line'],
    high: ['Listen', 'Offer support', 'Urge crisis line', 'Provide immediate resources'],
    imminent: ['Urge emergency services', 'Provide crisis line', 'Stay with user', 'Get immediate help'],
  };
  
  return actions[level];
}
