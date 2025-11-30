'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Phone, ArrowLeft, Building2 } from 'lucide-react';
import PhoneAuth2Factor from '@/components/PhoneAuth2Factor';

export default function ClinicPhonePage() {
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePhoneSuccess = (phoneNumber: string) => {
    setVerifiedPhone(phoneNumber);
    // Store phone number in session storage for the clinic onboarding page
    sessionStorage.setItem('clinicVerifiedPhone', phoneNumber);
    // Redirect to clinic onboarding page
      router.push('/clinic-register');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="mb-8">
            <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)] mb-4">
              Join as a Clinic Partner
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Start your journey as an upyogi partner clinic. 
              Verify your phone number to begin the onboarding process.
            </p>
          </div>
          <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden">
            <Image
              src="/Hero.jpg"
              alt="Ayurvedic clinic partnership"
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Phone Verification Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="lg:hidden flex justify-center">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
              <div className="flex justify-center">
                <div className="bg-primary/10 rounded-full p-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
                Clinic Phone Verification
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your clinic's contact number to continue with the partnership application
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <PhoneAuth2Factor 
                onSuccess={handlePhoneSuccess}
                onCancel={handleCancel}
              />

              <div className="text-center text-sm text-muted-foreground">
                Already a partner?{' '}
                <Link 
                  href="/clinic-login" 
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  Sign in here
                </Link>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:text-primary/90">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:text-primary/90">
                  Privacy Policy
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
