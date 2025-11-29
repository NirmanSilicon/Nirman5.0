import { motion } from "motion/react";
import { AlertTriangle, TrendingDown, Users, BookOpen, Brain, Zap } from "lucide-react";

export function ProblemPage() {
  const problems = [
    {
      icon: BookOpen,
      title: "Lack of Financial Education",
      description: "Traditional education systems rarely teach practical financial skills, leaving individuals unprepared for real-world money decisions.",
      color: "#FFD700"
    },
    {
      icon: Brain,
      title: "Emotional Decision Traps",
      description: "FOMO, speculation, and peer pressure drive irrational financial choices, leading to costly mistakes and poor outcomes.",
      color: "#FF00FF"
    },
    {
      icon: TrendingDown,
      title: "Passive Traditional Learning",
      description: "Reading books and watching videos don't translate to actual competence. Learning by doing is the only way to build real skills.",
      color: "#00FFFF"
    },
    {
      icon: AlertTriangle,
      title: "High-Stakes First Experiences",
      description: "Most people learn finance by making real mistakes with real money, resulting in significant financial losses.",
      color: "#FF6B35"
    },
    {
      icon: Users,
      title: "No Behavioral Feedback",
      description: "Without understanding your financial personality and biases, you're bound to repeat the same mistakes over and over.",
      color: "#7B68EE"
    },
    {
      icon: Zap,
      title: "Complexity Overwhelm",
      description: "Financial markets, credit systems, and investment strategies are complex. Without guided practice, it's easy to feel lost.",
      color: "#39FF14"
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>
      
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#FFD700 1px, transparent 1px), linear-gradient(90deg, #FFD700 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <span className="text-red-500 uppercase tracking-wider">The Problem</span>
          </div>
          <h2 className="text-5xl md:text-6xl mb-6 text-gradient-gold" style={{ fontWeight: 800 }}>
            Why Financial Education Fails
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The current approach to financial literacy is broken. Here's what's holding people back from making smart money decisions.
          </p>
        </motion.div>

        {/* Problem cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, index) => {
            const IconComponent = problem.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
                role="button"
                tabIndex={0}
              >
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundColor: problem.color }}
                />
                
                {/* Card */}
                <div className="relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 h-full hover:border-opacity-50 transition-all duration-300 depth-shadow"
                  style={{ borderColor: `${problem.color}40` }}
                >
                  {/* Icon */}
                  <div className="mb-4">
                    <div 
                      className="w-14 h-14 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${problem.color}20`,
                        border: `2px solid ${problem.color}40`
                      }}
                    >
                      <IconComponent 
                        className="w-7 h-7" 
                        style={{ color: problem.color }}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl mb-3" style={{ fontWeight: 700, color: problem.color }}>
                    {problem.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed">
                    {problem.description}
                  </p>

                  {/* Corner accent */}
                  <div 
                    className="absolute top-0 right-0 w-20 h-20 opacity-20 rounded-bl-full"
                    style={{ backgroundColor: problem.color }}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-[#FFD700]/10 via-[#FF00FF]/10 to-[#00FFFF]/10 border border-[#FFD700]/30 rounded-xl p-8">
            <p className="text-2xl text-gray-300 mb-2">
              It's time for a <span className="text-[#FFD700]" style={{ fontWeight: 700 }}>better approach</span>
            </p>
            <p className="text-gray-500">
              One that combines practice, feedback, and behavioral insights.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
