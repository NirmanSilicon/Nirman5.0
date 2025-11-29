import { motion } from "motion/react";
import { Award, Lock } from "lucide-react";

interface BadgeIconProps {
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

export function BadgeIcon({
  name,
  description,
  icon,
  isUnlocked,
  rarity = "common",
}: BadgeIconProps) {
  const getRarityColor = () => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600";
      case "rare":
        return "from-blue-400 to-blue-600";
      case "epic":
        return "from-purple-400 to-purple-600";
      case "legendary":
        return "from-amber-400 to-amber-600";
    }
  };

  return (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.05, rotate: 5 } : {}}
      className={`relative group ${!isUnlocked && "opacity-50"}`}
    >
      <div className="text-center space-y-2">
        <div
          className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getRarityColor()} flex items-center justify-center shadow-lg ${
            isUnlocked ? "ring-4 ring-accent/20" : ""
          }`}
        >
          {isUnlocked ? (
            <span className="text-3xl">{icon}</span>
          ) : (
            <Lock className="w-8 h-8 text-white/70" />
          )}
        </div>
        <div>
          <p className="text-center">{name}</p>
          <p className="text-muted-foreground text-center">{description}</p>
        </div>
      </div>

      {isUnlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--success)] rounded-full flex items-center justify-center"
        >
          <Award className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}
