'use client';

interface SpeechRecognitionConfig {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

type RecognitionCallback = (transcript: string, isFinal: boolean) => void;
type ErrorCallback = (error: string) => void;

export class STTService {
  private recognition: any = null;
  private isListening = false;
  private onResultCallback: RecognitionCallback | null = null;
  private onErrorCallback: ErrorCallback | null = null;
  private finalTranscript = '';

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition ||
                                (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
      }
    }
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }

  async startListening(
    onResult: RecognitionCallback,
    onError: ErrorCallback,
    config: SpeechRecognitionConfig = {}
  ): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    if (this.isListening) {
      return;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.finalTranscript = '';

    // Configure recognition
    this.recognition.lang = config.lang || 'en-US';
    this.recognition.continuous = config.continuous ?? true;
    this.recognition.interimResults = config.interimResults ?? true;
    this.recognition.maxAlternatives = config.maxAlternatives || 1;

    // Set up event handlers
    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          this.finalTranscript += transcript + ' ';
          this.onResultCallback?.(this.finalTranscript.trim(), true);
        } else {
          interimTranscript += transcript;
          this.onResultCallback?.(
            (this.finalTranscript + interimTranscript).trim(),
            false
          );
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      const errorMessages: { [key: string]: string } = {
        'no-speech': 'No speech detected',
        'audio-capture': 'No microphone found',
        'not-allowed': 'Microphone permission denied',
      };

      const errorMessage = errorMessages[event.error] || event.error;
      this.onErrorCallback?.(errorMessage);

      if (event.error === 'not-allowed') {
        this.isListening = false;
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        // Restart if we're supposed to be listening continuously
        try {
          this.recognition.start();
        } catch (e) {
          this.isListening = false;
        }
      }
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start recognition:', error);
      throw error;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
    }
  }

  resetTranscript(): void {
    this.finalTranscript = '';
  }

  getTranscript(): string {
    return this.finalTranscript.trim();
  }
}

export const sttService = new STTService();
