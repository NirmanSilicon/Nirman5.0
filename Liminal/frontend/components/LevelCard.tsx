import { motion } from 'motion/react';
import { Lock, Star } from 'lucide-react';

interface Level {
  difficulty: string;
  name: string;
  description: string;
  color: string;
  locked?: boolean;
}

interface LevelCardProps {
  level: Level;
  index: number;
  isVisible: boolean;
  forgeIndex: number;
  onClick: () => void;
}

export default function LevelCard({ level, index, isVisible, forgeIndex, onClick }: LevelCardProps) {
  const stars = index + 1;

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={isVisible ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: forgeIndex * 0.2 + index * 0.1 }}
      whileHover={!level.locked ? { scale: 1.03, x: 5 } : {}}
      className="relative group"
    >
      <button
        onClick={onClick}
        disabled={level.locked}
        className={`w-full text-left relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border-2 ${
          level.locked ? 'border-gray-700 opacity-60 cursor-not-allowed' : 'border-gray-700 hover:border-gray-600 cursor-pointer'
        } transition-all duration-300 overflow-hidden`}
      >
        {/* Gradient Overlay */}
        {!level.locked && (
          <div className={`absolute inset-0 bg-gradient-to-r ${level.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        )}

        <div className="relative z-10">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-2">
            {/* Difficulty Badge */}
            <div className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${level.color} text-white shadow-lg`}>
              {level.difficulty}
            </div>

            {/* Stars or Lock */}
            <div className="flex gap-1">
              {level.locked ? (
                <Lock className="w-4 h-4 text-gray-500" />
              ) : (
                Array.from({ length: stars }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isVisible ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: forgeIndex * 0.2 + index * 0.1 + i * 0.05 }}
                  >
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Level Name */}
          <h4 className={`mb-2 ${level.locked ? 'text-gray-500' : 'text-white'}`}>
            {level.name}
          </h4>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed">
            {level.description}
          </p>

          {!level.locked && (
            <p className="text-xs text-gray-500 mt-2 group-hover:text-yellow-500 transition-colors">
              Click to view details →
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {!level.locked && (
          <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${level.color}`}
              initial={{ width: '0%' }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </button>
    </motion.div>
  );
}
