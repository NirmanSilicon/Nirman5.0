import { Globe, Cpu, Shield, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Globe,
    title: "You Visit a Website",
    description: "SafeBrowse automatically activates when you navigate to any webpage.",
    number: "01"
  },
  {
    icon: Cpu,
    title: "Three-Layer Analysis",
    description: "ML scoring, heuristic checks, and reputation APIs analyze the URL in milliseconds.",
    number: "02"
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "A combined risk score is calculated from all detection methods.",
    number: "03"
  },
  {
    icon: CheckCircle,
    title: "Safe Browsing",
    description: "Get instant warnings for threats or browse safely with peace of mind.",
    number: "04"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="gradient-text">SafeBrowse</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Protection happens automatically in the background. 
            Here's what happens every time you visit a website.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <StepCard key={step.title} {...step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ 
  icon: Icon, 
  title, 
  description, 
  number,
  index 
}: { 
  icon: any; 
  title: string; 
  description: string;
  number: string;
  index: number;
}) {
  return (
    <div className="relative group">
      {/* Number Badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-glow-primary">
          {number}
        </div>
      </div>

      <div 
        className="glass rounded-2xl p-6 pt-8 text-center hover:bg-card/70 transition-all duration-300 hover:-translate-y-1"
        style={{ animationDelay: `${index * 0.15}s` }}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
