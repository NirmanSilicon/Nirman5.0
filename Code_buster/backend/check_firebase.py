import sys
import os
from datetime import datetime

# Add current directory to path so we can import app modules
sys.path.append(os.getcwd())

try:
    from app.services.firebase_service import firebase_service
    
    print("Checking Firebase connection...")
    
    if not firebase_service.enabled:
        print("❌ Firebase service is NOT enabled.")
        print("Please check if 'firebase-credentials.json' exists and is valid.")
        sys.exit(1)
        
    print("✅ Firebase service is enabled.")
    
    print("\nListing complaints...")
    
    # Try to list complaints
    try:
        complaints = firebase_service.list_complaints(limit=10)
        print(f"Found {len(complaints)} complaints using list_complaints().")
        
        if len(complaints) > 0:
            print("\nSample complaint:")
            for key, value in list(complaints[0].items())[:5]:
                print(f"  {key}: {value}")
        else:
            print("\nNo complaints found. Trying direct query...")
            
            # Try direct query without ordering
            if firebase_service.db:
                docs = firebase_service.db.collection('complaints').limit(10).stream()
                direct_complaints = [doc.to_dict() for doc in docs]
                print(f"Direct query found {len(direct_complaints)} complaints.")
                
                if len(direct_complaints) > 0:
                    print("\nSample complaint from direct query:")
                    for key, value in list(direct_complaints[0].items())[:5]:
                        print(f"  {key}: {value}")
                        
    except Exception as query_error:
        print(f"❌ Error querying complaints: {query_error}")
        import traceback
        traceback.print_exc()
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
