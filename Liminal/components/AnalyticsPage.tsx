import { motion } from "motion/react";
import { Brain, TrendingUp, AlertCircle, BarChart3, Zap, Target, Eye, Clock, MousePointer, DollarSign } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

export function AnalyticsPage() {
  const metrics = [
    { label: "Reaction Time", value: 85, color: "#FFD700", icon: Clock },
    { label: "Risk-Taking Score", value: 62, color: "#FF00FF", icon: TrendingUp },
    { label: "Trading Frequency", value: 45, color: "#00FFFF", icon: MousePointer },
    { label: "Debt Prioritization", value: 78, color: "#39FF14", icon: DollarSign }
  ];

  const profiles = [
    {
      type: "FOMO-Susceptible",
      description: "Tends to make impulsive decisions during market rallies",
      severity: "High",
      color: "#FF6B35",
      recommendation: "Practice patience modules & contrarian strategies"
    },
    {
      type: "High-Frequency Trader",
      description: "Makes quick decisions, potentially over-trading",
      severity: "Medium",
      color: "#FFA500",
      recommendation: "Focus on long-term investment simulations"
    },
    {
      type: "Conservative Planner",
      description: "Risk-averse with strong budgeting discipline",
      severity: "Low",
      color: "#39FF14",
      recommendation: "Explore calculated risk-taking scenarios"
    }
  ];

  const learningPath = [
    { stage: "Detect Behavior", status: "complete", description: "AI analyzes your decision patterns" },
    { stage: "Identify Biases", status: "complete", description: "Recognition of FOMO, loss aversion, etc." },
    { stage: "Recommend Modules", status: "active", description: "Personalized learning path created" },
    { stage: "Track Progress", status: "pending", description: "Monitor improvement over time" },
    { stage: "Adaptive Learning", status: "pending", description: "Difficulty adjusts to your level" }
  ];

  const visualizers = [
    {
      name: "Compound Interest Calculator",
      description: "See how small investments grow exponentially over time",
      icon: TrendingUp,
      color: "#FFD700"
    },
    {
      name: "Inflation Impact Tracker",
      description: "Understand how inflation erodes purchasing power",
      icon: AlertCircle,
      color: "#FF6B35"
    },
    {
      name: "Mock Asset Portfolio",
      description: "Track performance of simulated investments in real-time",
      icon: BarChart3,
      color: "#00FFFF"
    },
    {
      name: "News Sentiment Feed",
      description: "Live financial news with market impact indicators",
      icon: Eye,
      color: "#FF00FF"
    }
  ];

  return (
    <div className="relative min-h-screen py-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>
      
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#FFD700] rounded-full blur-[120px] animate-pulse-neon"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#FF00FF] rounded-full blur-[120px] animate-pulse-neon" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-full">
            <Brain className="w-6 h-6 text-purple-500" />
            <span className="text-purple-500 uppercase tracking-wider">Behavioral Analytics</span>
          </div>
          <h2 className="text-5xl md:text-6xl mb-4 text-gradient-gold" style={{ fontWeight: 800 }}>
            AI-Powered Insights
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Understand your financial personality through advanced behavioral analytics and personalized AI coaching
          </p>
        </motion.div>

        {/* Behavioral Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl text-[#FFD700] mb-6 flex items-center gap-3" style={{ fontWeight: 700 }}>
            <BarChart3 className="w-7 h-7" />
            Behavioral Analytics Engine
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-opacity-80 transition-all duration-300"
                  style={{ borderColor: `${metric.color}40` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: metric.color }}
                    />
                    <span 
                      className="text-2xl" 
                      style={{ fontWeight: 700, color: metric.color }}
                    >
                      {metric.value}%
                    </span>
                  </div>
                  <div className="mb-3 text-gray-300" style={{ fontWeight: 600 }}>
                    {metric.label}
                  </div>
                  <Progress 
                    value={metric.value} 
                    className="h-2"
                    style={{ 
                      backgroundColor: '#2a2a2a'
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* User Profiles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-2xl text-[#FFD700] mb-6 flex items-center gap-3" style={{ fontWeight: 700 }}>
            <Target className="w-7 h-7" />
            Behavioral Profile Detection
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {profiles.map((profile, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-zinc-900/80 border rounded-xl p-6 hover:scale-105 transition-all duration-300"
                style={{ borderColor: `${profile.color}60` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge 
                    className="px-3 py-1"
                    style={{ 
                      backgroundColor: `${profile.color}20`,
                      color: profile.color,
                      borderColor: `${profile.color}60`
                    }}
                  >
                    {profile.type}
                  </Badge>
                  <Badge 
                    variant={profile.severity === 'High' ? 'destructive' : profile.severity === 'Medium' ? 'secondary' : 'outline'}
                    className="px-2 py-1 text-xs"
                  >
                    {profile.severity}
                  </Badge>
                </div>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {profile.description}
                </p>
                <div className="border-t border-zinc-800 pt-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Recommendation</div>
                  <p className="text-sm text-gray-300">{profile.recommendation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Learning Path */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl text-[#FFD700] mb-6 flex items-center gap-3" style={{ fontWeight: 700 }}>
            <Zap className="w-7 h-7" />
            AI-Driven Learning Path
          </h3>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-[#FFD700]/30 rounded-xl p-8">
            <div className="space-y-4">
              {learningPath.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      step.status === 'complete' 
                        ? 'bg-green-500/20 border-green-500 text-green-500' 
                        : step.status === 'active'
                        ? 'bg-[#FFD700]/20 border-[#FFD700] text-[#FFD700] glow-gold'
                        : 'bg-zinc-800 border-zinc-700 text-gray-600'
                    }`}
                  >
                    {step.status === 'complete' ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <div 
                      className={`mb-1 ${
                        step.status === 'complete' ? 'text-green-500' 
                        : step.status === 'active' ? 'text-[#FFD700]' 
                        : 'text-gray-600'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {step.stage}
                    </div>
                    <div className="text-sm text-gray-500">{step.description}</div>
                  </div>
                  {index < learningPath.length - 1 && (
                    <div className="hidden md:block w-12 h-0.5 bg-zinc-700"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Visualizers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl text-[#FFD700] mb-6 flex items-center gap-3" style={{ fontWeight: 700 }}>
            <Eye className="w-7 h-7" />
            Interactive Visualizers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visualizers.map((viz, index) => {
              const IconComponent = viz.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-zinc-900/80 border border-zinc-700 rounded-xl p-6 hover:border-opacity-80 transition-all duration-300"
                  style={{ borderColor: `${viz.color}40` }}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ 
                      backgroundColor: `${viz.color}20`,
                      border: `2px solid ${viz.color}40`
                    }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: viz.color }}
                    />
                  </div>
                  <h4 
                    className="text-lg mb-2" 
                    style={{ fontWeight: 700, color: viz.color }}
                  >
                    {viz.name}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {viz.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
