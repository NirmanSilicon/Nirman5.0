import { Download, Settings, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const installSteps = [
  {
    icon: Download,
    title: "Download Extension",
    description: "Click the download button to get the SafeBrowse extension files."
  },
  {
    icon: Settings,
    title: "Open Chrome Extensions",
    description: "Navigate to chrome://extensions and enable Developer Mode."
  },
  {
    icon: Shield,
    title: "Load Extension",
    description: "Click 'Load unpacked' and select the downloaded extension folder."
  },
  {
    icon: CheckCircle,
    title: "You're Protected!",
    description: "SafeBrowse is now active and protecting your browsing."
  }
];

export function Installation() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/50 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started in <span className="gradient-text">Minutes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Installing SafeBrowse is quick and easy. 
            Follow these simple steps to start browsing safely.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {installSteps.map((step, index) => (
              <div 
                key={step.title}
                className="glass rounded-xl p-6 flex items-start gap-4 hover:bg-card/70 transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary">Step {index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Download CTA */}
          <div className="glass-strong rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-primary">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Ready to Browse Safely?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Download the extension files and follow the installation guide to get protected.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <a href="/extension/manifest.json" download>
                  <Download className="w-5 h-5" />
                  Download Extension
                </a>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked" target="_blank" rel="noopener noreferrer">
                  Installation Guide
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Chrome Extension • Manifest V3 • No signup required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
