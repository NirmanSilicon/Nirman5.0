from fastapi import APIRouter, HTTPException, status, Depends, Query
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta

from ...database.models import (
    ComplaintCreate, ComplaintUpdate, ComplaintResponse, 
    ComplaintModel, LocationModel, StatusEnum
)
from ...services.nlp_service import nlp_service
from ...services.firebase_service import firebase_service
from ...utils.logger import app_logger

router = APIRouter()



@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_complaint(complaint: ComplaintCreate) -> Dict[str, Any]:
    """
    Submit a new complaint
    
    - **address**: Address description
    - **complaint_text**: Complaint description
    """
    try:
        # Create complaint document
        complaint_doc = ComplaintModel(
            address=complaint.address,
            complaint_text=complaint.complaint_text,
            latitude=complaint.latitude,
            longitude=complaint.longitude
        )
        
        # Perform NLP analysis
        nlp_result = nlp_service.analyze_complaint(complaint.complaint_text)
        
        # Update complaint with NLP results
        complaint_doc.cleaned_text = nlp_result["cleaned_text"]
        complaint_doc.sentiment = nlp_result["sentiment"]
        complaint_doc.urgency = nlp_result["urgency"]
        complaint_doc.category = nlp_result["category"]
        complaint_doc.confidence_score = nlp_result["overall_confidence"]
        
        # Save to Firebase (primary storage)
        firebase_data = {
            'id': complaint_doc.id,
            'address': complaint_doc.address,
            'complaint_text': complaint_doc.complaint_text,
            'cleaned_text': complaint_doc.cleaned_text,
            'sentiment': complaint_doc.sentiment,
            'urgency': complaint_doc.urgency,
            'category': complaint_doc.category,
            'confidence_score': complaint_doc.confidence_score,
            'status': complaint_doc.status,
            'created_at': complaint_doc.created_at,
            'updated_at': complaint_doc.updated_at,
            'latitude': complaint_doc.latitude,
            'longitude': complaint_doc.longitude
        }
        
        firebase_id = firebase_service.save_complaint(firebase_data)
        
        if not firebase_id:
            app_logger.warning(f"Complaint created but not saved to Firebase (credentials missing): {complaint_doc.id}")
            print(f"⚠️  Complaint {complaint_doc.id} created but Firebase storage unavailable. Please add Firebase credentials.")
        
        app_logger.info(f"Complaint submitted successfully: {complaint_doc.id}")
        
        return {
            "message": "Complaint submitted successfully",
            "complaint_id": complaint_doc.id,
            "complaint": ComplaintResponse(
                id=complaint_doc.id,
                address=complaint_doc.address,
                complaint_text=complaint_doc.complaint_text,
                sentiment=complaint_doc.sentiment,
                urgency=complaint_doc.urgency,
                category=complaint_doc.category,
                status=complaint_doc.status,
                created_at=complaint_doc.created_at,
                updated_at=complaint_doc.updated_at,
                assigned_to=None,
                resolved_at=None
            ),
            "nlp_analysis": {
                "sentiment": nlp_result["sentiment"],
                "urgency": nlp_result["urgency"],
                "category": nlp_result["category"],
                "confidence": nlp_result["overall_confidence"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Error submitting complaint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/", response_model=List[ComplaintResponse])
async def get_complaints(
    status_filter: Optional[StatusEnum] = Query(None, alias="status", description="Filter by status"),
    category: Optional[str] = Query(None, description="Filter by category"),
    urgency: Optional[str] = Query(None, description="Filter by urgency"),
    limit: int = Query(50, ge=1, le=100, description="Number of complaints to return"),
    skip: int = Query(0, ge=0, description="Number of complaints to skip")
) -> List[ComplaintResponse]:
    """
    Get list of complaints with optional filters
    
    - **status**: Filter by complaint status
    - **category**: Filter by category
    - **urgency**: Filter by urgency level
    - **limit**: Maximum number of results (default: 50)
    - **skip**: Number of results to skip (for pagination)
    """
    try:
        # Build filter dictionary
        filters = {}
        if status_filter:
            filters["status"] = status_filter
        if category:
            filters["category"] = category
        if urgency:
            filters["urgency"] = urgency
        
        # Query Firebase
        complaints_data = firebase_service.list_complaints(filters=filters, limit=limit, skip=skip)
        
        # Convert to response models
        complaints = []
        for data in complaints_data:
            complaints.append(ComplaintResponse(**data))
        
        return complaints
        
    except Exception as e:
        app_logger.error(f"Error getting complaints: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/{complaint_id}", response_model=ComplaintResponse)
async def get_complaint(complaint_id: str) -> ComplaintResponse:
    """Get a specific complaint by ID"""
    try:
        complaint_data = firebase_service.get_complaint(complaint_id)
        
        if not complaint_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Complaint not found"
            )
        
        return ComplaintResponse(**complaint_data)
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Error getting complaint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.put("/{complaint_id}", response_model=ComplaintResponse)
async def update_complaint(
    complaint_id: str, 
    complaint_update: ComplaintUpdate
) -> ComplaintResponse:
    """
    Update complaint status and details
    
    - **status**: New complaint status
    - **assigned_to**: Department or person assigned
    - **resolved_at**: Resolution timestamp (auto-set if status is resolved)
    """
    try:
        # Check if complaint exists
        existing_complaint = firebase_service.get_complaint(complaint_id)
        if not existing_complaint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Complaint not found"
            )
        
        # Prepare update data
        update_data = complaint_update.dict(exclude_unset=True)
        
        # Auto-set resolved_at if status is resolved
        if complaint_update.status == StatusEnum.RESOLVED and not complaint_update.resolved_at:
            update_data["resolved_at"] = datetime.utcnow()
        
        # Update complaint in Firebase
        success = firebase_service.update_complaint(complaint_id, update_data)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update complaint"
            )
        
        # Get updated complaint
        updated_complaint = firebase_service.get_complaint(complaint_id)
        
        app_logger.info(f"Complaint updated: {complaint_id}")
        
        return ComplaintResponse(**updated_complaint)
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Error updating complaint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.delete("/{complaint_id}")
async def delete_complaint(complaint_id: str) -> Dict[str, Any]:
    """Delete a complaint (admin only)"""
    try:
        # Check if complaint exists
        existing_complaint = firebase_service.get_complaint(complaint_id)
        if not existing_complaint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Complaint not found"
            )
        
        # Delete complaint
        success = firebase_service.delete_complaint(complaint_id)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete complaint"
            )
        
        app_logger.info(f"Complaint deleted: {complaint_id}")
        
        return {
            "message": "Complaint deleted successfully",
            "complaint_id": complaint_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Error deleting complaint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/phone/{phone}", response_model=List[ComplaintResponse])
async def get_complaints_by_phone(phone: str) -> List[ComplaintResponse]:
    """Get all complaints for a specific phone number"""
    try:
        # Query Firebase with phone filter
        complaints_data = firebase_service.list_complaints(filters={"phone": phone}, limit=100)
        
        # Convert to response models
        complaints = []
        for data in complaints_data:
            complaints.append(ComplaintResponse(**data))
        
        return complaints
        
    except Exception as e:
        app_logger.error(f"Error getting complaints by phone: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/search/", response_model=List[ComplaintResponse])
async def search_complaints(
    q: str = Query(..., min_length=3, description="Search query"),
    limit: int = Query(20, ge=1, le=50, description="Number of results")
) -> List[ComplaintResponse]:
    """
    Search complaints by text
    
    - **q**: Search query (searches in complaint text and address)
    - **limit**: Maximum number of results
    """
    try:
        from ..services.search_service import SearchService
        
        # Create search service
        search_service = SearchService(firebase_service.db)
        
        # Search complaints
        complaints_data = search_service.search_complaints(q, limit)
        
        # Convert to response models
        complaints = []
        for data in complaints_data:
            complaints.append(ComplaintResponse(**data))
        
        return complaints
        
    except Exception as e:
        app_logger.error(f"Error searching complaints: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
