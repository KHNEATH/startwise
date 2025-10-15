# Railway Deployment Guide for StartWise

## Quick Deploy to Railway

### Step 1: Prepare for Deployment
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your `startwise` repository

### Step 2: Configure Services
Railway will create two services:
- **Frontend Service** (React app)
- **Backend Service** (Node.js API)

### Step 3: Environment Variables

#### Backend Service Environment Variables:
```
PORT=5001
JWT_SECRET=startwise_super_secret_jwt_key_2024_admin_system
DB_HOST=mysql.railway.internal
DB_USER=root
DB_PASSWORD=your-railway-mysql-password
DB_NAME=railway
DB_PORT=3306
NODE_ENV=production
```

#### Frontend Service Environment Variables:
```
REACT_APP_API_URL=https://your-backend-service.railway.app/api
```

### Step 4: Database Setup
1. Add MySQL plugin in Railway dashboard
2. Copy the database credentials to your backend environment variables
3. Run your database setup scripts

### Step 5: Build Configuration

#### Backend (package.json):
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "npm install"
  }
}
```

#### Frontend (package.json):
```json
{
  "scripts": {
    "build": "react-scripts build",
    "start": "serve -s build"
  }
}
```

### Step 6: Deploy
1. Push to main branch
2. Railway will auto-deploy both services
3. Get your frontend URL and share your app!

## Alternative: Manual Deploy

If you prefer step-by-step control, use Vercel + Render:

### Frontend (Vercel):
1. Connect GitHub repo to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/build`
4. Add environment variable: `REACT_APP_API_URL`

### Backend (Render):
1. Connect GitHub repo to Render
2. Create new Web Service
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add all your environment variables

## Cost Comparison:
- **Railway**: Free tier → $5/month
- **Vercel + Render**: Free tier → $7-10/month
- **Netlify + Railway**: Free tier → $5/month

## Recommendation:
Start with **Railway** for simplicity, then scale as needed!