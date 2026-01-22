# Development Guide - No More Cry

This guide is for developers who want to contribute to or extend the "No More Cry" application.

## Project Structure

```
no-more-cry/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with metadata
│   │   ├── page.tsx           # Main application page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── MonitoringControl.tsx
│   │   ├── ComfortingContent.tsx
│   │   ├── StatusIndicator.tsx
│   │   └── SettingsPanel.tsx
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAudioAnalyzer.ts
│   │   └── useCryDetection.ts
│   ├── services/              # External service integrations
│   │   ├── cryDetectionService.ts
│   │   ├── geminiService.ts
│   │   ├── ttsService.ts
│   │   └── sttService.ts
│   └── store/                 # State management
│       └── appStore.ts
├── public/                    # Static assets
│   └── manifest.json         # PWA manifest
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies

```

## Tech Stack Details

### Framework & Language
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **React 18**: UI library

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom animations**: Defined in `globals.css`

### Audio & ML
- **Web Audio API**: Browser-native audio processing
- **TensorFlow.js**: Machine learning in the browser
- **Speech Commands Model**: Pre-trained audio classification

### AI Integration
- **Google Gemini API**: AI-powered text generation
- **Web Speech API**: Text-to-speech synthesis

### State Management
- **Zustand**: Lightweight state management with persistence

## Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/no-more-cry.git
cd no-more-cry
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_development_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Key Components Explained

### useAudioAnalyzer Hook

Handles real-time audio monitoring:

```typescript
const {
  isListening,
  volume,
  isAboveThreshold,
  startListening,
  stopListening
} = useAudioAnalyzer({
  threshold: 30,
  onVolumeChange: (vol) => console.log(vol)
});
```

**Key Features**:
- Web Audio API integration
- Real-time volume analysis
- Configurable threshold
- Automatic cleanup

### useCryDetection Hook

Manages cry detection using ML:

```typescript
const {
  isDetecting,
  isCrying,
  confidence,
  startDetection,
  stopDetection
} = useCryDetection({
  threshold: 75,
  minDuration: 1500
});
```

**Key Features**:
- TensorFlow.js integration
- Speech Commands model
- Confidence scoring
- Duration-based detection

### geminiService

Communicates with Google Gemini API:

```typescript
const service = createGeminiService(apiKey);
const response = await service.generateComfortingResponse(context);
```

**Returns**:
- Comforting message
- Image URL
- Caregiver suggestions

## Adding New Features

### 1. Adding a New Audio Detection Pattern

Edit `src/hooks/useCryDetection.ts`:

```typescript
// Add new pattern detection
const detectPattern = (scores: number[]) => {
  // Your detection logic
  return isDetected;
};
```

### 2. Customizing AI Responses

Edit `src/services/geminiService.ts`:

```typescript
// Modify the system prompt
const systemPrompt = `
Your new custom prompt here...
`;
```

### 3. Adding New UI Components

1. Create component in `src/components/`
2. Import and use in `src/app/page.tsx`
3. Follow existing component patterns

### 4. Adding New Settings

1. Update `src/store/appStore.ts`:
```typescript
interface AppState {
  // Add new state
  newSetting: string;
  setNewSetting: (value: string) => void;
}
```

2. Update `src/components/SettingsPanel.tsx` to include UI

## Testing

### Manual Testing Checklist

- [ ] Microphone access works
- [ ] Volume detection is accurate
- [ ] Cry detection triggers correctly
- [ ] AI responses are generated
- [ ] Text-to-speech works
- [ ] Settings persist across reloads
- [ ] UI is responsive on mobile
- [ ] Dark mode works correctly

### Automated Testing (Future)

```bash
# Run tests (to be implemented)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Performance Considerations

### Optimizations Already Implemented

1. **Code Splitting**: Dynamic imports for TensorFlow.js
2. **State Persistence**: LocalStorage for settings
3. **Debouncing**: Volume analysis throttled
4. **Lazy Loading**: Components loaded on demand

### Performance Best Practices

1. **Avoid Re-renders**: Use `useCallback` and `useMemo`
2. **Optimize Images**: Use WebP format, add blur placeholders
3. **Bundle Analysis**: Run `npm run build -- --analyze`
4. **Monitor Size**: Keep bundles under 250KB

## Debugging

### Common Issues

**TensorFlow.js not loading**:
```javascript
// Check browser console for model loading errors
console.log('TF.js version:', tf.version.tfjs);
```

**Audio permissions denied**:
```javascript
// Check navigator.mediaDevices
console.log('Microphone available:', !!navigator.mediaDevices);
```

**API calls failing**:
```javascript
// Check network tab in DevTools
// Verify API key in .env.local
```

### DevTools Tips

1. **React DevTools**: Inspect component state
2. **Redux DevTools**: Monitor Zustand state changes
3. **Network Tab**: Check API requests
4. **Console**: Look for TensorFlow.js warnings

## Contributing Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive variable names
- Add JSDoc comments for functions

### Commit Messages

```
feat: add new feature
fix: fix bug in audio detection
docs: update README
refactor: improve code structure
test: add unit tests
chore: update dependencies
```

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure build passes: `npm run build`
6. Submit PR with description

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure these are set in Vercel:
- `NEXT_PUBLIC_GEMINI_API_KEY`
- `NEXT_PUBLIC_VOLUME_THRESHOLD`
- `NEXT_PUBLIC_CONFIDENCE_THRESHOLD`

## Future Enhancements

Potential improvements:

1. **Multi-language Support**: Add i18n for different languages
2. **Custom Audio Models**: Train custom TensorFlow.js models
3. **Offline Support**: Full PWA with service worker
4. **Analytics**: Track usage patterns
5. **Multiple Profiles**: Support for multiple children
6. **Video Calls**: Integrate video consultation
7. **Smart Home Integration**: Connect to IoT devices
8. **Sleep Patterns**: Track and analyze sleep data

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TensorFlow.js Guide](https://www.tensorflow.org/js/guide)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)

## License

MIT License - See LICENSE file for details

---

Happy coding! 🚀
