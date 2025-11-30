from datetime import datetime
from decimal import Decimal
import os
from typing import Generator, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Path, Security, status
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, ConfigDict
from sqlalchemy import (
    Column,
    Date,
    DateTime,
    DECIMAL,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    create_engine,
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker, Session

# -----------------------------------------------------------------------------
# Authentication (API Key)
# -----------------------------------------------------------------------------
API_KEY_NAME = "X-API-Key"
API_KEY_VALUE = os.getenv("API_KEY", "dev-secret-key")
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)


def get_api_key(api_key_header_value: Optional[str] = Security(api_key_header)) -> str:
    if not api_key_header_value or api_key_header_value != API_KEY_VALUE:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )
    return api_key_header_value


# -----------------------------------------------------------------------------
# Database setup (SQLAlchemy)
# -----------------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./agriculture_advisory.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    future=True,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)
Base = declarative_base()


# -----------------------------------------------------------------------------
# SQLAlchemy Models
# -----------------------------------------------------------------------------
class FarmerProfile(Base):
    __tablename__ = "FarmerProfile"

    profile_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    district = Column(String(100), nullable=False)
    land_size = Column(DECIMAL(10, 2), nullable=True)
    language_preference = Column(String(10), nullable=False)

    advisory_reports = relationship("AdvisoryReport", back_populates="profile", cascade="all, delete-orphan")


class Crop(Base):
    __tablename__ = "Crop"

    crop_id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(100), nullable=False, unique=True)


class AdvisoryReport(Base):
    __tablename__ = "AdvisoryReport"

    report_id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("FarmerProfile.profile_id"), nullable=False, index=True)
    state_input = Column(String(100), nullable=False)
    district_input = Column(String(100), nullable=False)
    soil_type_input = Column(String(100), nullable=False)
    season_input = Column(String(50), nullable=False)
    generated_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    fertilizer_advice = Column(Text, nullable=True)
    irrigation_advice = Column(Text, nullable=True)

    profile = relationship("FarmerProfile", back_populates="advisory_reports")


class MarketPrice(Base):
    __tablename__ = "MarketPrice"

    price_id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("Crop.crop_id"), nullable=False)
    price_date = Column(Date, nullable=False)
    market_price = Column(DECIMAL(10, 2), nullable=False)
    msp_price = Column(DECIMAL(10, 2), nullable=True)


class GovernmentScheme(Base):
    __tablename__ = "GovernmentScheme"

    scheme_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    eligibility = Column(Text, nullable=True)


class ReportRecommendedCrop(Base):
    __tablename__ = "ReportRecommendedCrop"
    __table_args__ = (
        UniqueConstraint("report_id", "crop_id", name="uq_report_crop"),
    )

    report_id = Column(Integer, ForeignKey("AdvisoryReport.report_id"), primary_key=True)
    crop_id = Column(Integer, ForeignKey("Crop.crop_id"), primary_key=True)


# Create tables if they do not exist
Base.metadata.create_all(bind=engine)


# -----------------------------------------------------------------------------
# Pydantic Schemas
# -----------------------------------------------------------------------------
class FarmerProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    profile_id: int
    name: str
    district: str
    land_size: Optional[float] = None
    language_preference: str


class AdvisoryReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    report_id: int
    profile_id: int
    state_input: str
    district_input: str
    soil_type_input: str
    season_input: str
    generated_at: datetime
    fertilizer_advice: Optional[str] = None
    irrigation_advice: Optional[str] = None


class ReportsListOut(BaseModel):
    reports_array: List[AdvisoryReportOut]


# -----------------------------------------------------------------------------
# Dependencies
# -----------------------------------------------------------------------------

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------------------------------------------------------------
# Router and Endpoints
# -----------------------------------------------------------------------------
router = APIRouter(prefix="/api", tags=["Profiles"], dependencies=[Depends(get_api_key)])


@router.get(
    "/profiles/{profile_id}",
    response_model=FarmerProfileOut,
    summary="Get Farmer Profile by ID",
    description="Retrieves the details of a specific farmer profile using their unique profile ID.",
)
def get_farmer_profile(
    profile_id: int = Path(..., ge=1, description="Unique farmer profile ID"),
    db: Session = Depends(get_db),
) -> FarmerProfileOut:
    profile = db.query(FarmerProfile).filter(FarmerProfile.profile_id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer profile not found")

    # Convert Decimal to float for land_size if necessary
    if isinstance(profile.land_size, Decimal):
        profile.land_size = float(profile.land_size)

    return profile


@router.get(
    "/profiles/{profile_id}/advisory-reports",
    response_model=ReportsListOut,
    summary="List Advisory Reports for a Profile",
    description="Retrieves a list of all previously generated advisory reports for a specific farmer profile.",
)
def list_advisory_reports(
    profile_id: int = Path(..., ge=1, description="Unique farmer profile ID"),
    db: Session = Depends(get_db),
) -> ReportsListOut:
    profile = db.query(FarmerProfile).filter(FarmerProfile.profile_id == profile_id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer profile not found")

    reports = (
        db.query(AdvisoryReport)
        .filter(AdvisoryReport.profile_id == profile_id)
        .order_by(AdvisoryReport.generated_at.desc())
        .all()
    )

    # Ensure Decimal fields (if any) are converted appropriately in response
    return ReportsListOut(reports_array=reports)
