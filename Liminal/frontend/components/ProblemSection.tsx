import { motion } from 'motion/react';
import { AlertTriangle, TrendingDown, Users, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

const problems = [
  {
    icon: BookOpen,
    title: 'Lack of Financial Education',
    description: 'Traditional education systems fail to teach practical financial skills, leaving people unprepared for real-world money decisions.',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: AlertTriangle,
    title: 'Emotional Traps',
    description: 'FOMO, speculation, and emotional decision-making lead to poor financial choices and significant losses.',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Users,
    title: 'Peer Pressure',
    description: 'Social influence and trending investments push people into risky decisions without proper understanding.',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    icon: TrendingDown,
    title: 'Passive Traditional Learning',
    description: 'Reading books and watching videos doesn\'t build the muscle memory needed for confident financial decisions.',
    color: 'from-amber-500 to-orange-600',
  },
];

export default function ProblemSection() {
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

    const element = document.querySelector('[data-section="1"]');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      data-section="1"
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
          <h2 className="text-6xl md:text-7xl mb-4">
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              The Problem
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Understanding the barriers to financial competence
          </p>
        </motion.div>

        {/* Problem Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative group"
            >
              <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 overflow-hidden shadow-xl">
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${problem.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${problem.color} shadow-lg`}>
                    <problem.icon className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${problem.color} blur-xl opacity-50`}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                </div>

                {/* Content */}
                <h3 className="text-2xl mb-3 text-white">
                  {problem.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {problem.description}
                </p>

                {/* Decorative Corner */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${problem.color} opacity-5 blur-2xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
        />
      </div>
    </section>
  );
}
