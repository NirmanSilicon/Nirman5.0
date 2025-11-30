from typing import List, Optional
import os
import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from dotenv import load_dotenv

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# Load environment variables
load_dotenv()

# Logger setup
logger = logging.getLogger("crops_router")
logger.setLevel(logging.INFO)
if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    ch.setFormatter(formatter)
    logger.addHandler(ch)

# Security / Auth setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

try:
    import jwt
except ImportError as e:
    raise RuntimeError("PyJWT is required. Please install 'PyJWT'.")

class User(BaseModel):
    sub: str
    role: Optional[str] = None


def decode_token(token: str) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Basic validation of standard claims
        sub = payload.get("sub")
        if not sub:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token: missing subject")
        exp = payload.get("exp")
        if exp and datetime.now(timezone.utc).timestamp() > float(exp):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
        return User(sub=sub, role=payload.get("role"))
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    return decode_token(token)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./AgricultureAdvisoryDB.db")
engine_kwargs = {}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, echo=False, future=True, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ORM models
class Crop(Base):
    __tablename__ = "Crop"
    crop_id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(100), unique=True, nullable=False)

# Create tables if they do not exist
Base.metadata.create_all(bind=engine)

# Dependency to get DB session

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schemas
class CropOut(BaseModel):
    crop_id: int
    crop_name: str

    class Config:
        from_attributes = True


class CropsList(BaseModel):
    crops_array: List[CropOut]


# Router
router = APIRouter(prefix="/api", tags=["crops"])

@router.get("/crops", response_model=CropsList, status_code=status.HTTP_200_OK)
def get_crops(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> CropsList:
    try:
        crops = db.query(Crop).order_by(Crop.crop_name.asc()).all()
        logger.info("Fetched %d crops for user %s", len(crops), current_user.sub)
        return CropsList(crops_array=crops)
    except Exception as e:
        logger.exception("Failed to fetch crops: %s", str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch crops")
