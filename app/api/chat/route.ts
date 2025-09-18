import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import ChatMessage from '@/lib/models/ChatMessage';
import { detectCrisis } from '@/lib/crisis-detection';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No authentication token' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      email: string;
    };

    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for crisis language
    const crisis = detectCrisis(message);
    const crisisDetected = crisis.level !== 'low';

    // Save user message
    const userMessage = new ChatMessage({
      userId: decoded.userId,
      content: message,
      role: 'user',
      crisisDetected,
      crisisLevel: crisisDetected ? crisis.level : undefined,
      language: 'en', // TODO: Detect language
    });

    await userMessage.save();

    // Generate AI response
    let aiResponse = '';
    
    if (crisisDetected) {
      // Crisis response handled in frontend
      aiResponse = crisis.message;
    } else {
      // Generate normal AI response
      aiResponse = await generateAIResponse(message, conversationHistory);
    }

    // Save AI response
    const assistantMessage = new ChatMessage({
      userId: decoded.userId,
      content: aiResponse,
      role: 'assistant',
      crisisDetected,
      crisisLevel: crisisDetected ? crisis.level : undefined,
      language: 'en',
    });

    await assistantMessage.save();

    return NextResponse.json({
      message: aiResponse,
      crisisDetected,
      crisisLevel: crisisDetected ? crisis.level : undefined,
    }, { status: 200 });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateAIResponse(message: string, conversationHistory: any[]): Promise<string> {
  // This is a simplified AI response generator
  // In production, you would integrate with OpenAI, Anthropic, or another AI service
  
  const responses = {
    greeting: [
      "Hello! I'm here to support you. How are you feeling today?",
      "Hi there! I'm your AI mental health companion. What's on your mind?",
      "Hello! I'm glad you're here. How can I help you today?",
    ],
    mood: [
      "I understand you're feeling that way. It's completely normal to have ups and downs. Would you like to talk about what might be contributing to these feelings?",
      "Thank you for sharing how you're feeling. Your emotions are valid and important. Is there anything specific that's been on your mind lately?",
      "I hear you. It sounds like you're going through a challenging time. Remember, it's okay to feel this way. What would help you feel better right now?",
    ],
    stress: [
      "Stress can be overwhelming, but you're taking a great step by reaching out. What are some things that usually help you relax?",
      "I can sense you're feeling stressed. That's completely understandable. Have you tried any breathing exercises or mindfulness techniques?",
      "Stress affects everyone differently, and it's brave of you to acknowledge it. What's one small thing you could do for yourself today?",
    ],
    anxiety: [
      "Anxiety can feel very intense, but you're not alone in this. What techniques have helped you manage anxiety in the past?",
      "I understand anxiety can be really challenging. Remember to breathe and take things one step at a time. What's making you feel anxious right now?",
      "Anxiety is a common experience, and it's okay to feel this way. What would make you feel more grounded and safe right now?",
    ],
    gratitude: [
      "It's wonderful that you're practicing gratitude! What are you most grateful for today?",
      "Gratitude is such a powerful practice. I'm glad you're focusing on the positive. What brought you joy recently?",
      "That's a beautiful way to shift your perspective. Gratitude can really help improve our overall well-being. What else are you thankful for?",
    ],
    default: [
      "I'm here to listen and support you. Can you tell me more about what you're experiencing?",
      "Thank you for sharing that with me. I want to understand better - can you elaborate on what's going on?",
      "I'm listening, and I care about what you're going through. What would be most helpful for you right now?",
    ],
  };

  const lowerMessage = message.toLowerCase();

  // Simple keyword matching for response selection
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
    return responses.mood[Math.floor(Math.random() * responses.mood.length)];
  }
  
  if (lowerMessage.includes('stressed') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
    return responses.stress[Math.floor(Math.random() * responses.stress.length)];
  }
  
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('nervous')) {
    return responses.anxiety[Math.floor(Math.random() * responses.anxiety.length)];
  }
  
  if (lowerMessage.includes('grateful') || lowerMessage.includes('thankful') || lowerMessage.includes('appreciate')) {
    return responses.gratitude[Math.floor(Math.random() * responses.gratitude.length)];
  }

  return responses.default[Math.floor(Math.random() * responses.default.length)];
}
