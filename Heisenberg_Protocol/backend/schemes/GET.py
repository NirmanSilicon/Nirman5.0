from typing import List, Optional
import os

from fastapi import APIRouter, Depends, HTTPException, Path, Security, status
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from jose import JWTError, jwt
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Integer, String, Text, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

# -------------------- Database Setup --------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./AgricultureAdvisoryDB.db")

engine = create_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


class GovernmentScheme(Base):
    __tablename__ = "GovernmentScheme"

    scheme_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    eligibility: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


Base.metadata.create_all(bind=engine)


# -------------------- Security / Auth --------------------
SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_ME_SUPER_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/token",
    scopes={
        "schemes:read": "Read access to Government Schemes",
    },
)


class TokenData(BaseModel):
    username: Optional[str] = None
    scopes: List[str] = []


def get_current_user(
    security_scopes: SecurityScopes, token: str = Depends(oauth2_scheme)
):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        token_scopes: List[str] = payload.get("scopes", [])
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Scope validation
        for scope in security_scopes.scopes:
            if scope not in token_scopes:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not enough permissions",
                )
        return {"username": username, "scopes": token_scopes}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


# -------------------- Pydantic Schemas --------------------
class SchemeListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    scheme_id: int
    title: str
    description: str


class SchemeDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    scheme_id: int
    title: str
    description: Optional[str] = None
    eligibility: Optional[str] = None


# -------------------- Dependencies --------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- Router & Routes --------------------
router = APIRouter(prefix="/api", tags=["Government Schemes"])


def _brief(text: Optional[str], limit: int = 160) -> str:
    if not text:
        return ""
    text = text.strip()
    return text if len(text) <= limit else text[:limit].rstrip() + "…"


@router.get(
    "/schemes",
    response_model=List[SchemeListItem],
    summary="Retrieves a list of all available government schemes with their titles and brief descriptions.",
)
def list_schemes(
    db: Session = Depends(get_db),
    _: dict = Security(get_current_user, scopes=["schemes:read"]),
):
    try:
        stmt = select(GovernmentScheme)
        results = db.execute(stmt).scalars().all()
        items: List[SchemeListItem] = [
            SchemeListItem(
                scheme_id=scheme.scheme_id,
                title=scheme.title,
                description=_brief(scheme.description),
            )
            for scheme in results
        ]
        return items
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve schemes",
        )


@router.get(
    "/schemes/{scheme_id}",
    response_model=SchemeDetail,
    summary="Retrieves the detailed information for a single government scheme, including eligibility and description.",
)
def get_scheme_by_id(
    scheme_id: int = Path(..., gt=0, description="ID of the government scheme"),
    db: Session = Depends(get_db),
    _: dict = Security(get_current_user, scopes=["schemes:read"]),
):
    try:
        stmt = select(GovernmentScheme).where(GovernmentScheme.scheme_id == scheme_id)
        scheme = db.execute(stmt).scalars().first()
        if not scheme:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scheme with id {scheme_id} not found",
            )
        return SchemeDetail.model_validate(scheme)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve scheme",
        )
