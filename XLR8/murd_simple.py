import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import re
from urllib.parse import urlparse
import warnings
warnings.filterwarnings('ignore')
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle
import os

class MURLDDetector:
    def __init__(self):
        self.model = None
        self.label_encoder = LabelEncoder()
        self.feature_columns = None
        
    def having_ip_address(self, url):
        """Check if URL contains IP address"""
        match = re.search(
            '(([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.'
            '([01]?\d\d?|2[0-4]\d|25[0-5])\/)|'
            '((0x[0-9a-fA-F]{1,2})\.(0x[0-9a-fA-F]{1,2})\.(0x[0-9a-fA-F]{1,2})\.(0x[0-9a-fA-F]{1,2})\/)'
            '(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}', url)
        return 1 if match else 0
    
    def abnormal_url(self, url):
        """Check if hostname is present in URL"""
        hostname = urlparse(url).hostname
        hostname = str(hostname)
        match = re.search(hostname, url)
        return 1 if match else 0
    
    def count_dot(self, url):
        """Count number of dots in URL"""
        return url.count('.')
    
    def count_www(self, url):
        """Count number of 'www' in URL"""
        return url.count('www')
    
    def count_atrate(self, url):
        """Count number of '@' symbols in URL"""
        return url.count('@')
    
    def no_of_dir(self, url):
        """Count number of directories in URL"""
        urldir = urlparse(url).path
        return urldir.count('/')
    
    def no_of_embed(self, url):
        """Count embedded domains in URL"""
        urldir = urlparse(url).path
        return urldir.count('//')
    
    def suspicious_words(self, url):
        """Check for suspicious words in URL"""
        match = re.search('PayPal|login|signin|bank|account|update|free|lucky|service|bonus|ebayisapi|webscr', url)
        return 1 if match else 0
    
    def shortening_service(self, url):
        """Check if URL uses shortening service"""
        match = re.search('bit\.ly|goo\.gl|shorte\.st|go2l\.ink|x\.co|ow\.ly|t\.co|tinyurl|tr\.im|is\.gd|cli\.gs|'
                          'yfrog\.com|migre\.me|ff\.im|tiny\.cc|url4\.eu|twit\.ac|su\.pr|twurl\.nl|snipurl\.com|'
                          'short\.to|BudURL\.com|ping\.fm|post\.ly|Just\.as|bkite\.com|snipr\.com|fic\.kr|loopt\.us|'
                          'doiop\.com|short\.ie|kl\.am|wp\.me|rubyurl\.com|om\.ly|to\.ly|bit\.do|t\.co|lnkd\.in|'
                          'db\.tt|qr\.ae|adf\.ly|goo\.gl|bitly\.com|cur\.lv|tinyurl\.com|ow\.ly|bit\.ly|ity\.im|'
                          'q\.gs|is\.gd|po\.st|bc\.vc|twitthis\.com|u\.to|j\.mp|buzurl\.com|cutt\.us|u\.bb|yourls\.org|'
                          'x\.co|prettylinkpro\.com|scrnch\.me|filoops\.info|vzturl\.com|qr\.net|1url\.com|tweez\.me|v\.gd|'
                          'tr\.im|link\.zip\.net', url)
        return 1 if match else 0
    
    def count_https(self, url):
        """Count HTTPS occurrences"""
        return url.count('https')
    
    def count_http(self, url):
        """Count HTTP occurrences"""
        return url.count('http')
    
    def count_per(self, url):
        """Count percentage symbols"""
        return url.count('%')
    
    def count_ques(self, url):
        """Count question marks"""
        return url.count('?')
    
    def count_hyphen(self, url):
        """Count hyphens"""
        return url.count('-')
    
    def count_equal(self, url):
        """Count equal signs"""
        return url.count('=')
    
    def url_length(self, url):
        """Calculate URL length"""
        return len(str(url))
    
    def hostname_length(self, url):
        """Calculate hostname length"""
        return len(urlparse(url).netloc)
    
    def fd_length(self, url):
        """Calculate first directory length"""
        urlpath = urlparse(url).path
        try:
            return len(urlpath.split('/')[1])
        except:
            return 0
    
    def digit_count(self, url):
        """Count digits in URL"""
        return sum(c.isdigit() for c in url)
    
    def letter_count(self, url):
        """Count letters in URL"""
        return sum(c.isalpha() for c in url)
    
    def extract_features(self, url):
        """Extract all features from a single URL"""
        features = {}
        features['use_of_ip'] = self.having_ip_address(url)
        features['abnormal_url'] = self.abnormal_url(url)
        features['count.'] = self.count_dot(url)
        features['count-www'] = self.count_www(url)
        features['count@'] = self.count_atrate(url)
        features['count_dir'] = self.no_of_dir(url)
        features['count_embed_domain'] = self.no_of_embed(url)
        features['short_url'] = self.shortening_service(url)
        features['count_https'] = self.count_https(url)
        features['count_http'] = self.count_http(url)
        features['count%'] = self.count_per(url)
        features['count?'] = self.count_ques(url)
        features['count-'] = self.count_hyphen(url)
        features['count='] = self.count_equal(url)
        features['url_length'] = self.url_length(url)
        features['hostname_length'] = self.hostname_length(url)
        features['sus_url'] = self.suspicious_words(url)
        features['fd_length'] = self.fd_length(url)
        features['count_digits'] = self.digit_count(url)
        features['count_letters'] = self.letter_count(url)
        
        return list(features.values())
    
    def create_sample_data(self):
        """Create sample training data"""
        # Sample URLs for training
        urls_data = [
            # Phishing URLs
            ('http://paypal-security.com/login', 'phishing'),
            ('http://bit.ly/verify-account', 'phishing'),
            ('http://secure-bank.net/update', 'phishing'),
            ('http://apple-id-update.com', 'phishing'),
            ('http://microsoft-security-alert.com', 'phishing'),
            ('http://ebay-security.net', 'phishing'),
            ('http://bit.ly/free-money', 'phishing'),
            ('http://secure-paypal.org', 'phishing'),
            ('http://bank-security-alert.com', 'phishing'),
            ('http://apple-security-update.com', 'phishing'),
            
            # Legitimate URLs
            ('https://www.google.com', 'legitimate'),
            ('https://facebook.com', 'legitimate'),
            ('https://github.com', 'legitimate'),
            ('https://stackoverflow.com', 'legitimate'),
            ('https://youtube.com', 'legitimate'),
            ('https://linkedin.com', 'legitimate'),
            ('https://amazon.com', 'legitimate'),
            ('https://netflix.com', 'legitimate'),
            ('https://instagram.com', 'legitimate'),
            ('https://twitter.com', 'legitimate'),
            
            # Malware URLs
            ('http://malware-download.com', 'malware'),
            ('http://virus-spread.net', 'malware'),
            ('http://trojan-install.com', 'malware'),
            
            # Defacement URLs
            ('http://hacked-site.com', 'defacement'),
            ('http://defaced-page.net', 'defacement'),
        ]
        
        X = []
        y = []
        
        for url, label in urls_data:
            features = self.extract_features(url)
            X.append(features)
            y.append(label)
        
        return np.array(X), np.array(y)
    
    def train_model(self):
        """Train the phishing detection model"""
        print("Creating sample training data...")
        X, y = self.create_sample_data()
        
        print(f"Training data shape: {X.shape}")
        print(f"Labels: {np.unique(y)}")
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print(f"Training set: {X_train.shape[0]} samples")
        print(f"Testing set: {X_test.shape[0]} samples")
        
        # Train Random Forest model
        print("Training Random Forest Classifier...")
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Test the model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"\nModel trained successfully!")
        print(f"Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        return accuracy
    
    def predict_url(self, url):
        """Predict if a URL is phishing, legitimate, malware, or defacement"""
        if self.model is None:
            return "Model not trained yet!"
        
        features = self.extract_features(url)
        features_array = np.array([features])
        
        prediction = self.model.predict(features_array)[0]
        probabilities = self.model.predict_proba(features_array)[0]
        
        return {
            'url': url,
            'prediction': prediction,
            'confidence': float(max(probabilities)),
            'all_probabilities': dict(zip(self.model.classes_, probabilities.tolist()))
        }
    
    def save_model(self, filename='murld_model.pkl'):
        """Save the trained model"""
        if self.model is None:
            print("No model to save!")
            return
        
        with open(filename, 'wb') as f:
            pickle.dump(self.model, f)
        print(f"Model saved as {filename}")
    
    def load_model(self, filename='murld_model.pkl'):
        """Load a trained model"""
        if not os.path.exists(filename):
            print(f"Model file {filename} not found!")
            return False
        
        with open(filename, 'rb') as f:
            self.model = pickle.load(f)
        print(f"Model loaded from {filename}")
        return True

def main():
    """Main function to demonstrate the MURLD system"""
    print("="*60)
    print("MURLD - Malicious URL Detection System")
    print("="*60)
    
    # Initialize the detector
    detector = MURLDDetector()
    
    # Train the model
    accuracy = detector.train_model()
    
    # Save the model
    detector.save_model()
    
    # Test some URLs
    test_urls = [
        "https://www.google.com",
        "http://paypal-security.com/login",
        "https://facebook.com",
        "http://bit.ly/verify-account-now",
        "https://github.com",
        "http://secure-bank.net/update"
    ]
    
    print("\n" + "="*60)
    print("TESTING URLs")
    print("="*60)
    
    for url in test_urls:
        result = detector.predict_url(url)
        print(f"\nURL: {url}")
        print(f"Prediction: {result['prediction'].upper()}")
        print(f"Confidence: {result['confidence']:.2%}")
        print(f"Details: {result['all_probabilities']}")
    
    print("\n" + "="*60)
    print("MURLD System Ready!")
    print("="*60)

if __name__ == "__main__":
    main()