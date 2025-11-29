"""
Search service for Firebase Firestore text search
"""
from typing import List, Dict, Any
from ..utils.logger import app_logger


class SearchService:
    """Service for searching complaints in Firestore"""
    
    def __init__(self, db):
        self.db = db
    
    def search_complaints(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Search complaints by text (simple implementation)
        Note: Firestore doesn't support full-text search natively.
        For production, consider using Algolia or Elasticsearch.
        
        Args:
            query: Search query string
            limit: Maximum number of results
            
        Returns:
            List of matching complaint dictionaries
        """
        try:
            # Get all complaints (limited approach for now)
            docs = self.db.collection('complaints').order_by('created_at', direction=-1).limit(limit * 3).stream()
            
            # Filter in memory (not ideal for large datasets)
            query_lower = query.lower()
            results = []
            
            for doc in docs:
                data = doc.to_dict()
                # Check if query appears in relevant fields
                if (query_lower in data.get('complaint_text', '').lower() or
                    query_lower in data.get('cleaned_text', '').lower() or
                    query_lower in data.get('address', '').lower()):
                    results.append(data)
                    if len(results) >= limit:
                        break
            
            return results
            
        except Exception as e:
            app_logger.error(f"Error searching complaints: {e}")
            return []
