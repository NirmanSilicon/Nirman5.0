import sys
import os
sys.path.append(os.getcwd())

try:
    from app.services.firebase_service import firebase_service
    
    print(f"Firebase Enabled: {firebase_service.enabled}")
    
    if firebase_service.enabled:
        complaints = firebase_service.list_complaints(limit=10)
        print(f"Found {len(complaints)} complaints:")
        for c in complaints:
            print(f"- {c.get('id')}: {c.get('title') or c.get('complaint_text')[:20]}...")
    else:
        print("Firebase not enabled.")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
