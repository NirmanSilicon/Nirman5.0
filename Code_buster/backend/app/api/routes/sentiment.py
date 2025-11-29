from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
from datetime import datetime, timedelta

from ...database.mongo import get_collection
from ...utils.logger import app_logger

router = APIRouter()


@router.get("/analysis", response_model=Dict[str, Any])
async def get_sentiment_analysis(
    days: int = 30
) -> Dict[str, Any]:
    """Get comprehensive sentiment analysis"""
    try:
        collection = get_collection("complaints")
        
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Sentiment distribution
        sentiment_pipeline = [
            {
                "$match": {
                    "created_at": {"$gte": start_date, "$lte": end_date},
                    "sentiment": {"$exists": True}
                }
            },
            {
                "$group": {
                    "_id": "$sentiment",
                    "count": {"$sum": 1}
                }
            }
        ]
        
        sentiment_results = await collection.aggregate(sentiment_pipeline).to_list(length=10)
        sentiment_distribution = {str(result["_id"]): result["count"] for result in sentiment_results}
        
        # Sentiment trends over time
        trend_pipeline = [
            {
                "$match": {
                    "created_at": {"$gte": start_date, "$lte": end_date},
                    "sentiment": {"$exists": True}
                }
            },
            {
                "$group": {
                    "_id": {
                        "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
                        "sentiment": "$sentiment"
                    },
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"_id.date": 1}}
        ]
        
        trend_results = await collection.aggregate(trend_pipeline).to_list(length=100)
        
        # Sentiment by category
        category_sentiment_pipeline = [
            {
                "$match": {
                    "created_at": {"$gte": start_date, "$lte": end_date},
                    "sentiment": {"$exists": True},
                    "category": {"$exists": True}
                }
            },
            {
                "$group": {
                    "_id": {
                        "category": "$category",
                        "sentiment": "$sentiment"
                    },
                    "count": {"$sum": 1}
                }
            }
        ]
        
        category_sentiment_results = await collection.aggregate(category_sentiment_pipeline).to_list(length=50)
        
        return {
            "sentiment_distribution": sentiment_distribution,
            "trend_data": trend_results,
            "category_sentiment": category_sentiment_results,
            "analysis_period_days": days
        }
        
    except Exception as e:
        app_logger.error(f"Error getting sentiment analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
