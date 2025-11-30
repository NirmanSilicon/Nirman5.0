from datetime import datetime
import os
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Path, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import Date, DateTime, DECIMAL, ForeignKey, Integer, String, Text, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, relationship, sessionmaker
from sqlalchemy.orm import selectinload
from pydantic import BaseModel, ConfigDict

# ============================================================
# Database setup
# ============================================================
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./agriculture_advisory.db")

engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    pass


# ============================================================
# ORM Models (reflecting provided schema)
# ============================================================
class AdvisoryReport(Base):
    __tablename__ = "AdvisoryReport"

    report_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    profile_id: Mapped[int] = mapped_column(ForeignKey("FarmerProfile.profile_id"), nullable=False)
    state_input: Mapped[str] = mapped_column(String(100), nullable=False)
    district_input: Mapped[str] = mapped_column(String(100), nullable=False)
    soil_type_input: Mapped[str] = mapped_column(String(100), nullable=False)
    season_input: Mapped[str] = mapped_column(String(50), nullable=False)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), nullable=False)
    fertilizer_advice: Mapped[Optional[str]] = mapped_column(Text)
    irrigation_advice: Mapped[Optional[str]] = mapped_column(Text)

    recommended_crops: Mapped[List["Crop"]] = relationship(
        secondary="ReportRecommendedCrop", back_populates="reports"
    )


class Crop(Base):
    __tablename__ = "Crop"

    crop_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    crop_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    reports: Mapped[List[AdvisoryReport]] = relationship(
        secondary="ReportRecommendedCrop", back_populates="recommended_crops"
    )


class ReportRecommendedCrop(Base):
    __tablename__ = "ReportRecommendedCrop"

    report_id: Mapped[int] = mapped_column(ForeignKey("AdvisoryReport.report_id"), primary_key=True)
    crop_id: Mapped[int] = mapped_column(ForeignKey("Crop.crop_id"), primary_key=True)


# ============================================================
# Pydantic Schemas
# ============================================================
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
    recommended_crops: List[str]


# ============================================================
# Security / Auth
# ============================================================
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "CHANGE_ME_SUPER_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def verify_token(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Example checks; extend as needed for scopes/roles
        if payload.get("sub") is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ============================================================
# Dependencies
# ============================================================

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================
# Router
# ============================================================
router = APIRouter(prefix="/api", tags=["Advisory Reports"])


@router.get(
    "/advisory-reports/{report_id}",
    response_model=AdvisoryReportOut,
    status_code=status.HTTP_200_OK,
)
def get_advisory_report(
    report_id: int = Path(..., ge=1, description="Unique ID of the advisory report"),
    db: Session = Depends(get_db),
    _: dict = Depends(verify_token),
):
    try:
        stmt = (
            select(AdvisoryReport)
            .options(selectinload(AdvisoryReport.recommended_crops))
            .where(AdvisoryReport.report_id == report_id)
        )
        result = db.execute(stmt).scalar_one_or_none()
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Advisory report with id {report_id} not found",
            )

        response = AdvisoryReportOut(
            report_id=result.report_id,
            profile_id=result.profile_id,
            state_input=result.state_input,
            district_input=result.district_input,
            soil_type_input=result.soil_type_input,
            season_input=result.season_input,
            generated_at=result.generated_at,
            fertilizer_advice=result.fertilizer_advice,
            irrigation_advice=result.irrigation_advice,
            recommended_crops=[c.crop_name for c in (result.recommended_crops or [])],
        )
        return response
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        ) from exc
