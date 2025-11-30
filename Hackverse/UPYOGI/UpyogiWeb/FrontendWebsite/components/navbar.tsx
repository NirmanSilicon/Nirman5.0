"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Menu, UserCircle } from "lucide-react";
import Image from "next/image";

interface NavbarProps {
  toggleMobileMenu: () => void;
}

export function Navbar({ toggleMobileMenu }: NavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="relative w-15 h-15 mr-2">
                <Image
                  src="/logo.png"
                  alt="upyogi Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-playfair)]">
                upyogi
              </h1>
            </div>
          </Link>
        </div>

        {/* Navigation Links with Dropdowns */}
        <div className="hidden md:flex items-center space-x-8">
          {/* Features Dropdown */}
          <div className="relative group">
            <button className="text-foreground hover:text-primary transition-colors cursor-pointer font-semibold">
              Features
            </button>
            <div className="absolute left-0 mt-2 w-72 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
              <div className="px-4 py-2 font-bold text-primary">
                Feature by Clinic
              </div>
              <Link
                href="/solo-panchakarma"
                className="block px-4 py-2 hover:bg-primary/10"
              >
                Solo Panchakarma Practice
              </Link>
              <Link
                href="/wellness-clinic"
                className="block px-4 py-2 hover:bg-primary/10"
              >
                Panchakarma Wellness Clinic
              </Link>
              <Link
                href="/multi-location"
                className="block px-4 py-2 hover:bg-primary/10"
              >
                Multi-location Panchakarma Center
              </Link>
              <Link
                href="/all-features"
                className="block px-4 py-2 hover:bg-primary/10"
              >
                All Features
              </Link>
              <div className="px-4 py-2 font-bold text-primary border-t">
                Feature by Module
              </div>
              <Link
                href="/patient-guide"
                className="block px-4 py-2 hover:bg-primary/10"
              >
                Patient Guide
              </Link>
              <Link
                href="/progress-tracking"
                className="block px-4 py-2 hover:bg-primary/10"
              >
                Progress Tracking
              </Link>
              <Link
                href="/dietary-scheduling"
                className="block px-4 py-2 hover:bg-primary/10"
              >
                Dietary Scheduling
              </Link>
              <Link
                href="/clinic-report"
                className="block px-4 py-2 hover:bg-primary/10"
              >
                Clinic Report
              </Link>
            </div>
          </div>

          {/* Diagnostic Tools */}
          <Link
            href="/diagnostic-tools"
            className="text-foreground hover:text-primary transition-colors font-semibold"
          >
            Diagnostic Tools
          </Link>

          {/* Analytics */}
          <Link
            href="/analytics"
            className="text-foreground hover:text-primary transition-colors font-semibold"
          >
            Analytics
          </Link>

          {/* Notification */}
          <Link
            href="/notifications"
            className="text-foreground hover:text-primary transition-colors font-semibold"
          >
            Notification
          </Link>

          {/* Resources Dropdown */}
          <div className="relative group">
            <button className="text-foreground hover:text-primary transition-colors cursor-pointer font-semibold">
              Resources
            </button>
            <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
              <Link
                href="/blog"
                className="block px-4 py-2 hover:bg-primary/10"
              >
                Blog
              </Link>
              <Link
                href="/guides"
                className="block px-4 py-2 hover:bg-primary/10"
              >
                Guides
              </Link>
              <Link href="/faq" className="block px-4 py-2 hover:bg-primary/10">
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            // Authenticated User Menu
            <>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary hover:cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                <User className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary hover:cursor-pointer"
                onClick={() => router.push("/myprofile")}
              >
                <UserCircle className="h-4 w-4 mr-2" />
                My Profile
              </Button>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary hover:cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            // Guest User Buttons
            <>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary hover:cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
              <Button
                variant="outline"
                className="hidden sm:flex hover:cursor-pointer"
                onClick={() => router.push("/phone-page")}
              >
                Sign Up
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Book Consultation
              </Button>
              <Link
                href="/clinic-login"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Clinic Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  );
}
