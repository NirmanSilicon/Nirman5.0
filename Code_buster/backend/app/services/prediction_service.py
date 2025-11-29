import numpy as np
from typing import List, Dict, Tuple, Optional
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
import pandas as pd
import pandas as pd

from ..database.models import CategoryEnum, TrendData, PredictionResponse
from ..services.firebase_service import firebase_service
from ..utils.logger import app_logger


class PredictionService:
    """Service for predicting complaint trends using machine learning"""
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize prediction models for each category"""
        for category in CategoryEnum:
            self.models[category.value] = LinearRegression()
            self.scalers[category.value] = StandardScaler()
    
    async def get_historical_data(self, category: str, days: int = 30) -> List[Tuple[datetime, int]]:
        """Get historical complaint data for a category"""
        try:
            # Calculate date range
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            # Get complaints from Firebase
            filters = {'category': category}
            complaints = firebase_service.list_complaints(filters=filters, limit=2000)
            
            # Filter by date and aggregate in memory
            daily_counts = {}
            
            # Initialize all days with 0
            current_date = start_date
            while current_date <= end_date:
                date_str = current_date.strftime("%Y-%m-%d")
                daily_counts[date_str] = 0
                current_date += timedelta(days=1)
            
            # Count complaints
            for c in complaints:
                created_at = c.get('created_at')
                if not created_at:
                    continue
                    
                created_at = created_at.replace(tzinfo=None)
                if created_at >= start_date and created_at <= end_date:
                    date_str = created_at.strftime("%Y-%m-%d")
                    if date_str in daily_counts:
                        daily_counts[date_str] += 1
            
            # Convert to list of (date, count) tuples
            historical_data = []
            for date_str, count in sorted(daily_counts.items()):
                date = datetime.strptime(date_str, "%Y-%m-%d")
                historical_data.append((date, count))
            
            return historical_data
            
        except Exception as e:
            app_logger.error(f"Error getting historical data for {category}: {e}")
            return []
    
    def prepare_features(self, historical_data: List[Tuple[datetime, int]]) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare features for machine learning model"""
        if len(historical_data) < 7:
            # Not enough data, return empty arrays
            return np.array([]), np.array([])
        
        # Convert to DataFrame
        df = pd.DataFrame(historical_data, columns=['date', 'count'])
        
        # Create features
        df['day_of_week'] = df['date'].dt.dayofweek
        df['day_of_month'] = df['date'].dt.day
        df['week_of_year'] = df['date'].dt.isocalendar().week
        df['month'] = df['date'].dt.month
        
        # Add lag features (previous day's count)
        df['lag_1'] = df['count'].shift(1)
        df['lag_7'] = df['count'].shift(7)  # Same day last week
        
        # Add rolling average features
        df['rolling_3'] = df['count'].rolling(window=3, min_periods=1).mean()
        df['rolling_7'] = df['count'].rolling(window=7, min_periods=1).mean()
        
        # Remove rows with NaN values
        df = df.dropna()
        
        if len(df) < 3:
            return np.array([]), np.array([])
        
        # Prepare feature matrix
        feature_columns = ['day_of_week', 'day_of_month', 'week_of_year', 'month', 
                          'lag_1', 'lag_7', 'rolling_3', 'rolling_7']
        
        X = df[feature_columns].values
        y = df['count'].values
        
        return X, y
    
    def train_model(self, category: str, X: np.ndarray, y: np.ndarray) -> bool:
        """Train prediction model for a category"""
        try:
            if len(X) < 3:
                app_logger.warning(f"Insufficient data to train model for {category}")
                return False
            
            # Scale features
            X_scaled = self.scalers[category].fit_transform(X)
            
            # Train model
            self.models[category].fit(X_scaled, y)
            
            app_logger.info(f"Model trained successfully for {category}")
            return True
            
        except Exception as e:
            app_logger.error(f"Error training model for {category}: {e}")
            return False
    
    async def predict_next_days(self, category: str, days: int = 7) -> List[Tuple[datetime, int]]:
        """Predict complaint counts for next N days"""
        try:
            predictions = []
            current_date = datetime.utcnow()
            
            # Get recent historical data for feature preparation
            historical_data = await self.get_historical_data(category, 30)
            
            if len(historical_data) < 7:
                # Not enough data for prediction, use simple average
                if historical_data:
                    avg_count = int(np.mean([count for _, count in historical_data]))
                    for i in range(days):
                        pred_date = current_date + timedelta(days=i+1)
                        predictions.append((pred_date, max(0, avg_count)))
                return predictions
            
            # Prepare features from most recent data
            X, _ = self.prepare_features(historical_data)
            
            if len(X) == 0:
                return predictions
            
            # Get the most recent feature values
            latest_features = X[-1].copy()
            
            for i in range(days):
                pred_date = current_date + timedelta(days=i+1)
                
                # Update date features
                latest_features[0] = pred_date.weekday()  # day_of_week
                latest_features[1] = pred_date.day         # day_of_month
                latest_features[2] = pred_date.isocalendar().week  # week_of_year
                latest_features[3] = pred_date.month       # month
                
                # Scale features
                scaled_features = self.scalers[category].transform([latest_features])
                
                # Make prediction
                predicted_count = self.models[category].predict(scaled_features)[0]
                predicted_count = max(0, int(round(predicted_count)))
                
                predictions.append((pred_date, predicted_count))
                
                # Update lag features for next prediction
                if len(predictions) >= 1:
                    latest_features[4] = predictions[-1][1]  # lag_1
                
            return predictions
            
        except Exception as e:
            app_logger.error(f"Error predicting for {category}: {e}")
            return []
    

    
    def calculate_trend_direction(self, historical_data: List[Tuple[datetime, int]], 
                                 predicted_data: List[Tuple[datetime, int]]) -> str:
        """Calculate trend direction based on historical and predicted data"""
        try:
            if not historical_data or not predicted_data:
                return "stable"
            
            # Calculate average of last 7 days
            recent_avg = np.mean([count for _, count in historical_data[-7:]])
            
            # Calculate average of predicted 7 days
            predicted_avg = np.mean([count for _, count in predicted_data])
            
            # Calculate percentage change
            if recent_avg == 0:
                return "stable" if predicted_avg == 0 else "rising"
            
            change_percent = ((predicted_avg - recent_avg) / recent_avg) * 100
            
            if change_percent > 10:
                return "rising"
            elif change_percent < -10:
                return "falling"
            else:
                return "stable"
                
        except Exception as e:
            app_logger.error(f"Error calculating trend direction: {e}")
            return "stable"
    
    def calculate_confidence(self, historical_data: List[Tuple[datetime, int]]) -> float:
        """Calculate confidence score based on data quality and consistency"""
        try:
            if len(historical_data) < 14:
                return 0.3  # Low confidence with insufficient data
            
            counts = [count for _, count in historical_data]
            
            # Calculate coefficient of variation (lower is more consistent)
            if np.mean(counts) == 0:
                return 0.5
            
            cv = np.std(counts) / np.mean(counts)
            
            # Map CV to confidence (inverse relationship)
            if cv < 0.3:
                confidence = 0.9
            elif cv < 0.5:
                confidence = 0.7
            elif cv < 0.8:
                confidence = 0.5
            else:
                confidence = 0.3
            
            return confidence
            
        except Exception as e:
            app_logger.error(f"Error calculating confidence: {e}")
            return 0.5
    
    async def predict_category_trends(self, category: str) -> PredictionResponse:
        """Generate complete prediction for a category"""
        try:
            # Get historical data
            historical_data = await self.get_historical_data(category, 30)
            
            if len(historical_data) < 7:
                # Not enough data for prediction
                return PredictionResponse(
                    category=category,
                    current_trend="insufficient_data",
                    predicted_counts=[],
                    confidence=0.0,
                    next_7_days_total=0
                )
            
            # Prepare features and train model
            X, y = self.prepare_features(historical_data)
            
            if len(X) >= 3:
                self.train_model(category, X, y)
            
            # Make predictions
            predicted_data = await self.predict_next_days(category, 7)
            
            # Calculate trend direction
            trend_direction = self.calculate_trend_direction(historical_data, predicted_data)
            
            # Calculate confidence
            confidence = self.calculate_confidence(historical_data)
            
            # Convert to TrendData format
            predicted_counts = []
            for date, count in predicted_data:
                predicted_counts.append(TrendData(
                    date=date,
                    category=category,
                    count=count,
                    predicted=True
                ))
            
            # Calculate next 7 days total
            next_7_days_total = sum([count for _, count in predicted_data])
            
            return PredictionResponse(
                category=category,
                current_trend=trend_direction,
                predicted_counts=predicted_counts,
                confidence=confidence,
                next_7_days_total=next_7_days_total
            )
            
        except Exception as e:
            app_logger.error(f"Error predicting trends for {category}: {e}")
            return PredictionResponse(
                category=category,
                current_trend="error",
                predicted_counts=[],
                confidence=0.0,
                next_7_days_total=0
            )
    
    async def predict_all_categories(self) -> List[PredictionResponse]:
        """Generate predictions for all categories"""
        predictions = []
        
        for category in CategoryEnum:
            if category == CategoryEnum.OTHER:
                continue  # Skip 'other' category
            
            prediction = await self.predict_category_trends(category.value)
            predictions.append(prediction)
        
        return predictions


# Global prediction service instance
prediction_service = PredictionService()
