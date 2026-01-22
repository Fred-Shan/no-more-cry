'use client';

import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands';

type CryDetectionCallback = (isCrying: boolean, confidence: number) => void;

export class CryDetectionService {
  private model: speechCommands.SpeechCommandRecognizer | null = null;
  private isInitialized = false;
  private isListening = false;
  private confidenceThreshold = 0.75;
  private cryDurationThreshold = 1500; // ms
  private cryStartTime: number | null = null;
  private callback: CryDetectionCallback | null = null;
  private detectionInterval: NodeJS.Timeout | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await tf.ready();
      this.model = speechCommands.create('BROWSER_FFT');
      await this.model.ensureModelLoaded();

      this.isInitialized = true;
      console.log('Cry detection model initialized');
    } catch (error) {
      console.error('Failed to initialize cry detection model:', error);
      throw error;
    }
  }

  async startDetection(callback: CryDetectionCallback): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isListening) return;

    this.callback = callback;
    this.isListening = true;
    this.cryStartTime = null;

    // Start listening for sounds
    await this.model!.listen(
      async (result) => {
        this.handleDetectionResult(result);
      },
      {
        includeSpectrogram: false,
        probabilityThreshold: 0.6,
        overlapFactor: 0.5,
      }
    );

    console.log('Cry detection started');
  }

  private handleDetectionResult(result: any): void {
    if (!this.model || !this.callback) return;

    const labels = this.model.wordLabels();
    const cryingIndex = labels.findIndex(label =>
      label.toLowerCase().includes('cry') ||
      label.toLowerCase().includes('scream') ||
      label.toLowerCase().includes('babble')
    );

    const confidence = cryingIndex >= 0 ? result.scores[cryingIndex] : 0;
    const isCrying = confidence >= this.confidenceThreshold;

    if (isCrying) {
      if (this.cryStartTime === null) {
        this.cryStartTime = Date.now();
      } else if (Date.now() - this.cryStartTime! >= this.cryDurationThreshold) {
        this.callback(true, confidence);
      }
    } else {
      this.cryStartTime = null;
      this.callback(false, confidence);
    }
  }

  stopDetection(): void {
    if (!this.isListening) return;

    if (this.model) {
      this.model.stopListening();
    }

    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }

    this.isListening = false;
    this.cryStartTime = null;
    this.callback = null;

    console.log('Cry detection stopped');
  }

  setConfidenceThreshold(threshold: number): void {
    this.confidenceThreshold = Math.max(0, Math.min(1, threshold));
  }

  setDurationThreshold(duration: number): void {
    this.cryDurationThreshold = duration;
  }

  dispose(): void {
    this.stopDetection();
    this.model = null;
    this.isInitialized = false;
  }
}

export const cryDetectionService = new CryDetectionService();
