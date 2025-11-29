# Fix: Website Not Opening

## The Problem
The website won't open because **both servers are not running**.

## Quick Fix

### Option 1: Use the Batch File (Easiest)
**Double-click:** `start-all.bat` in the project root

This will start both servers automatically in separate windows.

### Option 2: Manual Start (2 Terminals)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## What You Should See

### Backend Terminal:
```
🚀 Starting CYBER-NOVA backend...
📦 Connecting to database...
🌱 Seeding database...
✅ CYBER-NOVA backend ready on http://localhost:4000
```

### Frontend Terminal:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Open Your Browser

Once both servers show "ready", open:
**http://localhost:5173**

## Verify Servers Are Running

### Check Backend:
```bash
curl http://localhost:4000/api/health
```
Should return: `{"status":"ok","service":"CYBER-NOVA API"}`

### Check Frontend:
Just open http://localhost:5173 in your browser

## Common Issues

### Port Already in Use
**Error:** "Port 4000 (or 5173) is already in use"

**Solution:**
1. Find what's using the port:
   ```bash
   netstat -ano | findstr ":4000"
   netstat -ano | findstr ":5173"
   ```
2. Close that application
3. Or change ports in `.env` files

### "Cannot find module" Error
**Solution:**
```bash
cd server
npm install

cd ../frontend
npm install
```

### Backend Won't Start
**Check:**
- Node.js is installed: `node --version`
- Dependencies installed: `npm install` in server folder
- No syntax errors in code
- Check terminal for error messages

### Frontend Won't Start
**Check:**
- Node.js is installed
- Dependencies installed: `npm install` in frontend folder
- Port 5173 is available
- Check terminal for error messages

### Website Opens But Shows Errors
**Check:**
1. Backend is running on port 4000
2. Frontend can reach backend (check browser console F12)
3. CORS is enabled in backend
4. API URL is correct in frontend

## Step-by-Step Troubleshooting

1. **Check if servers are running:**
   ```bash
   # Backend
   curl http://localhost:4000/api/health
   
   # Frontend
   # Just try opening http://localhost:5173
   ```

2. **If not running, start them:**
   - Use `start-all.bat`
   - Or start manually in 2 terminals

3. **Wait for "ready" messages:**
   - Backend: "✅ CYBER-NOVA backend ready"
   - Frontend: "➜  Local:   http://localhost:5173/"

4. **Open browser:**
   - Go to http://localhost:5173
   - Should see the CYBER-NOVA dashboard

5. **If still not working:**
   - Check browser console (F12) for errors
   - Check both server terminals for errors
   - Verify ports are not blocked by firewall

## Success Indicators

✅ Backend terminal shows "ready on http://localhost:4000"
✅ Frontend terminal shows "Local: http://localhost:5173/"
✅ Browser opens http://localhost:5173 successfully
✅ You see the CYBER-NOVA dashboard
✅ No errors in browser console (F12)

## Quick Start Commands

**All in one:**
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2 (new terminal)
cd frontend && npm run dev

# Then open: http://localhost:5173
```

## Still Having Issues?

1. **Check Node.js version:**
   ```bash
   node --version  # Should be v16+ or v18+
   ```

2. **Reinstall dependencies:**
   ```bash
   cd server
   rm -rf node_modules package-lock.json
   npm install
   
   cd ../frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check for port conflicts:**
   ```bash
   netstat -ano | findstr ":4000 :5173"
   ```

4. **Restart everything:**
   - Close all terminals
   - Close browser
   - Start servers again
   - Open browser fresh

---

**The website should open once both servers are running!** 🚀

