import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_BASE_URL = 'http://localhost:11434';

interface ChatRequest {
  message: string;
  model: string;
  isCrisis: boolean;
}

interface OllamaResponse {
  response: string;
  done: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { message, model, isCrisis }: ChatRequest = await request.json();

    if (!message || !model) {
      return NextResponse.json(
        { error: 'Message and model are required' },
        { status: 400 }
      );
    }

    // Crisis response template
    if (isCrisis) {
      const crisisResponse = `I'm deeply concerned about what you've shared. Your safety is the most important thing right now. 

Please reach out for immediate help:
• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741
• Emergency Services: 911

You are not alone, and there are people who want to help you through this difficult time. Your life has value, and these feelings can change.

Would you like me to help you find local mental health resources or crisis support services?`;

      return NextResponse.json({ response: crisisResponse });
    }

    // Prepare the prompt for mental health context
    const systemPrompt = `You are a compassionate AI mental health assistant. Your role is to:
- Provide supportive, empathetic responses
- Offer practical coping strategies
- Encourage professional help when appropriate
- Maintain a warm, non-judgmental tone
- Focus on mental wellness and self-care
- Never provide medical diagnoses or replace professional therapy

Respond to the user's message with care and understanding. Keep responses concise but helpful.`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

    // Call Ollama API
    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500,
        },
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.status}`);
    }

    const ollamaData = await ollamaResponse.json();
    
    // Clean up the response
    let response = ollamaData.response.trim();
    
    // Remove any system prompt remnants
    response = response.replace(/^Assistant:\s*/i, '');
    response = response.replace(/^You are a compassionate AI mental health assistant.*?Assistant:\s*/is, '');
    
    // Ensure response is appropriate for mental health context
    if (response.length < 10) {
      response = "I understand you're going through a difficult time. Could you tell me more about what's on your mind? I'm here to listen and support you.";
    }

    return NextResponse.json({ 
      response,
      model: model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Fallback response if Ollama is not available
    const fallbackResponse = `I apologize, but I'm having trouble connecting to the AI service right now. 

In the meantime, here are some helpful resources:
• Take deep breaths and try grounding techniques
• Consider reaching out to a trusted friend or family member
• If you're in crisis, please contact emergency services (911) or a crisis hotline (988)

Please try again in a few moments, or feel free to use the other features of this app like mood tracking or journaling.`;

    return NextResponse.json({ 
      response: fallbackResponse,
      error: 'AI service temporarily unavailable'
    }, { status: 503 });
  }
}

// Health check endpoint
export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (response.ok) {
      const models = await response.json();
      return NextResponse.json({ 
        status: 'connected',
        models: models.models?.map((m: any) => m.name) || []
      });
    } else {
      return NextResponse.json({ 
        status: 'disconnected',
        error: 'Ollama not running'
      }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({ 
      status: 'disconnected',
      error: 'Cannot connect to Ollama'
    }, { status: 503 });
  }
}
