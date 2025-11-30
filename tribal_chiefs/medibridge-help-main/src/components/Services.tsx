import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Calendar, 
  FileText, 
  Pill, 
  Phone, 
  UserCheck,
  MapPin,
  Building2,
  AlertTriangle,
  Clock,
  Shield,
  Users,
  Star,
  Zap,
  Heart,
  Activity,
  Smartphone
} from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: Video,
      title: "Virtual Consultations",
      description: "Connect with qualified doctors from the comfort of your home through secure video calls.",
      features: ["HD Video Calls", "Secure Platform", "Instant Access"],
      link: "/consultations",
      stats: { patients: "50K+", satisfaction: "98%", availability: "24/7" },
      detailedFeatures: [
        "End-to-end encrypted video calls",
        "Multi-device compatibility",
        "Digital prescription sharing",
        "Follow-up scheduling"
      ]
    },
    {
      icon: Calendar,
      title: "Easy Appointment Booking",
      description: "Schedule appointments with your preferred medical providers at your convenience.",
      features: ["Online Booking", "Flexible Scheduling", "Instant Confirmation"],
      link: "/appointments",
      stats: { bookings: "100K+", timeSlots: "500+", departments: "25+" },
      detailedFeatures: [
        "Real-time availability checking",
        "SMS & email notifications",
        "Reschedule & cancel options",
        "Multi-language support"
      ]
    },
    {
      icon: Calendar,
      title: "Checkup Scheduler",
      description: "Schedule regular health checkups and preventive care appointments easily.",
      features: ["Health Reminders", "Preventive Care", "Custom Scheduling"],
      link: "/checkup",
      highlight: true,
      stats: { reminders: "Daily", success: "95%", coverage: "All Ages" },
      detailedFeatures: [
        "Personalized health reminders",
        "Preventive care tracking",
        "Family health management",
        "Health goal monitoring"
      ]
    },
    {
      icon: FileText,
      title: "Digital Health Records",
      description: "Access and manage your complete medical history in one secure digital platform.",
      features: ["Secure Storage", "Easy Access", "Comprehensive Records"],
      link: "/records",
      stats: { security: "Bank-level", access: "Instant", storage: "Unlimited" },
      detailedFeatures: [
        "Complete medical history",
        "Lab results & imaging",
        "Medication tracking",
        "Emergency information"
      ]
    },
    {
      icon: Pill,
      title: "Prescription Management",
      description: "Manage prescriptions, set reminders, and track medication adherence easily.",
      features: ["Digital Prescriptions", "Medication Reminders", "Refill Tracking"],
      link: "/prescriptions",
      stats: { adherence: "90%", reminders: "Smart", refills: "Auto" },
      detailedFeatures: [
        "Smart medication reminders",
        "Drug interaction alerts",
        "Pharmacy integration",
        "Adherence tracking"
      ]
    },
    {
      icon: MapPin,
      title: "Nearby Pharmacies",
      description: "Find and locate nearby pharmacies with real-time availability and directions.",
      features: ["Real-time Search", "Medication Availability", "GPS Directions"],
      link: "/pharmacies",
      highlight: true,
      stats: { pharmacies: "1000+", accuracy: "99%", coverage: "Punjab" },
      detailedFeatures: [
        "Real-time stock checking",
        "Price comparison",
        "24/7 pharmacy locator",
        "Home delivery options"
      ]
    },
    {
      icon: Building2,
      title: "Hospital Locator",
      description: "Locate nearby hospitals with emergency services, specialties, and contact information.",
      features: ["Emergency Services", "Specialist Directory", "Contact Information"],
      link: "/hospitals",
      highlight: true,
      stats: { hospitals: "500+", specialties: "50+", response: "< 2min" },
      detailedFeatures: [
        "Emergency room wait times",
        "Specialist availability",
        "Insurance verification",
        "Bed availability status"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Emergency SOS",
      description: "24/7 emergency medical support and immediate response when you need it most.",
      features: ["24/7 Availability", "Emergency Protocols", "Immediate Response"],
      link: "/emergency",
      highlight: true,
      emergency: true,
      stats: { response: "< 30sec", coverage: "24/7", success: "99.9%" },
      detailedFeatures: [
        "One-tap emergency calling",
        "GPS location sharing",
        "Medical history access",
        "Emergency contact alerts"
      ]
    },
    {
      icon: UserCheck,
      title: "Specialist Care",
      description: "Access to a network of specialists across various medical fields and expertise.",
      features: ["Expert Specialists", "Multiple Disciplines", "Quality Care"],
      link: "/specialists",
      stats: { specialists: "200+", fields: "30+", rating: "4.8/5" },
      detailedFeatures: [
        "Board-certified specialists",
        "Second opinion services",
        "Multidisciplinary care",
        "Research-backed treatments"
      ]
    }
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <UserCheck className="h-4 w-4 mr-2" />
            MediBridge Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience medical care reimagined with our full range of services designed for modern life.
          </p>
          
          {/* Service Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Emergency Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Partner Hospitals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Specialist Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Happy Patients</div>
            </div>
          </div>
        </div>

        {/* Service Process Flow */}
        <div className="mb-16">
          <Card className="bg-gradient-card border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary mb-2">How MediBridge Works</CardTitle>
              <CardDescription>Simple steps to access world-class healthcare</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">1. Register</h4>
                  <p className="text-sm text-muted-foreground">Sign up and complete your health profile</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">2. Book</h4>
                  <p className="text-sm text-muted-foreground">Schedule appointments or services</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">3. Care</h4>
                  <p className="text-sm text-muted-foreground">Receive quality medical care</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">4. Track</h4>
                  <p className="text-sm text-muted-foreground">Monitor your health progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-medical transition-all duration-300 border-2 ${
                service.highlight 
                  ? service.emergency 
                    ? "border-emergency/30 bg-gradient-to-br from-card to-emergency/5" 
                    : "border-accent/30 bg-gradient-to-br from-card to-accent/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    service.emergency 
                      ? "bg-emergency text-emergency-foreground" 
                      : service.highlight 
                        ? "bg-gradient-accent text-accent-foreground"
                        : "bg-gradient-hero text-primary-foreground"
                  }`}>
                    <service.icon className="h-6 w-6" />
                  </div>
                  {service.highlight && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Service Statistics */}
                <div className="grid grid-cols-3 gap-2 mb-6 p-3 bg-muted/20 rounded-lg">
                  {Object.entries(service.stats).map(([key, value], idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-sm font-bold text-primary">{value}</div>
                      <div className="text-xs text-muted-foreground capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                {/* Key Features */}
                <div className="mb-6">
                  <h5 className="font-semibold text-sm mb-3 flex items-center">
                    <Star className="h-4 w-4 mr-1 text-accent" />
                    Key Features
                  </h5>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Detailed Features - Expandable */}
                <details className="mb-6">
                  <summary className="cursor-pointer font-semibold text-sm text-primary hover:text-primary/80 flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    Advanced Features
                  </summary>
                  <ul className="mt-3 space-y-1 pl-5">
                    {service.detailedFeatures.map((feature, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-center">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </details>

                <Button 
                  asChild 
                  className={`w-full ${
                    service.emergency 
                      ? "bg-emergency hover:bg-emergency/90 text-emergency-foreground shadow-emergency"
                      : ""
                  }`}
                  variant={service.emergency ? "default" : service.highlight ? "default" : "outline"}
                >
                  <Link to={service.link}>
                    {service.emergency ? "Emergency Access" : "Access Service"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Benefits */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Why Choose MediBridge?</h3>
                <p className="text-muted-foreground">Experience the difference in modern healthcare</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-10 w-10 text-primary" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Secure & Private</h4>
                  <p className="text-sm text-muted-foreground">Bank-level security with end-to-end encryption for all your medical data</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-10 w-10 text-accent" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Available 24/7</h4>
                  <p className="text-sm text-muted-foreground">Round-the-clock access to emergency services and medical support</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Expert Care Team</h4>
                  <p className="text-sm text-muted-foreground">Qualified doctors and specialists committed to your health and wellbeing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;