from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum
import uuid
from bson import ObjectId


class SentimentEnum(str, Enum):
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"


class UrgencyEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class CategoryEnum(str, Enum):
    ROAD = "road"
    WATER = "water"
    ELECTRICITY = "electricity"
    GARBAGE = "garbage"
    SAFETY = "safety"
    HEALTH = "health"
    OTHER = "other"


class StatusEnum(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"


class LocationModel(BaseModel):
    type: str = "Point"
    coordinates: List[float] = Field(..., description="[longitude, latitude]")



class ComplaintModel(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), description="Complaint ID")
    address: str = Field(..., min_length=5, max_length=500, description="Address description")
    complaint_text: str = Field(..., min_length=10, max_length=2000, description="Complaint description")
    cleaned_text: Optional[str] = Field(None, description="Cleaned complaint text")
    
    # NLP Analysis results
    sentiment: Optional[SentimentEnum] = Field(None, description="Sentiment analysis result")
    urgency: Optional[UrgencyEnum] = Field(None, description="Urgency level")
    category: Optional[CategoryEnum] = Field(None, description="Complaint category")
    confidence_score: Optional[float] = Field(None, ge=0.0, le=1.0, description="NLP confidence score")
    
    # Metadata
    status: StatusEnum = Field(default=StatusEnum.PENDING, description="Complaint status")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    assigned_to: Optional[str] = Field(None, description="Assigned department/person")
    resolved_at: Optional[datetime] = Field(None, description="Resolution timestamp")
    
    class Config:
        schema_extra = {
            "example": {
                "address": "123 Main Street, Delhi",
                "complaint_text": "There is a huge pothole on the main road causing traffic issues."
            }
        }


    @validator('complaint_text')
    def validate_complaint_text(cls, v):
        if not v or len(v.strip()) < 10:
            raise ValueError('Complaint text must be at least 10 characters long')
        return v.strip()


class ComplaintCreate(BaseModel):
    address: str = Field(..., min_length=5, max_length=500)
    complaint_text: str = Field(..., min_length=10, max_length=2000)


class ComplaintUpdate(BaseModel):
    status: Optional[StatusEnum] = Field(None)
    assigned_to: Optional[str] = Field(None)
    resolved_at: Optional[datetime] = Field(None)


class ComplaintResponse(BaseModel):
    id: str
    address: str
    complaint_text: str
    sentiment: Optional[SentimentEnum]
    urgency: Optional[UrgencyEnum]
    category: Optional[CategoryEnum]
    status: StatusEnum
    created_at: datetime
    updated_at: datetime
    assigned_to: Optional[str]
    resolved_at: Optional[datetime]
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        json_encoders = {ObjectId: str}


class DashboardSummary(BaseModel):
    total_complaints: int
    pending_complaints: int
    in_progress_complaints: int
    resolved_complaints: int
    category_distribution: Dict[str, int]
    sentiment_distribution: Dict[str, int]
    urgency_distribution: Dict[str, int]
    recent_complaints: List[ComplaintResponse]


class HeatmapPoint(BaseModel):
    category: str
    status: str
    weight: int


class TrendData(BaseModel):
    date: datetime
    category: str
    count: int
    predicted: bool = False


class PredictionResponse(BaseModel):
    category: str
    current_trend: str  # "rising", "falling", "stable"
    predicted_counts: List[TrendData]
    confidence: float
    next_7_days_total: int
