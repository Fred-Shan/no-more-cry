# Deployment Guide - No More Cry

This guide will help you deploy the "No More Cry" application to Vercel.

## Prerequisites

1. **Gemini API Key**: Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **GitHub Account**: Push your code to GitHub
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Step-by-Step Deployment

### 1. Prepare Your Environment

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Add your Gemini API key:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

### 2. Push to GitHub

```bash
git add .
git commit -m "Initial commit: No More Cry application"
git branch -M main
git remote add origin https://github.com/yourusername/no-more-cry.git
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. Add Environment Variables:
   - Click "Environment Variables"
   - Add: `NEXT_PUBLIC_GEMINI_API_KEY` = your_api_key
   - Add: `NEXT_PUBLIC_VOLUME_THRESHOLD` = `30`
   - Add: `NEXT_PUBLIC_CONFIDENCE_THRESHOLD` = `0.75`

5. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables when prompted
# NEXT_PUBLIC_GEMINI_API_KEY: your_api_key
```

### 4. Post-Deployment Configuration

1. **Custom Domain** (Optional):
   - Go to your project settings in Vercel
   - Click "Domains"
   - Add your custom domain

2. **Environment Variables**:
   - Ensure all environment variables are set correctly
   - Redeploy if you make changes

3. **Testing**:
   - Test microphone access
   - Verify AI responses work
   - Check all features on mobile devices

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | Your Gemini API key | - | Yes |
| `NEXT_PUBLIC_VOLUME_THRESHOLD` | Volume detection threshold (10-100) | 30 | No |
| `NEXT_PUBLIC_CONFIDENCE_THRESHOLD` | AI confidence threshold (0.5-0.95) | 0.75 | No |

## Troubleshooting

### Build Failures

If the build fails:

1. Check the build logs in Vercel
2. Ensure all dependencies are installed
3. Verify TypeScript compilation passes locally: `npm run build`

### Runtime Issues

If the app doesn't work after deployment:

1. **Microphone Access**: Ensure your site is served over HTTPS (Vercel provides this)
2. **API Key**: Verify your Gemini API key is set correctly
3. **Browser Compatibility**: Test in Chrome/Firefox/Safari

### Common Errors

**"Microphone permission denied"**:
- Check browser permissions
- Ensure you're on HTTPS (not HTTP)

**"AI not responding"**:
- Verify API key is valid
- Check API quota at [Google AI Studio](https://makersuite.google.com/app/apikey)

**"Cry detection not working"**:
- Adjust volume threshold in settings
- Ensure TensorFlow.js models load correctly
- Check browser console for errors

## Performance Optimization

The app is already optimized for:

- **Bundle Size**: Code splitting and dynamic imports
- **Loading Speed**: Static generation where possible
- **Runtime**: TensorFlow.js models loaded on-demand
- **Images**: Using Unsplash with lazy loading

## Monitoring

Set up monitoring for:

1. **Vercel Analytics**: Built-in with Vercel deployment
2. **Error Tracking**: Consider integrating Sentry
3. **Performance**: Use Vercel Speed Insights

## Updates

To update the deployed app:

```bash
# Make changes locally
git add .
git commit -m "Update description"
git push

# Vercel will auto-deploy on push to main branch
```

## Security Considerations

1. **API Keys**: Never commit `.env.local` to git
2. **HTTPS**: Always use HTTPS in production (Vercel provides this)
3. **CORS**: The app makes direct API calls from browser
4. **Rate Limiting**: Monitor Gemini API usage

## Cost Estimation

- **Vercel**: Free tier includes:
  - 100GB bandwidth/month
  - Unlimited deployments
  - Automatic HTTPS

- **Gemini API**:
  - Free tier: 15 requests/minute
  - Paid tier: $0.00025/1k characters
  - Monitor usage at [Google AI Studio](https://makersuite.google.com/app/apikey)

## Support

For issues:
1. Check the [README.md](./README.md) for usage instructions
2. Review browser console for errors
3. Open an issue on GitHub

---

Your "No More Cry" application is now ready to help comfort babies! 🍼
