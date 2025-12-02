from flask import Flask, render_template, request, jsonify
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from murd_simple import MURLDDetector
import json

app = Flask(__name__)

# Initialize the detector globally
detector = MURLDDetector()
model_trained = False

@app.route('/')
def index():
    """Home page"""
    return render_template('index.html')

@app.route('/train', methods=['POST'])
def train_model():
    """Train the MURLD model"""
    global model_trained
    try:
        print("Training MURLD model...")
        accuracy = detector.train_model()
        detector.save_model()
        model_trained = True
        
        return jsonify({
            'success': True,
            'accuracy': f"{accuracy:.4f}",
            'message': f"Model trained successfully with {accuracy*100:.2f}% accuracy!"
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/predict', methods=['POST'])
def predict_url():
    """Predict URL classification"""
    global model_trained
    
    if not model_trained:
        # Try to load existing model
        if not detector.load_model():
            return jsonify({
                'success': False,
                'error': 'Model not trained yet. Please train the model first.'
            })
        model_trained = True
    
    try:
        data = request.get_json()
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({
                'success': False,
                'error': 'Please provide a URL to analyze.'
            })
        
        # Predict the URL
        result = detector.predict_url(url)
        
        # Determine risk level and color
        prediction = result['prediction']
        confidence = result['confidence']
        
        if prediction == 'phishing':
            risk_level = 'HIGH RISK'
            color = 'danger'
            icon = '⚠️'
        elif prediction == 'malware':
            risk_level = 'VERY HIGH RISK'
            color = 'dark'
            icon = '☠️'
        elif prediction == 'defacement':
            risk_level = 'HIGH RISK'
            color = 'warning'
            icon = '🚨'
        else:  # legitimate
            risk_level = 'SAFE'
            color = 'success'
            icon = '✅'
        
        return jsonify({
            'success': True,
            'url': url,
            'prediction': prediction,
            'risk_level': risk_level,
            'color': color,
            'icon': icon,
            'confidence': f"{confidence:.2%}",
            'details': result['all_probabilities']
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    """Predict multiple URLs"""
    global model_trained
    
    if not model_trained:
        if not detector.load_model():
            return jsonify({
                'success': False,
                'error': 'Model not trained yet. Please train the model first.'
            })
        model_trained = True
    
    try:
        data = request.get_json()
        urls = data.get('urls', [])
        
        if not urls:
            return jsonify({
                'success': False,
                'error': 'Please provide URLs to analyze.'
            })
        
        results = []
        for url in urls:
            if url.strip():
                result = detector.predict_url(url.strip())
                results.append({
                    'url': url,
                    'prediction': result['prediction'],
                    'confidence': f"{result['confidence']:.2%}",
                    'details': result['all_probabilities']
                })
        
        return jsonify({
            'success': True,
            'results': results,
            'count': len(results)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/model_status')
def model_status():
    """Check model status"""
    global model_trained
    
    if not model_trained:
        model_exists = os.path.exists('murld_model.pkl')
        return jsonify({
            'trained': False,
            'model_exists': model_exists,
            'message': 'Model exists' if model_exists else 'Model needs training'
        })
    
    return jsonify({
        'trained': True,
        'model_exists': True,
        'message': 'Model is ready for predictions'
    })

@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    if not os.path.exists('templates'):
        os.makedirs('templates')
    
    print("Starting MURLD Web Application...")
    print("Access the application at: http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)