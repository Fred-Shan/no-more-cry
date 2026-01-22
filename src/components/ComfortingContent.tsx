'use client';

import { useAppStore } from '@/store/appStore';
import { Heart, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ComfortingContent = () => {
  const { aiResponse, currentImage, isCrying, isAiSpeaking } = useAppStore();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isCrying && aiResponse) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isCrying, aiResponse]);

  if (!isCrying && !aiResponse) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="relative">
          <Heart className="w-24 h-24 text-pink-300 dark:text-pink-700 animate-pulse" />
          <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
        </div>
        <h3 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Waiting to help...
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-md">
          Start monitoring to detect when your little one needs comfort.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Image Display */}
      {currentImage && (
        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-t-lg">
          <img
            src={currentImage}
            alt="Calming scene"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {showAnimation && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-heartbeat">
                <Heart className="w-16 h-16 text-white drop-shadow-lg" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Response */}
      <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-b-lg shadow-lg">
        <div className="max-w-3xl mx-auto">
          {/* Speaking Indicator */}
          {isAiSpeaking && (
            <div className="flex items-center gap-2 mb-4 text-sm text-purple-600 dark:text-purple-400">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
              </div>
              <span>Speaking...</span>
            </div>
          )}

          {/* Message */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 leading-relaxed">
              {aiResponse}
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center gap-4 mt-6 text-pink-400 dark:text-pink-500">
            <Sparkles className="w-5 h-5 animate-spin [animation-duration:3s]" />
            <Heart className="w-5 h-5 animate-pulse" />
            <Sparkles className="w-5 h-5 animate-spin [animation-duration:3s] [animation-delay:1s]" />
          </div>
        </div>
      </div>
    </div>
  );
};
