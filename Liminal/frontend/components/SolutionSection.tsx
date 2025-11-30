import { motion } from 'motion/react';
import { Gamepad2, TrendingUp, Brain, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

const solutions = [
  {
    icon: Gamepad2,
    title: 'Gamified Web App',
    description: 'Engaging, game-like interface that makes learning finance addictive and fun, not boring.',
    gradient: 'from-purple-500 to-pink-500',
    glow: 'shadow-purple-500/50',
  },
  {
    icon: TrendingUp,
    title: 'Realistic Simulations',
    description: 'Practice with real market data and scenarios without risking actual money.',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/50',
  },
  {
    icon: Brain,
    title: 'Behavioral Learning',
    description: 'AI-powered system that identifies your biases and adapts to your learning style.',
    gradient: 'from-green-500 to-emerald-500',
    glow: 'shadow-green-500/50',
  },
  {
    icon: Shield,
    title: 'Zero Real Money Risk',
    description: 'Learn from mistakes in a safe environment before making real financial decisions.',
    gradient: 'from-yellow-500 to-orange-500',
    glow: 'shadow-yellow-500/50',
  },
];

export default function SolutionSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.querySelector('[data-section="2"]');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      data-section="2"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl mb-6">
            <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Finance Forge
            </span>
          </h2>
          <p className="text-3xl text-yellow-200/80 mb-4 italic">
            Conceptualizing Wealth
          </p>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A revolutionary approach to financial education through immersive, risk-free gameplay
          </p>
        </motion.div>

        {/* Solution Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ y: 100, opacity: 0, rotateX: -15 }}
              animate={isVisible ? { y: 0, opacity: 1, rotateX: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="relative group"
              style={{ perspective: '1000px' }}
            >
              <div className={`relative bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6 overflow-hidden shadow-2xl ${solution.glow} transition-shadow duration-300`}>
                {/* Animated Background Gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  animate={{
                    background: [
                      `linear-gradient(135deg, transparent 0%, transparent 100%)`,
                      `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)`,
                      `linear-gradient(135deg, transparent 0%, transparent 100%)`,
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />

                {/* Icon Container */}
                <div className="relative mb-6 flex justify-center">
                  <div className={`relative p-4 rounded-xl bg-gradient-to-br ${solution.gradient}`}>
                    <solution.icon className="w-10 h-10 text-white" />
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} blur-xl opacity-60`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 0.8, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl mb-3 text-center text-white">
                  {solution.title}
                </h3>
                <p className="text-gray-400 text-center leading-relaxed">
                  {solution.description}
                </p>

                {/* Shine Effect */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
