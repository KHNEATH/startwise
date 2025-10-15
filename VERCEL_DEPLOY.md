# 🚀 StartWise Deployment Guide - TROUBLESHOOTING 404 ERRORS

## 🔥 QUICK FIX for 404 Errors

### Option 1: Deploy Frontend Only to Vercel (Recommended)

1. **Deploy ONLY the frontend folder**:
   - In Vercel dashboard, set **Root Directory** to `frontend`
   - This tells Vercel to treat frontend as the main project

2. **Environment Variables in Vercel**:
   ```
   REACT_APP_API_URL = https://your-backend-url.railway.app/api
   ```

3. **Build Settings** (Vercel auto-detects, but verify):
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### Option 2: Alternative Deployment Methods

#### A) Netlify (Often easier for React apps)
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repo
3. Set:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

#### B) Railway (Full-stack in one place)
1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub repo
3. Railway auto-detects both frontend and backend
4. Set environment variables in Railway dashboard

## 🔧 Step-by-Step Fix for Current 404 Error

### Step 1: Check Your Vercel Project Settings
1. Go to Vercel Dashboard → Your Project → Settings
2. **Root Directory**: Set to `frontend` (not root)
3. **Framework Preset**: Should auto-detect as "Create React App"

### Step 2: Verify Build Output
Local test:
```bash
cd "/Users/macbookpro/Downloads/Startwise 2/frontend"
npm run build
ls build/  # Should show index.html, static/, etc.
```

### Step 3: Environment Variables
In Vercel dashboard, add:
```
REACT_APP_API_URL = http://localhost:5001/api  (for testing)
```

### Step 4: Redeploy
1. Push any change to trigger new deployment
2. Or manually redeploy in Vercel dashboard

## 🎯 Common 404 Causes & Solutions

| Problem | Solution |
|---------|----------|
| **Root directory wrong** | Set to `frontend` in Vercel |
| **Missing index.html** | Check if `frontend/build/index.html` exists |
| **Routing issues** | Use `vercel.json` with rewrites |
| **Build fails** | Check build logs in Vercel dashboard |
| **Wrong branch** | Ensure deploying from `main` branch |

## 🆘 Emergency Deployment Options

### Option A: GitHub Pages (Static only)
```bash
npm install --save-dev gh-pages
# Add to package.json scripts:
"homepage": "https://KHNEATH.github.io/startwise",
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

### Option B: Surge.sh (Quick static deployment)
```bash
npm install -g surge
cd frontend
npm run build
cd build
surge
```

## � Debug Commands

Check if your app works locally:
```bash
cd "/Users/macbookpro/Downloads/Startwise 2"
npm run build
cd frontend/build
npx serve -s . -p 3000
# Visit http://localhost:3000
```

## 📞 Next Steps if Still Failing

1. **Try Netlify instead of Vercel**
2. **Deploy backend to Railway first**
3. **Use Railway for both frontend and backend**
4. **Check browser console for specific errors**

## ⚡ Quick Railway Deployment (Backup Plan)

1. Go to [railway.app](https://railway.app)
2. "Deploy from GitHub repo"
3. Select your `startwise` repository
4. Railway will create services for both frontend and backend
5. Add environment variables in Railway dashboard
6. Get your URLs and test!

Railway often works better for full-stack apps than separate deployments.