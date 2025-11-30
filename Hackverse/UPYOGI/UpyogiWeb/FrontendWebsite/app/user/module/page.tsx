"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Circle,
  BookOpen,
  Bell,
  Star,
} from "lucide-react";
import { TherapyCard } from "@/app/module/therapy-card";
import type { TherapyModule, UserModule } from "@/types/therapy";
import { createTherapyModuleForBooking } from "@/app/module/enhanced-therapy-data";
import Link from "next/link";
import Image from "next/image";

export default function UserModulePage() {
  // Navbar for user dashboard
  const UserDashboardNavbar = () => (
    <nav className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-6 py-4 mb-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/dashboard">
            <div className="flex items-center cursor-pointer">
              <div className="relative w-12 h-12 mr-2">
                <Image
                  src="/logo.png"
                  alt="AyurSutra Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-primary font-[family-name:var(--font-playfair)]">
                AyurSutra
              </h1>
            </div>
          </Link>
        </div>
        {/* User Dashboard Links */}
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
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userModules, setUserModules] = useState<UserModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<TherapyModule | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserModules();
  }, []);

  const loadUserModules = () => {
    try {
      // Load modules from localStorage (in real app, this would be from API)
      const storedModules = localStorage.getItem("userModules");
      console.log("Stored modules:", storedModules);

      if (storedModules) {
        const modules: UserModule[] = JSON.parse(storedModules);
        console.log("Parsed modules:", modules);
        setUserModules(modules);

        // If there's a bookingId in URL, select that module
        const bookingId = searchParams.get("bookingId");
        console.log("Booking ID from URL:", bookingId);
        if (bookingId) {
          const module = modules.find(
            (m) => m.therapyModule.bookingId === bookingId
          );
          console.log("Found module for booking ID:", module);
          if (module) {
            setSelectedModule(module.therapyModule);
          }
        }
      } else {
        console.log("No modules found in localStorage");
        // Create a test module for demonstration
        createTestModule();
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading user modules:", error);
      setLoading(false);
    }
  };

  const createTestModule = () => {
    try {
      const testModule = createTherapyModuleForBooking(
        "vata-basti",
        "Test Ayurveda Clinic",
        "2024-01-15",
        "09:00",
        "test-booking-123"
      );

      if (testModule) {
        const userModule: UserModule = {
          id: "test-module-1",
          userId: "test-user",
          therapyModule: testModule,
          createdAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          completed: false,
        };

        setUserModules([userModule]);
        setSelectedModule(testModule);
        localStorage.setItem("userModules", JSON.stringify([userModule]));
        console.log("Created test module:", userModule);
      }
    } catch (error) {
      console.error("Error creating test module:", error);
    }
  };

  const handleUpdateProgress = (therapyId: string, progress: number) => {
    setUserModules((prev) =>
      prev.map((module) => {
        if (module.therapyModule.therapyId === therapyId) {
          const updatedModule = {
            ...module,
            therapyModule: {
              ...module.therapyModule,
              overallProgress: progress,
            },
            lastAccessed: new Date().toISOString(),
          };

          // Update localStorage
          const updatedModules = prev.map((m) =>
            m.therapyModule.therapyId === therapyId ? updatedModule : m
          );
          localStorage.setItem("userModules", JSON.stringify(updatedModules));

          return updatedModule;
        }
        return module;
      })
    );
  };

  const handleToggleInstruction = (
    therapyId: string,
    sectionId: string,
    instructionId: string
  ) => {
    console.log("handleToggleInstruction called:", {
      therapyId,
      sectionId,
      instructionId,
    });
    setUserModules((prev) =>
      prev.map((module) => {
        if (module.therapyModule.therapyId === therapyId) {
          const updatedModule = {
            ...module,
            therapyModule: {
              ...module.therapyModule,
              sections: module.therapyModule.sections.map((section) => {
                if (section.id === sectionId) {
                  return {
                    ...section,
                    instructions: section.instructions.map((instruction) => {
                      if (instruction.id === instructionId) {
                        return {
                          ...instruction,
                          completed: !instruction.completed,
                        };
                      }
                      return instruction;
                    }),
                  };
                }
                return section;
              }),
            },
            lastAccessed: new Date().toISOString(),
          };

          // Calculate new progress after updating instruction state
          const totalInstructions = updatedModule.therapyModule.sections.reduce(
            (acc, section) => acc + section.instructions.length,
            0
          );
          const completedInstructions =
            updatedModule.therapyModule.sections.reduce(
              (acc, section) =>
                acc +
                section.instructions.filter((inst) => inst.completed).length,
              0
            );
          const newProgress = Math.round(
            (completedInstructions / totalInstructions) * 100
          );

          // Update progress in the module
          updatedModule.therapyModule.overallProgress = newProgress;

          // Update localStorage
          const updatedModules = prev.map((m) =>
            m.therapyModule.therapyId === therapyId ? updatedModule : m
          );
          localStorage.setItem("userModules", JSON.stringify(updatedModules));

          // Update selectedModule if it's the same therapy
          if (selectedModule && selectedModule.therapyId === therapyId) {
            setSelectedModule(updatedModule.therapyModule);
          }

          return updatedModule;
        }
        return module;
      })
    );
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case "vata":
        return "bg-blue-500 text-white";
      case "pitta":
        return "bg-red-500 text-white";
      case "kapha":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getDoshaIcon = (dosha: string) => {
    switch (dosha) {
      case "vata":
        return "💨";
      case "pitta":
        return "🔥";
      case "kapha":
        return "🌱";
      default:
        return "⚡";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading your treatment modules...
          </p>
        </div>
      </div>
    );
  }

  if (userModules.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  No Treatment Modules Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You don't have any treatment modules yet. Book a therapy
                  session to get started with your personalized treatment plan.
                </p>
                <Button
                  onClick={() => router.push("/treatment")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Browse Treatments
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <UserDashboardNavbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Your Treatment Modules</h1>
                <p className="text-muted-foreground">
                  Personalized pre and post procedure instructions for your
                  treatments
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Module List */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Your Treatments</h2>
              {userModules.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Treatment Modules Yet
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Complete a booking to get your personalized treatment
                      module with pre and post procedure instructions.
                    </p>
                    <Button
                      onClick={() => router.push("/clinics")}
                      className="w-full"
                    >
                      Browse Clinics
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                userModules.map((userModule) => (
                  <Card
                    key={userModule.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedModule?.id === userModule.therapyModule.id
                        ? "ring-2 ring-primary shadow-md"
                        : ""
                    }`}
                    onClick={() => setSelectedModule(userModule.therapyModule)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-sm">
                              {userModule.therapyModule.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {userModule.therapyModule.clinic}
                            </div>
                          </div>
                          <Badge
                            className={`${getDoshaColor(
                              userModule.therapyModule.dominantDosha
                            )} text-xs`}
                          >
                            {getDoshaIcon(
                              userModule.therapyModule.dominantDosha
                            )}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              userModule.therapyModule.scheduledDate
                            ).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {userModule.therapyModule.scheduledTime}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Progress</span>
                            <span>
                              {userModule.therapyModule.overallProgress}%
                            </span>
                          </div>
                          <Progress
                            value={userModule.therapyModule.overallProgress}
                            className="h-1"
                          />
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Bell className="w-3 h-3" />
                          Last accessed:{" "}
                          {new Date(
                            userModule.lastAccessed
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Module Details */}
            <div className="lg:col-span-2">
              {selectedModule ? (
                <TherapyCard
                  therapy={selectedModule}
                  onUpdateProgress={handleUpdateProgress}
                  onToggleInstruction={handleToggleInstruction}
                />
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Select a Treatment Module
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a treatment from the list to view detailed pre and
                      post procedure instructions.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
