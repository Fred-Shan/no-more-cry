'use client';

import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiConfig {
  apiKey: string;
  model?: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface ComfortingContent {
  message: string;
  imageUrl?: string;
  videoUrl?: string;
  suggestion?: string;
}

export class GeminiService {
  private config: GeminiConfig;
  private conversationHistory: ChatMessage[] = [];

  constructor(config: GeminiConfig) {
    this.config = {
      ...config,
      model: config.model || 'gemini-pro',
    };
  }

  async generateComfortingResponse(context: string): Promise<ComfortingContent> {
    const systemPrompt = `You are a nurturing and caring AI assistant specialized in comforting crying babies and toddlers.
Your responses should be:
- Warm, gentle, and soothing
- Simple and age-appropriate (directed at parents/caregivers)
- Include practical suggestions to calm the child
- Brief and concise (under 100 words)

When a baby is crying, provide comforting words and practical advice for the caregiver.`;

    const userPrompt = `Context: ${context}

Please provide:
1. A comforting message for the caregiver
2. A suggestion to help calm the baby
3. A brief description of a calming image that would be helpful (for visual content generation)`;

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${this.config.apiKey}`,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const text = response.data.candidates[0]?.content?.parts[0]?.text || '';
      return this.parseResponse(text);
    } catch (error) {
      console.error('Error generating response:', error);
      return this.getDefaultComfortingContent();
    }
  }

  private parseResponse(text: string): ComfortingContent {
    // Parse the AI response to extract message, suggestions, and image descriptions
    const lines = text.split('\n').filter(line => line.trim());
    const message = lines[0] || "It's okay, baby. I'm here with you. You're safe and loved.";

    const suggestion = lines.slice(1).join(' ') ||
      "Try gentle rocking, soft singing, or a warm hug to help comfort the little one.";

    return {
      message,
      suggestion,
      imageUrl: this.getCalmingImageUrl(),
    };
  }

  private getDefaultComfortingContent(): ComfortingContent {
    return {
      message: "Shh, shh... It's okay. Everything is going to be alright. You are safe and loved.",
      suggestion: "Try holding the baby close and gently swaying. Soft humming or white noise can also help.",
      imageUrl: this.getCalmingImageUrl(),
    };
  }

  private getCalmingImageUrl(): string {
    // Return calming placeholder images or generated image URLs
    const calmingImages = [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501854140884-074cf2b2c3af?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop',
    ];
    return calmingImages[Math.floor(Math.random() * calmingImages.length)];
  }

  async generateConversationResponse(userMessage: string): Promise<string> {
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${this.config.apiKey}`,
        {
          contents: this.conversationHistory.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          })),
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const text = response.data.candidates[0]?.content?.parts[0]?.text || '';
      this.conversationHistory.push({
        role: 'model',
        content: text,
      });

      return text;
    } catch (error) {
      console.error('Error in conversation:', error);
      return "I'm here to help. Let's try again.";
    }
  }

  clearConversation(): void {
    this.conversationHistory = [];
  }
}

export const createGeminiService = (apiKey: string) => {
  return new GeminiService({ apiKey });
};
