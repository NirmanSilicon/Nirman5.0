"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, Info } from "lucide-react";

const FLASK_URL = "http://127.0.0.1:5000"; // AyuScan (Flask) UI

export default function TongueIframePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  // Listen for messages from Flask iframe
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMessage = (event: MessageEvent) => {
      const allowedOrigins = ["http://127.0.0.1:5000", "http://localhost:5000"];
      if (!allowedOrigins.includes(event.origin)) {
        return; // ignore unknown iframe origins
      }

      const data = event.data as any;
      if (!data || data.type !== "TONGUE_ANALYSIS_RESULT") return;

      console.log("🔥 Tongue Analysis Received from Flask:", data.payload);
      const result = data.payload;

      try {
        const existing = localStorage.getItem("assessmentData");
        const assessmentData = existing ? JSON.parse(existing) : {};
        assessmentData.tongueAnalysis = result;
        localStorage.setItem("assessmentData", JSON.stringify(assessmentData));
        console.log("💾 Saved tongueAnalysis to localStorage");
      } catch (e) {
        console.error("❌ Failed to store tongueAnalysis in localStorage", e);
      }

      // Redirect to dashboard after storing results
      //router.push("/dashboard");
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Leaf className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
                  Jivha Analysis
                </h1>
                <p className="text-sm text-muted-foreground">
                  Tongue Diagnostic Assessment
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              Test 2 of 2
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <Card className="bg-card border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold font-[family-name:var(--font-playfair)]">
              AI-Powered Tongue Analysis
            </CardTitle>
            <CardDescription>
              Capture your tongue inside the frame below and click "Analyze".
              Once the analysis is complete, you will be automatically redirected
              to your dashboard with personalized Ayurvedic insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-primary/5 border-primary/20 mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                For best results, take the picture in a well-lit area and extend
                your tongue fully. This tool is for awareness and not a medical
                diagnosis.
              </AlertDescription>
            </Alert>

            {/* 👇 Embedded Flask UI */}
            <div className="w-full h-[80vh] border rounded-lg overflow-hidden bg-muted">
              <iframe
                src={FLASK_URL}
                title="Tongue Analysis (Flask)"
                className="w-full h-full border-0"
                // 👇 Fixes camera/microphone blocked error
                allow="camera; microphone; fullscreen; clipboard-read; clipboard-write"
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
