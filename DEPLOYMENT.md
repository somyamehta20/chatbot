# 🚀 One-Click Deployment Guide

Your voice bot is now configured for **automatic deployment** on multiple platforms. Choose any option below:

## 🎯 **Recommended: Railway (Easiest)**

### Step 1: Click Deploy
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new?template=https://github.com/somyamehta20/chatbotsomya)

### Step 2: Add API Key
1. After deployment, go to your Railway dashboard
2. Click on your project → Variables
3. Add: `OPENAI_API_KEY` = `your_openai_api_key_here`
4. Your app will automatically redeploy

### Step 3: Share Your URL
- Railway will give you a URL like: `https://your-app-name.railway.app`
- Share this URL for testing!

---

## 🌐 **Alternative: Render**

### Step 1: Deploy
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub: `somyamehta20/chatbotsomya`
4. Click "Create Web Service"

### Step 2: Add API Key
1. Go to Environment → Environment Variables
2. Add: `OPENAI_API_KEY` = your API key
3. Click "Save Changes"

---

## ⚡ **Alternative: Vercel**

### Step 1: Deploy
1. Go to [vercel.com/import](https://vercel.com/import)
2. Import from GitHub: `somyamehta20/chatbotsomya`
3. Click "Deploy"

### Step 2: Add API Key
1. Go to Settings → Environment Variables
2. Add: `OPENAI_API_KEY` = your API key
3. Redeploy

---

## 🎪 **Alternative: Heroku**

### Step 1: Deploy
1. Go to [heroku.com](https://heroku.com)
2. Create New App
3. Connect to GitHub: `somyamehta20/chatbotsomya`
4. Enable automatic deploys

### Step 2: Add API Key
1. Go to Settings → Config Vars
2. Add: `OPENAI_API_KEY` = your API key

---

## ✅ **What You Get**

After deployment, your voice bot will:
- ✅ Be accessible to anyone online
- ✅ Work on desktop and mobile
- ✅ Have voice input/output capabilities
- ✅ Respond to personal questions authentically
- ✅ Use your OpenAI API key (or fallback to mock responses)

## 🔧 **Troubleshooting**

If deployment fails:
1. Check that your GitHub repo is public
2. Ensure the API key is correctly set
3. Try a different platform from the list above

**Your app is ready to deploy! Choose any platform above.** 