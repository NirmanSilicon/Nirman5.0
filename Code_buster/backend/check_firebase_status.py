import sys
import os
sys.path.append(os.getcwd())
try:
    from app.services.firebase_service import firebase_service
    print(f"Firebase Enabled: {firebase_service.enabled}")
    if not firebase_service.enabled:
        print("Firebase is disabled. Checking why...")
        cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
        if os.path.exists(cred_path):
            print(f"Credentials file found at {cred_path}")
            try:
                with open(cred_path, 'r') as f:
                    content = f.read()
                    print(f"File size: {len(content)} bytes")
                    if len(content) < 100:
                        print(f"Content preview: {content}")
            except Exception as e:
                print(f"Error reading file: {e}")
        else:
            print(f"Credentials file NOT found at {cred_path}")
except Exception as e:
    print(f"Error importing/initializing: {e}")
    import traceback
    traceback.print_exc()
