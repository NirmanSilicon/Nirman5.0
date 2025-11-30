import { motion } from 'motion/react';
import { Wallet, TrendingUp, Cpu, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import LevelCard from './LevelCard';
import LevelModal from './LevelModal';
import BudgetingForgeMicroVisuals from './BudgetingForgeMicroVisuals';
import MarketForgeMicroVisuals from './MarketForgeMicroVisuals';
import DigitalForgeMicroVisuals from './DigitalForgeMicroVisuals';
import { levelDetailsData } from '../data/levelDetails';

const forges = [
  {
    title: 'Budgeting Forge',
    subtitle: 'Personal Finance',
    icon: Wallet,
    gradient: 'from-blue-600 to-cyan-600',
    levels: [
      {
        difficulty: 'Beginner',
        name: 'Cash Flow Runner',
        description: 'Quick-fire salary decision challenges',
        color: 'from-green-500 to-emerald-500',
      },
      {
        difficulty: 'Intermediate',
        name: 'Debt Trap Escape',
        description: 'Master credit card compounding',
        color: 'from-yellow-500 to-orange-500',
      },
      {
        difficulty: 'Advanced',
        name: 'Life Planner',
        description: 'Multi-year financial simulation',
        color: 'from-red-500 to-pink-500',
      },
    ],
  },
  {
    title: 'Market Forge',
    subtitle: 'Investing & Trading',
    icon: TrendingUp,
    gradient: 'from-purple-600 to-pink-600',
    levels: [
      {
        difficulty: 'Beginner',
        name: 'Passive Power',
        description: 'Learn SIP & compounding magic',
        color: 'from-green-500 to-emerald-500',
      },
      {
        difficulty: 'Intermediate',
        name: 'Behavioral Trap',
        description: 'Overcome FOMO and bias',
        color: 'from-yellow-500 to-orange-500',
      },
      {
        difficulty: 'Advanced',
        name: 'Portfolio Architect',
        description: 'Diversification mastery simulator',
        color: 'from-red-500 to-pink-500',
      },
    ],
  },
  {
    title: 'Digital Forge',
    subtitle: 'FinTech & Crypto',
    icon: Cpu,
    gradient: 'from-orange-600 to-yellow-600',
    levels: [
      {
        difficulty: 'Beginner',
        name: 'DeFi Detective',
        description: 'Uncover decentralized finance',
        color: 'from-green-500 to-emerald-500',
      },
      {
        difficulty: 'Intermediate',
        name: 'Tokenomics Tussle',
        description: 'Understand crypto economics',
        color: 'from-yellow-500 to-orange-500',
      },
      {
        difficulty: 'Advanced',
        name: 'Future Expansion',
        description: 'Coming soon...',
        color: 'from-gray-500 to-gray-600',
        locked: true,
      },
    ],
  },
];

export default function ForgesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<{
    level: any;
    forgeTitle: string;
    forgeGradient: string;
  } | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('[data-section="3"]');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleLevelClick = (forgeIndex: number, levelIndex: number) => {
    const forge = forges[forgeIndex];
    const level = forge.levels[levelIndex];
    
    if (level.locked) return;

    // Map forge and level indices to detail data
    const forgeKeys = ['budgeting', 'market', 'digital'];
    const levelKeys = ['beginner', 'intermediate', 'advanced'];
    
    const forgeKey = forgeKeys[forgeIndex];
    const levelKey = levelKeys[levelIndex];
    
    const detailData = (levelDetailsData as any)[forgeKey][levelKey];
    
    setSelectedLevel({
      level: {
        ...level,
        ...detailData
      },
      forgeTitle: forge.title,
      forgeGradient: forge.gradient
    });
  };

  return (
    <section 
      data-section="3"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl mb-6">
            <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Choose Your Forge
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Three paths to financial mastery. Each forge offers progressive challenges 
            that build real-world competence.
          </p>
        </motion.div>

        {/* Forges Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {forges.map((forge, forgeIndex) => (
            <motion.div
              key={forgeIndex}
              initial={{ y: 100, opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: forgeIndex * 0.2 }}
              className="relative group"
            >
              {/* Forge Container */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-6 overflow-hidden">
                {/* Header */}
                <div className="relative mb-8">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${forge.gradient} shadow-xl`}>
                      <forge.icon className="w-12 h-12 text-white" />
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${forge.gradient} blur-2xl opacity-60`}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: forgeIndex * 0.5,
                        }}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-3xl text-center mb-2 bg-gradient-to-r ${forge.gradient} bg-clip-text text-transparent`}>
                    {forge.title}
                  </h3>
                  <p className="text-center text-gray-400 text-sm">
                    {forge.subtitle}
                  </p>
                </div>

                {/* Level Cards */}
                <div className="space-y-4">
                  {forge.levels.map((level, levelIndex) => (
                    <LevelCard
                      key={levelIndex}
                      level={level}
                      index={levelIndex}
                      isVisible={isVisible}
                      forgeIndex={forgeIndex}
                      onClick={() => handleLevelClick(forgeIndex, levelIndex)}
                    />
                  ))}
                </div>

                {/* Decorative Elements */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${forge.gradient} opacity-5 blur-3xl pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Micro Visuals for Each Forge */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          <div>
            <h3 className="text-2xl mb-4 text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Budgeting Tools
            </h3>
            <BudgetingForgeMicroVisuals />
          </div>
          <div>
            <h3 className="text-2xl mb-4 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Market Tools
            </h3>
            <MarketForgeMicroVisuals />
          </div>
          <div>
            <h3 className="text-2xl mb-4 text-center bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Digital Tools
            </h3>
            <DigitalForgeMicroVisuals />
          </div>
        </motion.div>
      </div>

      {/* Level Modal */}
      {selectedLevel && (
        <LevelModal
          isOpen={!!selectedLevel}
          onClose={() => setSelectedLevel(null)}
          level={selectedLevel.level}
          forgeTitle={selectedLevel.forgeTitle}
          forgeGradient={selectedLevel.forgeGradient}
        />
      )}
    </section>
  );
}
