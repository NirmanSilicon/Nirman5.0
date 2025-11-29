# Deploy UniXplore to Vercel

## Quick Start

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Find and select `FOX-KNIGHT/hack` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `unixplore`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_secret_key_here
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app/hack
   ```
   
   > **Note**: Get your PostgreSQL connection string from your database provider (e.g., Neon, Supabase, Railway)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `https://your-app.vercel.app/hack`

## Automatic Deployments

Once set up, Vercel will automatically deploy:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

## Database Setup

If you don't have a PostgreSQL database yet:

1. **Option 1: Neon (Recommended)**
   - Go to [neon.tech](https://neon.tech)
   - Create free account
   - Create new project
   - Copy connection string
   - Add to Vercel environment variables

2. **Option 2: Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Create free account
   - Create new project
   - Go to Settings → Database
   - Copy connection string (use "Connection pooling" mode)
   - Add to Vercel environment variables

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure `DATABASE_URL` is accessible from Vercel

### 404 Errors
- Remember the app is at `/hack` path
- Access at `https://your-app.vercel.app/hack` not just `/`

### Database Connection Issues
- Ensure database allows connections from Vercel IPs
- Use connection pooling for serverless environments

## Local Development

The app is already configured for local development:

```bash
npm run dev
```

Access at: `http://localhost:3000/hack`

## Configuration Files

- ✅ `vercel.json` - Vercel configuration (already set up)
- ✅ `next.config.js` - Next.js config (updated for Vercel)
- ✅ Environment variables configured in `vercel.json`

## What Changed

- Removed `output: 'export'` from `next.config.js` (incompatible with API routes)
- Kept `basePath: '/hack'` for proper routing
- Vercel configuration already existed with environment variables

You're all set! Just follow the steps above to deploy.
