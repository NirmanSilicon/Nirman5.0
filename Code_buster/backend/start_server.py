#!/usr/bin/env python3
"""
Startup script that patches typing_extensions and starts the server
"""

import sys
import subprocess

# First apply the typing_extensions patch
print("🔧 Applying typing_extensions patch...")
subprocess.run([sys.executable, "fix_typing_extensions.py"], check=True)

# Then start uvicorn
print("🚀 Starting FastAPI server...")
import uvicorn
uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
