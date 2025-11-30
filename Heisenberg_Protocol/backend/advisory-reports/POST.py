from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field, ConfigDict, field_validator
from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    Table,
    create_engine,
)
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
    sessionmaker,
    Session,
)
import jwt

# =========================================
# Database setup
# =========================================

DATABASE_URL = "sqlite:///./agriculture_advisory.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


# Association table for many-to-many relationship between AdvisoryReport and Crop
report_recommended_crop = Table(
    "ReportRecommendedCrop",
    Base.metadata,
    mapped_column(
        "report_id", ForeignKey("AdvisoryReport.report_id", ondelete="CASCADE"), primary_key=True
    ),
    mapped_column(
        "crop_id", ForeignKey("Crop.crop_id", ondelete="CASCADE"), primary_key=True
    ),
)


class FarmerProfile(Base):
    __tablename__ = "FarmerProfile"

    profile_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    land_size: Mapped[Optional[float]] = mapped_column(Numeric(10, 2))
    language_preference: Mapped[str] = mapped_column(String(10), nullable=False)

    reports: Mapped[List["AdvisoryReport"]] = relationship(
        back_populates="profile", cascade="all, delete-orphan"
    )


class Crop(Base):
    __tablename__ = "Crop"
    __table_args__ = (
        UniqueConstraint("crop_name", name="uq_crop_name"),
    )

    crop_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    crop_name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)

    reports: Mapped[List["AdvisoryReport"]] = relationship(
        secondary=report_recommended_crop,
        back_populates="recommended_crops",
    )


class AdvisoryReport(Base):
    __tablename__ = "AdvisoryReport"

    report_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("FarmerProfile.profile_id"), nullable=False)

    state_input: Mapped[str] = mapped_column(String(100), nullable=False)
    district_input: Mapped[str] = mapped_column(String(100), nullable=False)
    soil_type_input: Mapped[str] = mapped_column(String(100), nullable=False)
    season_input: Mapped[str] = mapped_column(String(50), nullable=False)

    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    fertilizer_advice: Mapped[Optional[str]] = mapped_column(Text)
    irrigation_advice: Mapped[Optional[str]] = mapped_column(Text)

    profile: Mapped[FarmerProfile] = relationship(back_populates="reports")
    recommended_crops: Mapped[List[Crop]] = relationship(
        secondary=report_recommended_crop,
        back_populates="reports",
    )


class MarketPrice(Base):
    __tablename__ = "MarketPrice"

    price_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    crop_id: Mapped[int] = mapped_column(ForeignKey("Crop.crop_id"), nullable=False)
    price_date: Mapped[datetime] = mapped_column(Date, nullable=False)
    market_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    msp_price: Mapped[Optional[float]] = mapped_column(Numeric(10, 2))


class GovernmentScheme(Base):
    __tablename__ = "GovernmentScheme"

    scheme_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    eligibility: Mapped[Optional[str]] = mapped_column(Text)


# Create tables
Base.metadata.create_all(bind=engine)


# =========================================
# Security / Auth
# =========================================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
SECRET_KEY = "CHANGE_ME_SUPER_SECRET"
ALGORITHM = "HS256"


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: Optional[str] = payload.get("sub")
        scopes: List[str] = payload.get("scopes", []) if isinstance(payload.get("scopes", []), list) else []
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    # Authorization check: require reports:create scope or admin
    if "reports:create" not in scopes and "admin" not in scopes:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")

    return {"user_id": user_id, "scopes": scopes}


# =========================================
# Schemas
# =========================================

class AdvisoryReportCreate(BaseModel):
    profile_id: int = Field(..., ge=1)
    state_input: str = Field(..., min_length=1, max_length=100)
    district_input: str = Field(..., min_length=1, max_length=100)
    soil_type_input: str = Field(..., min_length=1, max_length=100)
    season_input: str = Field(..., min_length=1, max_length=50)
    recommended_crop_ids: List[int] = Field(..., min_length=1)

    @field_validator("recommended_crop_ids")
    @classmethod
    def validate_crop_ids(cls, v: List[int]) -> List[int]:
        if not v or len(v) == 0:
            raise ValueError("recommended_crop_ids must contain at least one crop_id")
        if any((not isinstance(i, int) or i <= 0) for i in v):
            raise ValueError("All recommended_crop_ids must be positive integers")
        return v


class CropOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    crop_id: int
    crop_name: str


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
    recommended_crops: List[CropOut]


# =========================================
# Business Logic Helpers
# =========================================

def generate_fertilizer_advice(soil_type: str, season: str, crops: List[Crop]) -> str:
    crop_names = ", ".join(sorted({c.crop_name for c in crops}))
    return (
        f"For {soil_type} soils in the {season} season, apply a balanced NPK schedule. "
        f"Tailor micronutrients based on soil test results. Recommended for: {crop_names}."
    )


def generate_irrigation_advice(state: str, district: str, season: str, soil_type: str) -> str:
    return (
        f"In {district}, {state}, during {season}, adopt irrigation aligned with ET rates. "
        f"For {soil_type} soils, prefer frequent, lighter irrigation to avoid waterlogging."
    )


# =========================================
# Router and Endpoint
# =========================================

router = APIRouter()


@router.post(
    "/api/advisory-reports",
    response_model=AdvisoryReportOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create Advisory Report",
    description="Generates and saves a new advisory report based on user-provided farm details and links it to a farmer profile.",
)
def create_advisory_report(
    payload: AdvisoryReportCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Validate farmer profile exists
    profile: FarmerProfile | None = db.get(FarmerProfile, payload.profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farmer profile with id {payload.profile_id} not found",
        )

    # Deduplicate and validate crops
    unique_crop_ids = sorted(set(payload.recommended_crop_ids))
    crops: List[Crop] = (
        db.query(Crop).filter(Crop.crop_id.in_(unique_crop_ids)).all()
        if unique_crop_ids
        else []
    )

    found_ids = {c.crop_id for c in crops}
    missing = [cid for cid in unique_crop_ids if cid not in found_ids]
    if missing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid crop_id(s): {missing}",
        )

    # Generate advisory content
    fertilizer_text = generate_fertilizer_advice(
        payload.soil_type_input, payload.season_input, crops
    )
    irrigation_text = generate_irrigation_advice(
        payload.state_input, payload.district_input, payload.season_input, payload.soil_type_input
    )

    # Create report
    new_report = AdvisoryReport(
        profile_id=payload.profile_id,
        state_input=payload.state_input.strip(),
        district_input=payload.district_input.strip(),
        soil_type_input=payload.soil_type_input.strip(),
        season_input=payload.season_input.strip(),
        generated_at=datetime.now(timezone.utc),
        fertilizer_advice=fertilizer_text,
        irrigation_advice=irrigation_text,
    )

    # Assign relationships
    new_report.recommended_crops = crops

    try:
        db.add(new_report)
        db.commit()
        db.refresh(new_report)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create advisory report")

    # Build response
    return AdvisoryReportOut(
        report_id=new_report.report_id,
        profile_id=new_report.profile_id,
        state_input=new_report.state_input,
        district_input=new_report.district_input,
        soil_type_input=new_report.soil_type_input,
        season_input=new_report.season_input,
        generated_at=new_report.generated_at,
        fertilizer_advice=new_report.fertilizer_advice,
        irrigation_advice=new_report.irrigation_advice,
        recommended_crops=[CropOut.model_validate(c) for c in new_report.recommended_crops],
    )
