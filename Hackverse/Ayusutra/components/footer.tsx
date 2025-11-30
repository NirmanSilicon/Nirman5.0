"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Heart,
  Leaf,
} from "lucide-react";

const footerSections = [
  {
    title: "Platform",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Documentation", href: "#docs" },
      { name: "API Reference", href: "#api" },
      { name: "Integrations", href: "#integrations" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help Center", href: "#help" },
      { name: "Community", href: "#community" },
      { name: "Blog", href: "#blog" },
      { name: "Webinars", href: "#webinars" },
      { name: "Case Studies", href: "#cases" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About AIIA", href: "#about" },
      { name: "Ministry of Ayush", href: "#ministry" },
      { name: "Careers", href: "#careers" },
      { name: "Press Kit", href: "#press" },
      { name: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "Compliance", href: "#compliance" },
      { name: "Security", href: "#security" },
    ],
  },
];

const socialLinks = [
  { icon: Github, href: "#github", label: "GitHub" },
  { icon: Linkedin, href: "#linkedin", label: "LinkedIn" },
  { icon: Twitter, href: "#twitter", label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-background to-muted/30 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  <Image
                    src="/logo.png"
                    alt="upyogi Logo"
                    width={48}
                    height={48}
                    className="rounded-xl object-contain"
                  />
                </div>
                <div>
                  <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">
                    upyogi
                  </h1>
                  <p className="text-sm text-muted-foreground font-body">
                    Panchakarma Management
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed max-w-md font-body">
                Revolutionizing Panchakarma therapy management by bridging
                ancient Ayurvedic wisdom with modern healthcare technology.
                Trusted by practitioners worldwide.
              </p>

              {/* Government Badges */}
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-background/50">
                  <Leaf className="w-4 h-4 mr-2 text-primary" />
                  Ministry of Ayush
                </Badge>
                <Badge variant="outline" className="bg-background/50">
                  <Globe className="w-4 h-4 mr-2 text-primary" />
                  AIIA Certified
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>contact@upyogi.aiia.gov.in</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+91-11-2685-8000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>All India Institute of Ayurveda, New Delhi</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-muted hover:bg-primary rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-all duration-300"
                      aria-label={social.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Links Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {footerSections.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h3 className="font-heading font-semibold text-foreground">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-body"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="py-8 border-t border-border"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                Stay Updated with upyogi
              </h3>
              <p className="text-sm text-muted-foreground font-body">
                Get the latest updates on Ayurvedic healthcare technology and
                platform features.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 min-w-0 sm:min-w-96">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-body"
              />
              <Button size="sm" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="py-6 border-t border-border"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>© 2025 upyogi. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for global Ayurvedic healthcare.</span>
            </div>
            <div className="flex items-center gap-6">
              <span>All India Institute of Ayurveda (AIIA)</span>
              <span>Ministry of Ayush, Govt. of India</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
