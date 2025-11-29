#!/usr/bin/env python3
"""
Startup script for the FastAPI server
"""

if __name__ == "__main__":
    print("🚀 Starting FastAPI server...")
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
