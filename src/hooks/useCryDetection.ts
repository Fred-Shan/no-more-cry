'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseCryDetectionOptions {
  threshold?: number;
  minDuration?: number;
}

export const useCryDetection = (options: UseCryDetectionOptions = {}) => {
  const { threshold = 75, minDuration = 1500 } = options;

  const [isDetecting, setIsDetecting] = useState(false);
  const [isCrying, setIsCrying] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(false);

  const modelRef = useRef<any>(null);
  const cryStartTimeRef = useRef<number | null>(null);
  const detectionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const initializeModel = useCallback(async () => {
    if (modelRef.current) return;

    setIsModelLoading(true);
    try {
      // Dynamic import to avoid SSR issues
      const speechCommands = await import('@tensorflow-models/speech-commands');
      const tf = await import('@tensorflow/tfjs');

      await tf.ready();

      const model = speechCommands.create('BROWSER_FFT');
      await model.ensureModelLoaded();

      modelRef.current = model;
      console.log('Cry detection model initialized');
    } catch (error) {
      console.error('Failed to initialize cry detection model:', error);
      throw error;
    } finally {
      setIsModelLoading(false);
    }
  }, []);

  const startDetection = useCallback(async () => {
    if (isDetecting) return;

    try {
      await initializeModel();

      if (!modelRef.current) {
        throw new Error('Model not initialized');
      }

      setIsDetecting(true);
      cryStartTimeRef.current = null;

      await modelRef.current.listen(
        (result: { scores: number[] }) => {
          const labels = modelRef.current.wordLabels();

          // Look for crying-related sounds
          const cryingIndex = labels.findIndex((label: string) =>
            label.toLowerCase().includes('cry') ||
            label.toLowerCase().includes('scream') ||
            label.toLowerCase().includes('babble')
          );

          // If no specific cry label, use the highest confidence score
          const currentConfidence = cryingIndex >= 0
            ? result.scores[cryingIndex]
            : Math.max(...result.scores);

          setConfidence(currentConfidence);

          const isAboveThreshold = currentConfidence >= threshold;

          if (isAboveThreshold) {
            if (!cryStartTimeRef.current) {
              cryStartTimeRef.current = Date.now();
            } else if (Date.now() - cryStartTimeRef.current >= minDuration) {
              setIsCrying(true);
            }
          } else {
            cryStartTimeRef.current = null;
            setIsCrying(false);
          }
        },
        {
          includeSpectrogram: false,
          probabilityThreshold: threshold / 100,
          overlapFactor: 0.5,
        }
      );

      console.log('Cry detection started');
    } catch (error) {
      console.error('Failed to start cry detection:', error);
      setIsDetecting(false);
      throw error;
    }
  }, [isDetecting, threshold, minDuration, initializeModel]);

  const stopDetection = useCallback(() => {
    if (!isDetecting) return;

    if (modelRef.current) {
      modelRef.current.stopListening();
    }

    if (detectionTimeoutRef.current) {
      clearTimeout(detectionTimeoutRef.current);
    }

    setIsDetecting(false);
    setIsCrying(false);
    cryStartTimeRef.current = null;

    console.log('Cry detection stopped');
  }, [isDetecting]);

  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return {
    isDetecting,
    isCrying,
    confidence,
    isModelLoading,
    startDetection,
    stopDetection,
  };
};
