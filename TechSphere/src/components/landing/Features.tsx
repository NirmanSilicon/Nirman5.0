import { Brain, Search, Shield, AlertTriangle, FileWarning, Bug } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "ML-Powered Scoring",
    description: "Our machine learning model analyzes URL patterns, suspicious keywords, and structural anomalies to generate accurate risk scores.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Search,
    title: "Reputation Checks",
    description: "Integration with Google Safe Browsing and VirusTotal APIs for real-time threat intelligence from trusted sources.",
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    icon: Shield,
    title: "Heuristic Analysis",
    description: "Fast rule-based checks for HTTPS, IP-based URLs, obfuscation patterns, and brand impersonation attempts.",
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    icon: AlertTriangle,
    title: "Instant Warnings",
    description: "Beautiful warning overlays with detailed threat breakdowns help you make informed decisions about risky sites.",
    color: "text-warning",
    bgColor: "bg-warning/10"
  },
  {
    icon: FileWarning,
    title: "User Reports",
    description: "Community-powered protection. Report suspicious websites to help protect other users from emerging threats.",
    color: "text-destructive",
    bgColor: "bg-destructive/10"
  },
  {
    icon: Bug,
    title: "Phishing Detection",
    description: "Advanced detection of brand impersonation, lookalike domains, and social engineering tactics.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  }
];

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Three-Layer</span> Protection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SafeBrowse combines multiple detection methods to provide comprehensive 
            protection against phishing, malware, and other web threats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  bgColor,
  index 
}: { 
  icon: any; 
  title: string; 
  description: string;
  color: string;
  bgColor: string;
  index: number;
}) {
  return (
    <div 
      className="glass rounded-2xl p-6 hover:bg-card/70 transition-all duration-300 hover:-translate-y-1 group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
