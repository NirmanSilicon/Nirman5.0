from datetime import date
from typing import Generator, List, Optional
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Path, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Date, DECIMAL, ForeignKey, Integer, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

# =====================
# Database Setup
# =====================
DATABASE_URL = "sqlite:///./AgricultureAdvisoryDB.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


class Crop(Base):
    __tablename__ = "Crop"
    crop_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    crop_name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)


class MarketPrice(Base):
    __tablename__ = "MarketPrice"
    price_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    crop_id: Mapped[int] = mapped_column(ForeignKey("Crop.crop_id"), nullable=False)
    price_date: Mapped[date] = mapped_column(Date, nullable=False)
    market_price: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    msp_price: Mapped[Optional[Decimal]] = mapped_column(DECIMAL(10, 2), nullable=True)


# Create tables if they don't exist
Base.metadata.create_all(bind=engine)


# =====================
# Security / Auth
# =====================
# In a production app, store this securely (e.g., env var / secrets manager)
SECRET_KEY = "CHANGE_ME_SUPER_SECRET_KEY"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        subject: Optional[str] = payload.get("sub")
        if subject is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
        return {"sub": subject}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


# =====================
# Schemas
# =====================
class PriceHistoryItem(BaseModel):
    price_date: date
    market_price: float
    msp_price: Optional[float] = None


class CropMarketPricesResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    crop_id: int
    crop_name: str
    price_history_array: List[PriceHistoryItem]


# =====================
# Router
# =====================
router = APIRouter(
    prefix="/api/market-prices",
    tags=["Market Prices"],
    dependencies=[Depends(get_current_user)],
)


@router.get(
    "/crops/{crop_id}",
    response_model=CropMarketPricesResponse,
    summary="Retrieves current and historical market price data, including MSP, for a specific crop.",
)
def get_market_prices_for_crop(
    crop_id: int = Path(..., ge=1, description="Unique identifier for the crop"),
    db: Session = Depends(get_db),
):
    # Validate crop exists
    crop = db.get(Crop, crop_id)
    if not crop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop not found")

    # Fetch market prices ordered by date descending (latest first)
    stmt = select(MarketPrice).where(MarketPrice.crop_id == crop_id).order_by(MarketPrice.price_date.desc())
    prices = db.execute(stmt).scalars().all()

    price_history: List[PriceHistoryItem] = []
    for p in prices:
        price_history.append(
            PriceHistoryItem(
                price_date=p.price_date,
                market_price=float(p.market_price) if p.market_price is not None else 0.0,
                msp_price=float(p.msp_price) if p.msp_price is not None else None,
            )
        )

    return CropMarketPricesResponse(
        crop_id=crop.crop_id,
        crop_name=crop.crop_name,
        price_history_array=price_history,
    )
