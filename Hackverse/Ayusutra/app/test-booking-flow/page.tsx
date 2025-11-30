"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CreditCard,
  MessageSquare,
  CheckCircle
} from "lucide-react";

export default function TestBookingFlowPage() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    therapyName: "Basti (Medicated Enema)",
    clinicName: "Kerala Panchakarma Vaidyasala",
    selectedDate: "2024-01-15",
    selectedTime: "10:00 AM - 11:00 AM",
    userName: "",
    userPhone: "",
    userEmail: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const simulateBooking = async () => {
    // Simulate the complete booking flow
    const bookingRecord = {
      id: Date.now().toString(),
      ...bookingData,
      paymentStatus: 'completed',
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    // Store booking in localStorage
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    existingBookings.push(bookingRecord);
    localStorage.setItem('userBookings', JSON.stringify(existingBookings));

    // Create notification
    const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    notifications.unshift({
      id: Date.now().toString(),
      type: 'booking_confirmed',
      title: 'Booking Confirmed!',
      message: `Your ${bookingData.therapyName} appointment is scheduled for ${bookingData.selectedDate} at ${bookingData.selectedTime}. WhatsApp confirmation sent!`,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('userNotifications', JSON.stringify(notifications));

    // Send WhatsApp notification
    try {
      const response = await fetch('/api/whatsapp/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: bookingData.userPhone,
          userName: bookingData.userName,
          therapyName: bookingData.therapyName,
          clinicName: bookingData.clinicName,
          selectedDate: bookingData.selectedDate,
          selectedTime: bookingData.selectedTime,
          amount: '₹1,200'
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        if (result.smsMessageId) {
          alert('✅ Booking completed successfully!\n✅ SMS & WhatsApp notifications sent!\n✅ Check your phone for confirmation messages.');
        } else {
          alert('✅ Booking completed successfully!\n✅ WhatsApp notification sent!\n⚠️ SMS failed (trial account limitation)\n✅ Check your WhatsApp for confirmation message.');
        }
      } else {
        alert('✅ Booking completed successfully!\n❌ Notifications failed: ' + result.error);
      }
    } catch (error) {
      alert('✅ Booking completed successfully!\n❌ Notifications failed: Network error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Test Complete Booking Flow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Step 1: Booking Summary */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Treatment:</span>
                    <span className="font-medium">{bookingData.therapyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clinic:</span>
                    <span className="font-medium">{bookingData.clinicName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{bookingData.selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{bookingData.selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium text-primary">₹1,200</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      type="text"
                      value={bookingData.userName}
                      onChange={(e) => handleInputChange('userName', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input
                      type="tel"
                      value={bookingData.userPhone}
                      onChange={(e) => handleInputChange('userPhone', e.target.value)}
                      placeholder="Enter your WhatsApp number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={bookingData.userEmail}
                    onChange={(e) => handleInputChange('userEmail', e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Step 3: Payment Simulation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Payment Simulation</span>
                </div>
                <p className="text-sm text-blue-700">
                  This will simulate the complete booking process including SMS and WhatsApp notifications.
                </p>
              </div>

              {/* Test Button */}
                <Button 
                  onClick={simulateBooking}
                  disabled={!bookingData.userName || !bookingData.userPhone}
                  className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Complete Booking & Send SMS & WhatsApp Notifications
                </Button>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Test Instructions:</h3>
                <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>Enter your name and phone number</li>
                  <li>Click "Complete Booking" button</li>
                  <li>Check your SMS and WhatsApp for confirmation messages</li>
                  <li>Visit dashboard to see the booking in "Your Bookings" section</li>
                  <li>Check notifications for booking confirmation</li>
                </ol>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Booking Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">SMS & WhatsApp Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Dashboard Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Notification System</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
