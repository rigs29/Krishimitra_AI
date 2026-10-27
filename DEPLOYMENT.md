# KrishiMitra AI - Deployment Guide

## Overview

This document provides instructions for deploying the **KrishiMitra AI** project on Vercel.

### Architecture

- **Frontend**: React + Vite + React Router (Single Page Application)
- **Backend**: Python FastAPI with mock data endpoints
- **ML Models**: TensorFlow-based disease detection (optional, for production deployment)

## Deployment Options

### Option 1: Frontend on Vercel, Backend Separately (RECOMMENDED)

Due to Vercel's Serverless Function limitations (50MB deployment size, 10s timeout, no persistent storage), the **recommended approach** is to:

1. **Deploy Frontend on Vercel** - Works perfectly with Vite
2. **Deploy Backend on a compatible service** - For full ML functionality:
   - [Render](https://render.com) - Easy Python deployment
   - [Railway](https://railway.app) - Good for Python APIs
   - [Fly.io](https://fly.io) - Supports Docker and large deployments
   - VPS (DigitalOcean, AWS, etc.) - Full control

### Option 2: Full Deployment on Vercel (LIMITED)

If you want to try deploying both frontend and backend on Vercel:
- Frontend will work fully
- Backend will work **only with mock data** (no TensorFlow/ML models)
- Model-based disease detection will be disabled
- All other features (weather, market, chat) work with mock data

---

## Frontend Deployment on Vercel

### Prerequisites

- Vercel account and CLI installed
- Node.js 18+ (for local testing)

### Configuration Files Created

1. **`frontend/vercel.json`** - SPA rewrite configuration
2. **`frontend/.env.example`** - Environment variable template
3. **`vercel.json`** (root) - Project-level configuration

### Steps

#### 1. Set Up Environment Variables

Create a `.env` file in the frontend directory:

```bash
cd frontend
cp .env.example .env
```

Edit `.env` and set the backend URL:

```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

For local development, use:
```
VITE_API_URL=http://localhost:8000/api
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Test Locally

```bash
npm run dev
```

Visit `http://localhost:5173` to test the frontend.

#### 4. Build for Production

```bash
npm run build
```

This creates a `dist/` directory with optimized production files.

#### 5. Deploy to Vercel

**Using Vercel CLI:**

```bash
# From the frontend directory
cd frontend
vercel
```

Follow the prompts. When asked:
- Project name: `krishimitra-frontend` (or any name)
- Framework preset: `Vite`
- Build command: `npm run build` (already configured)
- Output directory: `dist` (already configured)
- Install command: `npm install` (already configured)

**Using Vercel Dashboard:**

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select `frontend` as the root directory
5. Framework preset: `Vite`
6. Configure as above
7. Add environment variable: `VITE_API_URL` = your backend URL

#### 6. Configure Rewrites (if needed)

The `frontend/vercel.json` already includes SPA rewrite configuration:
- All routes (`/.*`) are rewritten to `/index.html`
- This ensures React Router handles client-side navigation

---

## Backend Deployment

### Option A: Deploy on Render (RECOMMENDED)

#### Steps

1. **Create a new Web Service on Render**
   - Go to [https://dashboard.render.com](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Connect your GitHub repository**
   - Select the `backend` directory
   - Name: `krishimitra-backend`

3. **Configure the service:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 8000`
   - **Python Version:** 3.11 (recommended)
   - **Region:** Choose closest to your users

4. **Add Environment Variables:**
   - `APP_NAME` = `KrishiMitra AI`
   - `ENVIRONMENT` = `production`
   - `SECRET_KEY` = (generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
   - `CORS_ORIGINS` = `https://your-frontend.vercel.app` (your frontend URL)

5. **Deploy**
   - Render will build and deploy your backend
   - Once deployed, update your frontend's `VITE_API_URL` to point to this backend

6. **Update CORS (Important!)**
   Edit `backend/app/main.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-frontend.vercel.app"],  # Replace with your frontend URL
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

#### Adding ML Models to Render

If you have trained ML model files (`model.h5` and `labels.json`):

1. Create directory: `backend/app/ml/models/plant_disease_model/`
2. Upload your model files
3. Update `backend/app/ml/predictor.py` to use the correct paths
4. Install full requirements: `pip install -r requirements.txt`

### Option B: Deploy on Vercel (Mock Data Only)

#### Steps

1. **Install mangum** (ASGI adapter for Vercel):
   ```bash
   pip install mangum
   ```

2. **Create `backend/requirements-vercel.txt`** with minimal dependencies:
   ```
   fastapi==0.104.1
   uvicorn==0.24.0
   python-multipart==0.0.6
   mangum==0.19.0
   ```

3. **Deploy using Vercel CLI:**
   ```bash
   cd backend
   vercel --name krishimitra-backend
   ```

4. **Or use Vercel Dashboard:**
   - Create a new project
   - Select `backend` as root directory
   - Framework: `Other`
   - Build command: `pip install -r requirements-vercel.txt`
   - Output directory: (leave empty)

#### Limitations on Vercel

- **No ML Models**: TensorFlow and model files exceed 50MB limit
- **No File Uploads**: Temporary files can't be stored
- **Cold Starts**: First request may be slow
- **Timeout**: Max 10 seconds execution
- **Disease Detection**: Will use mock data only
- **Weather/Market/Chat**: Will use mock data

---

## Vercel Dashboard Settings

### Frontend Project Settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Install Command** | `npm install` |
| **Output Directory** | `dist` |
| **Environment Variables** | `VITE_API_URL=https://your-backend-url/api` |

### Backend Project Settings (if deploying on Vercel)

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Framework Preset** | Other / Python |
| **Build Command** | `pip install -r requirements-vercel.txt` |
| **Output Directory** | (empty) |
| **Environment Variables** | See below |

---

## Environment Variables

### Frontend (Vite)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ Yes | Backend API base URL | `https://your-backend.vercel.app/api` |

**Note**: Vite only exposes variables prefixed with `VITE_` to the client-side code.

### Backend (FastAPI)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `APP_NAME` | ❌ No | Application name | `KrishiMitra AI` |
| `ENVIRONMENT` | ❌ No | Environment type | `production` |
| `VERSION` | ❌ No | App version | `1.0.0` |
| `DEBUG` | ❌ No | Debug mode | `false` |
| `SECRET_KEY` | ✅ Yes | JWT secret key | `your-secure-random-key` |
| `ALGORITHM` | ❌ No | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ❌ No | Token expiry | `30` |
| `CORS_ORIGINS` | ❌ No | Allowed origins (comma-separated) | `https://your-frontend.vercel.app` |
| `ENABLE_DISEASE_DETECTION` | ❌ No | Enable disease detection | `true` |
| `ENABLE_WEATHER` | ❌ No | Enable weather API | `true` |
| `ENABLE_MARKET` | ❌ No | Enable market API | `true` |
| `ENABLE_CHAT` | ❌ No | Enable chat API | `true` |

---

## Post-Deployment Checklist

### Frontend

- [ ] Visit your deployed frontend URL
- [ ] Test all routes (Home, Disease Detection, Weather, Market, AI Advisor)
- [ ] Test direct navigation (refresh on `/disease-detection`, `/weather`, etc.)
- [ ] Verify API calls are going to the correct backend URL
- [ ] Test authentication flow (login, register, profile)

### Backend

- [ ] Test health endpoint: `GET /` and `GET /health`
- [ ] Test API endpoints:
  - `GET /api/disease`
  - `GET /api/weather`
  - `GET /api/market`
  - `GET /api/chat`
- [ ] Test POST endpoints with appropriate data
- [ ] Verify CORS headers are correct

---

## Troubleshooting

### Frontend Build Fails

```bash
# Clean and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Backend Import Errors

```bash
# Install all dependencies
pip install -r requirements.txt
# Or for Vercel:
pip install -r requirements-vercel.txt
```

### CORS Issues

```
Error: Network Error
```

**Solution:**
1. Verify `VITE_API_URL` is correct in frontend
2. Check backend CORS configuration
3. Ensure backend URL is accessible
4. Test with curl: `curl https://your-backend.vercel.app/api/health`

### 404 on Page Refresh

**Solution:**
1. Verify `frontend/vercel.json` has the rewrite rule
2. Ensure it points to `/index.html`
3. Re-deploy the frontend

### Backend Timeout on Vercel

**Solution:**
- The backend is likely too slow or hitting the 10s timeout
- Deploy backend on a service with longer timeout (Render, Railway, etc.)
- Remove heavy dependencies (TensorFlow) if deploying on Vercel

---

## Files Modified/Created

### Modified Files

1. **`backend/app/main.py`** - Added CORS documentation comments

### New Files Created

1. **`frontend/vercel.json`** - Vercel configuration for frontend
2. **`frontend/.env.example`** - Frontend environment variable template
3. **`vercel.json`** (root) - Project-level Vercel configuration
4. **`backend/vercel.json`** - Vercel configuration for backend
5. **`backend/vercel_handler.py`** - Vercel Serverless Function handler
6. **`backend/requirements-vercel.txt`** - Minimal dependencies for Vercel
7. **`.env.example`** (root) - Root environment variable template
8. **`DEPLOYMENT.md`** - This deployment guide

---

## Git Commands

After making changes, commit and push to GitHub:

```bash
# Add all new/modified files
git add frontend/vercel.json frontend/.env.example vercel.json \
      backend/vercel.json backend/vercel_handler.py \
      backend/requirements-vercel.txt .env.example DEPLOYMENT.md

# Commit changes
git commit -m "Add Vercel deployment configuration

- Add frontend/vercel.json with SPA rewrite rules
- Add backend/vercel.json for Serverless Functions
- Add vercel_handler.py for FastAPI on Vercel
- Add environment variable templates
- Update CORS configuration
- Add deployment documentation

Generated by Mistral Vibe.
Co-Authored-By: Mistral Vibe <vibe@mistral.ai>"

# Push to GitHub
git push origin main
```

---

## Recommendations

1. **For Production**: Deploy backend on Render/Railway/Fly.io with full ML models
2. **For Development**: Use local backend with `uvicorn main:app --reload`
3. **For Testing**: Try backend on Vercel with mock data only
4. **Monitor**: Set up monitoring for backend health endpoint
5. **Update**: Keep `.env.example` files updated with all required variables

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Vite Documentation](https://vitejs.dev)
- [Render Python Deployment](https://render.com/docs/deploy-python)
- [TensorFlow Model Size](https://www.tensorflow.org/guide/keras/save_load)

---

## Support

For issues or questions:
- Check this deployment guide
- Review the troubleshooting section
- Verify all configuration files
- Ensure environment variables are set correctly
