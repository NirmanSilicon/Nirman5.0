from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

from ...database.models import (
    DashboardSummary, HeatmapPoint, TrendData, ComplaintResponse, PredictionResponse
)
from ...services.firebase_service import firebase_service
from ...services.prediction_service import prediction_service
from ...utils.logger import app_logger

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze")
) -> DashboardSummary:
    """
    Get dashboard summary statistics
    
    - **days**: Number of days to look back for statistics (default: 30)
    Returns total complaints, status distribution, category distribution, etc.
    """
    try:
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get all complaints from Firebase (filtered by date in memory)
        # Note: For production, we should add date filtering to list_complaints
        all_complaints = firebase_service.list_complaints(limit=1000)
        
        # Filter by date
        complaints = [
            c for c in all_complaints 
            if c.get('created_at') and c['created_at'].replace(tzinfo=None) >= start_date
        ]
        
        total_complaints = len(complaints)
        
        # Status distribution
        status_counts = {}
        for c in complaints:
            status = c.get('status', 'unknown')
            status_counts[status] = status_counts.get(status, 0) + 1
            
        status_distribution = {k: v for k, v in status_counts.items()}
        
        # Get individual status counts
        pending_complaints = status_distribution.get("pending", 0)
        in_progress_complaints = status_distribution.get("in_progress", 0)
        resolved_complaints = status_distribution.get("resolved", 0)
        
        # Category distribution
        category_counts = {}
        for c in complaints:
            category = c.get('category', 'unknown')
            category_counts[category] = category_counts.get(category, 0) + 1
            
        category_distribution = {k: v for k, v in category_counts.items()}
        
        # Sentiment distribution
        sentiment_counts = {}
        for c in complaints:
            sentiment = c.get('sentiment', 'unknown')
            sentiment_counts[sentiment] = sentiment_counts.get(sentiment, 0) + 1
            
        sentiment_distribution = {k: v for k, v in sentiment_counts.items()}
        
        # Urgency distribution
        urgency_counts = {}
        for c in complaints:
            urgency = c.get('urgency', 'unknown')
            urgency_counts[urgency] = urgency_counts.get(urgency, 0) + 1
            
        urgency_distribution = {k: v for k, v in urgency_counts.items()}
        
        # Recent complaints (last 10)
        sorted_complaints = sorted(
            complaints, 
            key=lambda x: x.get('created_at', datetime.min), 
            reverse=True
        )[:10]
        
        recent_complaints = [ComplaintResponse(**c) for c in sorted_complaints]
        
        return DashboardSummary(
            total_complaints=total_complaints,
            pending_complaints=pending_complaints,
            in_progress_complaints=in_progress_complaints,
            resolved_complaints=resolved_complaints,
            category_distribution=category_distribution,
            sentiment_distribution=sentiment_distribution,
            urgency_distribution=urgency_distribution,
            recent_complaints=recent_complaints
        )
        
    except Exception as e:
        app_logger.error(f"Error getting dashboard summary: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/heatmap", response_model=List[HeatmapPoint])
async def get_heatmap_data(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status")
) -> List[HeatmapPoint]:
    """
    Get heatmap data for location-based visualization
    
    - **days**: Number of days to look back (default: 30)
    - **category**: Filter by specific category
    - **status**: Filter by specific status
    
    Returns location points with weights for heatmap visualization
    """
    try:
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Build filters
        filters = {}
        if category:
            filters['category'] = category
        if status:
            filters['status'] = status
            
        # Get complaints
        complaints = firebase_service.list_complaints(filters=filters, limit=2000)
        
        # Filter by date and location existence
        valid_complaints = [
            c for c in complaints 
            if c.get('created_at') and c['created_at'].replace(tzinfo=None) >= start_date
            and c.get('location') and c['location'].get('coordinates')
        ]
        
        # Aggregate by location (simple clustering by rounding coordinates)
        # In a real app, use a geospatial library or geohashing
        clusters = {}
        
        for c in valid_complaints:
            # Round to ~111m precision (3 decimal places)
            lat = round(c['location']['coordinates'][1], 3)
            lon = round(c['location']['coordinates'][0], 3)
            key = f"{lat},{lon}"
            
            if key not in clusters:
                clusters[key] = {
                    "lat": lat,
                    "lon": lon,
                    "count": 0,
                    "categories": [],
                    "statuses": []
                }
            
            clusters[key]["count"] += 1
            clusters[key]["categories"].append(c.get('category'))
            clusters[key]["statuses"].append(c.get('status'))
            
        heatmap_points = []
        for key, data in clusters.items():
            # Get most common category and status
            categories = data["categories"]
            statuses = data["statuses"]
            
            most_common_category = max(set(categories), key=categories.count) if categories else None
            most_common_status = max(set(statuses), key=statuses.count) if statuses else None
            
            heatmap_points.append(HeatmapPoint(
                latitude=data["lat"],
                longitude=data["lon"],
                weight=data["count"],
                category=most_common_category,
                status=most_common_status
            ))
            
        # Sort by weight desc
        heatmap_points.sort(key=lambda x: x.weight, reverse=True)
        
        return heatmap_points[:1000]  # Limit points
        
    except Exception as e:
        app_logger.error(f"Error getting heatmap data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/trends", response_model=List[TrendData])
