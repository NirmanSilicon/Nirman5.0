import { Button } from "@/components/ui/button";
import { Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/healthcare-hero.jpg";
import AIAgent from "./AIAgent";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] bg-gradient-hero flex items-center">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/80" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground mb-6 backdrop-blur-sm">
            <Heart className="h-4 w-4 mr-2" />
            Trusted MediBridge Platform
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6">
            Your Health,{" "}
            <span className="text-accent">Our Priority</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl leading-relaxed">
            Experience modern medical care with our comprehensive platform. Access quality medical services, 
            connect with professionals, and manage your health journey with confidence.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg">
              <Link to="/get-started">Get Started Today</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-primary-foreground/10 backdrop-blur-sm shadow-lg">
              <Link to="/services">Learn More</Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <div className="text-primary-foreground/90">Care Available</div>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
              <div className="flex items-center text-4xl font-bold text-accent mb-2">
                <Users className="h-8 w-8 mr-2" />
                500K+
              </div>
              <div className="text-primary-foreground/90">Patients Served</div>
              <AIAgent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;