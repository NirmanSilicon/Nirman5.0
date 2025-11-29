# Fix "Failed to Load Conversations" Error

## The Problem
You're seeing "Failed to load conversations. Please try refreshing the page."

This means the **backend server is not running** or not accessible.

## Quick Fix

### Step 1: Start the Backend Server

Open a terminal and run:
```bash
cd server
npm run dev
```

**Wait for this message:**
```
✅ CYBER-NOVA backend ready on http://localhost:4000
```

### Step 2: Verify It's Working

In another terminal, test the connection:
```bash
curl http://localhost:4000/api/health
```

You should see: `{"status":"ok","service":"CYBER-NOVA API"}`

### Step 3: Refresh Your Browser

Go to http://localhost:5173 and refresh the page (F5).

The error should be gone!

## Automated Test

Run this to test everything:
```bash
powershell -ExecutionPolicy Bypass -File test-assistant.ps1
```

This will:
- ✅ Check if backend is running
- ✅ Test assistant service
- ✅ Create a test conversation
- ✅ Send a test message

## Common Issues

### Port 4000 Already in Use
**Solution:** Close the other application or change port in `server/.env`:
```env
PORT=4001
```

### "Cannot find module" Error
**Solution:** Install dependencies:
```bash
cd server
npm install
```

### Backend Starts But Still Shows Error
**Solution:** 
1. Check browser console (F12) for errors
2. Verify CORS is enabled in backend
3. Make sure frontend is pointing to correct API URL

### Database Connection Error
**Solution:** 
- If using in-memory DB (default), it's automatic
- If using external MongoDB, check connection string in `.env`

## Verify Everything Works

1. **Backend running:** `http://localhost:4000/api/health` returns OK
2. **Frontend running:** `http://localhost:5173` loads
3. **Assistant accessible:** Can see conversations (or "No conversations yet")
4. **Can send messages:** Type a message and get a response

## Still Having Issues?

1. Check backend terminal for error messages
2. Check browser console (F12) for errors
3. Verify both servers are running:
   - Backend: Port 4000
   - Frontend: Port 5173
4. Try restarting both servers

## Success Indicators

✅ No red error messages
✅ Can see "No conversations yet" or conversation list
✅ Can type in the input field
✅ Can click "Send" button
✅ Get responses from assistant

Once you see these, your assistant is working! 🎉

