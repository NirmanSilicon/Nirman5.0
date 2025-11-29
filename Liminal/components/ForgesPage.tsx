import { motion } from "motion/react";
import { useState } from "react";
import { Flame, Wallet, TrendingUp, Cpu, Star, Lock, ChevronRight, Zap, Trophy, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function ForgesPage() {
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
          name: "Cash Flow Runner",
          description: "Make quick-fire salary and expense decisions. Learn to prioritize needs vs wants in real-time scenarios.",
          skills: ["Income allocation", "Essential expenses", "Emergency fund basics"],
          duration: "15-20 min",
          xp: 100,
          locked: false
        },
        {
          difficulty: "Intermediate",
          name: "Debt Trap Escape",
          description: "Navigate credit card debt, understand compounding interest, and develop strategies to break free from debt cycles.",
          skills: ["Credit management", "Interest calculations", "Debt payoff strategies"],
          duration: "25-30 min",
          xp: 250,
          locked: false
        },
        {
          difficulty: "Advanced",
          name: "Life Planner",
          description: "Multi-year financial simulation including career changes, major purchases, family planning, and retirement goals.",
          skills: ["Long-term planning", "Life event modeling", "Retirement strategy"],
          duration: "45-60 min",
          xp: 500,
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
          name: "Passive Power",
          description: "Master SIP investments and compound interest. Learn the power of consistent, long-term investing strategies.",
          skills: ["SIP mechanics", "Compound growth", "Index fund basics"],
          duration: "20-25 min",
          xp: 150,
          locked: false
        },
        {
          difficulty: "Intermediate",
          name: "Behavioral Trap",
          description: "Face FOMO scenarios, market crashes, and euphoria. Learn to make rational decisions under emotional pressure.",
          skills: ["Emotion control", "Market psychology", "Contrarian thinking"],
          duration: "30-35 min",
          xp: 300,
          locked: false
        },
        {
          difficulty: "Advanced",
          name: "Portfolio Architect",
          description: "Build and rebalance diversified portfolios across asset classes, sectors, and geographies. Master risk management.",
          skills: ["Asset allocation", "Portfolio rebalancing", "Risk optimization"],
          duration: "50-60 min",
          xp: 600,
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
          name: "DeFi Detective",
          description: "Explore decentralized finance basics. Learn to identify legitimate protocols from scams and understand smart contracts.",
          skills: ["DeFi fundamentals", "Scam detection", "Wallet security"],
          duration: "20-25 min",
          xp: 175,
          locked: false
        },
        {
          difficulty: "Intermediate",
          name: "Tokenomics Tussle",
          description: "Analyze cryptocurrency projects, understand tokenomics, and evaluate investment potential in the crypto ecosystem.",
          skills: ["Token analysis", "Project evaluation", "Market timing"],
          duration: "35-40 min",
          xp: 350,
          locked: false
        },
        {
          difficulty: "Advanced",
          name: "Future Expansion",
          description: "Advanced crypto strategies and DeFi mastery. Coming soon with cutting-edge scenarios and challenges.",
          skills: ["Coming soon", "Advanced strategies", "New features"],
          duration: "TBA",
          xp: 0,
          locked: true
        }
      ]
    }
  };

  const difficultyConfig = {
    Beginner: { icon: Star, color: "#39FF14" },
    Intermediate: { icon: Zap, color: "#FFA500" },
    Advanced: { icon: Crown, color: "#FF00FF" }
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

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full">
            <Flame className="w-6 h-6 text-[#FFD700]" />
            <span className="text-[#FFD700] uppercase tracking-wider">Choose Your Path</span>
          </div>
          <h2 className="text-5xl md:text-6xl mb-4 text-gradient-gold" style={{ fontWeight: 800 }}>
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
              <button
                key={forgeKey}
                onClick={() => setActiveForge(forgeKey)}
                className={`relative group px-8 py-4 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-zinc-800 to-zinc-700 border-2 scale-105' 
                    : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
                }`}
                style={isActive ? { borderColor: forge.color } : {}}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    className="w-6 h-6" 
                    style={{ color: isActive ? forge.color : '#666' }}
                  />
                  <div className="text-left">
                    <div 
                      className="text-lg" 
                      style={{ 
                        fontWeight: 700,
                        color: isActive ? forge.color : '#999'
                      }}
                    >
                      {forge.name}
                    </div>
                    <div className="text-sm text-gray-500">{forge.subtitle}</div>
                  </div>
                </div>
                {isActive && (
                  <div 
                    className="absolute inset-0 rounded-xl blur-xl opacity-30"
                    style={{ backgroundColor: forge.color }}
                  ></div>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Level cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {currentForge.levels.map((level, index) => {
            const DiffIcon = difficultyConfig[level.difficulty as keyof typeof difficultyConfig].icon;
            const diffColor = difficultyConfig[level.difficulty as keyof typeof difficultyConfig].color;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: level.locked ? 1 : 1.05, y: level.locked ? 0 : -10 }}
                className="relative group"
              >
                {/* Card glow */}
                {!level.locked && (
                  <div 
                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                    style={{ backgroundColor: currentForge.color }}
                  ></div>
                )}
                
                {/* Card */}
                <div 
                  className={`relative h-full rounded-2xl p-6 border-2 transition-all duration-300 ${
                    level.locked 
                      ? 'bg-zinc-900/30 border-zinc-800/50 opacity-60' 
                      : 'bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700 hover:border-opacity-80'
                  }`}
                  style={!level.locked ? { borderColor: `${currentForge.color}60` } : {}}
                >
                  {/* Difficulty badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      className="px-3 py-1 border"
                      style={{ 
                        backgroundColor: `${diffColor}20`,
                        borderColor: `${diffColor}60`,
                        color: diffColor
                      }}
                    >
                      <DiffIcon className="w-4 h-4 mr-1" />
                      {level.difficulty}
                    </Badge>
                    {!level.locked && (
                      <div className="flex items-center gap-1 text-[#FFD700]">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm" style={{ fontWeight: 600 }}>{level.xp} XP</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-2xl mb-3" 
                    style={{ 
                      fontWeight: 700,
                      color: level.locked ? '#666' : currentForge.color
                    }}
                  >
                    {level.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {level.description}
                  </p>

                  {/* Skills */}
                  <div className="mb-6 space-y-2">
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                      Skills Developed
                    </div>
                    {level.skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: level.locked ? '#666' : currentForge.color }}
                        ></div>
                        <span className="text-sm text-gray-400">{skill}</span>
                      </div>
                    ))}
                  </div>

                  {/* Duration */}
                  <div className="mb-6 text-sm text-gray-500">
                    ⏱️ {level.duration}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    disabled={level.locked}
                    className={`w-full ${
                      level.locked 
                        ? 'bg-zinc-800 text-gray-600 cursor-not-allowed' 
                        : 'text-black'
                    }`}
                    style={!level.locked ? { 
                      backgroundColor: currentForge.color,
                      fontWeight: 600
                    } : {}}
                  >
                    {level.locked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Coming Soon
                      </>
                    ) : (
                      <>
                        Start Challenge
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  {/* Lock overlay */}
                  {level.locked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-16 h-16 text-zinc-700" />
                    </div>
                  )}
                </div>
              </motion.div>
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
