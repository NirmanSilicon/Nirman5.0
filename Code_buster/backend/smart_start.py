#!/usr/bin/env python3
"""
Smart startup script that tries multiple approaches to start the server
"""

import sys
import subprocess
import os

def try_approach_1():
    """Try with Python 3.12 environment"""
    print("🔄 Approach 1: Trying Python 3.12 environment...")
    try:
        if os.path.exists("venv_py312\\Scripts\\uvicorn.exe"):
            subprocess.run([
                "venv_py312\\Scripts\\uvicorn.exe", 
                "app.main:app", 
                "--reload", 
                "--host", "0.0.0.0", 
                "--port", "8000"
            ], check=True)
            return True
    except:
        pass
    return False

def try_approach_2():
    """Try with comprehensive fix"""
    print("🔄 Approach 2: Trying comprehensive fix...")
    try:
        subprocess.run([sys.executable, "comprehensive_fix.py"], check=True)
        import uvicorn
        uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
        return True
    except:
        pass
    return False

def try_approach_3():
    """Try with newer libraries"""
    print("🔄 Approach 3: Trying with newer libraries...")
    try:
        # Install newer requirements
        subprocess.run([
            sys.executable, "-m", "pip", "install", 
            "--upgrade", "fastapi>=0.115.0", "uvicorn>=0.32.0", "pydantic>=2.10.0"
        ], check=True)
        
        import uvicorn
        uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
        return True
    except:
        pass
    return False

def main():
    print("🚀 Smart Server Startup - Trying multiple approaches...")
    print("=" * 50)
    
    approaches = [
        ("Python 3.12 Environment", try_approach_1),
        ("Comprehensive Fix", try_approach_2), 
        ("Newer Libraries", try_approach_3)
    ]
    
    for name, try_func in approaches:
        print(f"\n🔄 Trying: {name}")
        try:
            if try_func():
                print(f"✅ Success with {name}!")
                return
        except Exception as e:
            print(f"❌ {name} failed: {e}")
    
    print("\n❌ All approaches failed!")
    print("Please consider:")
    print("1. Using Python 3.12 or 3.13 instead of 3.14")
    print("2. Waiting for library updates to support Python 3.14")
    print("3. Using Docker with a compatible Python version")

if __name__ == "__main__":
    main()
