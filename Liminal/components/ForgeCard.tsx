import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Lock, ChevronRight } from "lucide-react";

interface ForgeCardProps {
  title: string;
  description: string;
  difficulty: string;
  difficultyIcon: string;
  difficultyColor: string;
  icon: LucideIcon;
  moduleIcon: LucideIcon;
  moduleLabel: string;
  skills: string[];
  duration: string;
  xp: number;
  xpProgress: number;
  locked: boolean;
  forgeColor: string;
  onClick?: () => void;
}

export function ForgeCard({
  title,
  description,
  difficulty,
  difficultyIcon,
  difficultyColor,
  icon: DiffIcon,
  moduleIcon: ModuleIcon,
  moduleLabel,
  skills,
  duration,
  xp,
  xpProgress,
  locked,
  forgeColor,
  onClick
}: ForgeCardProps) {
  const handleClick = () => {
    if (!locked && onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative group h-full"
    >
      {/* Card glow */}
      {!locked && (
        <div 
          className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: forgeColor }}
        />
      )}
      
      {/* Card */}
      <motion.div 
        whileHover={locked ? {} : { y: -10, scale: 1.02 }}
        className={`relative h-full rounded-2xl p-6 border-2 transition-all duration-300 ${
          locked 
            ? 'bg-zinc-900/30 border-zinc-800/50 opacity-60 cursor-not-allowed' 
            : 'bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700 hover:border-opacity-80 depth-shadow cursor-pointer'
        }`}
        style={!locked ? { borderColor: `${forgeColor}60` } : {}}
        onClick={handleClick}
        role="button"
        tabIndex={locked ? -1 : 0}
        aria-disabled={locked}
      >
        {/* Forge texture overlay */}
        {!locked && (
          <div className="absolute inset-0 rounded-2xl forge-texture opacity-30 pointer-events-none" />
        )}

        {/* Content */}
        <div className="relative z-10">
          {/* Difficulty badge */}
          <div className="flex items-center justify-between mb-4">
            <Badge 
              className="px-3 py-1.5 border pointer-events-none"
              style={{ 
                backgroundColor: `${difficultyColor}20`,
                borderColor: `${difficultyColor}60`,
                color: difficultyColor,
                fontWeight: 700
              }}
            >
              <span className="mr-1.5">{difficultyIcon}</span>
              <DiffIcon className="w-4 h-4 mr-1" />
              {difficulty}
            </Badge>
            {!locked && (
              <div className="flex items-center gap-1 text-[#FFD700] pointer-events-none">
                <span className="text-sm" style={{ fontWeight: 700 }}>{xp} XP</span>
              </div>
            )}
          </div>

          {/* XP Progress Bar */}
          {!locked && (
            <div className="mb-4 pointer-events-none">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs text-[#FFD700]" style={{ fontWeight: 600 }}>
                  {xpProgress}%
                </span>
              </div>
              <Progress 
                value={xpProgress} 
                className="h-2 bg-zinc-800"
              />
            </div>
          )}

          {/* Title */}
          <h3 
            className="text-2xl mb-3" 
            style={{ 
              fontWeight: 800,
              color: locked ? '#666' : forgeColor,
              letterSpacing: '-0.01em'
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 mb-6 leading-relaxed text-sm">
            {description}
          </p>

          {/* Visual Module Info */}
          <div 
            className="mb-6 p-3 rounded-lg border pointer-events-none"
            style={{ 
              backgroundColor: `${locked ? '#2a2a2a' : forgeColor}10`,
              borderColor: `${locked ? '#444' : forgeColor}40`
            }}
          >
            <div className="flex items-center gap-2">
              <ModuleIcon 
                className="w-5 h-5" 
                style={{ color: locked ? '#666' : forgeColor }}
              />
              <span 
                className="text-sm"
                style={{ 
                  fontWeight: 600,
                  color: locked ? '#666' : forgeColor
                }}
              >
                {moduleLabel}
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6 space-y-2 pointer-events-none">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>
              Skills Developed
            </div>
            {skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2">
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: locked ? '#666' : forgeColor }}
                />
                <span className="text-sm text-gray-400">{skill}</span>
              </div>
            ))}
          </div>

          {/* Duration */}
          <div className="mb-6 text-sm text-gray-500 flex items-center gap-2 pointer-events-none">
            <span>⏱️</span>
            <span>{duration}</span>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={locked ? {} : { scale: 1.05 }}
            whileTap={locked ? {} : { scale: 0.95 }}
            disabled={locked}
            className={`w-full px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
              locked 
                ? 'bg-zinc-800 text-gray-600 cursor-not-allowed' 
                : 'button-3d'
            }`}
            style={!locked ? { 
              backgroundColor: forgeColor,
              color: '#000',
              fontWeight: 700
            } : {}}
          >
            {locked ? (
              <>
                <Lock className="w-4 h-4" />
                Coming Soon
              </>
            ) : (
              <>
                Start Challenge
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </motion.button>

          {/* Lock overlay */}
          {locked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Lock className="w-16 h-16 text-zinc-700" />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
