from typing import Optional
import os

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel, Field, field_validator, ConfigDict
from sqlalchemy import create_engine, Column, Integer, String, Numeric
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError

# ---------------------------
# Authentication Setup
# ---------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_ME_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        subject: Optional[str] = payload.get("sub")
        if subject is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return subject
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# ---------------------------
# Database Setup
# ---------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./AgricultureAdvisoryDB.db")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class FarmerProfile(Base):
    __tablename__ = "FarmerProfile"

    profile_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    district = Column(String(100), nullable=False)
    land_size = Column(Numeric(10, 2), nullable=True)
    language_preference = Column(String(10), nullable=False)


# Create tables if they do not exist
Base.metadata.create_all(bind=engine)


# ---------------------------
# Pydantic Schemas
# ---------------------------
class FarmerProfileCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    district: str = Field(..., min_length=1, max_length=100)
    land_size: Optional[float] = Field(default=None)
    language_preference: str = Field(..., min_length=1, max_length=10)

    @field_validator("land_size")
    @classmethod
    def validate_land_size(cls, v):
        if v is not None and v <= 0:
            raise ValueError("land_size must be greater than 0")
        return v


class FarmerProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    profile_id: int
    name: str
    district: str
    land_size: Optional[float]
    language_preference: str


# ---------------------------
# Dependency
# ---------------------------

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------
# Router and Endpoint
# ---------------------------
router = APIRouter(prefix="/api", tags=["profiles"])


@router.post(
    "/profiles",
    response_model=FarmerProfileRead,
    status_code=status.HTTP_201_CREATED,
    summary="Creates a new farmer profile",
    description=(
        "Creates a new farmer profile. This is the first step for a new user to store their information."
    ),
)
def create_farmer_profile(
    payload: FarmerProfileCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    try:
        profile = FarmerProfile(
            name=payload.name.strip(),
            district=payload.district.strip(),
            land_size=payload.land_size,
            language_preference=payload.language_preference.strip(),
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the farmer profile.",
        )
