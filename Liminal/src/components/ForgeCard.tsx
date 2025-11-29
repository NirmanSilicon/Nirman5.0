import { motion } from "motion/react";
import { ArrowRight, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface ForgeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  badgeLevel: string;
  simulatorsCompleted: number;
  totalSimulators: number;
  bgGradient: string;
  onClick: () => void;
}

export function ForgeCard({
  title,
  description,
  icon,
  progress,
  badgeLevel,
  simulatorsCompleted,
  totalSimulators,
  bgGradient,
  onClick,
}: ForgeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-xl bg-card border border-border shadow-lg hover:shadow-xl transition-shadow">
        <div className={`absolute inset-0 opacity-10 ${bgGradient}`} />
        
        <div className="relative p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <Badge variant="secondary" className="gap-1.5">
              <Award className="w-3.5 h-3.5" />
              {badgeLevel}
            </Badge>
          </div>

          <div className="space-y-2">
            <h3>{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {simulatorsCompleted} / {totalSimulators} Completed
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Start Learning
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
