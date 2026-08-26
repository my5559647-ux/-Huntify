# Backend Deployment Guide (Railway / Free Hosting)

## Summary of Changes Made

### 1. Node Version Compatibility ✅
- Added `"engines": { "node": ">=20.0.0" }` to `package.json`
- This ensures Railway uses Node 20+ during build

### 2. Puppeteer/Chromium Build Error Fix ✅
- Modified `leadController.ts` to support `PUPPETEER_EXECUTABLE_PATH` environment variable
- This allows using system Chrome on Railway instead of downloading bundled Chrome
- No automatic Chrome download during build (prevents zip extraction errors)

### 3. MongoDB Connection ✅
- Verified `MONGODB_URI` is properly handled in `db.ts`
- Fallback to localhost for development

### 4. Additional Files Created ✅
- `.gitignore` - excludes node_modules, dist, .env files
- `.env.example` - template for required environment variables

---

## Step-by-Step Deployment to Railway

### Prerequisites
1. **GitHub Repository**: Push your backend code to GitHub
2. **MongoDB Atlas Account**: Free tier account for database
3. **Railway Account**: Free tier account for hosting

---

### Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and create a new cluster (free tier)
3. Click "Connect" → "Connect your application"
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/huntify?retryWrites=true&w=majority
   ```
5. **Important**: Replace `username` and `password` with your actual database user credentials
6. In Network Access, allow IP `0.0.0.0/0` (allows all IPs for Railway)

---

### Step 2: Deploy to Railway

#### Option A: Using Railway CLI (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize Railway in your backend folder
cd backend
railway init

# Create a new project
railway create

# Add MongoDB service (optional - can use external Atlas)
railway add mongodb

# Deploy backend
railway up
```

#### Option B: Using Railway Dashboard (Easier)
1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your backend repository
4. Railway will auto-detect Node.js project
5. Click "Deploy"

---

### Step 3: Configure Environment Variables in Railway

After deployment, go to your Railway project dashboard and add these variables:

#### Required Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `5000` | Server port (Railway auto-sets this, but good to have) |
| `MONGODB_URI` | Your MongoDB Atlas connection string | Database connection |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/google-chrome` | Path to system Chrome on Railway (optional but recommended) |
| `NODE_ENV` | `production` | Environment mode |

**How to add in Railway:**
1. Go to your project → Settings → Variables
2. Click "New Variable"
3. Add each variable from the table above
4. Click "Save Changes"
5. Railway will automatically redeploy with new variables

---

### Step 4: Verify Deployment

1. Check Railway logs for any errors
2. Your backend URL will be: `https://your-project-name.railway.app`
3. Test the health endpoint: `https://your-project-name.railway.app/`
4. Should return: "Huntify Backend is Running Perfectly!"

---

### Step 5: Connect Frontend to Backend

#### Update Frontend Environment Variables

In your frontend project, update the backend URL:

**For Vercel deployment:**
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add variable: `NEXT_PUBLIC_API_URL`
3. Value: `https://your-project-name.railway.app`
4. Redeploy frontend

**For local development:**
Create `.env.local` in frontend folder:
```env
NEXT_PUBLIC_API_URL=https://your-project-name.railway.app
```

---

## Alternative Free Hosting Options

### Render.com
1. Create account at [Render.com](https://render.com)
2. New → Web Service → Connect GitHub repo
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add same environment variables as Railway
6. Render provides system Chrome at: `/usr/bin/chromium`

### Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. `fly launch` in backend folder
3. Configure `fly.toml` for Node.js
4. Add environment variables: `fly secrets set MONGODB_URI=...`
5. Deploy: `fly deploy`

---

## Troubleshooting

### Issue: "Node version mismatch"
**Solution**: Already fixed by adding `"engines": { "node": ">=20.0.0" }` in package.json

### Issue: "Failed to set up chrome... Extraction failed"
**Solution**: Already fixed by:
- Adding `PUPPETEER_EXECUTABLE_PATH` support in code
- Setting this variable to `/usr/bin/google-chrome` in Railway

### Issue: MongoDB connection timeout
**Solution**: 
- Ensure MongoDB Atlas allows IP `0.0.0.0/0`
- Check connection string format
- Verify database user has correct permissions

### Issue: Build fails on Railway
**Solution**:
- Check logs in Railway dashboard
- Ensure `package.json` has correct scripts
- Verify TypeScript compiles locally first: `npm run build`

---

## Complete Environment Variables Checklist

Copy this list and add to Railway/Render dashboard:

```
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/huntify?retryWrites=true&w=majority
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
NODE_ENV=production
```

---

## Testing After Deployment

Test these endpoints to verify everything works:

1. **Health Check**: `GET https://your-backend-url.com/`
2. **Scraping**: `POST https://your-backend-url.com/api/leads/scrape`
   ```json
   {
     "keyword": "restaurant",
     "location": "Lahore"
   }
   ```
3. **Auth**: `POST https://your-backend-url.com/api/auth/signup`
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

---

## Cost Summary

- **Railway**: Free tier ($5/month credit, sufficient for small projects)
- **MongoDB Atlas**: Free tier (512MB storage)
- **Total**: $0/month for development/small usage

---

## Next Steps

1. Push code changes to GitHub
2. Follow Railway deployment steps
3. Configure environment variables
4. Update frontend with new backend URL
5. Test full integration

Your backend is now ready for deployment! 🚀
