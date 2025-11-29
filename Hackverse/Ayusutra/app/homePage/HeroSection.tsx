"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LightRays from "@/components/ui/LightRays";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Bell,
  Activity,
  BarChart3,
  ArrowRight,
  Sparkles,
  Shield,
  Users,
  Brain,
  Camera,
} from "lucide-react";

export function HeroSection() {
  const router = useRouter();

  const handlePartnerClick = () => {
    router.push('/clinic-login');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Light Rays Background Effect */}
      <div className="absolute inset-0 z-[1]">
        <LightRays
          raysOrigin="top-center"
          raysColor="#059669"
          raysSpeed={1.0}
          lightSpread={0.6}
          rayLength={3.0}
          pulsating={true}
          fadeDistance={0.5}
          saturation={1.0}
          followMouse={true}
          mouseInfluence={0.25}
          noiseAmount={0.1}
          distortion={0.08}
          className="opacity-80"
        />
      </div>

      {/* Subtle dark overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10 z-[1]" />

      {/* Background Elements */}
      <div className="absolute inset-0 bg-hero-gradient z-[2]" />

      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden z-[3]">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium bg-accent/50 text-accent-foreground border border-accent/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Ministry of Ayush Initiative
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                upyogi
              </span>
              <br />
              <span className="text-foreground/90 font-heading">
                Panchakarma
              </span>
              <br />
              <span className="text-muted-foreground text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-body font-medium">
                Patient Management
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-body max-w-2xl mx-auto lg:mx-0"
            >
              Bridging{" "}
              <span className="font-semibold text-primary">
                Ancient Ayurvedic Wisdom
              </span>{" "}
              with
              <span className="font-semibold text-primary">
                {" "}
                AI-Powered Healthcare Technology
              </span>
              . Revolutionary Dosha assessment through gamified questionnaires
              and AI tongue analysis for personalized{" "}
              <span className="font-semibold text-accent">
                Panchakarma therapy recommendations
              </span>
              .
            </motion.p>

            {/* Key Features Pills */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10"
            >
              <Badge variant="outline" className="px-4 py-2 bg-background/50">
                <Brain className="w-4 h-4 mr-2" />
                AI Dosha Assessment
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-background/50">
                <Camera className="w-4 h-4 mr-2" />
                Tongue Analysis
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-background/50">
                <Activity className="w-4 h-4 mr-2" />
                Personalized Therapy
              </Badge>
              <Badge variant="outline" className="px-4 py-2 bg-background/50">
                <BarChart3 className="w-4 h-4 mr-2" />
                Real-time Tracking
              </Badge>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12"
            >
              <Button
                size="lg"
                onClick={handlePartnerClick}
                className="group px-8 py-4 text-lg font-semibold animate-pulse-glow hover:scale-105 transition-all duration-300"
              >
                Become our partner
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold hover:scale-105 transition-all duration-300"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>AIIA Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Trusted by 500+ Centers</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span>99.9% Uptime</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="relative flex justify-center items-center"
          >
            <div className="relative">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl transform scale-110" />

              {/* Main image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <Image
                  src="/heroo.jpg"
                  alt="upyogi - Modern Ayurvedic Healthcare Technology"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-2xl object-cover border border-border/20"
                  priority
                />
              </motion.div>

              {/* Floating elements around the image */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg z-20"
              >
                <Activity className="w-10 h-10 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center shadow-lg z-20"
              >
                <Calendar className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0], x: [0, 3, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute top-1/2 -right-8 w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg z-20"
              >
                <Bell className="w-7 h-7 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
