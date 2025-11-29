import { motion, AnimatePresence } from "motion/react";
import { X, Trophy, Star, Zap, Crown, Shield, Target, Flame } from "lucide-react";
import { Badge } from "./ui/badge";
import { GameButton } from "./GameButton";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
}

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const achievements: Achievement[] = [
    {
      id: "first-challenge",
      name: "First Steps",
      description: "Complete your first challenge",
      icon: Star,
      color: "#39FF14",
      unlocked: true,
      rarity: "Common"
    },
    {
      id: "debt-master",
      name: "Debt Destroyer",
      description: "Successfully escape the debt trap 3 times",
      icon: Zap,
      color: "#FFD700",
      unlocked: true,
      progress: 3,
      maxProgress: 3,
      rarity: "Rare"
    },
    {
      id: "portfolio-pro",
      name: "Portfolio Pro",
      description: "Build a perfectly balanced portfolio",
      icon: Crown,
      color: "#FF00FF",
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      rarity: "Epic"
    },
    {
      id: "fomo-fighter",
      name: "FOMO Fighter",
      description: "Resist 10 emotional trading triggers",
      icon: Shield,
      color: "#00FFFF",
      unlocked: false,
      progress: 6,
      maxProgress: 10,
      rarity: "Epic"
    },
    {
      id: "grand-master",
      name: "Financial Grand Master",
      description: "Complete all challenges with perfect scores",
      icon: Trophy,
      color: "#F5C142",
      unlocked: false,
      progress: 0,
      maxProgress: 9,
      rarity: "Legendary"
    },
    {
      id: "streak-master",
      name: "Week Warrior",
      description: "Complete challenges 7 days in a row",
      icon: Flame,
      color: "#FF6B35",
      unlocked: false,
      progress: 4,
      maxProgress: 7,
      rarity: "Rare"
    }
  ];

  const rarityColors = {
    Common: "#39FF14",
    Rare: "#00FFFF",
    Epic: "#FF00FF",
    Legendary: "#FFD700"
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[80vh] bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-[#FFD700]/50 rounded-2xl p-8 z-50 overflow-hidden"
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-400" />
            </motion.button>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-[#FFD700]" />
                <h2 className="text-3xl text-gradient-gold" style={{ fontWeight: 900 }}>
                  Achievements
                </h2>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span>Progress:</span>
                <span className="text-[#FFD700]" style={{ fontWeight: 700 }}>
                  {unlockedCount}/{achievements.length}
                </span>
                <span className="text-gray-500">unlocked</span>
              </div>
            </div>

            {/* Achievements grid */}
            <div className="overflow-y-auto max-h-[calc(80vh-200px)] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  const progress = achievement.progress || 0;
                  const maxProgress = achievement.maxProgress || 1;
                  const progressPercentage = (progress / maxProgress) * 100;

                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={achievement.unlocked ? { scale: 1.03, y: -3 } : {}}
                      whileTap={achievement.unlocked ? { scale: 0.98 } : {}}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-zinc-800 to-zinc-700 border-opacity-100 cursor-pointer'
                          : 'bg-zinc-900/50 border-zinc-800 opacity-70'
                      }`}
                      style={{
                        borderColor: achievement.unlocked
                          ? rarityColors[achievement.rarity]
                          : undefined
                      }}
                      onClick={() => {
                        if (achievement.unlocked) {
                          alert(`🏆 ${achievement.title}\n\n${achievement.description}\n\nReward: ${achievement.reward}`);
                        }
                      }}
                      role={achievement.unlocked ? "button" : undefined}
                      tabIndex={achievement.unlocked ? 0 : -1}
                    >
                      {/* Rarity badge */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          className="text-xs px-2 py-0.5"
                          style={{
                            backgroundColor: `${rarityColors[achievement.rarity]}20`,
                            color: rarityColors[achievement.rarity],
                            borderColor: `${rarityColors[achievement.rarity]}60`
                          }}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>

                      {/* Icon */}
                      <div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
                          achievement.unlocked ? 'glow-gold' : ''
                        }`}
                        style={{
                          backgroundColor: `${achievement.color}20`,
                          border: `2px solid ${achievement.color}60`
                        }}
                      >
                        <IconComponent
                          className="w-8 h-8"
                          style={{ color: achievement.unlocked ? achievement.color : '#666' }}
                        />
                      </div>

                      {/* Name */}
                      <h3
                        className="text-lg mb-2"
                        style={{
                          fontWeight: 700,
                          color: achievement.unlocked ? achievement.color : '#666'
                        }}
                      >
                        {achievement.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-400 mb-4">
                        {achievement.description}
                      </p>

                      {/* Progress bar */}
                      {!achievement.unlocked && achievement.maxProgress && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500">Progress</span>
                            <span className="text-xs text-[#FFD700]" style={{ fontWeight: 700 }}>
                              {progress}/{maxProgress}
                            </span>
                          </div>
                          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: achievement.color }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Unlocked badge */}
                      {achievement.unlocked && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                          <span className="text-sm text-green-500" style={{ fontWeight: 600 }}>
                            Unlocked!
                          </span>
                        </div>
                      )}

                      {/* Locked overlay */}
                      {!achievement.unlocked && (
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-6xl opacity-20"
                          >
                            🔒
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-zinc-700 flex justify-center">
              <GameButton
                onClick={onClose}
                variant="primary"
                size="md"
              >
                Close
              </GameButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
