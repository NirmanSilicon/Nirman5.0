"""
PDF Processing Microservice
Uses PyMuPDF (fitz) for high-performance PDF text extraction
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
from typing import Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PDF Processor Service",
    description="High-performance PDF text extraction using PyMuPDF",
    version="1.0.0"
)

# CORS middleware to allow Next.js backend to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "PDF Processor",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "pymupdf_version": fitz.version[0]
    }

@app.post("/extract")
async def extract_text(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Extract text and metadata from PDF file
    
    Args:
        file: Uploaded PDF file
        
    Returns:
        Dictionary containing:
        - text: Extracted text content
        - page_count: Number of pages
        - metadata: PDF metadata (title, author, etc.)
    """
    try:
        logger.info(f"Processing PDF: {file.filename}")
        
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=400,
                detail="File must be a PDF"
            )
        
        # Read file content
        content = await file.read()
        
        if len(content) == 0:
            raise HTTPException(
                status_code=400,
                detail="Empty file received"
            )
        
        logger.info(f"File size: {len(content)} bytes")
        
        # Open PDF with PyMuPDF
        try:
            doc = fitz.open(stream=content, filetype="pdf")
        except Exception as e:
            logger.error(f"Failed to open PDF: {str(e)}")
            raise HTTPException(
                status_code=400,
                detail=f"Invalid PDF file: {str(e)}"
            )
        
        # Extract text from all pages
        text_parts = []
        for page_num in range(len(doc)):
            page = doc[page_num]
            text_parts.append(page.get_text())
        
        full_text = "\n".join(text_parts)
        
        # Extract metadata
        metadata = {
            "title": doc.metadata.get("title", ""),
            "author": doc.metadata.get("author", ""),
            "subject": doc.metadata.get("subject", ""),
            "creator": doc.metadata.get("creator", ""),
            "producer": doc.metadata.get("producer", ""),
            "creation_date": doc.metadata.get("creationDate", ""),
            "modification_date": doc.metadata.get("modDate", ""),
        }
        
        page_count = len(doc)
        text_length = len(full_text)
        
        # Close document
        doc.close()
        
        logger.info(f"Extraction complete: {page_count} pages, {text_length} characters")
        
        return {
            "success": True,
            "text": full_text,
            "page_count": page_count,
            "metadata": metadata,
            "stats": {
                "text_length": text_length,
                "file_size": len(content)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during extraction: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"PDF extraction failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
