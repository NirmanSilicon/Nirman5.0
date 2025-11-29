# LokAI Backend

FastAPI-based backend for LokAI - AI for Smarter Cities complaint management system.

## 🚀 Features

- **FastAPI Framework**: High-performance async web framework
- **MongoDB Integration**: Async MongoDB with Motor
- **Redis Caching**: OTP storage with fallback to in-memory
- **NLP Processing**: Sentiment analysis, urgency detection, category prediction
- **Machine Learning**: 7-day trend forecasting
- **OTP Verification**: Secure phone verification with rate limiting
- **Comprehensive Logging**: Structured logging with colored output
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Error Handling**: Global exception handling with proper HTTP status codes

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── database/
│   │   ├── mongo.py         # MongoDB connection and utilities
│   │   └── models.py        # Pydantic models and schemas
│   ├── api/
│   │   └── routes/
│   │       ├── otp.py       # OTP verification endpoints
│   │       ├── complaints.py # Complaint management
│   │       ├── dashboard.py  # Analytics and dashboard
│   │       └── sentiment.py # Sentiment analysis endpoints
│   ├── services/
│   │   ├── nlp_service.py   # NLP processing engine
│   │   ├── otp_service.py   # OTP management service
│   │   └── prediction_service.py # Trend forecasting
│   ├── utils/
│   │   ├── logger.py        # Logging configuration
│   │   ├── data_cleaning.py # Text preprocessing
│   │   └── helpers.py       # Utility functions
│   └── tests/               # Test suite
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- MongoDB 4.4+
- Redis 6.0+ (optional)

### Setup

1. **Clone and navigate**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start services**
   ```bash
   # MongoDB
   mongod

   # Redis (optional)
   redis-server
   ```

6. **Run the application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## 🌐 API Endpoints

### OTP Management
- `POST /api/otp/send` - Send OTP to phone number
- `POST /api/otp/verify` - Verify OTP code
- `GET /api/otp/status/{phone}` - Get OTP status
- `DELETE /api/otp/cleanup` - Clean up expired OTPs

### Complaint Management
- `POST /api/complaints/submit` - Submit new complaint
- `GET /api/complaints/` - List complaints with filters
- `GET /api/complaints/{id}` - Get specific complaint
- `PUT /api/complaints/{id}` - Update complaint status
- `DELETE /api/complaints/{id}` - Delete complaint
- `GET /api/complaints/phone/{phone}` - Get complaints by phone
- `GET /api/complaints/search/` - Search complaints

### Dashboard Analytics
- `GET /api/dashboard/summary` - Dashboard summary statistics
- `GET /api/dashboard/heatmap` - Geographic heatmap data
- `GET /api/dashboard/trends` - Trend analysis data
- `GET /api/dashboard/stats/overview` - Quick overview stats
- `GET /api/dashboard/performance` - Performance metrics
- `GET /api/dashboard/predictions` - 7-day predictions
- `GET /api/dashboard/predictions/{category}` - Category-specific predictions

### Sentiment Analysis
- `GET /api/sentiment/analysis` - Comprehensive sentiment analysis

### System
- `GET /health` - Health check endpoint
- `GET /` - Root endpoint with API info
- `GET /docs` - Interactive API documentation (development only)

## 🤖 NLP Service

The NLP service provides:

### Sentiment Analysis
- Uses TextBlob for primary sentiment analysis
- Enhanced with keyword-based scoring
- Returns positive/neutral/negative with confidence scores

### Urgency Detection
- Keyword-based urgency classification
- Categories: high/medium/low
- Considers emergency terms and time sensitivity

### Category Prediction
- Machine learning model using Naive Bayes
- TF-IDF vectorization for text features
- Fallback to keyword matching
- Categories: road, water, electricity, garbage, safety, health

## 📊 Prediction Service

### Features
- 7-day trend forecasting using Linear Regression
- Feature engineering with time-based variables
- Confidence scoring based on data consistency
- Automatic model training for each category

### Models
- Linear Regression for trend prediction
- Feature scaling with StandardScaler
- Lag features for temporal patterns
- Rolling averages for trend smoothing

## 🔐 Security Features

### OTP System
- 6-digit random OTP generation
- 5-minute expiry time
- Rate limiting: 3 OTPs per hour per phone
- Redis storage with TTL, fallback to in-memory
- Maximum 3 verification attempts

### Data Validation
- Pydantic models for request/response validation
- Phone number format validation
- Coordinate bounds checking
- Text length requirements

### API Security
- CORS middleware configuration
- Input sanitization
- Error message sanitization (production)
- Structured logging for security events

## 📝 Configuration

### Environment Variables

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/lokai
REDIS_URL=redis://localhost:6379

# Application Configuration
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENVIRONMENT=development
DEBUG=True

# CORS Configuration
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:5173"]

# Rate Limiting
OTP_RATE_LIMIT_PER_HOUR=3

# Logging
LOG_LEVEL=INFO
```

## 🧪 Testing

### Run Tests
```bash
pytest app/tests/ -v
```

### Test Coverage
```bash
pytest --cov=app app/tests/
```

### Test Structure
```
app/tests/
├── test_otp.py           # OTP service tests
├── test_complaints.py    # Complaint API tests
├── test_dashboard.py     # Dashboard API tests
├── test_nlp.py          # NLP service tests
└── test_prediction.py   # Prediction service tests
```

## 📊 Monitoring & Logging

### Logging Features
- Colored console output
- File logging with rotation
- Structured logging format
- Different log levels for components
- Request/response logging

### Health Checks
- Database connectivity
- Redis connectivity
- Application status
- Performance metrics

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Setup
1. Configure MongoDB Atlas
2. Set up Redis (or use in-memory fallback)
3. Set environment variables
4. Deploy to platform (Render, Heroku, etc.)

## 🔄 Development

### Code Style
- Follow PEP 8 guidelines
- Use type hints throughout
- Comprehensive docstrings
- Error handling with proper HTTP status codes

### Adding New Features
1. Create Pydantic models in `models.py`
2. Implement business logic in services
3. Add API routes in appropriate route files
4. Write comprehensive tests
5. Update documentation

### Database Migrations
- MongoDB schema changes handled in application code
- Backward compatibility maintained
- Index creation in `mongo.py`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **Redis Connection Error**
   - Redis is optional (fallback to in-memory)
   - Check Redis server status
   - Verify Redis URL

3. **OTP Not Working**
   - Check rate limiting
   - Verify phone number format
   - Check Redis storage

4. **NLP Model Errors**
   - Models auto-initialize on first use
   - Check NLTK data download
   - Verify scikit-learn installation

### Debug Mode
Set `DEBUG=True` in `.env` for:
- Detailed error messages
- API documentation at `/docs`
- Enhanced logging

## 📚 API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation with:
- Endpoint descriptions
- Request/response schemas
- Try-it-out functionality
- Authentication examples

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.
