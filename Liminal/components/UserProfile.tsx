import { motion } from "motion/react";
import { Trophy, Star } from "lucide-react";
import { Progress } from "./ui/progress";

interface UserProfileProps {
  username?: string;
  level?: number;
  xp?: number;
  maxXp?: number;
  riskProfile?: "Conservative" | "Moderate" | "Aggressive";
}

export function UserProfile({ 
  username = "Learner", 
  level = 5, 
  xp = 750, 
  maxXp = 1000,
  riskProfile = "Moderate"
}: UserProfileProps) {
  const xpPercentage = (xp / maxXp) * 100;

  const riskColors = {
    Conservative: "#39FF14",
    Moderate: "#FFA500",
    Aggressive: "#FF6B35"
  };

  return (
    <div className="flex items-center gap-4">
      {/* Avatar with risk profile ring */}
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] flex items-center justify-center overflow-hidden border-2"
          style={{ borderColor: riskColors[riskProfile] }}
        >
          <span className="text-black" style={{ fontWeight: 900 }}>
            {username.charAt(0).toUpperCase()}
          </span>
        </div>
        {/* Level badge */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FFD700] border-2 border-black flex items-center justify-center">
          <span className="text-[10px] text-black" style={{ fontWeight: 900 }}>
            {level}
          </span>
        </div>
      </div>

      {/* XP Info */}
      <div className="hidden md:block min-w-[150px]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">{username}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#FFD700]" />
            <span className="text-xs text-[#FFD700]" style={{ fontWeight: 700 }}>
              {xp}/{maxXp} XP
            </span>
          </div>
        </div>
        <Progress 
          value={xpPercentage} 
          className="h-2 bg-zinc-800"
        />
      </div>
    </div>
  );
}

export function XPBar({ xp = 750, maxXp = 1000, level = 5 }: { xp?: number; maxXp?: number; level?: number }) {
  const xpPercentage = (xp / maxXp) * 100;

  return (
    <motion.div 
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="fixed top-[72px] left-0 right-0 h-1.5 bg-zinc-900 z-40 origin-left"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${xpPercentage}%` }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="h-full bg-gradient-to-r from-[#F5C142] via-[#FFD700] to-[#FFA500] relative"
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FFD700] rounded-full glow-gold"></div>
      </motion.div>
    </motion.div>
  );
}
