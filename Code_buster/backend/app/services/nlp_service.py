import re
import string
from typing import Dict, List, Tuple, Optional
from textblob import TextBlob
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle
import os
import numpy as np

from ..database.models import SentimentEnum, UrgencyEnum, CategoryEnum
from ..utils.logger import app_logger


class NLPService:
    """NLP service for sentiment analysis, urgency detection, and category prediction"""
    
    def __init__(self):
        self.sentiment_keywords = {
            SentimentEnum.POSITIVE: [
                'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 
                'thank', 'thanks', 'appreciate', 'happy', 'satisfied', 'pleased',
                'resolved', 'fixed', 'improved', 'better', 'nice', 'perfect'
            ],
            SentimentEnum.NEGATIVE: [
                'bad', 'terrible', 'awful', 'horrible', 'disgusting', 'disappointed',
                'angry', 'frustrated', 'annoyed', 'upset', 'worst', 'hate',
                'problem', 'issue', 'broken', 'damaged', 'failed', 'not working',
                'urgent', 'emergency', 'dangerous', 'unsafe', 'risk', 'hazard'
            ],
            SentimentEnum.NEUTRAL: [
                'information', 'request', 'question', 'inquiry', 'suggestion',
                'report', 'notify', 'update', 'status', 'check', 'verify'
            ]
        }
        
        self.urgency_keywords = {
            UrgencyEnum.HIGH: [
                'urgent', 'emergency', 'immediately', 'asap', 'critical', 'dangerous',
                'hazard', 'unsafe', 'risk', 'accident', 'injury', 'fire', 'flood',
                'broken', 'blocked', 'no water', 'no electricity', 'power outage',
                'sewage', 'leak', 'burst', 'collapse', 'falling', 'dead'
            ],
            UrgencyEnum.MEDIUM: [
                'soon', 'quickly', 'promptly', 'important', 'priority', 'attention',
                'please', 'need', 'require', 'broken', 'damaged', 'not working',
                'issue', 'problem', 'complaint', 'concern', 'worried'
            ],
            UrgencyEnum.LOW: [
                'suggestion', 'improvement', 'recommendation', 'enhancement',
                'cosmetic', 'minor', 'small', 'little', 'could', 'would',
                'nice to have', 'when convenient', 'no rush'
            ]
        }
        
        self.category_keywords = {
            CategoryEnum.ROAD: [
                'road', 'street', 'pothole', 'traffic', 'signal', 'speed breaker',
                'highway', 'intersection', 'lane', 'pavement', 'sidewalk',
                'construction', 'repair', 'maintenance', 'marking', 'signage'
            ],
            CategoryEnum.WATER: [
                'water', 'supply', 'pipeline', 'leak', 'burst', 'contamination',
                'pressure', 'tap', 'drainage', 'sewage', 'flooding', 'overflow',
                'blockage', 'connection', 'meter', 'tank', 'pump'
            ],
            CategoryEnum.ELECTRICITY: [
                'electricity', 'power', 'current', 'voltage', 'outage', 'blackout',
                'wire', 'cable', 'pole', 'transformer', 'connection', 'bill',
                'meter', 'short circuit', 'spark', 'shock', 'hazard'
            ],
            CategoryEnum.GARBAGE: [
                'garbage', 'trash', 'waste', 'dustbin', 'dump', 'collection',
                'disposal', 'landfill', 'recycling', 'cleanliness', 'hygiene',
                'overflowing', 'smell', 'rotting', 'pests', 'sanitation'
            ],
            CategoryEnum.SAFETY: [
                'safety', 'security', 'crime', 'theft', 'robbery', 'assault',
                'police', 'lighting', 'street light', 'cctv', 'surveillance',
                'dangerous', 'unsafe', 'risk', 'hazard', 'accident', 'emergency'
            ],
            CategoryEnum.HEALTH: [
                'health', 'hospital', 'clinic', 'medical', 'doctor', 'medicine',
                'ambulance', 'emergency room', 'disease', 'infection', 'sanitation',
                'pollution', 'air quality', 'noise', 'contamination', 'public health'
            ]
        }
        
        # Initialize models (simplified for demo)
        self.category_vectorizer = None
        self.category_model = None
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize ML models for category prediction"""
        try:
            # Sample training data for category classification
            training_texts = [
                # Road examples
                "huge pothole on main road causing accidents",
                "traffic signal not working at intersection",
                "street light broken causing visibility issues",
                
                # Water examples
                "water pipeline burst flooding the area",
                "no water supply for 3 days",
                "sewage water overflowing on streets",
                
                # Electricity examples
                "power outage for 12 hours",
                "electric wires hanging dangerously",
                "transformer exploded causing fire",
                
                # Garbage examples
                "garbage not collected for weeks",
                "overflowing dustbins spreading diseases",
                "illegal dumping in public area",
                
                # Safety examples
                "no street lights making area unsafe",
                "theft and robbery increasing in locality",
                "broken fence around public park",
                
                # Health examples
                "mosquito breeding causing malaria",
                "hospital emergency room overcrowded",
                "pollution causing respiratory issues"
            ]
            
            training_labels = [
                'road', 'road', 'road',
                'water', 'water', 'water',
                'electricity', 'electricity', 'electricity',
                'garbage', 'garbage', 'garbage',
                'safety', 'safety', 'safety',
                'health', 'health', 'health'
            ]
            
            # Train vectorizer and model
            self.category_vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
            X = self.category_vectorizer.fit_transform(training_texts)
            self.category_model = MultinomialNB()
            self.category_model.fit(X, training_labels)
            
            app_logger.info("NLP models initialized successfully")
            
        except Exception as e:
            app_logger.error(f"Error initializing NLP models: {e}")
            # Fallback to keyword-based approach
            self.category_vectorizer = None
            self.category_model = None
    
    def clean_text(self, text: str) -> str:
        """Clean and preprocess text"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and extra spaces
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text
    
    def analyze_sentiment(self, text: str) -> Tuple[SentimentEnum, float]:
        """Analyze sentiment of text"""
        try:
            cleaned_text = self.clean_text(text)
            
            # Use TextBlob for sentiment analysis
            blob = TextBlob(cleaned_text)
            polarity = blob.sentiment.polarity
            
            # Determine sentiment based on polarity
            if polarity > 0.1:
                sentiment = SentimentEnum.POSITIVE
            elif polarity < -0.1:
                sentiment = SentimentEnum.NEGATIVE
            else:
                sentiment = SentimentEnum.NEUTRAL
            
            # Calculate confidence score
            confidence = abs(polarity)
            
            # Enhance with keyword analysis
            keyword_score = self._keyword_sentiment_score(cleaned_text)
            if keyword_score > 0.7:
                confidence = min(confidence + 0.2, 1.0)
            
            return sentiment, confidence
            
        except Exception as e:
            app_logger.error(f"Error analyzing sentiment: {e}")
            return SentimentEnum.NEUTRAL, 0.5
    
    def _keyword_sentiment_score(self, text: str) -> float:
        """Calculate sentiment score based on keywords"""
        text_words = set(text.split())
        scores = {SentimentEnum.POSITIVE: 0, SentimentEnum.NEGATIVE: 0, SentimentEnum.NEUTRAL: 0}
        
        for sentiment, keywords in self.sentiment_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    scores[sentiment] += 1
        
        total_keywords = sum(scores.values())
        if total_keywords == 0:
            return 0.5
        
        # Return normalized score for the dominant sentiment
        max_score = max(scores.values())
        return max_score / total_keywords
    
    def detect_urgency(self, text: str) -> Tuple[UrgencyEnum, float]:
        """Detect urgency level of complaint"""
        try:
            cleaned_text = self.clean_text(text)
            text_words = set(cleaned_text.split())
            
            urgency_scores = {UrgencyEnum.HIGH: 0, UrgencyEnum.MEDIUM: 0, UrgencyEnum.LOW: 0}
            
            # Calculate keyword scores
            for urgency, keywords in self.urgency_keywords.items():
                for keyword in keywords:
                    if keyword in cleaned_text:
                        urgency_scores[urgency] += 1
            
            # Determine urgency based on scores
            max_score = max(urgency_scores.values())
            if max_score == 0:
                return UrgencyEnum.MEDIUM, 0.5  # Default to medium
            
            detected_urgency = max(urgency_scores, key=urgency_scores.get)
            confidence = min(max_score / 3.0, 1.0)  # Normalize to 0-1
            
            return detected_urgency, confidence
            
        except Exception as e:
            app_logger.error(f"Error detecting urgency: {e}")
            return UrgencyEnum.MEDIUM, 0.5
    
    def predict_category(self, text: str) -> Tuple[CategoryEnum, float]:
        """Predict category of complaint"""
        try:
            cleaned_text = self.clean_text(text)
            
            # Try ML model first if available
            if self.category_vectorizer and self.category_model:
                try:
                    X = self.category_vectorizer.transform([cleaned_text])
                    prediction = self.category_model.predict(X)[0]
                    probabilities = self.category_model.predict_proba(X)[0]
                    confidence = max(probabilities)
                    
                    # Map prediction to enum
                    category_map = {
                        'road': CategoryEnum.ROAD,
                        'water': CategoryEnum.WATER,
                        'electricity': CategoryEnum.ELECTRICITY,
                        'garbage': CategoryEnum.GARBAGE,
                        'safety': CategoryEnum.SAFETY,
                        'health': CategoryEnum.HEALTH
                    }
                    
                    if prediction in category_map:
                        return category_map[prediction], confidence
                        
                except Exception as e:
                    app_logger.warning(f"ML model prediction failed: {e}")
            
            # Fallback to keyword-based approach
            return self._keyword_category_prediction(cleaned_text)
            
        except Exception as e:
            app_logger.error(f"Error predicting category: {e}")
            return CategoryEnum.OTHER, 0.5
    
    def _keyword_category_prediction(self, text: str) -> Tuple[CategoryEnum, float]:
        """Keyword-based category prediction"""
        text_words = set(text.split())
        category_scores = {category: 0 for category in CategoryEnum}
        
        for category, keywords in self.category_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    category_scores[category] += 1
        
        # Find category with highest score
        max_score = max(category_scores.values())
        if max_score == 0:
            return CategoryEnum.OTHER, 0.5
        
        detected_category = max(category_scores, key=category_scores.get)
        confidence = min(max_score / 3.0, 1.0)  # Normalize to 0-1
        
        return detected_category, confidence
    
    def analyze_complaint(self, text: str) -> Dict[str, any]:
        """Perform complete NLP analysis on complaint text"""
        try:
            # Clean text
            cleaned_text = self.clean_text(text)
            
            # Analyze sentiment
            sentiment, sentiment_confidence = self.analyze_sentiment(text)
            
            # Detect urgency
            urgency, urgency_confidence = self.detect_urgency(text)
            
            # Predict category
            category, category_confidence = self.predict_category(text)
            
            # Overall confidence (average of all)
            overall_confidence = (sentiment_confidence + urgency_confidence + category_confidence) / 3
            
            result = {
                "cleaned_text": cleaned_text,
                "sentiment": sentiment,
                "sentiment_confidence": sentiment_confidence,
                "urgency": urgency,
                "urgency_confidence": urgency_confidence,
                "category": category,
                "category_confidence": category_confidence,
                "overall_confidence": overall_confidence
            }
            
            app_logger.info(f"NLP analysis completed for complaint: {result}")
            return result
            
        except Exception as e:
            app_logger.error(f"Error in NLP analysis: {e}")
            return {
                "cleaned_text": self.clean_text(text),
                "sentiment": SentimentEnum.NEUTRAL,
                "sentiment_confidence": 0.5,
                "urgency": UrgencyEnum.MEDIUM,
                "urgency_confidence": 0.5,
                "category": CategoryEnum.OTHER,
                "category_confidence": 0.5,
                "overall_confidence": 0.5
            }


# Global NLP service instance
nlp_service = NLPService()
