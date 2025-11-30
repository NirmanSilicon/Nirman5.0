"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Hospital,
  Stethoscope,
  Megaphone,
  BarChart3,
  Brain,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const featuresData = [
  {
    id: 1,
    title: "Clinic Management",
    description:
      "From local Ayurveda clinics to global wellness centers, the Panchakarma Management Software blends tradition with digital technology to simplify operations, enhance therapy outcomes, and support personalized patient care.",
    icon: <Hospital className="w-5 h-5" />,
    image: "/features/clinic-management.png",
    capabilities: [
      "Centralized Patient Records",
      "Efficient Appointment Scheduling",
      "Integrated Billing & Payments",
      "Staff and Resource Management",
      "Compliance and Documentation",
    ],
  },
  {
    id: 2,
    title: "Diagnostic Analysis",
    description:
      "Integrated diagnostic tools supporting Ayurveda-specific assessments like Nadi, tongue, and prakriti analyses to aid accurate Panchakarma therapy planning.",
    icon: <Stethoscope className="w-5 h-5" />,
    image: "/features/diagnostic-analysis.png",
    capabilities: [
      "Support for Ayurveda-specific diagnostic tests (Nadi, tongue, prakriti)",
      "Digital recording of diagnostic parameters",
      "Data-driven personalized therapy recommendations",
      "Historical diagnostic data tracking",
      "Integration with therapy planning modules",
    ],
  },
  {
    id: 3,
    title: "Agentic Marketer",
    description:
      "Marketing automation built specifically for Panchakarma clinics to streamline patient outreach and enhance engagement through targeted campaigns.",
    icon: <Megaphone className="w-5 h-5" />,
    image: "/features/agentic-marketer.png",
    capabilities: [
      "Automated SMS and email marketing campaigns",
      "Patient segmentation for targeted outreach",
      "Personalized campaign customization",
      "Performance tracking and analytics for campaigns",
      "Integration with patient database for contact management",
    ],
  },
  {
    id: 4,
    title: "Analytics & Reporting",
    description:
      "Comprehensive reporting system delivering insights on therapy outcomes, patient adherence, and clinic operational performance for decision-making improvement.",
    icon: <BarChart3 className="w-5 h-5" />,
    image: "/features/analytics-reporting.png",
    capabilities: [
      "Comprehensive therapy outcome analytics",
      "Patient adherence and engagement reports",
      "Operational efficiency dashboards",
      "Customizable report generation",
      "Trend visualization for continuous improvement",
    ],
  },
  {
    id: 5,
    title: "AI & Automation",
    description:
      "The AI & Automation module leverages advanced artificial intelligence technologies and automation tools to enhance diagnosis accuracy, optimize therapy planning, automate routine administrative tasks, and improve patient engagement in Panchakarma clinics. This results in improved operational efficiency, personalized treatment plans, and better patient outcomes.",
    icon: <Brain className="w-5 h-5" />,
    image: "/features/ai-automation.png",
    capabilities: [
      "Personalized Dosha & Prakriti Analysis",
      "Intelligent Appointment Scheduling & Notifications",
      "Symptom Mapping & Predictive Therapy Adjustments",
      "AI-Powered Patient Engagement Tools",
      "Continuous Learning & Treatment Optimization",
    ],
  },
];

export const TabbedFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(featuresData[0].id);
  const currentFeature = featuresData.find((f) => f.id === activeFeature);

  if (!currentFeature) {
    return null;
  }

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-muted/20 to-accent/5 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
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
            Platform Features
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            What we
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Offer
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-body max-w-4xl mx-auto">
            Comprehensive Panchakarma management platform with advanced features
            designed to modernize traditional Ayurvedic practices while
            maintaining therapeutic authenticity.
          </p>
        </motion.div>

        {/* Feature Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {featuresData.map((feature, index) => (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setActiveFeature(feature.id)}
              className={`px-6 py-3 rounded-full font-heading font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeFeature === feature.id
                  ? "bg-foreground text-background shadow-lg"
                  : "bg-card border border-border text-foreground hover:bg-muted/50"
              }`}
            >
              {feature.icon}
              {feature.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Feature Content */}
        <AnimatePresence mode="wait">
          {currentFeature && (
            <motion.div
              key={currentFeature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Feature Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/3] relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-border/30 overflow-hidden">
                  <Image
                    src={currentFeature.image}
                    alt={`${currentFeature.title} feature illustration`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    priority={currentFeature.id === 1}
                  />
                  {/* Gradient overlay for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </motion.div>

              {/* Feature Content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                    {currentFeature.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed font-body">
                    {currentFeature.description}
                  </p>
                </div>

                {/* Key Capabilities */}
                <div>
                  <h4 className="text-xl font-heading font-bold text-foreground mb-4">
                    Key Capabilities:
                  </h4>
                  <div className="space-y-3">
                    {currentFeature.capabilities.map((capability, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-muted-foreground font-body leading-relaxed">
                          {capability}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Learn More Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <Button
                    className="bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transition-all duration-300 group"
                    size="lg"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
