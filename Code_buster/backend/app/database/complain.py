# backend/app/models/complaint.py
from datetime import datetime
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field, validator
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class ComplaintStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"

class ComplaintPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Coordinates(BaseModel):
    type: str = "Point"
    coordinates: List[float]  # [longitude, latitude]

class ComplaintBase(BaseModel):
    title: str
    description: str
    status: ComplaintStatus = ComplaintStatus.PENDING
    priority: ComplaintPriority = ComplaintPriority.MEDIUM
    category: str = "general"
    location: str
    coordinates: Coordinates
    user_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ComplaintCreate(ComplaintBase):
    pass

class Complaint(ComplaintBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        json_encoders = {ObjectId: str}
        from_attributes = True