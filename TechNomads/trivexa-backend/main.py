from functools import wraps
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'medicines.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# app.config['SECRET_KEY'] = 'we-are-using-authentication-just-to-show-the-security-of-our-apis'
# app.config['USERNAME'] = 'shubh'
# app.config['PASSWORD'] = 'uwu'

db = SQLAlchemy(app)

# Database Model
class Medicine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))

    def __repr__(self):
        return f'<Medicine {self.name}>'

@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/api/data')
# @auth_required
def get_data():
    return jsonify({'data': 'This is a protected route.'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
