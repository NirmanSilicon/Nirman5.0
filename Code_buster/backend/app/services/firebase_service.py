"""
Firebase service for storing complaints in Firestore
"""
import os
import json
from typing import Dict, Any, Optional
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from ..utils.logger import app_logger


class FirebaseService:
    """Service for Firebase Firestore operations"""
    
    def __init__(self):
        self.db = None
        self.enabled = False
        self._initialize()
    
    def _initialize(self):
        """Initialize Firebase Admin SDK"""
        try:
            # Check if already initialized
            if firebase_admin._apps:
                app_logger.info("Firebase already initialized")
                self.db = firestore.client()
                self.enabled = True
                return
            
            # Get credentials path
            cred_paths = [
                os.getenv("FIREBASE_CREDENTIALS_PATH"),
                "firebase-credentials.json",
                "backend/firebase-credentials.json",
                "../firebase-credentials.json"
            ]
            
            cred_path = None
            for path in cred_paths:
                if path and os.path.exists(path):
                    cred_path = path
                    break
            
            if not cred_path:
                cred_path = "firebase-credentials.json"  # Default for error message
            
            # Check if credentials file exists
            if not os.path.exists(cred_path):
                error_msg = f"Firebase credentials file not found at {cred_path}. Please add credentials to enable Firebase storage."
                app_logger.warning(error_msg)
                print(f"\n⚠️  WARNING: {error_msg}\n")
                self.enabled = False
                return
            
            # Initialize Firebase
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            
            # Get Firestore client
            self.db = firestore.client()
            self.enabled = True
            
            app_logger.info("Firebase initialized successfully")
            
        except Exception as e:
            app_logger.warning(f"Failed to initialize Firebase: {e}")
            print(f"\n⚠️  WARNING: Firebase initialization failed: {e}\n")
            print("Please add Firebase credentials to enable complaint storage.\n")
            self.enabled = False
    
    def save_complaint(self, complaint_data: Dict[str, Any]) -> Optional[str]:
        """
        Save complaint to Firestore
        
        Args:
            complaint_data: Complaint data dictionary
            
        Returns:
            Document ID if successful, None otherwise
        """
        if not self.enabled or not self.db:
            app_logger.warning("Firebase is not initialized. Complaint not saved to Firebase. Please add credentials.")
            return None
        
        try:
            # Prepare data for Firestore
            firestore_data = self._prepare_complaint_data(complaint_data)
            
            # Add to Firestore
            doc_ref = self.db.collection('complaints').document(complaint_data.get('id'))
            print(f"🔥 Saving complaint to Firebase: {complaint_data.get('id')}")
            doc_ref.set(firestore_data)
            print(f"✅ Complaint saved successfully: {complaint_data.get('id')}")
            
            app_logger.info(f"Complaint saved to Firebase: {complaint_data.get('id')}")
            return complaint_data.get('id')
            
        except Exception as e:
            app_logger.error(f"Error saving complaint to Firebase: {e}")
            return None
    
    def _prepare_complaint_data(self, complaint_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Prepare complaint data for Firestore storage
        
        Args:
            complaint_data: Raw complaint data
            
        Returns:
            Firestore-compatible data dictionary
        """
        # Convert datetime objects to timestamps
        firestore_data = {}
        
        for key, value in complaint_data.items():
            if isinstance(value, datetime):
                firestore_data[key] = value
            elif value is None:
                continue  # Skip None values
            else:
                firestore_data[key] = value
        
        # Ensure required fields
        if 'created_at' not in firestore_data:
            firestore_data['created_at'] = datetime.utcnow()
        
        if 'updated_at' not in firestore_data:
            firestore_data['updated_at'] = datetime.utcnow()
        
        return firestore_data
    
    def get_complaint(self, complaint_id: str) -> Optional[Dict[str, Any]]:
        """
        Get complaint from Firestore
        
        Args:
            complaint_id: Complaint ID
            
        Returns:
            Complaint data if found, None otherwise
        """
        if not self.enabled or not self.db:
            return None
        
        try:
            doc_ref = self.db.collection('complaints').document(complaint_id)
            doc = doc_ref.get()
            
            if doc.exists:
                return doc.to_dict()
            return None
            
        except Exception as e:
            app_logger.error(f"Error getting complaint from Firebase: {e}")
            return None
    
    def update_complaint(self, complaint_id: str, update_data: Dict[str, Any]) -> bool:
        """
        Update complaint in Firestore
        
        Args:
            complaint_id: Complaint ID
            update_data: Data to update
            
        Returns:
            True if successful, False otherwise
        """
        if not self.enabled or not self.db:
            return False
        
        try:
            # Add updated_at timestamp
            update_data['updated_at'] = datetime.utcnow()
            
            doc_ref = self.db.collection('complaints').document(complaint_id)
            doc_ref.update(update_data)
            
            app_logger.info(f"Complaint updated in Firebase: {complaint_id}")
            return True
            
        except Exception as e:
            app_logger.error(f"Error updating complaint in Firebase: {e}")
            return False
    
    def list_complaints(self, filters: Dict[str, Any] = None, limit: int = 50, skip: int = 0) -> list:
        """
        List complaints from Firestore with optional filters
        
        Args:
            filters: Dictionary of field:value filters
            limit: Maximum number of results
            skip: Number of results to skip
            
        Returns:
            List of complaint dictionaries
        """
        if not self.enabled or not self.db:
            return []
        
        try:
            query = self.db.collection('complaints')
            
            # Apply filters
            if filters:
                for field, value in filters.items():
                    if value is not None:
                        query = query.where(field, '==', value)
            
            # Simple query without ordering to avoid index requirements
            query = query.limit(limit)
            docs = query.stream()
            
            complaints = []
            for doc in docs:
                complaint_data = doc.to_dict()
                complaints.append(complaint_data)
            
            app_logger.info(f"Retrieved {len(complaints)} complaints from Firebase")
            return complaints
            
        except Exception as e:
            app_logger.error(f"Error listing complaints from Firebase: {e}")
            return []
    
    
    def delete_complaint(self, complaint_id: str) -> bool:
        """
        Delete complaint from Firestore
        
        Args:
            complaint_id: Complaint ID
            
        Returns:
            True if successful, False otherwise
        """
        if not self.enabled or not self.db:
            return False
        
        try:
            doc_ref = self.db.collection('complaints').document(complaint_id)
            doc_ref.delete()
            
            app_logger.info(f"Complaint deleted from Firebase: {complaint_id}")
            return True
            
        except Exception as e:
            app_logger.error(f"Error deleting complaint from Firebase: {e}")
            return False


# Global Firebase service instance
firebase_service = FirebaseService()
