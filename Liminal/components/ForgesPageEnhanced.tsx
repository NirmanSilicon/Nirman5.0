import { motion } from "motion/react";
import { useState } from "react";
import { Flame, Wallet, TrendingUp, Cpu, Star, Zap, Trophy, Crown, Heart, CreditCard, Calendar, TrendingDown, PieChart, Shield, Network, Coins } from "lucide-react";
import { GoldCoin3D } from "./GoldCoin3D";
import { SparkParticles, ForgeGlow } from "./ForgeEffects";
import { ForgeCard } from "./ForgeCard";

export function ForgesPageEnhanced() {
  const [activeForge, setActiveForge] = useState<"budgeting" | "market" | "digital">("budgeting");

  const forges = {
    budgeting: {
      name: "Budgeting Forge",
      subtitle: "Personal Finance Mastery",
      icon: Wallet,
      color: "#FFD700",
      levels: [
        {
          difficulty: "Beginner",
          difficultyIcon: "🔥",
          name: "Cash Flow Runner",
          description: "Make quick-fire salary and expense decisions. Learn to prioritize needs vs wants in real-time scenarios.",
          skills: ["Income allocation", "Essential expenses", "Emergency fund basics"],
          visualModule: {
            type: "necessity-gauge",
            icon: Heart,
            label: "Necessity vs Desire Meter"
          },
          duration: "15-20 min",
          xp: 100,
          xpProgress: 0,
          locked: false
        },
        {
          difficulty: "Intermediate",
          difficultyIcon: "⚡",
          name: "Debt Trap Escape",
          description: "Navigate credit card debt, understand compounding interest, and develop strategies to break free from debt cycles.",
          skills: ["Credit management", "Interest calculations", "Debt payoff strategies"],
          visualModule: {
            type: "compound-meter",
            icon: CreditCard,
            label: "Compounding Interest Meter"
          },
          duration: "25-30 min",
          xp: 250,
          xpProgress: 0,
          locked: false
        },
        {
          difficulty: "Advanced",
          difficultyIcon: "💎",
          name: "Life Planner",
          description: "Multi-year financial simulation including career changes, major purchases, family planning, and retirement goals.",
          skills: ["Long-term planning", "Life event modeling", "Retirement strategy"],
          visualModule: {
            type: "timeline-slider",
            icon: Calendar,
            label: "Multi-Year Timeline Slider"
          },
          duration: "45-60 min",
          xp: 500,
          xpProgress: 0,
          locked: false
        }
      ]
    },
    market: {
      name: "Market Forge",
      subtitle: "Investing & Trading Skills",
      icon: TrendingUp,
      color: "#FF00FF",
      levels: [
        {
          difficulty: "Beginner",
          difficultyIcon: "🔥",
          name: "Passive Power",
          description: "Master SIP investments and compound interest. Learn the power of consistent, long-term investing strategies.",
          skills: ["SIP mechanics", "Compound growth", "Index fund basics"],
          visualModule: {
            type: "sip-graph",
            icon: TrendingUp,
            label: "Monthly SIP Growth Graph"
          },
          duration: "20-25 min",
          xp: 150,
          xpProgress: 0,
          locked: false
        },
        {
          difficulty: "Intermediate",
          difficultyIcon: "⚡",
          name: "Behavioral Trap",
          description: "Face FOMO scenarios, market crashes, and euphoria. Learn to make rational decisions under emotional pressure.",
          skills: ["Emotion control", "Market psychology", "Contrarian thinking"],
          visualModule: {
            type: "sentiment-meter",
            icon: TrendingDown,
            label: "Fear-Greed Sentiment Bar"
          },
          duration: "30-35 min",
          xp: 300,
          xpProgress: 0,
          locked: false
        },
        {
          difficulty: "Advanced",
          difficultyIcon: "💎",
          name: "Portfolio Architect",
          description: "Build and rebalance diversified portfolios across asset classes, sectors, and geographies. Master risk management.",
          skills: ["Asset allocation", "Portfolio rebalancing", "Risk optimization"],
          visualModule: {
            type: "asset-pie",
            icon: PieChart,
            label: "Asset Allocation Pie Chart"
          },
          duration: "50-60 min",
          xp: 600,
          xpProgress: 0,
          locked: false
        }
      ]
    },
    digital: {
      name: "Digital Forge",
      subtitle: "FinTech & Crypto Navigation",
      icon: Cpu,
      color: "#00FFFF",
      levels: [
        {
          difficulty: "Beginner",
          difficultyIcon: "🔥",
          name: "DeFi Detective",
          description: "Explore decentralized finance basics. Learn to identify legitimate protocols from scams and understand smart contracts.",
          skills: ["DeFi fundamentals", "Scam detection", "Wallet security"],
          visualModule: {
            type: "blockchain-diagram",
            icon: Network,
            label: "Blockchain Network Diagram"
          },
          duration: "20-25 min",
          xp: 175,
          xpProgress: 0,
          locked: false
        },
        {
          difficulty: "Intermediate",
          difficultyIcon: "⚡",
          name: "Tokenomics Tussle",
          description: "Analyze cryptocurrency projects, understand tokenomics, and evaluate investment potential in the crypto ecosystem.",
          skills: ["Token analysis", "Project evaluation", "Market timing"],
          visualModule: {
            type: "tokenomics-gauge",
            icon: Coins,
            label: "Supply-Utility Gauge"
          },
          duration: "35-40 min",
          xp: 350,
          xpProgress: 0,
          locked: false
        },
        {
          difficulty: "Advanced",
          difficultyIcon: "🔒",
          name: "Future Expansion",
          description: "Advanced crypto strategies and DeFi mastery. Coming soon with cutting-edge scenarios and challenges.",
          skills: ["Coming soon", "Advanced strategies", "New features"],
          visualModule: {
            type: "locked",
            icon: Shield,
            label: "Unlocking Soon..."
          },
          duration: "TBA",
          xp: 0,
          xpProgress: 0,
          locked: true
        }
      ]
    }
  };

  const difficultyConfig = {
    Beginner: { icon: Star, color: "#39FF14", label: "Beginner" },
    Intermediate: { icon: Zap, color: "#FFA500", label: "Intermediate" },
    Advanced: { icon: Crown, color: "#FF00FF", label: "Advanced" }
  };

  const currentForge = forges[activeForge];
  const ForgeIcon = currentForge.icon;

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>
      
      {/* Dynamic background glow */}
      <div 
        className="absolute top-1/4 left-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 transition-all duration-700"
        style={{ backgroundColor: currentForge.color, transform: 'translate(-50%, -50%)' }}
      ></div>

      {/* Floating coins */}
      <div className="absolute top-20 right-10 hidden xl:block">
        <GoldCoin3D size="lg" />
      </div>
      <div className="absolute bottom-32 left-10 hidden xl:block">
        <GoldCoin3D size="md" />
      </div>

      {/* Spark effects */}
      <div className="absolute bottom-0 left-0 right-0 h-40">
        <SparkParticles />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full backdrop-blur-sm">
            <Flame className="w-6 h-6 text-[#FFD700]" />
            <span className="text-[#FFD700] uppercase tracking-wider" style={{ fontWeight: 700 }}>Choose Your Path</span>
          </div>
          <h2 className="text-5xl md:text-6xl mb-4 text-gradient-gold" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
            The Three Forges
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Select your domain and progress through increasingly challenging simulations
          </p>
        </motion.div>

        {/* Forge selector tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {(Object.keys(forges) as Array<keyof typeof forges>).map((forgeKey) => {
            const forge = forges[forgeKey];
            const Icon = forge.icon;
            const isActive = activeForge === forgeKey;
            
            return (
              <motion.button
                key={forgeKey}
                onClick={() => setActiveForge(forgeKey)}
                whileHover={!isActive ? { scale: 1.02, y: -2 } : {}}
                whileTap={{ scale: 0.98 }}
                className={`relative group px-8 py-4 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-zinc-800 to-zinc-700 border-2 scale-105 depth-shadow cursor-default' 
                    : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 cursor-pointer'
                }`}
                style={isActive ? { borderColor: forge.color } : {}}
              >
                <div className="flex items-center gap-3 pointer-events-none">
                  <Icon 
                    className="w-6 h-6" 
                    style={{ color: isActive ? forge.color : '#666' }}
                  />
                  <div className="text-left">
                    <div 
                      className="text-lg" 
                      style={{ 
                        fontWeight: 800,
                        color: isActive ? forge.color : '#999'
                      }}
                    >
                      {forge.name}
                    </div>
                    <div className="text-sm text-gray-500">{forge.subtitle}</div>
                  </div>
                </div>
                {isActive && (
                  <>
                    <div 
                      className="absolute inset-0 rounded-xl blur-xl opacity-30 pointer-events-none"
                      style={{ backgroundColor: forge.color }}
                    />
                    <ForgeGlow color={forge.color} />
                  </>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Level cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {currentForge.levels.map((level, index) => {
            const DiffIcon = difficultyConfig[level.difficulty as keyof typeof difficultyConfig].icon;
            const diffColor = difficultyConfig[level.difficulty as keyof typeof difficultyConfig].color;
            const ModuleIcon = level.visualModule.icon;
            
            return (
              <ForgeCard
                key={index}
                title={level.name}
                description={level.description}
                difficulty={level.difficulty}
                difficultyIcon={level.difficultyIcon}
                difficultyColor={diffColor}
                icon={DiffIcon}
                moduleIcon={ModuleIcon}
                moduleLabel={level.visualModule.label}
                skills={level.skills}
                duration={level.duration}
                xp={level.xp}
                xpProgress={level.xpProgress}
                locked={level.locked}
                forgeColor={currentForge.color}
                onClick={() => {
                  if (!level.locked) {
                    alert(`Starting ${level.name}!\n\nThis would navigate to the challenge interface.`);
                  }
                }}
              />
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500">
            💡 Complete challenges to unlock achievements, climb leaderboards, and receive personalized AI recommendations
          </p>
        </motion.div>
      </div>
    </div>
  );
}
