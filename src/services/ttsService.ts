'use client';

export class TTSService {
  private synthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!this.synthesis) {
      throw new Error('Speech synthesis not supported');
    }

    // Wait for voices to be loaded
    return new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = this.synthesis!.getVoices();
        this.isInitialized = true;
        resolve();
      };

      if (this.synthesis && this.synthesis.getVoices().length > 0) {
        loadVoices();
      } else if (this.synthesis) {
        this.synthesis.onvoiceschanged = loadVoices;
      }
    });
  }

  speak(text: string, options: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceIndex?: number;
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not available'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set options
      utterance.rate = options.rate ?? 0.9; // Slightly slower for calmness
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 0.8;

      // Try to select a soft, female voice if available
      const preferredVoice = this.voices.find(voice =>
        voice.lang.includes('en') &&
        voice.name.toLowerCase().includes('female')
      ) || this.voices.find(voice =>
        voice.lang.includes('en')
      ) || this.voices[options.voiceIndex ?? 0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event);

      this.synthesis.speak(utterance);
    });
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  pause(): void {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

export const ttsService = new TTSService();
