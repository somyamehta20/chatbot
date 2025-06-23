# 🚀 Vercel Deployment Guide

This guide will help you deploy your voice bot to Vercel with proper security for your API key.

## 📋 Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **OpenAI API Key**: Keep this ready (we'll add it securely)

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Ensure your repository is public** (Vercel needs access)

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your GitHub repository**:
   - Select your voice bot repository
   - Vercel will auto-detect it's a Node.js project
4. **Configure the project**:
   - **Framework Preset**: Node.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `public`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables

**⚠️ CRITICAL: Add your OpenAI API key securely**

1. **In your Vercel project dashboard**, go to **Settings** → **Environment Variables**
2. **Add the following variable**:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `your_actual_openai_api_key_here`
   - **Environment**: Production (and Preview if you want)
3. **Click "Save"**

### Step 4: Deploy

1. **Click "Deploy"** in Vercel
2. **Wait for deployment** (usually 1-2 minutes)
3. **Your app will be live** at a URL like: `https://your-project-name.vercel.app`

## 🔒 Security Notes

✅ **Your API key is secure** - it's stored as an environment variable and never exposed in your code

✅ **No API key in repository** - the config.js file uses `process.env.OPENAI_API_KEY`

✅ **Environment variables are encrypted** - Vercel encrypts all environment variables

## 🌐 What Works on Vercel

✅ **Text-based chat** - Full functionality
✅ **OpenAI API integration** - Complete
✅ **Responsive UI** - Works on all devices
✅ **Static file serving** - HTML, CSS, JS served properly

## ⚠️ Limitations on Vercel

❌ **Voice input** - FFmpeg not supported (we'll add this later)
❌ **File uploads** - Serverless functions have limitations
❌ **Audio file storage** - No persistent file system

## 🔄 Voice Features (Future Enhancement)

To add voice features later, you can:
1. Use **AssemblyAI** or **Google Speech-to-Text** API
2. Use **Cloudinary** for audio file storage
3. Implement **WebSocket** connections for real-time audio

## 🧪 Testing Your Deployment

1. **Visit your Vercel URL**
2. **Test text chat** - should work perfectly
3. **Check console** - no errors should appear
4. **Test on mobile** - should be responsive

## 📊 Monitoring

- **Vercel Dashboard**: Monitor deployments and performance
- **Function Logs**: Check for any errors in the Vercel dashboard
- **Analytics**: Vercel provides basic analytics

## 🔧 Troubleshooting

### Common Issues:

1. **"API Key not configured"**
   - Check environment variables in Vercel dashboard
   - Ensure variable name is exactly `OPENAI_API_KEY`

2. **"Function timeout"**
   - Vercel functions have 30-second timeout
   - Chat responses should be quick enough

3. **"CORS errors"**
   - CORS is properly configured in the API functions
   - Should work out of the box

### If deployment fails:

1. **Check Vercel logs** in the dashboard
2. **Verify all files are committed** to GitHub
3. **Ensure package.json is correct**
4. **Check environment variables are set**

## 🎉 Success!

Once deployed, your voice bot will be:
- ✅ **Publicly accessible** via Vercel URL
- ✅ **Secure** with encrypted API keys
- ✅ **Scalable** with Vercel's infrastructure
- ✅ **Fast** with global CDN

**Share your Vercel URL and start chatting!** 🚀 