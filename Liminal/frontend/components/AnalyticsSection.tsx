import { motion } from 'motion/react';
import { Brain, Clock, Zap, Target, TrendingUp, AlertCircle, LineChart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import EnhancedBehavioralAnalytics from './EnhancedBehavioralAnalytics';

const behavioralMetrics = [
  { name: 'Reaction Time', icon: Clock, value: 85, color: '#3b82f6' },
  { name: 'Risk Taking', icon: Zap, value: 62, color: '#f59e0b' },
  { name: 'Trading Frequency', icon: TrendingUp, value: 45, color: '#10b981' },
  { name: 'Debt Prioritization', icon: Target, value: 78, color: '#8b5cf6' },
];

const userProfiles = [
  {
    badge: 'FOMO-Susceptible',
    description: 'Tends to make impulsive decisions based on market trends',
    color: 'from-red-500 to-orange-500',
    icon: AlertCircle,
  },
  {
    badge: 'High-Frequency Trader',
    description: 'Makes rapid successive trades without adequate analysis',
    color: 'from-yellow-500 to-amber-500',
    icon: Zap,
  },
  {
    badge: 'Conservative Planner',
    description: 'Prefers stable, long-term investment strategies',
    color: 'from-green-500 to-emerald-500',
    icon: Target,
  },
];

const learningPath = [
  { step: 'Detect Behavior', description: 'AI analyzes your decision patterns', active: true },
  { step: 'Identify Biases', description: 'Pinpoint emotional triggers', active: true },
  { step: 'Recommend Module', description: 'Personalized learning path', active: false },
  { step: 'Track Progress', description: 'Monitor improvement over time', active: false },
];

export default function AnalyticsSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('[data-section="4"]');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      data-section="4"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-black via-gray-950 to-black"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <Brain className="w-16 h-16 text-yellow-500" />
          </div>
          <h2 className="text-6xl md:text-7xl mb-6">
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Behavioral Analytics
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            AI-powered insights that understand your financial behavior and adapt to your learning needs
          </p>
        </motion.div>

        {/* Analytics Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Behavioral Metrics */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8"
          >
            <h3 className="text-2xl mb-6 flex items-center gap-3">
              <LineChart className="w-6 h-6 text-cyan-500" />
              Behavioral Analytics Engine
            </h3>
            
            <div className="space-y-6">
              {behavioralMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={isVisible ? { x: 0, opacity: 1 } : {}}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                      <span className="text-gray-300">{metric.name}</span>
                    </div>
                    <span className="text-white">{metric.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: metric.color }}
                      initial={{ width: 0 }}
                      animate={isVisible ? { width: `${metric.value}%` } : {}}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Radial Chart */}
            <div className="mt-8 w-full h-64 min-h-[16rem]">
              <ResponsiveContainer width="100%" height={256}>
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="20%" 
                  outerRadius="90%" 
                  data={behavioralMetrics.map(m => ({ ...m, fill: m.color }))}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise
                    dataKey="value"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* User Profiles */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8"
          >
            <h3 className="text-2xl mb-6">User Profile Badges</h3>
            
            <div className="space-y-4">
              {userProfiles.map((profile, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={isVisible ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="relative group"
                >
                  <div className={`relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 border-2 border-gray-700 hover:border-gray-600 transition-all overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${profile.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    
                    <div className="relative z-10 flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${profile.color}`}>
                        <profile.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`mb-2 bg-gradient-to-r ${profile.color} bg-clip-text text-transparent`}>
                          {profile.badge}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {profile.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Learning Path */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8"
        >
          <h3 className="text-2xl mb-8 text-center">AI-Driven Learning Path</h3>
          
          <div className="flex flex-wrap justify-center gap-4">
            {learningPath.map((step, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                className="relative"
              >
                <div className={`relative ${step.active ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-gray-800'} rounded-2xl p-6 min-w-[200px] shadow-xl ${step.active ? 'shadow-yellow-500/30' : ''}`}>
                  <div className="text-center">
                    <div className={`w-8 h-8 mx-auto mb-3 rounded-full ${step.active ? 'bg-white text-black' : 'bg-gray-700 text-gray-400'} flex items-center justify-center`}>
                      {index + 1}
                    </div>
                    <h4 className={`mb-2 ${step.active ? 'text-white' : 'text-gray-400'}`}>
                      {step.step}
                    </h4>
                    <p className={`text-sm ${step.active ? 'text-white/80' : 'text-gray-500'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                {index < learningPath.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-700" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Behavioral Analytics */}
        <EnhancedBehavioralAnalytics />

        {/* Visualizers Note */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl px-6 py-4">
            <p className="text-gray-400">
              <span className="text-yellow-500">Interactive Visualizers:</span> Compound Interest Calculator • Inflation Tracker • Mock Asset Portfolio • Real-time News Integration
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
