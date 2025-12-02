# PDF Processor Service

Python microservice for high-performance PDF text extraction using PyMuPDF.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
```

2. Activate virtual environment:
```bash
# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Service

```bash
python main.py
```

The service will start on `http://localhost:8000`

## API Endpoints

### GET /
Health check endpoint

### GET /health
Detailed health status

### POST /extract
Extract text from PDF file

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: PDF file

**Response:**
```json
{
  "success": true,
  "text": "Extracted text content...",
  "page_count": 10,
  "metadata": {
    "title": "Document Title",
    "author": "Author Name",
    ...
  },
  "stats": {
    "text_length": 5000,
    "file_size": 102400
  }
}
```

## Testing

Test with curl:
```bash
curl -X POST "http://localhost:8000/extract" \
  -F "file=@test.pdf"
```
