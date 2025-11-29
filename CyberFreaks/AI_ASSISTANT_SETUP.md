# AI Assistant Setup Guide

This guide will help you set up a fully functional AI assistant for your CYBER-NOVA website.

## 🚀 Quick Setup (Automated)

### Windows:
1. **Double-click** `setup-ai-assistant.bat`
   OR
2. **Right-click** `setup-ai-assistant.ps1` → "Run with PowerShell"

The script will:
- ✅ Check if Ollama is installed
- ✅ Install Ollama if needed (with download link)
- ✅ Start Ollama service
- ✅ Download the LLM model (llama3.2)
- ✅ Configure your environment
- ✅ Test the setup

## 📋 Manual Setup

### Step 1: Install Ollama

1. Visit: **https://ollama.ai/download**
2. Download Ollama for Windows
3. Run the installer
4. Ollama will start automatically

### Step 2: Download the Model

Open a terminal and run:
```bash
ollama pull llama3.2
```

This downloads a ~2GB model. It may take 5-15 minutes depending on your internet speed.

**Alternative models** (smaller/faster):
```bash
ollama pull llama3.2:1b    # Very small, fast (1GB)
ollama pull mistral        # Good balance (4GB)
ollama pull codellama      # Code-focused (3.8GB)
```

### Step 3: Configure Environment

Create or update `server/.env`:
```env
# Local LLM Configuration
LLM_API_URL=http://localhost:11434
LLM_MODEL=llama3.2
LLM_TIMEOUT=60000
```

### Step 4: Verify Setup

Test if Ollama is working:
```bash
curl http://localhost:11434/api/tags
```

You should see a JSON response with your models.

Test the model:
```bash
ollama run llama3.2 "Hello, how are you?"
```

## 🎯 Using the AI Assistant

### Start Your Servers

1. **Backend** (Terminal 1):
   ```bash
   cd server
   npm run dev
   ```

2. **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Browser**: http://localhost:5173

### Use the Assistant

1. Click **"Assistant"** in the sidebar
2. You'll see a welcome message from the AI
3. Type a message and click **"Send"**
4. The AI will respond using your local LLM!

## 🔧 Troubleshooting

### "Local LLM service unavailable"

**Problem**: Ollama is not running

**Solution**:
1. Check if Ollama is running: `curl http://localhost:11434/api/tags`
2. Start Ollama from Start menu or system tray
3. Or run: `ollama serve` in a terminal

### "Model not found"

**Problem**: The model isn't downloaded

**Solution**:
```bash
ollama pull llama3.2
```

### Slow Responses

**Problem**: Model is too large or system is slow

**Solutions**:
1. Use a smaller model: `ollama pull llama3.2:1b`
2. Update `LLM_MODEL` in `server/.env` to `llama3.2:1b`
3. Increase timeout: `LLM_TIMEOUT=120000` (2 minutes)

### Port 11434 Already in Use

**Problem**: Another Ollama instance is running

**Solution**:
1. Close other Ollama instances
2. Or change port in Ollama settings
3. Update `LLM_API_URL` in `.env` to match

### Connection Refused

**Problem**: Ollama service isn't accessible

**Solution**:
1. Check Windows Firewall settings
2. Ensure Ollama is running: Check system tray
3. Restart Ollama service

## 📊 Model Comparison

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| llama3.2:1b | ~1GB | ⚡⚡⚡ Fast | ⭐⭐ Good | Quick responses |
| llama3.2 | ~2GB | ⚡⚡ Medium | ⭐⭐⭐ Very Good | **Recommended** |
| mistral | ~4GB | ⚡ Slow | ⭐⭐⭐⭐ Excellent | Best quality |
| codellama | ~3.8GB | ⚡ Slow | ⭐⭐⭐⭐ Excellent | Code-focused |

**Recommendation**: Start with `llama3.2` for the best balance.

## 🎓 Training the Assistant

The assistant is already "trained" with:
- ✅ Cybersecurity context (alerts, devices, networks)
- ✅ System prompts for CYBER-NOVA
- ✅ Conversation history awareness
- ✅ Context loading from your data

### Customizing the Assistant

Edit `server/src/services/assistantService.js`:

1. **Change the system prompt** (line ~11-27):
   ```javascript
   function buildSystemPrompt({ tone, context }) {
     // Modify the prompt here
   }
   ```

2. **Adjust model parameters** (line ~83-86):
   ```javascript
   options: {
     temperature: 0.7,  // Creativity (0-1)
     top_p: 0.9,        // Diversity
   }
   ```

3. **Change context loading** (line ~29-57):
   ```javascript
   async function loadContext() {
     // Modify what data is included
   }
   ```

## 🔒 Privacy & Security

✅ **All processing is local** - No data sent to external services
✅ **No API keys needed** - Completely free
✅ **Offline capable** - Works without internet
✅ **Your data stays private** - Everything runs on your machine

## 📈 Performance Tips

1. **Use smaller models** for faster responses
2. **Close other applications** to free up RAM
3. **Use SSD** for faster model loading
4. **Increase timeout** for slower systems: `LLM_TIMEOUT=120000`
5. **Limit conversation history** in `assistantService.js` (currently 10 messages)

## 🆘 Getting Help

If you encounter issues:

1. Check the browser console (F12) for errors
2. Check backend terminal for error messages
3. Verify Ollama is running: `curl http://localhost:11434/api/tags`
4. Test the model directly: `ollama run llama3.2 "test"`
5. Check `server/.env` configuration

## ✅ Verification Checklist

- [ ] Ollama installed and running
- [ ] Model downloaded (`ollama list` shows your model)
- [ ] `server/.env` configured with LLM settings
- [ ] Backend server running (`npm run dev` in server/)
- [ ] Frontend server running (`npm run dev` in frontend/)
- [ ] Can access http://localhost:5173
- [ ] Assistant shows welcome message
- [ ] Can send and receive messages

Once all checked, your AI assistant is ready! 🎉

