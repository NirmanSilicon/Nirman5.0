'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, ArrowLeft, CheckCircle } from 'lucide-react';

interface PhoneAuth2FactorProps {
  onSuccess: (phoneNumber: string) => void;
  onCancel: () => void;
}

export default function PhoneAuth2Factor({ onSuccess, onCancel }: PhoneAuth2FactorProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'phone' | 'verification'>('phone');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Format phone number (add + if not present)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: formattedPhone }),
      });

      const data = await response.json();

      if (data.success) {
        setSessionId(data.sessionId);
        setStep('verification');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim() || !sessionId) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, otp }),
      });

      const data = await response.json();

      if (data.success) {
        // Format phone number for success callback
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
        onSuccess(formattedPhone);
      } else {
        setError(data.error || 'Invalid verification code');
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setSessionId('');
  };

  return (
    <div className="space-y-6">
      {step === 'phone' ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10 bg-input border-border"
                placeholder="+1234567890"
                required
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Include country code (+91 for India)
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send OTP'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 border-border hover:bg-accent"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Enter Verification Code</h3>
            <p className="text-sm text-muted-foreground">
              We sent a 4-digit code to {phoneNumber}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium text-foreground">
              Verification Code
            </label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center text-lg tracking-widest bg-input border-border"
              placeholder="0000"
              maxLength={4}
              required
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify & Continue'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToPhone}
              className="px-6 border-border hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
