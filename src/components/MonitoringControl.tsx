'use client';

import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import { useEffect } from 'react';

interface MonitoringControlProps {
  onStart?: () => void;
  onStop?: () => void;
}

export const MonitoringControl = ({ onStart, onStop }: MonitoringControlProps) => {
  const { isMonitoring, setMonitoring, setCrying, setVolume } = useAppStore();

  const {
    startListening,
    stopListening,
    volume,
    isListening,
    isAboveThreshold,
  } = useAudioAnalyzer({
    threshold: useAppStore.getState().volumeThreshold,
    onVolumeChange: (vol) => {
      setVolume(vol);
    },
  });

  useEffect(() => {
    if (isAboveThreshold && isListening) {
      setCrying(true);
    } else if (!isAboveThreshold && isListening) {
      setCrying(false);
    }
  }, [isAboveThreshold, isListening, setCrying]);

  const handleToggleMonitoring = async () => {
    if (isMonitoring) {
      stopListening();
      setMonitoring(false);
      setCrying(false);
      onStop?.();
    } else {
      await startListening();
      setMonitoring(true);
      onStart?.();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleToggleMonitoring}
        className={`
          relative group overflow-hidden rounded-full transition-all duration-300
          ${isMonitoring
            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
          }
          shadow-lg hover:shadow-xl transform hover:scale-105
          w-32 h-32 flex items-center justify-center
        `}
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />

        {isListening ? (
          <MicOff className="w-12 h-12 text-white" />
        ) : (
          <Mic className="w-12 h-12 text-white" />
        )}

        {isListening && (
          <div className="absolute -top-1 -right-1">
            <div className="relative">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping" />
              <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full" />
            </div>
          </div>
        )}
      </button>

      <div className="text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {isListening ? 'Listening...' : 'Tap to Start'}
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          {isListening ? (
            <>
              <Volume2 className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Volume: {volume}
              </span>
            </>
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );
};
