'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Calendar, 
  Ruler, 
  Weight, 
  Activity, 
  Target, 
  Heart, 
  Pill, 
  AlertTriangle, 
  Utensils,
  Moon,
  Brain,
  ArrowLeft,
  Edit,
  Check,
  X
} from 'lucide-react';

interface UserProfile {
  id: number;
  firebase_uid: string;
  email: string;
  date_of_birth: string;
  gender: string;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  health_goals: string[];
  medical_conditions: string[];
  medications: string[];
  allergies: string[];
  dietary_preferences: string[];
  sleep_pattern: string;
  stress_level: number;
  test1_completed: boolean;
  test2_completed: boolean;
  created_at: string;
  updated_at: string;
  bmi: string;
  age: number;
}

export default function MyProfile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, [user, router]);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await fetch(`/api/profile?userId=${user?.uid}`);
      const data = await response.json();

      if (data.success) {
        setProfile(data.profile);
      } else {
        setError(data.error || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setProfileLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Profile Not Found</CardTitle>
            <CardDescription>
              {error || 'Please complete the health assessment to view your profile.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={() => router.push('/test1')} className="w-full">
              Complete Health Assessment
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getBMICategory = (bmi: string) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { label: 'Underweight', color: 'bg-blue-100 text-blue-800' };
    if (bmiValue < 25) return { label: 'Normal', color: 'bg-green-100 text-green-800' };
    if (bmiValue < 30) return { label: 'Overweight', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Obese', color: 'bg-red-100 text-red-800' };
  };

  const getActivityLevelDisplay = (level: string) => {
    const levels = {
      sedentary: { label: 'Sedentary', icon: '🛋️', color: 'bg-gray-100 text-gray-800' },
      lightly_active: { label: 'Lightly Active', icon: '🚶‍♂️', color: 'bg-blue-100 text-blue-800' },
      moderately_active: { label: 'Moderately Active', icon: '🚴‍♂️', color: 'bg-green-100 text-green-800' },
      very_active: { label: 'Very Active', icon: '🏃‍♂️', color: 'bg-orange-100 text-orange-800' },
      extremely_active: { label: 'Extremely Active', icon: '🏋️‍♂️', color: 'bg-red-100 text-red-800' }
    };
    return levels[level as keyof typeof levels] || { label: level, icon: '❓', color: 'bg-gray-100 text-gray-800' };
  };

  const getSleepPatternDisplay = (pattern: string) => {
    const patterns = {
      excellent: { label: 'Excellent', icon: '😴', color: 'bg-green-100 text-green-800' },
      good: { label: 'Good', icon: '😊', color: 'bg-blue-100 text-blue-800' },
      fair: { label: 'Fair', icon: '😐', color: 'bg-yellow-100 text-yellow-800' },
      poor: { label: 'Poor', icon: '😞', color: 'bg-orange-100 text-orange-800' },
      very_poor: { label: 'Very Poor', icon: '😵', color: 'bg-red-100 text-red-800' }
    };
    return patterns[pattern as keyof typeof patterns] || { label: pattern, icon: '❓', color: 'bg-gray-100 text-gray-800' };
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatArrayField = (field: string[] | null) => {
    if (!field || !Array.isArray(field) || field.length === 0) return ['None'];
    return field;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
                  My Profile
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your personalized health profile
                </p>
              </div>
            </div>
            <Button onClick={() => router.push('/test1')} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Age: {profile.age} years</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">Gender: {profile.gender}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Height: {profile.height_cm} cm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Weight: {profile.weight_kg} kg</span>
                </div>
                {profile.bmi && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">BMI</span>
                      <span className="text-sm font-bold">{profile.bmi}</span>
                    </div>
                    <Badge className={getBMICategory(profile.bmi).color}>
                      {getBMICategory(profile.bmi).label}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity & Wellness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Activity & Wellness</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Activity Level</span>
                  </div>
                  <Badge className={getActivityLevelDisplay(profile.activity_level).color}>
                    {getActivityLevelDisplay(profile.activity_level).icon} {getActivityLevelDisplay(profile.activity_level).label}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sleep Quality</span>
                  </div>
                  <Badge className={getSleepPatternDisplay(profile.sleep_pattern).color}>
                    {getSleepPatternDisplay(profile.sleep_pattern).icon} {getSleepPatternDisplay(profile.sleep_pattern).label}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Stress Level</span>
                    </div>
                    <span className="text-sm font-bold">{profile.stress_level}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getStressLevelColor(profile.stress_level)}`}
                      style={{ width: `${(profile.stress_level / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Health Goals</span>
                </CardTitle>
                <CardDescription>What you want to achieve</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {formatArrayField(profile.health_goals).map((goal, index) => (
                    <Badge key={index} variant="secondary">
                      {goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Medical Information</span>
                </CardTitle>
                <CardDescription>Current health conditions and medications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Medical Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {formatArrayField(profile.medical_conditions).map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Current Medications</h4>
                  <div className="flex flex-wrap gap-2">
                    {formatArrayField(profile.medications).map((medication, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Pill className="h-3 w-3 mr-1" />
                        {medication}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dietary Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="h-5 w-5" />
                  <span>Dietary Information</span>
                </CardTitle>
                <CardDescription>Your eating preferences and restrictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Dietary Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {formatArrayField(profile.dietary_preferences).map((preference, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {preference.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Allergies & Intolerances</h4>
                  <div className="flex flex-wrap gap-2">
                    {formatArrayField(profile.allergies).map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {allergy.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment Progress</CardTitle>
                <CardDescription>Track your completed health assessments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {profile.test1_completed ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <h4 className="font-medium">Health Assessment</h4>
                      <p className="text-sm text-muted-foreground">Basic health and lifestyle questionnaire</p>
                    </div>
                  </div>
                  <Badge variant={profile.test1_completed ? "default" : "secondary"}>
                    {profile.test1_completed ? "Completed" : "Pending"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {profile.test2_completed ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <h4 className="font-medium">Detailed Assessment</h4>
                      <p className="text-sm text-muted-foreground">In-depth health evaluation</p>
                    </div>
                  </div>
                  <Badge variant={profile.test2_completed ? "default" : "secondary"}>
                    {profile.test2_completed ? "Completed" : "Pending"}
                  </Badge>
                </div>

                {!profile.test2_completed && (
                  <Button onClick={() => router.push('/test2')} className="w-full mt-4">
                    Continue to Detailed Assessment
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
