import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  showLevel?: boolean;
}

export function XPBar({ currentXP, maxXP, level, showLevel = true }: XPBarProps) {
  const percentage = (currentXP / maxXP) * 100;

  return (
    <div className="flex items-center gap-3">
      {showLevel && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent rounded-lg">
          <Sparkles className="w-4 h-4 text-accent-foreground" />
          <span className="text-accent-foreground">Lvl {level}</span>
        </div>
      )}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-muted-foreground">
            {currentXP} / {maxXP} XP
          </span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
