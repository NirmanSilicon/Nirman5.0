from datetime import datetime
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Path, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import Column, Integer, String, Numeric, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
import os

# -------------------- Database Setup --------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./agriculture_advisory.db")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    future=True,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
Base = declarative_base()


# -------------------- Models --------------------
class FarmerProfile(Base):
    __tablename__ = "FarmerProfile"

    profile_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    district = Column(String(100), nullable=False)
    land_size = Column(Numeric(10, 2), nullable=True)
    language_preference = Column(String(10), nullable=False)


# Create tables if not existing (idempotent)
Base.metadata.create_all(bind=engine)


# -------------------- Schemas --------------------
class FarmerProfileUpdate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    district: str = Field(..., min_length=1, max_length=100)
    land_size: float = Field(..., ge=0)
    language_preference: str = Field(..., min_length=1, max_length=10)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("name cannot be empty")
        return v

    @field_validator("district")
    @classmethod
    def validate_district(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("district cannot be empty")
        return v

    @field_validator("language_preference")
    @classmethod
    def validate_language_preference(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("language_preference cannot be empty")
        return v


class FarmerProfileResponse(BaseModel):
    profile_id: int
    name: str
    district: str
    land_size: Optional[float] = None
    language_preference: str
    message: str


# -------------------- Dependencies --------------------
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    # Simple placeholder for authentication. Replace with real verification.
    # Accept a static token for demonstration purposes.
    if token not in {"testtoken", "secrettoken"}:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"sub": "authorized_user"}


# -------------------- Router --------------------
router = APIRouter(prefix="/api/profiles", tags=["profiles"])


@router.put(
    "/{profile_id}",
    response_model=FarmerProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Updates the details of an existing farmer profile.",
)
def update_farmer_profile(
    profile_id: int = Path(..., ge=1, description="Unique identifier of the farmer profile"),
    payload: FarmerProfileUpdate = ...,
    db: Session = Depends(get_db),
    _user: dict = Depends(get_current_user),
) -> FarmerProfileResponse:
    # Fetch existing profile
    profile = db.get(FarmerProfile, profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farmer profile with id {profile_id} not found",
        )

    # Update fields
    profile.name = payload.name
    profile.district = payload.district
    profile.land_size = Decimal(str(payload.land_size)) if payload.land_size is not None else None
    profile.language_preference = payload.language_preference

    try:
        db.add(profile)
        db.commit()
        db.refresh(profile)
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the profile",
        ) from exc

    return FarmerProfileResponse(
        profile_id=profile.profile_id,
        name=profile.name,
        district=profile.district,
        land_size=float(profile.land_size) if profile.land_size is not None else None,
        language_preference=profile.language_preference,
        message="Profile updated successfully",
    )
