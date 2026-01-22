'use client';

import { useState, useEffect, useRef } from 'react';
import { Settings, Baby, Heart } from 'lucide-react';
import { MonitoringControl } from '@/components/MonitoringControl';
import { ComfortingContent } from '@/components/ComfortingContent';
import { StatusIndicator } from '@/components/StatusIndicator';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useAppStore } from '@/store/appStore';
import { createGeminiService } from '@/services/geminiService';
import { ttsService } from '@/services/ttsService';
import { useCryDetection } from '@/hooks/useCryDetection';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const aiServiceRef = useRef<any>(null);

  const {
    isCrying: storeIsCrying,
    aiResponse,
    apiKey,
    volumeThreshold,
    confidenceThreshold,
    setAiResponse,
    setCurrentImage,
    setAiSpeaking,
    setCrying,
  } = useAppStore();

  const {
    isDetecting,
    isCrying: detectedCrying,
    confidence,
    isModelLoading,
    startDetection,
    stopDetection,
  } = useCryDetection({
    threshold: confidenceThreshold * 100,
  });

  // Sync detection state with store
  useEffect(() => {
    setCrying(detectedCrying);
  }, [detectedCrying, setCrying]);

  // Initialize TTS service
  useEffect(() => {
    const initServices = async () => {
      try {
        await ttsService.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };

    initServices();
  }, []);

  // Handle crying detection
  useEffect(() => {
    if (!isInitialized || !apiKey) return;

    const handleCryDetected = async () => {
      if (!aiServiceRef.current) {
        aiServiceRef.current = createGeminiService(apiKey);
      }

      try {
        // Generate comforting response
        const response = await aiServiceRef.current.generateComfortingResponse(
          'Baby is crying and needs comfort'
        );

        setAiResponse(response.message);
        setCurrentImage(response.imageUrl);

        // Speak the response
        setAiSpeaking(true);
        await ttsService.speak(response.message, {
          rate: 0.85,
          pitch: 1.0,
          volume: 0.8,
        });
        setAiSpeaking(false);
      } catch (error) {
        console.error('Error generating AI response:', error);
      }
    };

    if (detectedCrying && !aiResponse) {
      handleCryDetected();
    }
  }, [detectedCrying, aiResponse, apiKey, isInitialized, setAiResponse, setCurrentImage, setAiSpeaking]);

  const handleStartMonitoring = async () => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    try {
      await startDetection();
    } catch (error) {
      console.error('Failed to start cry detection:', error);
    }
  };

  const handleStopMonitoring = () => {
    stopDetection();
    ttsService.stop();
    setAiResponse(null);
    setCurrentImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
                <Baby className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  No More Cry
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-Powered Baby Comforter
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Open settings"
            >
              <Settings className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
                Monitor Baby
              </h2>
              <MonitoringControl
                onStart={handleStartMonitoring}
                onStop={handleStopMonitoring}
              />
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                System Status
              </h3>
              <StatusIndicator />
            </div>

            {!apiKey && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Setup Required</h3>
                    <p className="text-sm opacity-90 mb-3">
                      Please add your Gemini API key to get started with AI-powered comfort.
                    </p>
                    <button
                      onClick={() => setIsSettingsOpen(true)}
                      className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      Configure Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Content Display */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden min-h-[600px]">
              <ComfortingContent />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              No More Cry - Built with Next.js, TensorFlow.js, and Gemini AI
            </p>
            <p className="mt-1">
              Remember: This app assists but doesn't replace parental care
            </p>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
