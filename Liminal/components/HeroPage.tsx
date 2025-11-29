import { motion } from "motion/react";
import { Flame, TrendingUp, ChevronDown, Sparkles } from "lucide-react";
import { GoldCoin3D } from "./GoldCoin3D";
import { SparkParticles } from "./ForgeEffects";
import { GameButton } from "./GameButton";

interface HeroPageProps {
  onStartClick: () => void;
  onScrollToNext: () => void;
}

export function HeroPage({ onStartClick, onScrollToNext }: HeroPageProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#FFD700] rounded-full blur-[120px] animate-pulse-neon"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF00FF] rounded-full blur-[120px] animate-pulse-neon" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#00FFFF] rounded-full blur-[120px] animate-pulse-neon" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Floating 3D coins */}
      <div className="absolute top-20 right-20 hidden lg:block">
        <GoldCoin3D size="xl" />
      </div>
      <div className="absolute top-40 left-20 hidden lg:block">
        <GoldCoin3D size="lg" />
      </div>
      <div className="absolute bottom-40 right-40 hidden xl:block">
        <GoldCoin3D size="md" />
      </div>

      {/* Floating forge fire */}
      <motion.div 
        className="absolute bottom-20 left-20 hidden lg:block"
        animate={{ 
          y: [0, -15, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <div className="relative w-32 h-32">
          <Flame className="w-full h-full text-[#FFD700] glow-gold-intense drop-shadow-2xl" />
        </div>
      </motion.div>

      {/* Spark particles at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <SparkParticles />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#FFD700] blur-3xl opacity-50 rounded-full"></div>
            <TrendingUp className="w-24 h-24 text-[#FFD700] relative z-10" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl mb-6 tracking-wider"
          style={{ 
            fontWeight: 800,
            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 80px rgba(255, 215, 0, 0.5)"
          }}
        >
          FIN-FORGE
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl md:text-3xl mb-8 italic"
          style={{
            background: "linear-gradient(135deg, #FF00FF 0%, #00FFFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          Bridging the Financial Competence Gap
        </motion.p>

        {/* Problem statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Traditional financial education fails to prepare individuals for real-world decisions. 
            <span className="text-[#FFD700]"> Fin-Forge</span> transforms learning through 
            <span className="text-[#FF00FF]"> gamified simulations</span>, helping you master 
            budgeting, investing, and digital finance without risking real money.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <GameButton 
            onClick={onStartClick}
            variant="primary"
            size="lg"
            icon={Flame}
            iconPosition="left"
            className="px-12 py-6 text-xl"
          >
            Start Your Forge
          </GameButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { label: "Active Learners", value: "10K+" },
            { label: "Simulations Completed", value: "50K+" },
            { label: "Success Rate", value: "94%" }
          ].map((stat, index) => (
            <div key={index} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 to-[#FF00FF]/20 rounded-lg blur-xl"></div>
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-[#FFD700]/30 rounded-lg p-6">
                <div className="text-4xl text-[#FFD700] mb-2" style={{ fontWeight: 800 }}>{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={onScrollToNext}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-20 p-4 hover:scale-110 transition-transform"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        aria-label="Scroll to next section"
      >
        <ChevronDown className="w-8 h-8 text-[#FFD700]" />
      </motion.button>
    </div>
  );
}
