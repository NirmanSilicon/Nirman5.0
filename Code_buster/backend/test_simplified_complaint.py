#!/usr/bin/env python3
"""
Test script for simplified complaint submission
"""

import asyncio
import sys
import os
import json

# Add the app directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.mysql import connect_to_mysql, close_mysql_connection
from app.api.routes.complaints import submit_complaint
from app.database.models import ComplaintCreate


async def test_complaint_submission():
    """Test the simplified complaint submission"""
    # Connect to database
    await connect_to_mysql()
    
    try:
        # Test complaint data
        test_complaint = ComplaintCreate(
            address="123 Main Street, Delhi, India",
            complaint_text="There is a huge pothole on the main road causing traffic issues and accidents. Please fix it urgently."
        )
        
        print("Testing simplified complaint submission...")
        print(f"Address: {test_complaint.address}")
        print(f"Complaint: {test_complaint.complaint_text}")
        print("-" * 50)
        
        # Submit complaint
        result = await submit_complaint(test_complaint)
        
        print("✅ Complaint submitted successfully!")
        print(f"Complaint ID: {result['complaint_id']}")
        print(f"Message: {result['message']}")
        
        # Show NLP analysis
        nlp_analysis = result.get('nlp_analysis', {})
        print("\n📊 NLP Analysis:")
        print(f"  Category: {nlp_analysis.get('category', 'N/A')}")
        print(f"  Sentiment: {nlp_analysis.get('sentiment', 'N/A')}")
        print(f"  Urgency: {nlp_analysis.get('urgency', 'N/A')}")
        print(f"  Confidence: {nlp_analysis.get('confidence', 'N/A')}")
        
        # Show complaint details
        complaint = result.get('complaint', {})
        print("\n📋 Complaint Details:")
        print(f"  Status: {complaint.get('status', 'N/A')}")
        print(f"  Created: {complaint.get('created_at', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error submitting complaint: {e}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        await close_mysql_connection()


async def test_invalid_complaint():
    """Test complaint submission with invalid data"""
    await connect_to_mysql()
    
    try:
        print("\n" + "=" * 50)
        print("Testing invalid complaint submission...")
        
        # Test with too short complaint text
        invalid_complaint = ComplaintCreate(
            address="123 Main Street",
            complaint_text="Too short"
        )
        
        try:
            result = await submit_complaint(invalid_complaint)
            print("❌ Should have failed with short complaint text")
            return False
        except Exception as e:
            print("✅ Correctly rejected short complaint text")
            print(f"Error: {e}")
        
        # Test with too short address
        invalid_complaint2 = ComplaintCreate(
            address="123",
            complaint_text="This is a valid complaint text that meets the minimum length requirement for testing purposes."
        )
        
        try:
            result = await submit_complaint(invalid_complaint2)
            print("❌ Should have failed with short address")
            return False
        except Exception as e:
            print("✅ Correctly rejected short address")
            print(f"Error: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Unexpected error in invalid test: {e}")
        return False
        
    finally:
        await close_mysql_connection()


async def main():
    """Main test function"""
    print("🧪 Testing Simplified Complaint System")
    print("=" * 50)
    
    # Test valid complaint submission
    success1 = await test_complaint_submission()
    
    # Test invalid submissions
    success2 = await test_invalid_complaint()
    
    print("\n" + "=" * 50)
    if success1 and success2:
        print("🎉 All tests passed!")
        print("\nThe simplified complaint system is working correctly.")
        print("Users can now submit complaints with just address and complaint text.")
    else:
        print("❌ Some tests failed!")
    
    return success1 and success2


if __name__ == "__main__":
    asyncio.run(main())
