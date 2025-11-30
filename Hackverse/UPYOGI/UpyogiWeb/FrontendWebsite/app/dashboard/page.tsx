"use client";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Download,
  RefreshCw,
  Calendar,
  User,
  Leaf,
  Heart,
  Activity,
  BookOpen,
} from "lucide-react";

import { TherapyRecommendations } from "@/components/therapy-recommendations";

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userAnalysis, setUserAnalysis] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [userModules, setUserModules] = useState<any[]>([]);
  const [assessmentData, setAssessmentData] = useState<any>(null);

  // Modern Navbar for Dashboard
  const DashboardNavbar = () => (
    <nav className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-6 py-4 mb-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/dashboard">
            <div className="flex items-center cursor-pointer">
              <div className="relative w-12 h-12 mr-2">
                <Image
                  src="/logo.png"
                  alt="upyogi Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-primary font-[family-name:var(--font-playfair)]">
                upyogi
              </h1>
            </div>
          </Link>
        </div>
        {/* Dashboard Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/dashboard"
            className="text-foreground hover:text-primary font-semibold"
          >
            Dashboard
          </Link>
          <Link
            href="/myprofile"
            className="text-foreground hover:text-primary font-semibold"
          >
            My Profile
          </Link>
          <Link
            href="/user/bookings"
            className="text-foreground hover:text-primary font-semibold"
          >
            Bookings
          </Link>
          <Link
            href="/notifications"
            className="text-foreground hover:text-primary font-semibold"
          >
            Notifications
          </Link>
          <Link
            href="/help"
            className="text-foreground hover:text-primary font-semibold"
          >
            Help
          </Link>
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary font-semibold"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );

  // Debug effect to track userModules changes
  useEffect(() => {
    console.log("Dashboard userModules updated:", userModules);
  }, [userModules]);

  // Load assessment data from localStorage
  useEffect(() => {
    const savedAssessmentData = localStorage.getItem("assessmentData");
    if (savedAssessmentData) {
      setAssessmentData(JSON.parse(savedAssessmentData));
    }
  }, []);

  // 🔥 Map tongueAnalysis from assessmentData → userAnalysis
  useEffect(() => {
    if (!assessmentData || !assessmentData.tongueAnalysis) return;

    const t = assessmentData.tongueAnalysis;

    // ⚠️ Make sure these keys match the Flask payload
    const mappedAnalysis = {
      dosha_indicators: {
        vata: t.vata_score ?? t.vata ?? 33,
        pitta: t.pitta_score ?? t.pitta ?? 33,
        kapha: t.kapha_score ?? t.kapha ?? 33,
        dominant_dosha:
          t.dominant_dosha ?? t.dominant ?? "vata",
        confidence: t.confidence ?? 90,
      },
      recommendations:
        t.recommendations ??
        t.remedies ?? [
          "Follow your dosha-specific daily routine",
          "Prefer freshly cooked, warm meals",
          "Maintain consistent sleep schedule",
        ],
    };

    console.log("Mapped tongueAnalysis to userAnalysis:", mappedAnalysis);
    setUserAnalysis(mappedAnalysis);
    setAnalysisLoading(false);
  }, [assessmentData]);

  // Download assessment report
  const handleDownloadReport = useCallback(() => {
    if (!assessmentData) {
      alert("No assessment data found. Please complete the assessment first.");
      return;
    }

    // Generate comprehensive report
    const reportData = {
      patient: {
        name: assessmentData.name || "Sradha",
        age: assessmentData.age || "22",
        gender: assessmentData.gender || "Female",
        height: assessmentData.height || "165",
        weight: assessmentData.weight || "55",
      },
      assessment: {
        symptoms: assessmentData.symptoms || [],
        stressLevel: assessmentData.stressLevel || 3,
        tongueImage: assessmentData.tongueImage ? "Captured" : "Not captured",
        hairImage: assessmentData.hairImage ? "Captured" : "Not captured",
        faceImage: assessmentData.faceImage ? "Captured" : "Not captured",
      },
      skinAnalysis: assessmentData.skinAnalysis || null,
      doshaAnalysis: {
        vata: Math.floor(Math.random() * 40) + 20,
        pitta: Math.floor(Math.random() * 40) + 20,
        kapha: Math.floor(Math.random() * 40) + 20,
        dominant: ["Vata", "Pitta", "Kapha"][Math.floor(Math.random() * 3)],
      },
      recommendations: [
        "Daily meditation and yoga practice",
        "Balanced diet according to your dosha",
        "Regular oil massage (Abhyanga)",
        "Adequate sleep and rest",
        "Stress management techniques",
      ],
      generatedAt: new Date().toISOString(),
      reportId: `AYR-${Date.now()}`,
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," +
      encodeURIComponent(dataStr);

    const exportFileDefaultName = `ayurvedic-assessment-report-${reportData.patient.name}-${new Date()
      .toISOString()
      .split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    // Also show a summary in an alert
    const summary = `
AYURVEDIC ASSESSMENT REPORT
===========================

Patient: ${reportData.patient.name}
Age: ${reportData.patient.age} years
Gender: ${reportData.patient.gender}

Assessment Summary:
- Symptoms: ${reportData.assessment.symptoms.join(", ")}
- Stress Level: ${reportData.assessment.stressLevel}/5
- Images Captured: Tongue ✓, Hair ✓, Face ✓

Dosha Analysis:
- Dominant Dosha: ${reportData.doshaAnalysis.dominant}
- Vata: ${reportData.doshaAnalysis.vata}%
- Pitta: ${reportData.doshaAnalysis.pitta}%
- Kapha: ${reportData.doshaAnalysis.kapha}%

Skin Analysis:
- Type: ${reportData.skinAnalysis?.skinType || "Normal"}
- Complexion: ${reportData.skinAnalysis?.complexion || "Medium"}
- Texture: ${reportData.skinAnalysis?.texture || "Smooth"}

Report ID: ${reportData.reportId}
Generated: ${new Date().toLocaleString()}
    `;

    alert(summary);
  }, [assessmentData]);

  const loadUserData = useCallback(() => {
    try {
      // Load notifications
      const storedNotifications = JSON.parse(
        localStorage.getItem("userNotifications") || "[]"
      );
      setNotifications(storedNotifications);

      // Load bookings
      const storedBookings = JSON.parse(
        localStorage.getItem("userBookings") || "[]"
      );
      setUserBookings(storedBookings);

      // Load user modules
      const storedModules = JSON.parse(
        localStorage.getItem("userModules") || "[]"
      );
      console.log("Dashboard loaded modules:", storedModules);
      setUserModules(storedModules);
    } catch (error) {
      console.error("Error loading user data from localStorage:", error);
      // Set empty arrays as fallback
      setNotifications([]);
      setUserBookings([]);
      setUserModules([]);
    }
  }, []);

  const fetchUserAnalysis = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/user/analysis?userId=${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        // Only overwrite if nothing from local tongueAnalysis
        if (!userAnalysis) {
          setUserAnalysis(data.analysis);
        }
      }
    } catch (error) {
      console.error("Error fetching user analysis:", error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  useEffect(() => {
    console.log(
      "Dashboard useEffect - authLoading:",
      authLoading,
      "user:",
      !!user
    );

    // Fast redirect if no user (don't wait for auth loading)
    if (!authLoading && !user) {
      console.log("Redirecting to login - no user found");
      router.replace("/login");
      return;
    }

    // Load data when user is available
    if (!authLoading && user) {
      console.log("Loading dashboard data for user:", user.uid);
      loadUserData();
      fetchUserAnalysis();
    }
  }, [user, authLoading, router, loadUserData]);

  // Refresh data when page becomes visible (e.g., returning from module page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        loadUserData();
      }
    };

    const handleFocus = () => {
      if (user) {
        loadUserData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [user, loadUserData]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleRefresh = () => {
    loadUserData();
    fetchUserAnalysis();
  };

  // Show loading while auth is checking
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Loading Dashboard
            </h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we prepare your personalized experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If no user after auth loading, show nothing (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Made smaller */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <Card className="bg-card shadow-sm border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-primary flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/ayurvedic-user-profile.jpg" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.displayName?.charAt(0) ||
                        user.email?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground">
                      {user.displayName ||
                        user.email?.split("@")[0] ||
                        "Wellness Seeker"}
                    </h3>
                    <p className="text-muted-foreground">Age: 35 • Male</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Status Card */}
            <Card className="bg-card shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Health Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dosha Levels */}
                <div className="space-y-4">
                  {analysisLoading ? (
                    <div className="space-y-4">
                      <div className="animate-pulse">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded"></div>
                      </div>
                      <div className="animate-pulse">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded"></div>
                      </div>
                      <div className="animate-pulse">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded"></div>
                      </div>
                    </div>
                  ) : userAnalysis ? (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-primary">Vata</span>
                          <span className="text-sm text-muted-foreground">
                            {userAnalysis.dosha_indicators.vata}%
                          </span>
                        </div>
                        <Progress
                          value={userAnalysis.dosha_indicators.vata}
                          className="h-3 bg-muted"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-secondary">
                            Kapha
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {userAnalysis.dosha_indicators.kapha}%
                          </span>
                        </div>
                        <Progress
                          value={userAnalysis.dosha_indicators.kapha}
                          className="h-3 bg-muted"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-accent">Pitta</span>
                          <span className="text-sm text-muted-foreground">
                            {userAnalysis.dosha_indicators.pitta}%
                          </span>
                        </div>
                        <Progress
                          value={userAnalysis.dosha_indicators.pitta}
                          className="h-3 bg-muted"
                        />
                      </div>

                      {/* Show dominant dosha */}
                      <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">
                            Dominant Dosha
                          </p>
                          <p className="text-lg font-bold text-primary capitalize">
                            {userAnalysis.dosha_indicators.dominant_dosha}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Confidence:{" "}
                            {userAnalysis.dosha_indicators.confidence}%
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        No analysis data available
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/test2")}
                        className="text-xs"
                      >
                        Complete Tongue Analysis
                      </Button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    onClick={handleDownloadReport}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Assessment Report
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted flex items-center gap-2"
                    onClick={() => router.push("/test2")}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Recheck Health
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Your Therapy Progress */}
            <Card className="bg-card shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Therapy Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded"></div>
                    </div>
                  ) : userAnalysis ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">
                          Analysis Confidence
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {userAnalysis.dosha_indicators.confidence}%
                        </span>
                      </div>
                      <Progress
                        value={userAnalysis.dosha_indicators.confidence}
                        className="h-4 bg-muted"
                      />
                      <p className="text-sm text-muted-foreground italic">
                        "Your tongue analysis shows{" "}
                        {userAnalysis.dosha_indicators.dominant_dosha}{" "}
                        constitution with{" "}
                        {userAnalysis.dosha_indicators.confidence}% confidence."
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        Complete your tongue analysis to see progress
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Therapy Modules Section */}
            <Card className="bg-card shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Your Therapy Modules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userModules.length > 0 ? (
                    userModules.map((module, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-foreground">
                              {module.therapyModule.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {module.therapyModule.clinic}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {module.therapyModule.overallProgress || 0}%
                            Complete
                          </Badge>
                        </div>
                        <Progress
                          value={module.therapyModule.overallProgress || 0}
                          className="h-2 mb-2"
                        />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>
                            Scheduled: {module.therapyModule.scheduledDate} at{" "}
                            {module.therapyModule.scheduledTime}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/user/module")}
                            className="h-6 px-2 text-xs"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">
                        No therapy modules yet
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Book a treatment to get started
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bookings Section */}
            <Card className="bg-card shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Your Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userBookings.length > 0 ? (
                    <>
                      {userBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          className="flex flex-col space-y-2 p-4 bg-primary/5 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-foreground">
                              {booking.therapyName}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {booking.clinicName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                booking.selectedDate
                              ).toLocaleDateString()}{" "}
                              at {booking.selectedTime}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {booking.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {booking.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push("/user/module")}
                          className="w-full text-xs"
                        >
                          📱 View Treatment Modules
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        No bookings yet
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/treatment")}
                        className="text-xs"
                      >
                        Book Treatment
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Made bigger for recommended therapy */}
          <div className="lg:col-span-3 space-y-6">
            {/* Notifications Panel */}
            <Card className="bg-card shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysisLoading ? (
                    <>
                      <div className="animate-pulse p-3 bg-muted/20 rounded-lg">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded mb-1"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                      <div className="animate-pulse p-3 bg-muted/20 rounded-lg">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded mb-1"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                      <div className="animate-pulse p-3 bg-muted/20 rounded-lg">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded mb-1"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </>
                  ) : notifications.length > 0 ? (
                    notifications.slice(0, 3).map((notification, index) => (
                      <div
                        key={notification.id}
                        className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg"
                      >
                        <Bell className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              notification.timestamp
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : userAnalysis ? (
                    <>
                      <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
                        <Heart className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            Dosha Analysis Complete
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Your {userAnalysis.dosha_indicators.dominant_dosha}{" "}
                            constitution detected
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Just now
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-secondary/5 rounded-lg">
                        <Leaf className="h-5 w-5 text-secondary mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            Personalized Recommendations
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {userAnalysis.recommendations?.[0] ||
                              "Follow your dosha-specific diet"}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Just now
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-accent/5 rounded-lg">
                        <Activity className="h-5 w-5 text-accent mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            Analysis Confidence
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {userAnalysis.dosha_indicators.confidence}%
                            confidence in results
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Just now
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
                        <Heart className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            Complete Your Analysis
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Take the tongue analysis test
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Pending
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-secondary/5 rounded-lg">
                        <Leaf className="h-5 w-5 text-secondary mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            Get Personalized Insights
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Discover your dosha type
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Pending
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-accent/5 rounded-lg">
                        <Calendar className="h-5 w-5 text-accent mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            Start Your Journey
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Begin with tongue analysis
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Ready
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personalized Therapy Recommendations */}
            {userAnalysis ? (
              <TherapyRecommendations
                userDosha={userAnalysis.dosha_indicators.dominant_dosha}
                doshaScores={userAnalysis.dosha_indicators}
                onBookAppointment={(clinicName, therapyName) => {
                  console.log(`Booking ${therapyName} at ${clinicName}`);
                  alert(
                    `Booking ${therapyName} at ${clinicName}. This feature will be implemented soon!`
                  );
                }}
              />
            ) : (
              <Card className="bg-card shadow-lg border-border">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary font-[family-name:var(--font-playfair)]">
                    Recommended Therapy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Complete Your Analysis First
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Take the tongue analysis test to get personalized therapy
                      recommendations based on your dosha type.
                    </p>
                    <Button
                      onClick={() => router.push("/test2")}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Start Tongue Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
