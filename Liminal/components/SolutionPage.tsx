import { motion } from "motion/react";
import { Gamepad2, Target, Shield, Brain, Sparkles, CheckCircle } from "lucide-react";

export function SolutionPage() {
  const features = [
    {
      icon: Gamepad2,
      title: "Gamified Web App",
      description: "Learn through interactive challenges, unlock achievements, and track your progress as you master financial concepts.",
      benefits: ["Level-based progression", "XP & rewards system", "Competitive leaderboards"]
    },
    {
      icon: Target,
      title: "Realistic Simulations",
      description: "Experience real-world financial scenarios with market volatility, economic events, and life situations that mirror reality.",
      benefits: ["Live market data", "Economic scenarios", "Life event triggers"]
    },
    {
      icon: Brain,
      title: "Behavioral Learning",
      description: "Understand your financial personality, identify biases, and receive personalized feedback to improve decision-making.",
      benefits: ["Bias detection AI", "Personalized insights", "Behavioral scoring"]
    },
    {
      icon: Shield,
      title: "Zero Real Money Risk",
      description: "Make mistakes, experiment with strategies, and learn from failures without any financial consequences.",
      benefits: ["Safe environment", "Unlimited retries", "Risk-free experimentation"]
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>
      
      {/* Radial gradient accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD700] rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF00FF] rounded-full blur-[150px] opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-full">
            <Sparkles className="w-6 h-6 text-green-500" />
            <span className="text-green-500 uppercase tracking-wider">The Solution</span>
          </div>
          <h2 className="text-5xl md:text-6xl mb-6 text-gradient-gold" style={{ fontWeight: 800 }}>
            Finance Forge
          </h2>
          <p className="text-3xl mb-4 text-gradient-neon italic">
            Conceptualizing Wealth Through Experience
          </p>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A revolutionary platform that combines gamification, behavioral science, and realistic simulations 
            to transform how people learn about money.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative group cursor-pointer"
              >
                {/* Card glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 to-[#FF00FF]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                {/* Card */}
                <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 border border-[#FFD700]/30 rounded-2xl p-8 h-full hover:border-[#FFD700]/60 transition-all duration-300 depth-shadow">
                  {/* Icon */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700]/20 to-[#FF00FF]/20 border border-[#FFD700]/50 rounded-xl flex items-center justify-center glow-gold">
                      <IconComponent className="w-8 h-8 text-[#FFD700]" />
                    </div>
                    <h3 className="text-2xl text-[#FFD700]" style={{ fontWeight: 700 }}>
                      {feature.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-400">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#FFD700]/10 to-transparent rounded-tl-full"></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Value proposition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 via-[#FF00FF]/5 to-[#00FFFF]/5 rounded-2xl blur-2xl"></div>
          <div className="relative bg-zinc-900/50 border-2 border-gradient rounded-2xl p-10 text-center">
            <h3 className="text-3xl mb-4 text-[#FFD700]" style={{ fontWeight: 700 }}>
              Learn by Doing, Not by Reading
            </h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Fin-Forge transforms passive learning into active mastery. Through hands-on practice in a risk-free environment, 
              you'll develop the financial competence needed to make smart decisions with real money.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {[
                { value: "100%", label: "Safe to Practice" },
                { value: "Real-time", label: "Market Simulation" },
                { value: "AI-Powered", label: "Personal Coaching" }
              ].map((stat, index) => (
                <div key={index} className="border-l-2 border-[#FFD700]/50 pl-4 text-left">
                  <div className="text-3xl text-[#FFD700] mb-1" style={{ fontWeight: 800 }}>{stat.value}</div>
                  <div className="text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
