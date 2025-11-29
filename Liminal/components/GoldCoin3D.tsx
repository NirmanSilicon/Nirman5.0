import { motion } from "motion/react";

interface GoldCoin3DProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function GoldCoin3D({ size = "md", className = "" }: GoldCoin3DProps) {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-48 h-48"
  };

  return (
    <motion.div
      className={`${sizes[size]} ${className} relative`}
      animate={{
        rotateY: [0, 360],
        y: [0, -10, 0]
      }}
      transition={{
        rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Coin face */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#F5C142] via-[#FFD700] to-[#B8860B] animate-forge-glow">
        {/* Inner ring */}
        <div className="absolute inset-2 rounded-full border-4 border-[#FFA500]/30"></div>
        
        {/* Center symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl" style={{ 
            fontWeight: 900,
            color: '#B8860B',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>₣</span>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-50"></div>
      </div>

      {/* Glow aura */}
      <div className="absolute inset-0 rounded-full bg-[#FFD700] blur-xl opacity-60 animate-pulse-neon"></div>
    </motion.div>
  );
}
