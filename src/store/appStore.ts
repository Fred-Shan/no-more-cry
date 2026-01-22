'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  // UI State
  isMonitoring: boolean;
  isCrying: boolean;
  currentVolume: number;
  cryStartTime: number | null;

  // AI Interaction
  aiResponse: string | null;
  currentImage: string | null;
  isAiSpeaking: boolean;

  // Settings
  volumeThreshold: number;
  confidenceThreshold: number;
  apiKey: string | null;

  // Conversation
  conversationMessages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;

  // Actions
  setMonitoring: (monitoring: boolean) => void;
  setCrying: (crying: boolean) => void;
  setVolume: (volume: number) => void;
  setAiResponse: (response: string | null) => void;
  setCurrentImage: (image: string | null) => void;
  setAiSpeaking: (speaking: boolean) => void;
  setVolumeThreshold: (threshold: number) => void;
  setConfidenceThreshold: (threshold: number) => void;
  setApiKey: (key: string) => void;
  addConversationMessage: (role: 'user' | 'assistant', content: string) => void;
  clearConversation: () => void;
  reset: () => void;
}

const initialState = {
  isMonitoring: false,
  isCrying: false,
  currentVolume: 0,
  cryStartTime: null,
  aiResponse: null,
  currentImage: null,
  isAiSpeaking: false,
  volumeThreshold: 30,
  confidenceThreshold: 0.75,
  apiKey: null,
  conversationMessages: [],
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setMonitoring: (monitoring) => set({ isMonitoring: monitoring }),

        setCrying: (crying) => set((state) => ({
          isCrying: crying,
          cryStartTime: crying && !state.cryStartTime ? Date.now() : null,
        })),

        setVolume: (volume) => set({ currentVolume: volume }),

        setAiResponse: (response) => set({ aiResponse: response }),

        setCurrentImage: (image) => set({ currentImage: image }),

        setAiSpeaking: (speaking) => set({ isAiSpeaking: speaking }),

        setVolumeThreshold: (threshold) => set({ volumeThreshold: threshold }),

        setConfidenceThreshold: (threshold) => set({ confidenceThreshold: threshold }),

        setApiKey: (key) => set({ apiKey: key }),

        addConversationMessage: (role, content) => set((state) => ({
          conversationMessages: [
            ...state.conversationMessages,
            {
              role,
              content,
              timestamp: Date.now(),
            },
          ],
        })),

        clearConversation: () => set({ conversationMessages: [] }),

        reset: () => set(initialState),
      }),
      {
        name: 'no-more-cry-storage',
        partialize: (state) => ({
          volumeThreshold: state.volumeThreshold,
          confidenceThreshold: state.confidenceThreshold,
          apiKey: state.apiKey,
        }),
      }
    )
  )
);
