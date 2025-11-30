"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Bell,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";

const problemsData = [
  {
    id: 1,
    title: "Therapy Scheduling & Consistency",
    icon: Calendar,
    problems: [
      "Frequent manual errors in scheduling therapy sessions for patients and practitioners",
      "Overlapping bookings and missed therapies reduce quality and trust",
      "Inconsistent therapy protocols and standards across different therapists or centers",
      "Last-minute cancellations not communicated efficiently",
      "No way to automatically optimize schedules based on therapist skills and availability",
    ],
  },
  {
    id: 2,
    title: "Patient Guidance & Notifications",
    icon: Bell,
    problems: [
      "Patients uninformed about important pre-procedure precautions and post-care steps",
      "Missed or forgotten precautions reduce therapy effectiveness",
      "No automated system to send timely reminders for upcoming sessions or care routines",
      "Lack of personalized channel choices (SMS, app, email) for notifications",
      "Difficulty tracking which patients have received and acknowledged instructions",
    ],
  },
  {
    id: 3,
    title: "Therapy Progress Tracking & Feedback",
    icon: Activity,
    problems: [
      "No centralized way to monitor therapy progress and recovery over multiple sessions",
      "Difficulty tracking improvements or side effects after each Panchakarma treatment",
      "Manual record-keeping causes incomplete or lost data",
      "Patients unable to report symptoms or feedback easily after sessions",
      "Absence of visual dashboards hinders insights for both practitioners and patients",
    ],
  },
  {
    id: 4,
    title: "Clinic Oversight & Quality Control",
    icon: Shield,
    problems: [
      "No real-time visibility into all centers' therapy quality and performance",
      "Inconsistent care experiences and therapy results between branches",
      "Fragmented data, making unified reporting and trend analysis impossible",
      "Inability to enforce standard operating protocols across locations",
      "No centralized approvals or checks for therapy procedures and pricing",
    ],
  },
];

export const ProblemsWesolve = () => {
  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-destructive/5 to-background overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
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
            className="mb-6 px-4 py-2 bg-destructive/10 text-destructive border-destructive/20"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Critical Challenges
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            Problems We
            <br />
            <span className="bg-gradient-to-r from-destructive via-destructive/80 to-primary bg-clip-text text-transparent">
              Solve
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-body max-w-4xl mx-auto">
            Traditional Panchakarma clinics face numerous operational challenges
            that compromise patient care, reduce efficiency, and limit growth
            potential. Our platform addresses these critical pain points.
          </p>
        </motion.div>

        {/* Problems Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {problemsData.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-card/80 to-card/40 border border-border/50 backdrop-blur-sm rounded-2xl p-8 hover:shadow-lg hover:shadow-destructive/10 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-destructive/20 to-destructive/10 border border-destructive/30">
                  <problem.icon className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground">
                  {problem.title}
                </h3>
              </div>

              <div className="space-y-4">
                {problem.problems.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground leading-relaxed font-body">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 rounded-2xl p-8 md:p-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-primary" />
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Transform Your Practice Today
              </h3>
            </div>
            <p className="text-muted-foreground font-body mb-8 max-w-2xl mx-auto">
              Join hundreds of Ayurvedic practitioners who have eliminated these
              operational challenges and enhanced their patient care with our
              comprehensive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-heading font-semibold flex items-center justify-center gap-2 group transition-all duration-300 hover:shadow-lg"
              >
                <Users className="w-4 h-4" />
                See Our Solutions
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 border border-border text-foreground rounded-lg font-heading font-semibold hover:bg-muted/50 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Schedule Demo
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
