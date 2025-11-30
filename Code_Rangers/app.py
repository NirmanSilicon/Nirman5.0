from flask import Flask, request, jsonify, render_template
import smtplib
import ssl
from email.message import EmailMessage
from flask_cors import CORS
import os

app = Flask(__name__)

# Manual CORS handling
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send-email', methods=['POST', 'OPTIONS'])
def send_email():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', '*')
        return response
    
    try:
        data = request.get_json()
        email = data.get('email')
        booking_details = data.get('bookingDetails')
        
        print(f"Sending email to: {email}")
        print(f"Booking: {booking_details}")
        
        # Email configuration
        sender_email = "smartyatra11@gmail.com"
        sender_password = "craj bxsk hpbn dngo"
        
        msg = EmailMessage()
        msg["From"] = sender_email
        msg["To"] = email
        msg["Subject"] = "Bhubaneswar City Bus - Booking Confirmation"
        
        email_content = f"""
Dear Passenger,

Your bus seat reservation has been successfully confirmed!

Booking Details:
- Booking Reference: {booking_details.get('bookingRef')}
- Route: {booking_details.get('route')}
- Seats: {booking_details.get('seats')}
- Number of Seats: {booking_details.get('seatCount')}
- Total Amount: ₹{booking_details.get('totalAmount')}
- Date: {booking_details.get('date')}

Please carry this confirmation with you during your journey.

Thank you for choosing Bhubaneswar City Bus Service!

Safe travels!
"""
        msg.set_content(email_content)
        
        # Send email
        ctx = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=ctx) as smtp:
            smtp.login(sender_email, sender_password)
            smtp.send_message(msg)
        
        return jsonify({"success": True, "message": "Email sent successfully"})
    
    except Exception as e:
        error_msg = f"Failed to send email: {str(e)}"
        print(error_msg)
        return jsonify({"success": False, "message": error_msg}), 500

if __name__ == '__main__':
    if not os.path.exists('templates'):
        os.makedirs('templates')
    app.run(debug=True, port=5000)