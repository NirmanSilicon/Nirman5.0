import { motion } from "motion/react";
import { ArrowRight, Target, Brain, TrendingUp, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LandingPageProps {
  onStartLearning: () => void;
}

export function LandingPage({ onStartLearning }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-primary to-accent py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white space-y-6"
            >
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <span>🎮 Learn Finance Through Gaming</span>
              </div>
              
              <h1 className="text-white">
                Master Your Financial Future
              </h1>
              
              <p className="text-white/90 text-xl">
                Forge your path to financial mastery through interactive simulations, real-world scenarios, and gamified learning. Build skills that last a lifetime.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={onStartLearning}
                  className="bg-white text-secondary hover:bg-white/90 shadow-xl"
                >
                  Start Learning Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-white text-3xl">10K+</div>
                  <div className="text-white/80">Learners</div>
                </div>
                <div>
                  <div className="text-white text-3xl">50+</div>
                  <div className="text-white/80">Simulators</div>
                </div>
                <div>
                  <div className="text-white text-3xl">98%</div>
                  <div className="text-white/80">Success Rate</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1761735485999-f3e7e531e149?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwZWR1Y2F0aW9uJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzY0NDIwNzYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Financial learning dashboard"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2>Why Choose Fin-Forge?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn by doing with our hands-on approach to financial education
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3>Personalized Path</h3>
                <p className="text-muted-foreground">
                  Tailored learning journey based on your goals and risk profile
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-[var(--success)]/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[var(--success)]" />
                </div>
                <h3>Real Scenarios</h3>
                <p className="text-muted-foreground">
                  Practice with realistic financial challenges and decisions
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3>Track Progress</h3>
                <p className="text-muted-foreground">
                  Earn XP, unlock badges, and see your financial knowledge grow
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3>Risk-Free Learning</h3>
                <p className="text-muted-foreground">
                  Make mistakes and learn in a safe, simulated environment
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-white">Ready to Transform Your Financial Future?</h2>
            <p className="text-white/90 text-xl">
              Join thousands of learners who are mastering finance through interactive gameplay
            </p>
            <Button
              size="lg"
              onClick={onStartLearning}
              className="bg-white text-secondary hover:bg-white/90 shadow-xl"
            >
              Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
