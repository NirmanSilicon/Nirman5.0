import { Shield, Zap, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Scan Line Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="scan-line" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-sm text-muted-foreground">Real-time threat detection active</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
          <span className="text-foreground">Browse the Web</span>
          <br />
          <span className="gradient-text">Without Fear</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          SafeBrowse protects you from malicious websites using advanced ML scoring, 
          reputation checks, and intelligent heuristics — all in real-time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button variant="hero" size="xl" asChild>
            <a href="/extension/manifest.json" download>
              <Shield className="w-5 h-5" />
              Install Extension
              <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
          <Button variant="glass" size="xl">
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <StatCard icon={<Shield />} value="3-Layer" label="Detection System" />
          <StatCard icon={<Zap />} value="<100ms" label="Analysis Time" />
          <StatCard icon={<Lock />} value="100%" label="Privacy Focused" />
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="glass rounded-xl p-6 hover:bg-card/70 transition-all duration-300">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="text-primary">{icon}</div>
        <span className="text-2xl font-bold text-foreground">{value}</span>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
