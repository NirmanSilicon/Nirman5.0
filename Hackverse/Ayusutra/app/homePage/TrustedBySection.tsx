"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const TrustedBySection = () => {
  // Medical/Healthcare organization logos - only existing files
  const logoData = [
    {
      logo: "/trustedByLogos/who.png",
      width: 100,
    },
    {
      logo: "/trustedByLogos/qualitas-health.png",
      width: 140,
    },
    {
      logo: "/trustedByLogos/jiva-ayurveda.png",
      width: 110,
    },
    {
      logo: "/trustedByLogos/sanyas-ayurveda.png",
      width: 130,
    },
    {
      logo: "/trustedByLogos/wellness-intl.webp",
      width: 125,
    },
    {
      logo: "/trustedByLogos/global-health.jpeg",
      width: 115,
    },
    {
      logo: "/trustedByLogos/ayurvedic-institute.png",
      width: 135,
    },
    {
      logo: "/trustedByLogos/medical-excellence.jpg",
      width: 125,
    },
    {
      logo: "/trustedByLogos/health-hub.png",
      width: 140,
    },
    {
      logo: "/trustedByLogos/karma-ayurveda.png",
      width: 130,
    },
    {
      logo: "/trustedByLogos/holistic-health.jpeg",
      width: 120,
    },
  ];

  return (
    <section className="relative py-16 lg:py-20 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
            Physicians, Specialists & Clinic Chains using{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              upyogi
            </span>{" "}
            across the World
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-body max-w-4xl mx-auto leading-relaxed">
            Join the growing community of healthcare providers who trust
            upyogi to run their practices efficiently. We build credibility
            through proven results and endorsements.
          </p>
        </motion.div>

        {/* Moving Logos */}
        <div className="flex overflow-hidden">
          <TranslateWrapper>
            <LogoRow logos={logoData} />
          </TranslateWrapper>
          <TranslateWrapper>
            <LogoRow logos={logoData} />
          </TranslateWrapper>
          <TranslateWrapper>
            <LogoRow logos={logoData} />
          </TranslateWrapper>
        </div>
      </div>
    </section>
  );
};

const TranslateWrapper = ({
  children,
  reverse,
}: {
  children: React.ReactElement;
  reverse?: boolean;
}) => {
  return (
    <motion.div
      initial={{ translateX: reverse ? "-100%" : "0%" }}
      animate={{ translateX: reverse ? "0%" : "-100%" }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="flex gap-8 px-4"
    >
      {children}
    </motion.div>
  );
};

const LogoItem = ({ logo, width }: { logo: string; width: number }) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className="flex-shrink-0 flex items-center justify-center h-16 md:h-20 bg-card/50 border border-border/30 rounded-xl hover:bg-card/80 hover:border-border/50 transition-all duration-300 px-4 backdrop-blur-sm">
      {!imageError ? (
        <Image
          src={logo}
          alt="Healthcare partner logo"
          width={width}
          height={60}
          className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 max-h-12 md:max-h-14"
          onError={() => setImageError(true)}
          priority={false}
          quality={90}
          style={{
            width: "auto",
            height: "auto",
            maxWidth: `${width}px`,
            maxHeight: "56px",
          }}
        />
      ) : (
        /* Hide completely if image fails to load */
        <div
          className="flex items-center justify-center"
          style={{ minWidth: `${width}px`, height: "56px" }}
        />
      )}
    </div>
  );
};

const LogoRow = ({
  logos,
}: {
  logos: Array<{ logo: string; width: number }>;
}) => (
  <>
    {logos.map((logoData, index) => (
      <LogoItem key={index} logo={logoData.logo} width={logoData.width} />
    ))}
  </>
);

export default TrustedBySection;
