'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface AudioAnalyzerState {
  isListening: boolean;
  volume: number;
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  stream: MediaStream | null;
}

interface UseAudioAnalyzerOptions {
  onVolumeChange?: (volume: number) => void;
  threshold?: number;
  analysisInterval?: number;
}

export const useAudioAnalyzer = (options: UseAudioAnalyzerOptions = {}) => {
  const {
    onVolumeChange,
    threshold = 30,
    analysisInterval = 100
  } = options;

  const [state, setState] = useState<AudioAnalyzerState>({
    isListening: false,
    volume: 0,
    audioContext: null,
    analyser: null,
    stream: null,
  });

  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 44100,
      });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const analyzeVolume = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const average = sum / dataArray.length;
        const volume = Math.round(average);

        setState(prev => ({ ...prev, volume }));
        onVolumeChange?.(volume);

        animationFrameRef.current = requestAnimationFrame(analyzeVolume);
      };

      analyzeVolume();

      setState({
        isListening: true,
        volume: 0,
        audioContext,
        analyser,
        stream,
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }, [onVolumeChange]);

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }

    analyserRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;

    setState({
      isListening: false,
      volume: 0,
      audioContext: null,
      analyser: null,
      stream: null,
    });
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    ...state,
    startListening,
    stopListening,
    isAboveThreshold: state.volume > threshold,
  };
};
