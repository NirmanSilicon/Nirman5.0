import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Phone, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface PhoneVerificationProps {
  userId?: string;
  onVerified?: () => void;
  className?: string;
}

export function PhoneVerification({ userId, onVerified, className }: PhoneVerificationProps) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'verified'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error: sendError } = await supabase.functions.invoke('send-otp', {
        body: { phone: formattedPhone },
      });

      if (sendError) throw sendError;

      if (data?.error) {
        throw new Error(data.error);
      }

      setStep('otp');
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error: any) {
      console.error('Send OTP error:', error);
      setError(error.message || 'Failed to send OTP');
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error: verifyError } = await supabase.functions.invoke('verify-otp', {
        body: { phone: formattedPhone, otp, userId },
      });

      if (verifyError) throw verifyError;

      if (data?.error) {
        throw new Error(data.error);
      }

      setStep('verified');
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully",
      });
      onVerified?.();
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      setError(error.message || 'Invalid OTP');
      toast({
        title: "Verification failed",
        description: error.message || "Invalid code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    await handleSendOTP();
  };

  if (step === 'verified') {
    return (
      <div className={cn('flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20', className)}>
        <Check className="w-5 h-5 text-success" />
        <div>
          <p className="font-medium text-success">Phone Verified</p>
          <p className="text-sm text-muted-foreground">{phone}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {step === 'phone' ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <div className="flex gap-2">
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError(null);
                }}
                className={cn(error && 'border-destructive')}
              />
              <Button onClick={handleSendOTP} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Send OTP'
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Include country code (e.g., +1 for US, +91 for India)
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Enter the 6-digit code sent to
              </p>
              <p className="font-medium">{phone}</p>
            </div>
            
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setError(null);
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button onClick={handleVerifyOTP} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-muted-foreground hover:text-foreground"
              >
                Change number
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-primary hover:underline"
                disabled={isLoading}
              >
                Resend code
              </button>
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
