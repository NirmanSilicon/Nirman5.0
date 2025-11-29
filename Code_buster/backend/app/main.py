from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from .config import settings
from .utils.logger import app_logger
from .database.mysql import connect_to_mysql, close_mysql_connection
from .api.routes import complaints, dashboard, sentiment


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    app_logger.info("Starting LokAI Backend Application...")
    
    # Connect to MySQL
    try:
        await connect_to_mysql()
        app_logger.info("Successfully connected to MySQL")
    except Exception as e:
        app_logger.error(f"Failed to connect to MySQL: {e}")
        raise
    
    
    yield
    
    # Shutdown
    app_logger.info("Shutting down LokAI Backend Application...")
    await close_mysql_connection()
    app_logger.info("Disconnected from MySQL")


# Create FastAPI application
app = FastAPI(
    title="LokAI - AI for Smarter Cities",
    description="AI-powered citizen complaint system with NLP processing",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    lifespan=lifespan
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

# Add settings origins if they exist
if hasattr(settings, 'allowed_origins') and settings.allowed_origins:
    for origin in settings.allowed_origins:
        if origin not in origins:
            origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    app_logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "detail": str(exc) if settings.debug else None}
    )


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "application": "LokAI Backend",
        "version": "1.0.0",
        "environment": settings.environment
    }


# Include API routers
app.include_router(complaints.router, prefix="/api/complaints", tags=["Complaints"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(sentiment.router, prefix="/api/sentiment", tags=["Sentiment"])


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to LokAI - AI for Smarter Cities",
        "docs": "/docs" if settings.debug else "Documentation not available in production",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
