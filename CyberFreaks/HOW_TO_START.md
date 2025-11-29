# How to Start the Website

## Quick Start (Easiest Method)

### Option 1: Use the Batch File (Windows)
Double-click `start-all.bat` in the root folder. This will start both servers automatically.

### Option 2: Use PowerShell Script
Right-click `start-all.ps1` → "Run with PowerShell"

### Option 3: Manual Start (Two Terminals)

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

Once both servers are running, open:
**http://localhost:5173**

## Troubleshooting

### Port Already in Use
If you see "port already in use":
- **Port 4000 (Backend)**: Another process is using it. Close it or change port in `server/.env`
- **Port 5173 (Frontend)**: Vite will automatically use the next available port

### "Cannot find module" errors
Run in both directories:
```bash
cd server
npm install

cd ../frontend
npm install
```

### Backend won't start
- Check if MongoDB is needed (in-memory DB is default)
- Check `server/.env` for configuration
- Look at error messages in terminal

### Frontend shows "Failed to load conversations"
- Make sure backend is running on port 4000
- Check browser console (F12) for errors
- Verify `http://localhost:4000/api/health` works

## Verify Everything Works

1. **Backend Health Check:**
   ```bash
   curl http://localhost:4000/api/health
   ```
   Should return: `{"status":"ok","service":"CYBER-NOVA API"}`

2. **Open Browser:**
   - Go to http://localhost:5173
   - You should see the CYBER-NOVA dashboard
   - Click on "Assistant" in the sidebar
   - Try sending a message

## Stopping the Servers

- **If using start-all.bat**: Close the command windows
- **If using manual start**: Press `Ctrl+C` in each terminal
- **If using start-all.ps1**: Close the PowerShell windows

