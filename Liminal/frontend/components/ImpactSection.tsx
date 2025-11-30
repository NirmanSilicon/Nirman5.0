import { motion } from 'motion/react';
import { Target, Brain, TrendingUp, Award, Users, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const impacts = [
  {
    icon: Target,
    title: 'Actionable Competence',
    description: 'Build real-world financial skills through hands-on simulation, not just theoretical knowledge.',
    stat: '10x',
    statLabel: 'Better Retention',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    title: 'Bias Correction',
    description: 'Identify and overcome emotional triggers through repeated, risk-free decision-making scenarios.',
    stat: '85%',
    statLabel: 'Bias Reduction',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Long-term Financial Literacy',
    description: 'Develop lasting habits and confidence that extend far beyond the platform.',
    stat: '5yr+',
    statLabel: 'Impact Duration',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Award,
    title: 'Psychological Awareness',
    description: 'Understand your unique financial personality and decision-making patterns.',
    stat: '95%',
    statLabel: 'Self-Awareness',
    gradient: 'from-yellow-500 to-orange-500',
  },
];

const metrics = [
  { value: '50K+', label: 'Future Learners', icon: Users },
  { value: '100+', label: 'Simulations', icon: Target },
  { value: '24/7', label: 'AI Support', icon: Brain },
  { value: '∞', label: 'Possibilities', icon: Sparkles },
];

export default function ImpactSection() {
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

    const element = document.querySelector('[data-section="7"]');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      data-section="7"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-black via-gray-950 to-black overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute top-1/4 left-1/3 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={isVisible ? {
              rotate: [0, 360],
            } : {}}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="flex justify-center mb-6"
          >
            <Sparkles className="w-16 h-16 text-yellow-500" />
          </motion.div>
          <h2 className="text-6xl md:text-7xl mb-6">
            <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Expected Impact
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Transforming financial education from passive consumption to active mastery
          </p>
        </motion.div>

        {/* Impact Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {impacts.map((impact, index) => (
            <motion.div
              key={index}
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={isVisible ? { y: 0, opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative group"
            >
              <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8 overflow-hidden shadow-2xl">
                {/* Animated Gradient Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${impact.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Content Container */}
                <div className="relative z-10">
                  {/* Icon & Stat Row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${impact.gradient} shadow-xl`}>
                        <impact.icon className="w-10 h-10 text-white" />
                      </div>
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${impact.gradient} blur-2xl opacity-60`}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                      />
                    </div>

                    <div className="text-right">
                      <div className={`text-4xl bg-gradient-to-r ${impact.gradient} bg-clip-text text-transparent`}>
                        {impact.stat}
                      </div>
                      <div className="text-sm text-gray-500">
                        {impact.statLabel}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl mb-3 text-white">
                    {impact.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {impact.description}
                  </p>
                </div>

                {/* Decorative Element */}
                <div className={`absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl ${impact.gradient} opacity-5 blur-3xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Metrics Bar */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={isVisible ? { scale: 1 } : {}}
              transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6 text-center relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <metric.icon className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
              <div className="text-3xl mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                {metric.value}
              </div>
              <p className="text-sm text-gray-400">{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-12 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.5)] hover:shadow-[0_0_60px_rgba(255,215,0,0.7)] transition-all duration-300"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10 flex items-center gap-3 justify-center">
              <Sparkles className="w-6 h-6" />
              Begin Your Financial Journey
            </span>
          </motion.button>

          <p className="mt-6 text-gray-500 text-sm">
            Join the revolution in financial education
          </p>
        </motion.div>
      </div>
    </section>
  );
}
