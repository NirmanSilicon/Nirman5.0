import { motion } from "motion/react";
import { Brain, TrendingUp, AlertCircle, BarChart3, Zap, Target, Eye, Clock, MousePointer, DollarSign, Activity, Radar, ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export function AnalyticsPageEnhanced() {
  const metrics = [
    { label: "Reaction Time", value: 85, color: "#FFD700", icon: Clock, trend: "+5%" },
    { label: "Risk-Taking Score", value: 62, color: "#FF00FF", icon: TrendingUp, trend: "-12%" },
    { label: "Trading Frequency", value: 45, color: "#00FFFF", icon: MousePointer, trend: "-8%" },
    { label: "Debt Prioritization", value: 78, color: "#39FF14", icon: DollarSign, trend: "+15%" }
  ];

  // Reaction time data
  const reactionTimeData = [
    { session: 1, time: 850 },
    { session: 2, time: 780 },
    { session: 3, time: 720 },
    { session: 4, time: 680 },
    { session: 5, time: 650 },
    { session: 6, time: 620 }
  ];

  // Trading frequency data
  const tradingFrequencyData = [
    { day: "Mon", trades: 12 },
    { day: "Tue", trades: 8 },
    { day: "Wed", trades: 15 },
    { day: "Thu", trades: 6 },
    { day: "Fri", trades: 9 },
    { day: "Sat", trades: 4 },
    { day: "Sun", trades: 3 }
  ];

  // Decision heatmap data (simplified as bars)
  const decisionHeatmapData = [
    { category: "Impulse", score: 35, color: "#FF6B35" },
    { category: "Analytical", score: 75, color: "#39FF14" },
    { category: "Emotional", score: 45, color: "#FF00FF" },
    { category: "Strategic", score: 82, color: "#00FFFF" }
  ];

  // Debt prioritization path
  const debtPriorityData = [
    { method: "High Interest First", score: 90 },
    { method: "Snowball Method", score: 65 },
    { method: "Minimum Payments", score: 30 }
  ];

  const profiles = [
    {
      type: "FOMO-Susceptible",
      description: "Tends to make impulsive decisions during market rallies",
      severity: "High",
      color: "#FF6B35",
      recommendation: "Practice patience modules & contrarian strategies",
      percentage: 72
    },
    {
      type: "High-Frequency Trader",
      description: "Makes quick decisions, potentially over-trading",
      severity: "Medium",
      color: "#FFA500",
      recommendation: "Focus on long-term investment simulations",
      percentage: 58
    },
    {
      type: "Conservative Planner",
      description: "Risk-averse with strong budgeting discipline",
      severity: "Low",
      color: "#39FF14",
      recommendation: "Explore calculated risk-taking scenarios",
      percentage: 85
    }
  ];

  const learningPath = [
    { 
      stage: "Detect Behavior", 
      status: "complete", 
      description: "AI analyzes your decision patterns",
      icon: Radar
    },
    { 
      stage: "Identify Biases", 
      status: "complete", 
      description: "Recognition of FOMO, loss aversion, etc.",
      icon: Brain
    },
    { 
      stage: "Recommend Modules", 
      status: "active", 
      description: "Personalized learning path created",
      icon: Target
    },
    { 
      stage: "Track Progress", 
      status: "pending", 
      description: "Monitor improvement over time",
      icon: Activity
    },
    { 
      stage: "Adaptive Learning", 
      status: "pending", 
      description: "Difficulty adjusts to your level",
      icon: Zap
    }
  ];

  // Compound interest visualizer data
  const compoundInterestData = [
    { year: 0, value: 0 },
    { year: 5, value: 6802 },
    { year: 10, value: 15937 },
    { year: 15, value: 27811 },
    { year: 20, value: 43321 },
    { year: 25, value: 63328 }
  ];

  // Inflation calculator data
  const inflationData = [
    { item: "Coffee", current: 5, future: 7.5 },
    { item: "Gas", current: 80, future: 120 },
    { item: "Rent", current: 1500, future: 2250 }
  ];

  const visualizers = [
    {
      name: "Compound Interest Calculator",
      description: "See how small investments grow exponentially over time",
      icon: TrendingUp,
      color: "#FFD700",
      hasChart: true
    },
    {
      name: "Inflation Impact Tracker",
      description: "Understand how inflation erodes purchasing power",
      icon: AlertCircle,
      color: "#FF6B35",
      hasChart: true
    },
    {
      name: "Mock Asset Portfolio",
      description: "Track performance of simulated investments in real-time",
      icon: BarChart3,
      color: "#00FFFF",
      hasChart: false
    },
    {
      name: "Market News Sentiment",
      description: "Live financial news with market impact indicators",
      icon: Eye,
      color: "#FF00FF",
      hasChart: false
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
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-purple-500/10 border border-purple-500/30 rounded-full backdrop-blur-sm">
            <Brain className="w-6 h-6 text-purple-500" />
            <span className="text-purple-500 uppercase tracking-wider" style={{ fontWeight: 700 }}>Behavioral Analytics</span>
          </div>
          <h2 className="text-5xl md:text-6xl mb-4 text-gradient-gold" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
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
          <h3 className="text-2xl text-[#FFD700] mb-6 flex items-center gap-3" style={{ fontWeight: 800 }}>
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
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-6 transition-all duration-300 depth-shadow cursor-pointer group"
                  style={{ borderColor: `${metric.color}40` }}
                  onClick={() => {
                    alert(`📊 ${metric.label}\n\nCurrent Score: ${metric.value}/100\nTrend: ${metric.trend}\n\nClick to view detailed insights.`);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: metric.color }}
                    />
                    <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-green-500" style={{ fontWeight: 700 }}>
                      {metric.trend}
                    </span>
                  </div>
                  <div 
                    className="text-3xl mb-2" 
                    style={{ fontWeight: 900, color: metric.color }}
                  >
                    {metric.value}%
                  </div>
                  <div className="mb-3 text-gray-300 text-sm" style={{ fontWeight: 600 }}>
                    {metric.label}
                  </div>
                  <Progress 
                    value={metric.value} 
                    className="h-2 bg-zinc-800"
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Behavior Tracking Panels */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-2xl text-[#FFD700] mb-6 flex items-center gap-3" style={{ fontWeight: 800 }}>
            <Activity className="w-7 h-7" />
            Behavior Tracking Panels
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Reaction Time Graph */}
            <div className="bg-zinc-900/80 border border-[#FFD700]/30 rounded-xl p-6 depth-shadow">
              <h4 className="text-lg mb-4 text-[#FFD700]" style={{ fontWeight: 700 }}>
                Reaction Time Improvement
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={reactionTimeData}>
                  <defs>
                    <linearGradient id="reactionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="session" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="time" 
                    stroke="#FFD700" 
                    fillOpacity={1} 
                    fill="url(#reactionGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Trading Frequency Chart */}
            <div className="bg-zinc-900/80 border border-[#00FFFF]/30 rounded-xl p-6 depth-shadow">
              <h4 className="text-lg mb-4 text-[#00FFFF]" style={{ fontWeight: 700 }}>
                Trading Frequency Pattern
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={tradingFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #00FFFF' }}
                  />
                  <Bar dataKey="trades" fill="#00FFFF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Decision Heatmap */}
            <div className="bg-zinc-900/80 border border-[#FF00FF]/30 rounded-xl p-6 depth-shadow">
              <h4 className="text-lg mb-4 text-[#FF00FF]" style={{ fontWeight: 700 }}>
                Decision-Making Heatmap
              </h4>
              <div className="space-y-4">
                {decisionHeatmapData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300" style={{ fontWeight: 600 }}>{item.category}</span>
                      <span style={{ color: item.color, fontWeight: 700 }}>{item.score}%</span>
                    </div>
                    <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.score}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Debt Prioritization Path */}
            <div className="bg-zinc-900/80 border border-[#39FF14]/30 rounded-xl p-6 depth-shadow">
              <h4 className="text-lg mb-4 text-[#39FF14]" style={{ fontWeight: 700 }}>
                Debt Prioritization Strategy
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={debtPriorityData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="method" type="category" stroke="#666" width={150} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #39FF14' }}
                  />
                  <Bar dataKey="score" fill="#39FF14" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* User Profiles with Risk Meter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-2xl text-[#FFD700] mb-6 flex items-center gap-3" style={{ fontWeight: 800 }}>
            <Target className="w-7 h-7" />
            Behavioral Profile & Risk Meter
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {profiles.map((profile, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-zinc-900/80 border rounded-xl p-6 transition-all duration-300 depth-shadow"
                style={{ borderColor: `${profile.color}60` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge 
                    className="px-3 py-1.5 border"
                    style={{ 
                      backgroundColor: `${profile.color}20`,
                      color: profile.color,
                      borderColor: `${profile.color}60`,
                      fontWeight: 700
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

                {/* Risk percentage circle */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#2a2a2a"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke={profile.color}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - profile.percentage / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl" style={{ fontWeight: 900, color: profile.color }}>
                        {profile.percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {profile.description}
                </p>
                <div className="border-t border-zinc-800 pt-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>
                    Recommendation
                  </div>
                  <p className="text-sm text-gray-300">{profile.recommendation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Learning Path Flowchart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-2xl text-[#FFD700] mb-6 flex items-center gap-3" style={{ fontWeight: 800 }}>
            <Zap className="w-7 h-7" />
            AI-Driven Learning Path Flowchart
          </h3>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-[#FFD700]/30 rounded-xl p-8 depth-shadow">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {learningPath.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={index} className="flex items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`flex flex-col items-center p-6 rounded-xl border-2 min-w-[180px] ${
                        step.status === 'complete' 
                          ? 'bg-green-500/10 border-green-500' 
                          : step.status === 'active'
                          ? 'bg-[#FFD700]/10 border-[#FFD700] glow-gold'
                          : 'bg-zinc-800/50 border-zinc-700'
                      }`}
                    >
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-3 ${
                          step.status === 'complete' 
                            ? 'bg-green-500/20 border-green-500' 
                            : step.status === 'active'
                            ? 'bg-[#FFD700]/20 border-[#FFD700]'
                            : 'bg-zinc-800 border-zinc-700'
                        }`}
                      >
                        {step.status === 'complete' ? (
                          <span className="text-green-500 text-xl">✓</span>
                        ) : (
                          <StepIcon 
                            className="w-6 h-6" 
                            style={{ 
                              color: step.status === 'active' ? '#FFD700' : '#666'
                            }}
                          />
                        )}
                      </div>
                      <div 
                        className={`mb-2 text-center text-sm ${
                          step.status === 'complete' ? 'text-green-500' 
                          : step.status === 'active' ? 'text-[#FFD700]' 
                          : 'text-gray-600'
                        }`}
                        style={{ fontWeight: 700 }}
                      >
                        {step.stage}
                      </div>
                      <div className="text-xs text-gray-500 text-center">{step.description}</div>
                    </motion.div>
                    {index < learningPath.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-[#FFD700] mx-2 hidden lg:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Conceptual Visualizers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl text-[#FFD700] mb-6 flex items-center gap-3" style={{ fontWeight: 800 }}>
            <Eye className="w-7 h-7" />
            Interactive Visualizers
          </h3>
          
          {/* Compound Interest Visualizer */}
          <div className="mb-6 bg-zinc-900/80 border border-[#FFD700]/30 rounded-xl p-6 depth-shadow">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-[#FFD700]" />
              <h4 className="text-lg text-[#FFD700]" style={{ fontWeight: 700 }}>
                Compound Interest Growth Calculator
              </h4>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={compoundInterestData}>
                <defs>
                  <linearGradient id="compoundGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="year" stroke="#666" label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#666' }} />
                <YAxis stroke="#666" label={{ value: 'Value ($)', angle: -90, position: 'insideLeft', fill: '#666' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #FFD700' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#FFD700" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#compoundGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-400 mt-4 text-center">
              Monthly investment of $100 at 8% annual return
            </p>
          </div>

          {/* Other visualizers grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visualizers.slice(1).map((viz, index) => {
              const IconComponent = viz.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-zinc-900/80 border border-zinc-700 rounded-xl p-6 transition-all duration-300 depth-shadow"
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
