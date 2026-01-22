# No More Cry

AI-powered baby comforter that detects crying and provides automated comforting responses through AI-generated content and speech.

## Features

- **Real-time Audio Monitoring**: Uses Web Audio API to continuously monitor environmental sounds
- **Cry Detection**: Leverages TensorFlow.js and speech commands model to detect baby crying
- **AI-Powered Responses**: Integrates with Google Gemini API for intelligent, context-aware comforting messages
- **Text-to-Speech**: Speaks comforting messages in a soothing voice
- **Dynamic Content**: Displays calming images and videos to help soothe the baby
- **Responsive UI**: Beautiful, mobile-friendly interface built with Next.js and Tailwind CSS
- **PWA Support**: Installable as a progressive web app for offline access
- **Dark Mode**: Automatic dark mode support

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Audio Processing**: Web Audio API, WebRTC
- **Machine Learning**: TensorFlow.js, Speech Commands Model
- **AI**: Google Gemini API
- **State Management**: Zustand
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/no-more-cry.git
cd no-more-cry
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Setup**: Click the settings icon and enter your Gemini API key
2. **Start Monitoring**: Click the microphone button to begin audio monitoring
3. **Automatic Detection**: The app will automatically detect crying and trigger comforting responses
4. **Stop Monitoring**: Click the button again to stop monitoring

### Settings

- **Volume Threshold**: Adjust the sensitivity for sound detection (10-100)
- **Confidence Threshold**: Set the AI confidence level for cry detection (50%-95%)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

The app includes a `vercel.json` configuration file for optimal deployment settings.

## Browser Compatibility

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+

**Note**: Web Audio API and Speech Synthesis API require HTTPS in production. Vercel provides this automatically.

## Privacy & Security

- All audio processing happens locally in your browser
- No audio data is stored or transmitted
- API calls are made directly to Gemini API from your browser
- Microphone permission is requested only when you start monitoring

## Limitations

- Requires microphone access
- Works best in quiet environments
- Detection accuracy varies with background noise
- Not a substitute for parental care
- Should be used as an assistive tool only

## Troubleshooting

### Microphone not working
- Check browser permissions
- Ensure you're using HTTPS (or localhost)
- Try a different browser

### AI responses not working
- Verify your Gemini API key is valid
- Check your API quota in Google AI Studio
- Ensure you have internet connection

### Cry detection not accurate
- Adjust volume threshold in settings
- Reduce background noise
- Move closer to the baby's room

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linter
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Disclaimer

This application is designed to assist parents and caregivers but is not a substitute for proper childcare. Always prioritize direct parental care and supervision. The creators are not responsible for any issues arising from the use of this application.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, TensorFlow.js, and Gemini AI
