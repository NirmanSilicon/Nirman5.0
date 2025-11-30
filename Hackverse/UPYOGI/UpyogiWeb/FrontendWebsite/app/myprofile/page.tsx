"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  X,
} from "lucide-react";

// 👇 adjust these if your backend shape is slightly different
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
  const [notice, setNotice] = useState<string | null>(null); // soft warning instead of "Profile Not Found"

  // Build a basic fallback profile from Firebase user if API fails
  const buildFallbackProfile = (firebaseUser: any): UserProfile => {
    return {
      id: 0,
      firebase_uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      date_of_birth: "",
      gender: "not_specified",
      height_cm: 0,
      weight_kg: 0,
      activity_level: "sedentary",
      health_goals: [],
      medical_conditions: [],
      medications: [],
      allergies: [],
      dietary_preferences: [],
      sleep_pattern: "fair",
      stress_level: 5,
      test1_completed: false,
      test2_completed: false,
      created_at: "",
      updated_at: "",
      bmi: "",
      age: 0,
    };
  };

  // Fetch profile once auth is ready and user is present
  useEffect(() => {
    if (loading) return; // wait for auth

    if (!user) {
      router.push("/login");
      return;
    }

    const fetchProfile = async (userId: string) => {
      try {
        setProfileLoading(true);
        setError(null);
        setNotice(null);

        const response = await fetch(`/api/profile?userId=${userId}`);
        const data = await response.json();
        console.log("📡 /api/profile response:", { status: response.status, data });

        // Try to be flexible with backend response format
        const apiProfile =
          data.profile || data.data || data.userProfile || data.user || null;

        if (response.ok && data.success && apiProfile) {
          setProfile(apiProfile);
          setNotice(null);
        } else if (response.status === 404 || data.code === "PROFILE_NOT_FOUND") {
          // No profile row in DB yet → show fallback instead of hard error
          const fallback = buildFallbackProfile(user);
          setProfile(fallback);
          setNotice(
            "We couldn’t find a completed health profile yet. Showing basic info from your account — complete your health assessment to enrich your profile."
          );
        } else {
          // Unknown error but still build fallback so UI works
          const fallback = buildFallbackProfile(user);
          setProfile(fallback);
          setError(
            data.error || "Failed to load full profile data. Showing basic info."
          );
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        const fallback = buildFallbackProfile(user);
        setProfile(fallback);
        setError("Failed to contact profile API. Showing basic info.");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile(user.uid);
  }, [loading, user, router]);

  if (!user) return null;

  // Global loading (auth or profile)
  if (loading || profileLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const getBMICategory = (bmi: string) => {
    const bmiValue = parseFloat(bmi);
    if (isNaN(bmiValue) || bmi === "") {
      return { label: "Not calculated", color: "bg-gray-100 text-gray-800" };
    }
    if (bmiValue < 18.5)
      return { label: "Underweight", color: "bg-blue-100 text-blue-800" };
    if (bmiValue < 25)
      return { label: "Normal", color: "bg-green-100 text-green-800" };
    if (bmiValue < 30)
      return { label: "Overweight", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Obese", color: "bg-red-100 text-red-800" };
  };

  const getActivityLevelDisplay = (level: string) => {
    const levels = {
      sedentary: {
        label: "Sedentary",
        icon: "🛋️",
        color: "bg-gray-100 text-gray-800",
      },
      lightly_active: {
        label: "Lightly Active",
        icon: "🚶‍♂️",
        color: "bg-blue-100 text-blue-800",
      },
      moderately_active: {
        label: "Moderately Active",
        icon: "🚴‍♂️",
        color: "bg-green-100 text-green-800",
      },
      very_active: {
        label: "Very Active",
        icon: "🏃‍♂️",
        color: "bg-orange-100 text-orange-800",
      },
      extremely_active: {
        label: "Extremely Active",
        icon: "🏋️‍♂️",
        color: "bg-red-100 text-red-800",
      },
    };
    return (
      levels[level as keyof typeof levels] || {
        label: level || "Not set",
        icon: "❓",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  const getSleepPatternDisplay = (pattern: string) => {
    const patterns = {
      excellent: { label: "Excellent", icon: "😴", color: "bg-green-100 text-green-800" },
      good:      { label: "Good",      icon: "😊", color: "bg-blue-100 text-blue-800" },
      fair:      { label: "Fair",      icon: "😐", color: "bg-yellow-100 text-yellow-800" },
      poor:      { label: "Poor",      icon: "😞", color: "bg-orange-100 text-orange-800" },
      very_poor: { label: "Very Poor", icon: "😵", color: "bg-red-100 text-red-800" },
    };
    return (
      patterns[pattern as keyof typeof patterns] || {
        label: pattern || "Not set",
        icon: "❓",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  const getStressLevelColor = (level: number) => {
    if (level <= 3) return "bg-green-500";
    if (level <= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatArrayField = (field: string[] | null | undefined) => {
    if (!field || !Array.isArray(field) || field.length === 0) return ["None"];
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
                onClick={() => router.push("/dashboard")}
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
            <Button onClick={() => router.push("/test1")} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {/* Soft warning/error at top instead of full-screen "Profile Not Found" */}
        {(notice || error) && (
          <Card className="border border-yellow-300 bg-yellow-50">
            <CardContent className="py-3 text-sm">
              {notice && <p className="text-yellow-800">{notice}</p>}
              {error && <p className="text-red-700 mt-1">{error}</p>}
            </CardContent>
          </Card>
        )}

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
                  <span className="text-sm">
                    Age: {profile.age || "Not set"} years
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">
                    Gender: {profile.gender || "Not set"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Height: {profile.height_cm || 0} cm
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Weight: {profile.weight_kg || 0} kg
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">BMI</span>
                    <span className="text-sm font-bold">
                      {profile.bmi || "–"}
                    </span>
                  </div>
                  <Badge className={getBMICategory(profile.bmi).color}>
                    {getBMICategory(profile.bmi).label}
                  </Badge>
                </div>
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
                  <Badge
                    className={
                      getActivityLevelDisplay(profile.activity_level).color
                    }
                  >
                    {getActivityLevelDisplay(profile.activity_level).icon}{" "}
                    {getActivityLevelDisplay(profile.activity_level).label}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sleep Quality</span>
                  </div>
                  <Badge
                    className={getSleepPatternDisplay(profile.sleep_pattern).color}
                  >
                    {getSleepPatternDisplay(profile.sleep_pattern).icon}{" "}
                    {getSleepPatternDisplay(profile.sleep_pattern).label}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Stress Level</span>
                    </div>
                    <span className="text-sm font-bold">
                      {profile.stress_level}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStressLevelColor(
                        profile.stress_level
                      )}`}
                      style={{
                        width: `${(profile.stress_level / 10) * 100}%`,
                      }}
                    />
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
                      {goal
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
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
                <CardDescription>
                  Current health conditions and medications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Medical Conditions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formatArrayField(profile.medical_conditions).map(
                      (condition, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {condition
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Current Medications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formatArrayField(profile.medications).map(
                      (medication, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          <Pill className="h-3 w-3 mr-1" />
                          {medication}
                        </Badge>
                      )
                    )}
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
                <CardDescription>
                  Your eating preferences and restrictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Dietary Preferences
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formatArrayField(profile.dietary_preferences).map(
                      (preference, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {preference
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      )
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Allergies & Intolerances
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formatArrayField(profile.allergies).map(
                      (allergy, index) => (
                        <Badge
                          key={index}
                          variant="destructive"
                          className="text-xs"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {allergy
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment Progress</CardTitle>
                <CardDescription>
                  Track your completed health assessments
                </CardDescription>
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
                      <p className="text-sm text-muted-foreground">
                        Basic health and lifestyle questionnaire
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={profile.test1_completed ? "default" : "secondary"}
                  >
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
                      <p className="text-sm text-muted-foreground">
                        In-depth health evaluation
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={profile.test2_completed ? "default" : "secondary"}
                  >
                    {profile.test2_completed ? "Completed" : "Pending"}
                  </Badge>
                </div>

                {!profile.test2_completed && (
                  <Button
                    onClick={() => router.push("/test2")}
                    className="w-full mt-4"
                  >
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
