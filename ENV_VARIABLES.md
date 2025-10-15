# 🔑 StartWise Environment Variables (Copy-Paste Ready)

## Backend Environment Variables
Copy these into Vercel Backend Project → Settings → Environment Variables:

```
NODE_ENV=production
DB_PORT=3306
JWT_SECRET=startwise_super_secure_jwt_production_key_2024_admin_system
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0
DB_TIMEOUT=60000
```

## Frontend Environment Variables
Copy these into Vercel Frontend Project → Settings → Environment Variables:

```
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
GENERATE_SOURCEMAP=false
```

## Database Variables (Fill after setting up PlanetScale)
Add these to Backend after getting PlanetScale connection details:

```
DB_HOST=<replace-with-planetscale-host>
DB_USER=<replace-with-planetscale-username>
DB_PASSWORD=<replace-with-planetscale-password>
DB_NAME=startwise_db
```

## URL Variables (Fill after deployment)
Add these after both projects are deployed:

### To Backend:
```
FRONTEND_URL=<replace-with-frontend-vercel-url>
```

### To Frontend:
```
REACT_APP_API_URL=<replace-with-backend-vercel-url>
```

## Example of Final URLs:
```
FRONTEND_URL=https://startwise-frontend-abc123.vercel.app
REACT_APP_API_URL=https://startwise-backend-def456.vercel.app
```

## 📋 Deployment Order:
1. Deploy Backend (get backend URL)
2. Deploy Frontend (get frontend URL)  
3. Set up PlanetScale database (get DB credentials)
4. Add all environment variables
5. Redeploy both projects
6. Initialize database
7. Test application

## 🎯 Ready to Start?
Go to https://vercel.com/dashboard and click "New Project" to begin!