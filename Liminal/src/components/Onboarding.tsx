import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowLeft, Target, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";

interface OnboardingProps {
  onComplete: (data: { goal: string; experience: string; risk: string }) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [risk, setRisk] = useState("");

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({ goal, experience, risk });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    if (step === 1) return goal !== "";
    if (step === 2) return experience !== "";
    if (step === 3) return risk !== "";
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-8 space-y-4">
          <div className="text-center space-y-2">
            <h2>Welcome to Fin-Forge</h2>
            <p className="text-muted-foreground">Let's personalize your learning journey</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3>What's your primary learning goal?</h3>
                  <p className="text-muted-foreground">Choose the area you want to focus on first</p>
                </div>

                <RadioGroup value={goal} onValueChange={setGoal} className="space-y-3">
                  <div
                    className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                      goal === "budgeting" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setGoal("budgeting")}
                  >
                    <RadioGroupItem value="budgeting" id="budgeting" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="budgeting" className="cursor-pointer flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Master Personal Finance & Budgeting
                      </Label>
                      <p className="text-muted-foreground">Learn to manage money, create budgets, and build wealth</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                      goal === "investing" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setGoal("investing")}
                  >
                    <RadioGroupItem value="investing" id="investing" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="investing" className="cursor-pointer flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[var(--success)]" />
                        Understand Investing & Trading
                      </Label>
                      <p className="text-muted-foreground">Explore markets, portfolios, and investment strategies</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                      goal === "crypto" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setGoal("crypto")}
                  >
                    <RadioGroupItem value="crypto" id="crypto" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="crypto" className="cursor-pointer flex items-center gap-2">
                        <Zap className="w-5 h-5 text-accent-foreground" />
                        Explore FinTech & Crypto
                      </Label>
                      <p className="text-muted-foreground">Dive into digital finance, DeFi, and blockchain</p>
                    </div>
                  </div>
                </RadioGroup>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3>What's your experience level?</h3>
                  <p className="text-muted-foreground">This helps us recommend the right simulators</p>
                </div>

                <RadioGroup value={experience} onValueChange={setExperience} className="space-y-3">
                  <div
                    className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                      experience === "beginner" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setExperience("beginner")}
                  >
                    <RadioGroupItem value="beginner" id="beginner" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="beginner" className="cursor-pointer">
                        🌱 Beginner - Just getting started
                      </Label>
                      <p className="text-muted-foreground">I'm new to finance and want to learn the basics</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                      experience === "intermediate"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setExperience("intermediate")}
                  >
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="intermediate" className="cursor-pointer">
                        🎯 Intermediate - Some knowledge
                      </Label>
                      <p className="text-muted-foreground">I understand basics and want to deepen my skills</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                      experience === "advanced" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setExperience("advanced")}
                  >
                    <RadioGroupItem value="advanced" id="advanced" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="advanced" className="cursor-pointer">
                        🚀 Advanced - Ready for challenges
                      </Label>
                      <p className="text-muted-foreground">I'm experienced and want advanced strategies</p>
                    </div>
                  </div>
                </RadioGroup>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3>What's your risk tolerance?</h3>
                  <p className="text-muted-foreground">Help us understand your comfort with financial risk</p>
                </div>

                <RadioGroup value={risk} onValueChange={setRisk} className="space-y-3">
                  <div
                    className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                      risk === "conservative" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setRisk("conservative")}
                  >
                    <RadioGroupItem value="conservative" id="conservative" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="conservative" className="cursor-pointer flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[var(--success)]" />
                        Conservative - Safety first
                      </Label>
                      <p className="text-muted-foreground">I prefer stable, low-risk approaches</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                      risk === "moderate" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setRisk("moderate")}
                  >
                    <RadioGroupItem value="moderate" id="moderate" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="moderate" className="cursor-pointer flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Moderate - Balanced approach
                      </Label>
                      <p className="text-muted-foreground">I'm comfortable with some calculated risks</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-all ${
                      risk === "aggressive" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setRisk("aggressive")}
                  >
                    <RadioGroupItem value="aggressive" id="aggressive" />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="aggressive" className="cursor-pointer flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[var(--risk)]" />
                        Aggressive - High risk, high reward
                      </Label>
                      <p className="text-muted-foreground">I'm willing to take significant risks for growth</p>
                    </div>
                  </div>
                </RadioGroup>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()}>
            {step === totalSteps ? "Complete" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
