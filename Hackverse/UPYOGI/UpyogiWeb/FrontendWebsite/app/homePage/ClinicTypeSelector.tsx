"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Users,
  Building2,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ClinicTypeSelector = () => {
  const [position, setPosition] = useState(0);

  const shiftLeft = () => {
    if (position > 0) {
      setPosition((pv) => pv - 1);
    }
  };

  const shiftRight = () => {
    if (position < clinicTypes.length - 1) {
      setPosition((pv) => pv + 1);
    }
  };

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-muted/10 to-background overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20"
          >
            <Heart className="w-4 h-4 mr-2" />
            Verified Clinics
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            Verified Panchakarma Clinics You Can
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Trust Across the World
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-body max-w-5xl mx-auto mb-12">
            Our verified Panchakarma clinics worldwide follow authentic
            Ayurvedic practices and high-quality standards. Each clinic is
            trusted to provide safe, effective, and personalized Panchakarma
            therapies for holistic healing and wellness.
          </p>

          <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Choose Your Clinic Type to Find the Right Features
          </h3>
        </motion.div>

        {/* Navigation and Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex justify-between items-center gap-4"
        >
          <div className="flex gap-2">
            <button
              className="h-fit bg-foreground p-3 text-xl text-background transition-all duration-300 hover:bg-foreground/80 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={shiftLeft}
              disabled={position === 0}
            >
              <ChevronLeft />
            </button>
            <button
              className="h-fit bg-foreground p-3 text-xl text-background transition-all duration-300 hover:bg-foreground/80 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={shiftRight}
              disabled={position === clinicTypes.length - 1}
            >
              <ChevronRight />
            </button>
          </div>

          {/* Position indicator */}
          <div className="flex gap-2">
            {clinicTypes.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === position ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Cards Container */}
        <div className="flex gap-6 overflow-hidden">
          {clinicTypes.map((clinic, index) => (
            <ClinicCard
              key={index}
              {...clinic}
              position={position}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ClinicCardProps {
  position: number;
  index: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ClinicCard = ({
  position,
  index,
  title,
  subtitle,
  description,
  icon: Icon,
}: ClinicCardProps) => {
  const translateAmt =
    position >= index ? index * 100 : index * 100 - 100 * (index - position);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      animate={{ x: `${-translateAmt}%` }}
      transition={{
        ease: "easeInOut",
        duration: 0.5,
      }}
      className={`relative flex min-h-[320px] w-full max-w-sm shrink-0 flex-col justify-between overflow-hidden p-8 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
        isEven
          ? "bg-gradient-to-br from-card to-card/80 border-border text-foreground"
          : "bg-gradient-to-br from-primary to-accent text-primary-foreground border-primary/20"
      }`}
    >
      {/* Background Icon */}
      <Icon
        className={`absolute right-4 top-4 text-6xl opacity-10 ${
          isEven ? "text-muted-foreground" : "text-primary-foreground"
        }`}
      />

      {/* Content */}
      <div>
        <div
          className={`p-3 rounded-xl mb-4 w-fit ${
            isEven
              ? "bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
              : "bg-primary-foreground/20 border border-primary-foreground/30"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              isEven ? "text-primary" : "text-primary-foreground"
            }`}
          />
        </div>

        <h3 className="text-2xl font-heading font-bold mb-2">{title}</h3>
        <p
          className={`text-sm font-medium mb-4 ${
            isEven ? "text-primary" : "text-primary-foreground/80"
          }`}
        >
          {subtitle}
        </p>
      </div>

      <p
        className={`leading-relaxed font-body ${
          isEven ? "text-muted-foreground" : "text-primary-foreground/90"
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
};

const clinicTypes = [
  {
    title: "Solo Practice",
    subtitle: "Self-Run Clinic",
    icon: User,
    description:
      "Suitable for physicians and specialists who operate their own clinic with or without assistant and receptionist.",
  },
  {
    title: "Specialist Poly Clinic",
    subtitle: "Small Panchakarma Clinic",
    icon: Users,
    description:
      "Suitable for OPD practices or polyclinics with multiple doctors and specialists having optional offerings such as Pharmacy and Lab.",
  },
  {
    title: "Clinic Chains",
    subtitle: "Panchakarma Clinic Chains",
    icon: Building2,
    description:
      "Suitable for clinic chains across multiple locations & requiring centralized management & custom business processes.",
  },
  {
    title: "NGO Clinic",
    subtitle: "Community Care Clinics",
    icon: Heart,
    description:
      "Suitable for non-profit and mission-driven healthcare organizations that operate fixed or mobile clinics.",
  },
];

export default ClinicTypeSelector;
