# Deploying to GitHub Pages

## ⚠️ Important Limitations

GitHub Pages only supports **static HTML/CSS/JavaScript**. Your UniXplore app will have these limitations:

- ❌ **No Authentication** - Login/Register won't work
- ❌ **No Database** - Cannot connect to PostgreSQL
- ❌ **No API Routes** - All `/api/*` endpoints will fail
- ❌ **No Admin Features** - Cannot edit colleges/clubs
- ✅ **Public Browsing Only** - Can view static college/club pages

## Deployment Steps

### 1. Push Changes to GitHub

All configuration is ready. The changes will be committed and pushed automatically.

### 2. Enable GitHub Pages

1. Go to your repository: https://github.com/FOX-KNIGHT/hack
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
4. Save the settings

### 3. Automatic Deployment

The GitHub Actions workflow will automatically:
- Build your Next.js app as static HTML
- Deploy to GitHub Pages
- Your site will be available at: `https://fox-knight.github.io/hack/`

### 4. Monitor Deployment

1. Go to **Actions** tab in your repository
2. Watch the "Deploy to GitHub Pages" workflow
3. Once complete (green checkmark), visit your site

## What Works

- ✅ Home page
- ✅ Browse colleges (static list)
- ✅ Browse clubs (static list)
- ✅ View college/club details (if pre-generated)

## What Doesn't Work

- ❌ User registration/login
- ❌ Admin dashboard
- ❌ Dynamic data from database
- ❌ Search functionality (if it uses API)
- ❌ Any form submissions

## Alternative: Full-Featured Deployment

If you need all features (auth, database, admin), you must use a platform that supports server-side code:
- **Vercel** (recommended for Next.js)
- **Railway**
- **Render**
- **Netlify** (with serverless functions)

These platforms are free and provide the full functionality of your app.
