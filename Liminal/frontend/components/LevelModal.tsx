import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Clock, Target, Trophy, Play, CheckCircle, Lock } from 'lucide-react';

interface LevelDetails {
  difficulty: string;
  name: string;
  description: string;
  color: string;
  locked?: boolean;
  fullDescription: string;
  duration: string;
  objectives: string[];
  modules: {
    title: string;
    description: string;
    completed?: boolean;
  }[];
  skills: string[];
  rewards: string[];
}

interface LevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: LevelDetails;
  forgeTitle: string;
  forgeGradient: string;
}

export default function LevelModal({ isOpen, onClose, level, forgeTitle, forgeGradient }: LevelModalProps) {
  if (!isOpen) return null;

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
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-hidden"
          >
            <div className="relative h-full bg-gradient-to-br from-gray-900 via-gray-900 to-black border-2 border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
              {/* Decorative Background Gradient */}
              <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${level.color} opacity-10 blur-3xl pointer-events-none`} />
              <div className={`absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr ${forgeGradient} opacity-10 blur-3xl pointer-events-none`} />

              {/* Scrollable Content */}
              <div className="relative h-full overflow-y-auto p-6 md:p-8 lg:p-12">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-300 group z-10"
                >
                  <X className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                </button>

                {/* Header */}
                <div className="mb-8">
                  {/* Forge Title */}
                  <p className={`text-sm mb-2 bg-gradient-to-r ${forgeGradient} bg-clip-text text-transparent`}>
                    {forgeTitle}
                  </p>

                  {/* Difficulty Badge */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`px-4 py-2 rounded-full text-sm bg-gradient-to-r ${level.color} text-white shadow-lg`}>
                      {level.difficulty}
                    </div>
                    {level.locked && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">Locked - Complete previous levels</span>
                      </div>
                    )}
                  </div>

                  {/* Level Name */}
                  <h2 className="text-4xl md:text-5xl mb-4">
                    <span className={`bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                      {level.name}
                    </span>
                  </h2>

                  {/* Full Description */}
                  <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">
                    {level.fullDescription}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <h4 className="text-sm text-gray-400">Duration</h4>
                    </div>
                    <p className="text-white">{level.duration}</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      <h4 className="text-sm text-gray-400">Objectives</h4>
                    </div>
                    <p className="text-white">{level.objectives.length} Goals</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="w-5 h-5 text-orange-500" />
                      <h4 className="text-sm text-gray-400">Rewards</h4>
                    </div>
                    <p className="text-white">{level.rewards.length} Items</p>
                  </div>
                </div>

                {/* Objectives Section */}
                <div className="mb-8">
                  <h3 className="text-2xl mb-4 flex items-center gap-3">
                    <Target className="w-6 h-6 text-yellow-500" />
                    Learning Objectives
                  </h3>
                  <div className="grid gap-3">
                    {level.objectives.map((objective, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                      >
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-300">{objective}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Modules Section */}
                <div className="mb-8">
                  <h3 className="text-2xl mb-4 flex items-center gap-3">
                    <Play className="w-6 h-6 text-yellow-500" />
                    Course Modules
                  </h3>
                  <div className="grid gap-4">
                    {level.modules.map((module, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                              module.completed 
                                ? 'bg-green-500/20 border-2 border-green-500' 
                                : 'bg-gray-700 border-2 border-gray-600'
                            }`}>
                              {module.completed ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <span className="text-xs text-gray-400">{index + 1}</span>
                              )}
                            </div>
                            <h4 className="text-lg text-white">{module.title}</h4>
                          </div>
                          {module.completed && (
                            <span className="text-xs text-green-500 px-2 py-1 bg-green-500/10 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 ml-11">{module.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Skills You'll Master */}
                <div className="mb-8">
                  <h3 className="text-2xl mb-4 flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Skills You'll Master
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {level.skills.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className={`px-4 py-2 rounded-full bg-gradient-to-r ${level.color} bg-opacity-20 border border-gray-700 text-white text-sm`}
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Rewards Section */}
                <div className="mb-8">
                  <h3 className="text-2xl mb-4 flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Completion Rewards
                  </h3>
                  <div className="grid gap-3">
                    {level.rewards.map((reward, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center gap-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/30"
                      >
                        <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        <p className="text-gray-300">{reward}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {!level.locked && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className={`w-full bg-gradient-to-r ${level.color} text-white py-4 px-8 rounded-xl text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 group`}
                  >
                    <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    Start Challenge
                  </motion.button>
                )}
                {level.locked && (
                  <div className="w-full bg-gray-800 text-gray-500 py-4 px-8 rounded-xl text-lg flex items-center justify-center gap-3 border border-gray-700 cursor-not-allowed">
                    <Lock className="w-6 h-6" />
                    Complete Previous Levels to Unlock
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
