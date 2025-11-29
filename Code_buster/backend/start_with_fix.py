#!/usr/bin/env python3
"""
Startup script with comprehensive Python 3.14 compatibility fix
"""

import sys

# Apply comprehensive fix
print("Applying comprehensive Python 3.14 compatibility fix...")
try:
    import comprehensive_fix
except ImportError:
    # Fallback if import fails (e.g. if not in path), though it should be
    sys.path.append('.')
    import comprehensive_fix

# Start uvicorn
print("Starting FastAPI server with compatibility fix...")
try:
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
except Exception as e:
    print(f"Error starting server: {e}")
    sys.exit(1)
