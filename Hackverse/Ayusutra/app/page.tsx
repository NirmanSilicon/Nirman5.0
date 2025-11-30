"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import MobileMenu from "@/components/mobile-menu";
import { HeroSection } from "./homePage/HeroSection";
import TrustedBySection from "./homePage/TrustedBySection";
import ClinicTypeSelector from "./homePage/ClinicTypeSelector";
import { TabbedFeatures } from "./homePage/TabbedFeatures";
import { VideoSection } from "./homePage/VideoSection";
import { ProblemsWesolve } from "./homePage/ProblemsWesolve";
import { AyurvedicPrinciples } from "./homePage/AyurvedicPrinciples";
import MedicalSpecialties from "./homePage/MedicalSpecialties";
import { Footer } from "@/components/footer";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar toggleMobileMenu={toggleMobileMenu} />
      {/* Mobile Menu */}
      <MobileMenu
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={closeMobileMenu}
      />
      {/* Main Content */}
      <HeroSection />
      <TrustedBySection />
      <ClinicTypeSelector />
      <TabbedFeatures />
      <VideoSection />
      <ProblemsWesolve />
      <AyurvedicPrinciples />
      <MedicalSpecialties />
      <Footer />
    </main>
  );
}