async def get_trend_data(
    days: int = Query(30, ge=7, le=365, description="Number of days to analyze"),
    category: Optional[str] = Query(None, description="Filter by category")
) -> List[TrendData]:
    """
    Get trend data for complaints over time
    
    - **days**: Number of days to analyze (default: 30)
    - **category**: Filter by specific category
    
    Returns daily complaint counts for trend analysis
    """
    try:
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Build filters
        filters = {}
        if category:
            filters['category'] = category
            
        # Get complaints
        complaints = firebase_service.list_complaints(filters=filters, limit=2000)
        
        # Filter by date
        valid_complaints = [
            c for c in complaints 
            if c.get('created_at') and c['created_at'].replace(tzinfo=None) >= start_date
        ]
        
        # Aggregate by date
        daily_counts = {}
        
        # Initialize all days with 0
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.strftime("%Y-%m-%d")
            daily_counts[date_str] = {"count": 0, "category": category or "all"}
            current_date += timedelta(days=1)
            
        # Count complaints
        for c in valid_complaints:
            date_str = c['created_at'].strftime("%Y-%m-%d")
            if date_str in daily_counts:
                daily_counts[date_str]["count"] += 1
                
        trend_data = []
        for date_str, data in sorted(daily_counts.items()):
            trend_data.append(TrendData(
                date=datetime.strptime(date_str, "%Y-%m-%d"),
                category=data["category"],
                count=data["count"],
                predicted=False
            ))
        
        return trend_data
        
    except Exception as e:
        app_logger.error(f"Error getting trend data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/stats/overview")
async def get_overview_stats() -> Dict[str, Any]:
    """Get quick overview statistics for dashboard"""
    try:
        # Get all complaints
        complaints = firebase_service.list_complaints(limit=2000)
        
        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=today_start.weekday())
        month_start = today_start.replace(day=1)
        
        today_complaints = 0
        week_complaints = 0
        month_complaints = 0
        high_urgency_pending = 0
        resolution_times = []
        
        for c in complaints:
            created_at = c.get('created_at')
            if not created_at:
                continue
                
            created_at = created_at.replace(tzinfo=None)
            
            if created_at >= today_start:
                today_complaints += 1
            
            if created_at >= week_start:
                week_complaints += 1
                
            if created_at >= month_start:
                month_complaints += 1
                
            if c.get('urgency') == 'high' and c.get('status') in ['pending', 'in_progress']:
                high_urgency_pending += 1
                
            if c.get('status') == 'resolved' and c.get('resolved_at'):
                resolved_at = c['resolved_at'].replace(tzinfo=None)
                days = (resolved_at - created_at).total_seconds() / (24 * 3600)
                resolution_times.append(days)
        
        avg_resolution_days = round(sum(resolution_times) / len(resolution_times), 1) if resolution_times else 0
        
        return {
            "today_complaints": today_complaints,
            "week_complaints": week_complaints,
            "month_complaints": month_complaints,
            "high_urgency_pending": high_urgency_pending,
            "average_resolution_days": avg_resolution_days,
            "last_updated": now.isoformat()
        }
        
    except Exception as e:
        app_logger.error(f"Error getting overview stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/performance")
async def get_performance_metrics() -> Dict[str, Any]:
    """Get performance metrics for the system"""
    try:
        complaints = firebase_service.list_complaints(limit=2000)
        
        total_count = len(complaints)
        resolved_count = 0
        category_stats = {}
        urgency_counts = {}
        
        for c in complaints:
            status = c.get('status')
            category = c.get('category', 'unknown')
            urgency = c.get('urgency', 'unknown')
            
            if status == 'resolved':
                resolved_count += 1
                
            # Category stats
            if category not in category_stats:
                category_stats[category] = {"total": 0, "resolved": 0}
            category_stats[category]["total"] += 1
            if status == 'resolved':
                category_stats[category]["resolved"] += 1
                
            # Urgency stats
            urgency_counts[urgency] = urgency_counts.get(urgency, 0) + 1
            
        resolution_rate = (resolved_count / total_count * 100) if total_count > 0 else 0
        
        # Format category performance
        category_performance = []
        for cat, stats in category_stats.items():
            rate = (stats["resolved"] / stats["total"] * 100) if stats["total"] > 0 else 0
            category_performance.append({
                "category": cat,
                "total": stats["total"],
                "resolved": stats["resolved"],
                "resolution_rate": rate
            })
            
        return {
            "total_complaints": total_count,
            "resolved_complaints": resolved_count,
            "resolution_rate": round(resolution_rate, 2),
            "category_performance": category_performance,
            "urgency_distribution": urgency_counts,
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        app_logger.error(f"Error getting performance metrics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/predictions", response_model=List[PredictionResponse])
async def get_predictions() -> List[PredictionResponse]:
    """
    Get 7-day trend predictions for all complaint categories
    
    Returns predictions for next 7 days including trend direction and confidence scores
    """
    try:
        # Note: prediction_service might still need migration if it uses MongoDB directly
        # For now, we'll assume it's either stateless or we'll need to check it next
        predictions = await prediction_service.predict_all_categories()
        return predictions
        
    except Exception as e:
        app_logger.error(f"Error getting predictions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/predictions/{category}", response_model=PredictionResponse)
async def get_category_prediction(category: str) -> PredictionResponse:
    """
    Get 7-day trend prediction for a specific category
    
    - **category**: Complaint category (road, water, electricity, garbage, safety, health)
    """
    try:
        prediction = await prediction_service.predict_category_trends(category)
        return prediction
        
    except Exception as e:
        app_logger.error(f"Error getting category prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
