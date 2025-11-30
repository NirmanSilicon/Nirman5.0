"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

const MedicalSpecialties = () => {
  const specialties = [
    { name: "Aesthetic" },
    { name: "Allergy" },
    { name: "Alternative Medicine" },
    { name: "Ayurveda" },
    { name: "Cardiology" },
    { name: "Cosmetology" },
    { name: "Dentist" },
    { name: "Dermatology" },
    { name: "Diabetology" },
    { name: "Endocrinology" },
    { name: "Family Physician" },
    { name: "Gastroenterology" },
    { name: "General Practitioner" },
    { name: "Hematology" },
    { name: "Immunology" },
    { name: "IVF" },
    { name: "Nephrology" },
    { name: "Neurology" },
    { name: "Obstetrics and Gynaecology" },
    { name: "Oncology" },
    { name: "Ophthalmology" },
    { name: "Orthopedics" },
    { name: "Otolaryngology (ENT)" },
    { name: "Pediatrics" },
    { name: "Pathology" },
    { name: "Physiotherapy" },
    { name: "Psychiatry" },
    { name: "Psychology" },
    { name: "Radiology" },
    { name: "Rheumatology" },
    { name: "Sexology" },
    { name: "Surgery" },
    { name: "Trichology" },
    { name: "Urology" },
  ];

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/6 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
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
            <CheckCircle className="w-4 h-4 mr-2" />
            Specialized Features
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Click on your{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Specialty
            </span>{" "}
            to View Features
            <br />
            Tailored for you
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-body max-w-4xl mx-auto">
            Our platform offers specialized features and workflows designed
            specifically for your medical practice. Select your specialty to
            discover how upyogi can enhance your patient care and streamline
            your operations.
          </p>
        </motion.div>

        {/* Specialties Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-6xl mx-auto"
        >
          {specialties.map((specialty, index) => (
            <motion.div
              key={specialty.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: index * 0.02,
                type: "spring",
                stiffness: 120,
              }}
            >
              <Link href="#" className="block group">
                <div className="relative overflow-hidden rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 hover:scale-105 group-hover:bg-gradient-to-r group-hover:from-primary/20 group-hover:to-accent/20">
                  {/* Checkmark icon */}
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-heading font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors duration-300 whitespace-nowrap">
                      {specialty.name}
                    </span>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Don&apos;t see your specialty?
            </h3>
            <p className="text-muted-foreground font-body mb-8 max-w-2xl mx-auto">
              Our platform is designed to be flexible and adaptable. Contact us
              to discuss how we can customize upyogi for your specific
              medical practice needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-heading font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Contact Us
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 border border-border text-foreground rounded-lg font-heading font-semibold hover:bg-muted/50 transition-colors duration-300"
              >
                Request Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MedicalSpecialties;
