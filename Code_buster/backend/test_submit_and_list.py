import sys
import os
sys.path.append(os.getcwd())

try:
    from app.services.firebase_service import firebase_service
    
    print(f"Firebase Enabled: {firebase_service.enabled}")
    
    if not firebase_service.enabled:
        print("❌ Firebase not enabled!")
        sys.exit(1)
    
    # Test saving a complaint
    test_complaint = {
        'id': 'test_complaint_001',
        'address': 'Test Address 123',
        'complaint_text': 'This is a test complaint',
        'latitude': 28.6139,
        'longitude': 77.2090,
        'status': 'pending',
        'category': 'road',
        'sentiment': 'negative',
        'urgency': 'high',
        'confidence_score': 0.95
    }
    
    from datetime import datetime
    test_complaint['created_at'] = datetime.utcnow()
    test_complaint['updated_at'] = datetime.utcnow()
    
    print("\n📝 Saving test complaint...")
    result = firebase_service.save_complaint(test_complaint)
    print(f"Save result: {result}")
    
    # Try to retrieve it
    print("\n🔍 Retrieving complaint...")
    retrieved = firebase_service.get_complaint('test_complaint_001')
    if retrieved:
        print(f"✅ Retrieved: {retrieved.get('id')}")
    else:
        print("❌ Could not retrieve complaint!")
    
    # List all complaints
    print("\n📋 Listing all complaints...")
    all_complaints = firebase_service.list_complaints(limit=20)
    print(f"Found {len(all_complaints)} complaints:")
    for c in all_complaints:
        print(f"  - {c.get('id')}: {c.get('complaint_text', '')[:30]}...")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
