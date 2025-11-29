import { motion } from "motion/react";
import { Play, Clock, Zap, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface SimulatorCardProps {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  rewardXP: number;
  isCompleted?: boolean;
  progress?: number;
  onClick: () => void;
}

export function SimulatorCard({
  title,
  description,
  difficulty,
  estimatedTime,
  rewardXP,
  isCompleted = false,
  progress = 0,
  onClick,
}: SimulatorCardProps) {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case "Beginner":
        return "bg-[var(--success)] text-white";
      case "Intermediate":
        return "bg-[var(--gold)] text-[var(--navy)]";
      case "Advanced":
        return "bg-[var(--risk)] text-white";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div className="bg-card border border-border rounded-xl p-5 space-y-4 hover:shadow-lg transition-all">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4>{title}</h4>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
          {isCompleted && (
            <Badge variant="outline" className="bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20">
              ✓ Done
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={getDifficultyColor()}>{difficulty}</Badge>
          <Badge variant="secondary" className="gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {estimatedTime}
          </Badge>
          <Badge variant="secondary" className="gap-1.5 bg-accent/10 text-accent-foreground border-accent/20">
            <Zap className="w-3.5 h-3.5" />
            +{rewardXP} XP
          </Badge>
        </div>

        {progress > 0 && !isCompleted && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <Button onClick={onClick} className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
          <Play className="w-4 h-4 mr-2" />
          {isCompleted ? "Play Again" : progress > 0 ? "Continue" : "Start Simulator"}
        </Button>
      </div>
    </motion.div>
  );
}
