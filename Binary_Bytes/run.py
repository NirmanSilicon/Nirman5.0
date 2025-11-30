
import subprocess
import sys
import os
import signal
from pathlib import Path

processes = []

def cleanup():
    """Stop all running processes"""
    print("\n\nStopping servers...")
    for process in processes:
        try:
            process.terminate()
        except:
            pass
    sys.exit(0)

def main():
    signal.signal(signal.SIGINT, lambda s, f: cleanup())
    
    root_dir = Path(__file__).parent
    backend_dir = root_dir / "BACKEND" / "backend2"
    
    print("=" * 50)
    print("Starting Development Servers")
    print("=" * 50)
    print("\nBackend:  http://localhost:3001")
    print("Frontend: http://localhost:3000")
    print("\nPress Ctrl+C to stop all servers\n")
    print("-" * 50)
    print()
    
    # backend
    if backend_dir.exists():
        print("[BACKEND] Starting...")
        backend = subprocess.Popen(
            ["npm", "run", "dev"],
            cwd=str(backend_dir),
            shell=True if os.name == 'nt' else False
        )
        processes.append(backend)
    # frontend
    print("[FRONTEND] Starting...")
    frontend = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=str(root_dir),
        shell=True if os.name == 'nt' else False
    )
    processes.append(frontend)
    
   
    try:
        for process in processes:
            process.wait()
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()

