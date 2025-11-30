"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  Lock,
  Shield,
  MessageSquare,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { createTherapyModuleForBooking } from "@/app/module/enhanced-therapy-data";
import type { UserModule } from "@/types/therapy";

interface BookingData {
  therapyId: string;
  therapyName: string;
  clinicId: number;
  clinicName: string;
  selectedDate: string;
  selectedTime: string;
  userInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function PaymentPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentCode, setPaymentCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [error, setError] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem('bookingData');
    if (storedData) {
      setBookingData(JSON.parse(storedData));
    } else {
      router.push('/');
    }
  }, [router]);

  const handlePayment = async () => {
    if (paymentCode !== "4007") {
      setError("Invalid payment code. Please enter 4007 for demo.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create booking via API for assessment
      const assessmentData = localStorage.getItem('assessmentData');
      const parsedAssessmentData = assessmentData ? JSON.parse(assessmentData) : {};

      console.log("Calling assessment booking API...");
      const bookingResponse = await fetch('/api/booking/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          therapyName: bookingData?.therapyName || 'Complete Ayurvedic Assessment',
          selectedDate: bookingData?.selectedDate || new Date().toLocaleDateString(),
          selectedTime: bookingData?.selectedTime || new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          amount: 2500,
          currency: 'INR',
          userInfo: bookingData?.userInfo || {
            name: 'Sradha',
            phone: '+919876543210',
            email: 'sradha@example.com'
          },
          assessmentData: parsedAssessmentData
        }),
      });

      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text();
        console.error("Booking API error:", bookingResponse.status, errorText);
        throw new Error(`Failed to create booking: ${bookingResponse.status} ${errorText}`);
      }

      const bookingResult = await bookingResponse.json();
      console.log("Booking result:", bookingResult);
      const bookingRecord = bookingResult.booking;

      // Store booking in localStorage (in real app, this would be sent to backend)
      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      existingBookings.push(bookingRecord);
      localStorage.setItem('userBookings', JSON.stringify(existingBookings));

      // Update user notifications
      const notifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
      notifications.unshift({
        id: Date.now().toString(),
        type: 'booking_confirmed',
        title: 'Booking Confirmed!',
        message: `Your ${bookingData?.therapyName} appointment is scheduled for ${bookingData?.selectedDate} at ${bookingData?.selectedTime}`,
        timestamp: new Date().toISOString(),
        read: false
      });
      localStorage.setItem('userNotifications', JSON.stringify(notifications));

      // Create treatment module
      const therapyModule = createTherapyModuleForBooking(
        bookingData?.therapyId || '',
        bookingData?.clinicName || '',
        bookingData?.selectedDate || '',
        bookingData?.selectedTime || '',
        bookingRecord.id
      );

      if (therapyModule) {
        const userModule: UserModule = {
          id: `module-${Date.now()}`,
          userId: 'current-user', // In real app, get from auth context
          therapyModule,
          createdAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          completed: false
        };

        // Store module in localStorage
        const existingModules = JSON.parse(localStorage.getItem('userModules') || '[]');
        existingModules.push(userModule);
        localStorage.setItem('userModules', JSON.stringify(existingModules));

        // Add module access notification
        notifications.unshift({
          id: (Date.now() + 1).toString(),
          type: 'module_created',
          title: 'Treatment Module Created!',
          message: `Your personalized ${therapyModule.name} module is now available with pre and post procedure instructions.`,
          timestamp: new Date().toISOString(),
          read: false
        });
        localStorage.setItem('userNotifications', JSON.stringify(notifications));
      }

      setPaymentStatus('success');

      // Redirect to dashboard after successful payment
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      setPaymentStatus('failed');
      setError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };


  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Booking Data Found</h1>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Booking
        </Button>

        <div className="max-w-2xl mx-auto">
          {/* Payment Status */}
          {paymentStatus === 'success' && (
            <Card className="border-0 shadow-lg mb-6">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground mb-4">
                  Your booking has been confirmed and saved to your account.
                </p>
                
                <div className="bg-muted/50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Redirecting to dashboard...</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Redirecting to dashboard...
                </p>
              </CardContent>
            </Card>
          )}

          {paymentStatus === 'failed' && (
            <Card className="border-0 shadow-lg mb-6">
              <CardContent className="p-6 text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
                <p className="text-muted-foreground mb-4">
                  {error || "Something went wrong. Please try again."}
                </p>
                <Button onClick={() => setPaymentStatus('pending')}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {paymentStatus === 'pending' && (
            <>
              {/* Booking Summary */}
              <Card className="border-0 shadow-lg mb-6">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">{bookingData.therapyName}</h4>
                      <p className="text-sm text-muted-foreground">{bookingData.clinicName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {bookingData.therapyName.includes('Basti') ? '₹1,200' : '₹1,000'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{bookingData.selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{bookingData.selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Patient:</span>
                      <span className="font-medium">{bookingData.userInfo.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Security Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Secure Payment</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your payment information is encrypted and secure. We use industry-standard security measures.
                    </p>
                  </div>

                  {/* Demo Payment Code */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Payment Verification Code *
                      </label>
                      <Input
                        type="text"
                        value={paymentCode}
                        onChange={(e) => setPaymentCode(e.target.value)}
                        placeholder="Enter 4-digit code"
                        maxLength={4}
                        className="text-center text-lg tracking-widest"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Demo: Enter <strong>4007</strong> to complete payment
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Demo Mode</span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        This is a demo payment system. Use code <strong>4007</strong> to simulate successful payment.
                      </p>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <Button 
                    onClick={handlePayment}
                    disabled={isProcessing || paymentCode.length !== 4}
                    className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Complete Payment
                      </>
                    )}
                  </Button>

                  {/* Payment Methods */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">We accept:</p>
                    <div className="flex justify-center gap-4">
                      <Badge variant="outline">Credit Card</Badge>
                      <Badge variant="outline">Debit Card</Badge>
                      <Badge variant="outline">UPI</Badge>
                      <Badge variant="outline">Net Banking</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
