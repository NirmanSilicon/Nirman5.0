import { motion } from "motion/react";
import { Wallet, TrendingUp, Zap, Award, Target, BookOpen } from "lucide-react";
import { ForgeCard } from "./ForgeCard";

interface ForgeSelectionProps {
  onSelectForge: (forgeId: string) => void;
}

export function ForgeSelection({ onSelectForge }: ForgeSelectionProps) {
  const forges = [
    {
      id: "budgeting",
      title: "Budgeting Forge",
      description: "Master personal finance, budgeting, and wealth building fundamentals",
      icon: <Wallet className="w-8 h-8" />,
      progress: 35,
      badgeLevel: "Beginner",
      simulatorsCompleted: 3,
      totalSimulators: 8,
      bgGradient: "bg-gradient-to-br from-primary to-primary/50",
    },
    {
      id: "market",
      title: "Market Forge",
      description: "Learn investing, trading strategies, and portfolio management",
      icon: <TrendingUp className="w-8 h-8" />,
      progress: 20,
      badgeLevel: "Novice",
      simulatorsCompleted: 2,
      totalSimulators: 10,
      bgGradient: "bg-gradient-to-br from-[var(--success)] to-[var(--success)]/50",
    },
    {
      id: "digital",
      title: "Digital Forge",
      description: "Explore FinTech, cryptocurrency, DeFi, and blockchain technology",
      icon: <Zap className="w-8 h-8" />,
      progress: 0,
      badgeLevel: "Locked",
      simulatorsCompleted: 0,
      totalSimulators: 12,
      bgGradient: "bg-gradient-to-br from-accent to-accent/50",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full">
            <Award className="w-5 h-5" />
            <span>Choose Your Path</span>
          </div>
          <h1>Select Your Forge</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each Forge contains interactive simulators designed to build your financial expertise. Start with any path that interests you most.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {forges.map((forge, index) => (
            <motion.div
              key={forge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ForgeCard {...forge} onClick={() => onSelectForge(forge.id)} />
            </motion.div>
          ))}
        </div>

        {/* Learning Path Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-8 border border-border"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <h3>Your Personalized Learning Path</h3>
              <p className="text-muted-foreground">
                Based on your profile, we recommend starting with the Budgeting Forge. You'll earn XP, unlock badges, and progress through levels as you complete simulators.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
                    <span className="text-[var(--success)]">✓</span>
                  </div>
                  <span className="text-muted-foreground">Complete simulators</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <span className="text-muted-foreground">Earn XP & rewards</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">Unlock achievements</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
