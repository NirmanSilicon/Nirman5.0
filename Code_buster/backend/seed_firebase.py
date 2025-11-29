import sys
import os
from datetime import datetime, timedelta
import random

# Add current directory to path so we can import app modules
sys.path.append(os.getcwd())

try:
    from app.services.firebase_service import firebase_service
    from app.database.models import StatusEnum, CategoryEnum, SentimentEnum, UrgencyEnum
    
    print("Seeding Firebase with test data...")
    
    if not firebase_service.enabled:
        print("❌ Firebase service is NOT enabled.")
        sys.exit(1)
        
    # Sample data
    complaints = [
        {
            "id": "comp_001",
            "address": "123 Main St, Connaught Place, New Delhi",
            "complaint_text": "Huge pothole on the main road causing traffic jams and accidents.",
            "cleaned_text": "Huge pothole on the main road causing traffic jams and accidents.",
            "sentiment": SentimentEnum.NEGATIVE,
            "urgency": UrgencyEnum.HIGH,
            "category": CategoryEnum.ROAD,
            "confidence_score": 0.95,
            "status": StatusEnum.PENDING,
            "created_at": datetime.utcnow() - timedelta(days=1),
            "updated_at": datetime.utcnow() - timedelta(days=1)
        },
        {
            "id": "comp_002",
            "address": "45 Park Avenue, Bangalore",
            "complaint_text": "Garbage has not been collected for 3 days. It smells terrible.",
            "cleaned_text": "Garbage has not been collected for 3 days. It smells terrible.",
            "sentiment": SentimentEnum.NEGATIVE,
            "urgency": UrgencyEnum.MEDIUM,
            "category": CategoryEnum.GARBAGE,
            "confidence_score": 0.92,
            "status": StatusEnum.IN_PROGRESS,
            "created_at": datetime.utcnow() - timedelta(days=2),
            "updated_at": datetime.utcnow() - timedelta(days=1)
        },
        {
            "id": "comp_003",
            "address": "Sector 15, Noida",
            "complaint_text": "Street lights are not working in the entire block. It is very dark and unsafe.",
            "cleaned_text": "Street lights are not working in the entire block. It is very dark and unsafe.",
            "sentiment": SentimentEnum.NEGATIVE,
            "urgency": UrgencyEnum.HIGH,
            "category": CategoryEnum.ELECTRICITY,
            "confidence_score": 0.98,
            "status": StatusEnum.RESOLVED,
            "created_at": datetime.utcnow() - timedelta(days=5),
            "updated_at": datetime.utcnow() - timedelta(days=1),
            "resolved_at": datetime.utcnow() - timedelta(days=1)
        },
        {
            "id": "comp_004",
            "address": "Indiranagar, Bangalore",
            "complaint_text": "Water supply is very erratic and dirty.",
            "cleaned_text": "Water supply is very erratic and dirty.",
            "sentiment": SentimentEnum.NEGATIVE,
            "urgency": UrgencyEnum.HIGH,
            "category": CategoryEnum.WATER,
            "confidence_score": 0.88,
            "status": StatusEnum.PENDING,
            "created_at": datetime.utcnow() - timedelta(hours=5),
            "updated_at": datetime.utcnow() - timedelta(hours=5)
        },
        {
            "id": "comp_005",
            "address": "Koramangala, Bangalore",
            "complaint_text": "Stray dogs are becoming a menace in the park.",
            "cleaned_text": "Stray dogs are becoming a menace in the park.",
            "sentiment": SentimentEnum.NEGATIVE,
            "urgency": UrgencyEnum.MEDIUM,
            "category": CategoryEnum.SAFETY,
            "confidence_score": 0.85,
            "status": StatusEnum.REJECTED,
            "created_at": datetime.utcnow() - timedelta(days=10),
            "updated_at": datetime.utcnow() - timedelta(days=9)
        }
    ]
    
    count = 0
    for complaint in complaints:
        # Check if exists
        existing = firebase_service.get_complaint(complaint['id'])
        if not existing:
            firebase_service.save_complaint(complaint)
            print(f"Added complaint: {complaint['id']}")
            count += 1
        else:
            print(f"Complaint {complaint['id']} already exists.")
            
    print(f"\n✅ Seeding complete. Added {count} new complaints.")
    
    # Verify
    print("Verifying data...")
    saved = firebase_service.list_complaints(limit=10)
    print(f"Found {len(saved)} complaints in DB.")
    for c in saved:
        print(f"- {c.get('id')}")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
