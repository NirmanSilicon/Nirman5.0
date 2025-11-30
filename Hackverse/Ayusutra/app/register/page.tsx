'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Leaf, Mail, Lock, User, Phone, CheckCircle } from 'lucide-react';
import { createUserProfileWithPhone, updateUserPhone, getUserStatus } from '@/lib/database';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState('');
  
  const { register, registerWithPhone, loginWithGoogle } = useAuth();
  const router = useRouter();

  // Check for verified phone number from session storage
  useEffect(() => {
    const phone = sessionStorage.getItem('verifiedPhone');
    if (phone) {
      setVerifiedPhone(phone);
    } else {
      // If no verified phone, redirect to phone verification
      router.push('/phone-page');
    }
  }, [router]);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!verifiedPhone) {
      setError('Phone verification is required');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Always use phone-verified registration since we require phone verification
      await registerWithPhone(verifiedPhone, email, password, name);
      
      // Clear the verified phone from session storage
      sessionStorage.removeItem('verifiedPhone');
      
      // New users always start with test1
      router.push('/test1');
    } catch (error) {
      const errorMessage = error as { code?: string; message?: string };
      if (errorMessage.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (errorMessage.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (errorMessage.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setError('');
      setLoading(true);
      
      if (!verifiedPhone) {
        setError('Phone verification is required');
        return;
      }
      
      const userCredential = await loginWithGoogle();
      
      // Store phone number in database for Google users
      if (userCredential?.user) {
        try {
          const response = await fetch('/api/user/create-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firebase_uid: userCredential.user.uid,
              email: userCredential.user.email,
              full_name: userCredential.user.displayName || '',
              phone_number: verifiedPhone,
            }),
          });

          if (!response.ok) {
            console.error('Failed to create user profile with phone number');
          }
        } catch (error) {
          console.error('Error creating user profile:', error);
        }
      }
      
      // Clear the verified phone from session storage
      sessionStorage.removeItem('verifiedPhone');
      
      // Check user status and redirect accordingly
      if (userCredential?.user) {
        const statusResponse = await fetch(`/api/user/status?userId=${userCredential.user.uid}`);
        if (statusResponse.ok) {
          const userStatus = await statusResponse.json();
          router.push(userStatus.next_step);
        } else {
          router.push('/test1');
        }
      } else {
        router.push('/test1');
      }
    } catch (error) {
      const errorMessage = error as { message?: string };
      setError(errorMessage.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="mb-8">
            <Leaf className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground font-[family-name:var(--font-playfair)] mb-4">
              Join upyogi
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Begin your journey to wellness with authentic Ayurvedic healing. 
              Discover personalized treatments and holistic health solutions.
            </p>
          </div>
          <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden">
            <Image
              src="/Hero.jpg"
              alt="Ayurvedic wellness journey"
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="lg:hidden flex justify-center">
                <Leaf className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
                Create Account
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Start your wellness journey with upyogi today
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Phone Verification Status */}
              {verifiedPhone && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Phone verified: {verifiedPhone}
                </div>
              )}

              {/* Social Login */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoogleRegister}
                  variant="outline"
                  className="w-full h-11 border-border hover:bg-accent hover:text-accent-foreground"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="relative">
                <Separator className="bg-border" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-card px-4 text-sm text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailRegister} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-input border-border"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-input border-border"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-input border-border"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-input border-border"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-primary hover:text-primary/90 transition-colors"
                >
                  Sign in here
                </Link>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our{' '}
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
