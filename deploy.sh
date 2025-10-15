#!/bin/bash

# StartWise Emergency Deployment Script
echo "🚀 StartWise Emergency Deployment"
echo "=================================="

# Test local build first
echo "1. Testing local build..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
else
    echo "❌ Local build failed. Fix errors first."
    exit 1
fi

echo ""
echo "2. Build successful! Choose deployment option:"
echo ""
echo "   A) Fix Vercel (if you want to keep using Vercel)"
echo "   B) Deploy to Railway (recommended for full-stack)"
echo "   C) Deploy to Netlify (good for frontend)"
echo ""
echo "For option A: Check EMERGENCY_FIX.md for Vercel settings"
echo "For option B: Go to railway.app and deploy from GitHub"
echo "For option C: Go to netlify.com and deploy from GitHub"
echo ""
echo "✅ Your app is ready to deploy!"

# Optional: Serve locally for testing
echo ""
echo "🧪 Want to test locally first? Run:"
echo "   npx serve -s build -p 3000"
echo "   Then visit http://localhost:3000"