"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Brain, Camera, Target } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const doshaData = [
  {
    id: 1,
    title: "Vata Constitution",
    element: "Air + Space",
    description:
      "Governs all movement in the body including breathing, circulation, and nervous system. Our AI tongue analysis identifies Vata imbalances through texture patterns, dryness levels, and surface irregularities. The gamified assessment analyzes sleep patterns, energy fluctuations, and movement preferences to calculate precise Vata percentages.",
    imgSrc: "/doshas/vata.jpeg",
    color: "from-blue-500 to-purple-600",
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "Pitta Constitution",
    element: "Fire + Water",
    description:
      "Controls digestion, metabolism, and transformation processes in the body. Advanced computer vision detects Pitta markers through tongue color analysis, heat patterns, and inflammatory indicators. Our interactive questionnaire measures digestive strength, body temperature preferences, and metabolic responses for accurate Pitta assessment.",
    imgSrc: "/doshas/pitta.jpeg",
    color: "from-orange-500 to-red-600",
    icon: <Brain className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "Kapha Constitution",
    element: "Earth + Water",
    description:
      "Provides structure, stability, and immunity to the body. Machine learning algorithms analyze tongue moisture levels, coating thickness, and structural patterns to assess Kapha constitution. The comprehensive evaluation examines physical build, emotional stability, and immune response patterns for precise recommendations.",
    imgSrc: "/doshas/kapha.jpeg",
    color: "from-green-500 to-emerald-600",
    icon: <Camera className="w-5 h-5" />,
  },
];

export const AyurvedicPrinciples = () => {
  const [open, setOpen] = useState(doshaData[0].id);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const imgSrc = doshaData.find((s) => s.id === open)?.imgSrc;

  // Auto-cycle through cards every 3 seconds
  useEffect(() => {
    if (isUserInteracting) return; // Don't auto-cycle if user is interacting

    const interval = setInterval(() => {
      setOpen((current) => {
        const currentIndex = doshaData.findIndex((d) => d.id === current);
        const nextIndex = (currentIndex + 1) % doshaData.length;
        return doshaData[nextIndex].id;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isUserInteracting]);

  // Reset user interaction flag after 6 seconds of no interaction
  useEffect(() => {
    if (!isUserInteracting) return;

    const timeout = setTimeout(() => {
      setIsUserInteracting(false);
    }, 6000);

    return () => clearTimeout(timeout);
  }, [isUserInteracting]);

  const handleCardClick = (doshaId: number) => {
    setIsUserInteracting(true);
    setOpen(doshaId);
  };

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-accent/5 to-primary/5 overflow-hidden">
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
            Ancient Wisdom, Modern Innovation
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            Ayurvedic Principles
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-body max-w-4xl mx-auto">
            Experience the perfect fusion of 5,000-year-old Ayurvedic wisdom
            with cutting-edge AI technology. Our platform combines traditional
            Dosha assessment with modern computer vision to deliver personalized
            healthcare like never before.
          </p>
        </motion.div>

        {/* Accordion Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-6xl mx-auto grid gap-8 grid-cols-1 lg:grid-cols-[1fr_400px]"
        >
          <div>
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-8 text-foreground">
              The Three Doshas
            </h3>
            <div className="flex flex-col gap-4">
              {doshaData.map((dosha) => {
                return (
                  <DoshaAccordion
                    {...dosha}
                    key={dosha.id}
                    open={open}
                    setOpen={handleCardClick}
                    index={dosha.id}
                  />
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={imgSrc}
              className="bg-gradient-to-br from-muted/30 to-accent/20 rounded-2xl aspect-[4/3] lg:aspect-auto border border-border/30"
              style={{
                backgroundImage: imgSrc ? `url(${imgSrc})` : undefined,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
          </AnimatePresence>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Ready to Discover Your Dosha?
            </h3>
            <p className="text-muted-foreground font-body mb-8 max-w-2xl mx-auto">
              Take our comprehensive AI-powered assessment combining gamified
              questionnaires and advanced tongue analysis to unlock personalized
              Ayurvedic insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-heading font-semibold flex items-center justify-center gap-2 group transition-all duration-300 hover:shadow-lg"
              >
                Start Your Assessment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 border border-border text-foreground rounded-lg font-heading font-semibold hover:bg-muted/50 transition-colors duration-300"
              >
                Learn More About Doshas
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const DoshaAccordion = ({
  title,
  element,
  description,
  index,
  open,
  setOpen,
  color,
  icon,
}: {
  title: string;
  element: string;
  description: string;
  index: number;
  open: number;
  setOpen: (doshaId: number) => void;
  color: string;
  icon: React.ReactNode;
}) => {
  const isOpen = index === open;

  return (
    <div
      onClick={() => setOpen(index)}
      className="p-0.5 rounded-xl relative overflow-hidden cursor-pointer"
    >
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "280px" : "80px",
        }}
        className="p-6 rounded-[11px] bg-card/80 backdrop-blur-sm border border-border/50 flex flex-col justify-between relative z-20 shadow-sm"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-2 rounded-lg bg-gradient-to-r ${color} text-white`}
            >
              {icon}
            </div>
            <div>
              <motion.p
                initial={false}
                animate={{
                  color: isOpen ? "rgba(0, 0, 0, 0)" : "hsl(var(--foreground))",
                }}
                className={`text-xl font-heading font-bold w-fit bg-gradient-to-r ${color} bg-clip-text`}
              >
                {title}
              </motion.p>
              <p className="text-sm text-muted-foreground font-body">
                {element}
              </p>
            </div>
          </div>
          <motion.p
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
            }}
            className={`mt-4 bg-gradient-to-r ${color} bg-clip-text text-transparent font-body leading-relaxed`}
          >
            {description}
          </motion.p>
        </div>
        <motion.button
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
          }}
          className={`-ml-6 -mr-6 -mb-6 mt-4 py-3 rounded-b-[11px] flex items-center justify-center gap-2 group transition-[gap] bg-gradient-to-r ${color} text-white font-heading font-semibold`}
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
        }}
        className={`absolute inset-0 z-10 bg-gradient-to-r ${color}`}
      />
      <div className="absolute inset-0 z-0 bg-muted/20" />
    </div>
  );
};
