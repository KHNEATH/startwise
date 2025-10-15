# 🚀 StartWise Deployment Guide

## Quick Deploy to Vercel

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Import the `startwise` project

### Step 2: Set Environment Variables in Vercel Dashboard

Go to your project → Settings → Environment Variables and add:

#### For Development:
```
REACT_APP_API_URL = http://localhost:5001/api
```

#### For Production:
```
REACT_APP_API_URL = https://your-backend-service.railway.app/api
```

### Step 3: Deploy Backend Separately

#### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Deploy from the same GitHub repo
3. Railway will auto-detect your backend
4. Set these environment variables in Railway:

```
PORT = 5001
NODE_ENV = production
JWT_SECRET = startwise_super_secret_jwt_key_2024_admin_system
DB_HOST = (Railway will provide)
DB_USER = (Railway will provide) 
DB_PASSWORD = (Railway will provide)
DB_NAME = railway
```

#### Option B: Render
1. Create a new Web Service on render.com
2. Connect your GitHub repo
3. Set Root Directory to `backend`
4. Add the same environment variables

### Step 4: Update Frontend API URL
After backend is deployed:
1. Copy your backend URL (e.g., `https://startwise-backend.railway.app`)
2. Update Vercel environment variable:
   ```
   REACT_APP_API_URL = https://your-backend-url.railway.app/api
   ```
3. Redeploy frontend

### Step 5: Test Your Live App!
Your app will be available at:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.railway.app`

## ⚠️ Important Notes

1. **No Secrets Needed**: The vercel.json file doesn't reference any secrets anymore
2. **Environment Variables**: Set them directly in each platform's dashboard
3. **Database**: Railway/Render will provide database credentials automatically
4. **CORS**: Make sure your backend allows your frontend domain

## 🔧 Troubleshooting

- **"API URL not defined"**: Check REACT_APP_API_URL in Vercel dashboard
- **CORS errors**: Add your Vercel domain to backend CORS settings
- **Database connection**: Verify database credentials in backend platform

## 📱 Quick Test Commands

Test locally:
```bash
cd "/Users/macbookpro/Downloads/Startwise 2"
npm run dev
```

Test production build:
```bash
cd frontend
npm run build
npx serve -s build
```