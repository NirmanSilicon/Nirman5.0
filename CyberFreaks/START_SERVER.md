# Quick Start Guide - AI Assistant

## The Issue
If you see "Failed to load conversations" error, the backend server is not running.

## Solution: Start the Backend Server

### Step 1: Open Terminal in Server Directory
```bash
cd server
```

### Step 2: Install Dependencies (if not done)
```bash
npm install
```

### Step 3: Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

You should see:
```
🚀 Starting CYBER-NOVA backend...
📦 Connecting to database...
🌱 Seeding database...
✅ CYBER-NOVA backend ready on http://localhost:4000
```

### Step 4: Verify Server is Running
Open another terminal and test:
```bash
curl http://localhost:4000/api/health
```

You should get: `{"status":"ok","service":"CYBER-NOVA API"}`

## For Local LLM (Ollama) - Optional

If you want to use the local LLM instead of getting error messages:

1. **Install Ollama**: https://ollama.ai
2. **Download a model**:
   ```bash
   ollama pull llama3.2
   ```
3. **Verify Ollama is running**:
   ```bash
   curl http://localhost:11434/api/tags
   ```

The assistant will work even without Ollama, but will show setup instructions if you try to send a message.

## Troubleshooting

### Port 4000 already in use
Change the port in `server/.env`:
```env
PORT=4001
```

### Database connection errors
- If using in-memory DB (default), it's automatic
- If using external MongoDB, set `MONGODB_URI` in `.env`

### Frontend can't connect
- Make sure backend is running on port 4000
- Check `VITE_API_URL` in frontend `.env` if using custom port
- Check browser console for CORS errors

