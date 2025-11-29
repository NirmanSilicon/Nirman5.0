import { motion } from "motion/react";
import { Target, TrendingUp, Shield, Brain, Users, Sparkles, CheckCircle2, ArrowRight, Flame } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { GameButton } from "./GameButton";

export function ImpactPage() {
  const impacts = [
    {
      icon: Target,
      title: "Actionable Competence",
      description: "Transform theoretical knowledge into practical skills. Users learn to make real financial decisions through hands-on experience, not passive reading.",
      benefits: [
        "Muscle memory for financial decisions",
        "Confidence in real-world scenarios",
        "Practical experience without risk"
      ],
      color: "#FFD700"
    },
    {
      icon: Shield,
      title: "Bias-Correction Through Simulation",
      description: "Identify and overcome emotional biases like FOMO, loss aversion, and overconfidence through repeated exposure and feedback.",
      benefits: [
        "Recognition of personal biases",
        "Strategies to counteract emotions",
        "Improved decision-making under pressure"
      ],
      color: "#FF00FF"
    },
    {
      icon: TrendingUp,
      title: "Long-Term Financial Literacy",
      description: "Build sustainable financial habits that compound over time. Learn budgeting, investing, and wealth management systematically.",
      benefits: [
        "Generational wealth mindset",
        "Sustainable money habits",
        "Strategic financial planning"
      ],
      color: "#00FFFF"
    },
    {
      icon: Brain,
      title: "Psychological Awareness",
      description: "Understand the psychology behind money decisions. Develop meta-cognitive skills to analyze your own financial behavior patterns.",
      benefits: [
        "Self-awareness in money matters",
        "Understanding behavioral triggers",
        "Conscious financial decision-making"
      ],
      color: "#39FF14"
    }
  ];

  const outcomes = [
    { metric: "Better Financial Decisions", value: "3x", description: "Improvement in decision quality" },
    { metric: "Reduced Emotional Trading", value: "67%", description: "Decrease in impulsive moves" },
    { metric: "Increased Savings Rate", value: "+45%", description: "Average savings improvement" },
    { metric: "Debt Reduction Speed", value: "2.5x", description: "Faster debt payoff" }
  ];

  return (
    <div className="relative min-h-screen py-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>
      
      {/* Background image with overlay */}
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm93dGglMjBzdWNjZXNzJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY0MzU4MDAxfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Growth"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>
      </div>

      {/* Radial gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD700] rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#39FF14] rounded-full blur-[150px] opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-full">
            <Sparkles className="w-6 h-6 text-green-500" />
            <span className="text-green-500 uppercase tracking-wider">Expected Impact</span>
          </div>
          <h2 className="text-5xl md:text-6xl mb-4 text-gradient-gold" style={{ fontWeight: 800 }}>
            Transform Your Financial Future
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real behavioral change through gamified learning that creates lasting impact on financial well-being
          </p>
        </motion.div>

        {/* Impact cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {impacts.map((impact, index) => {
            const IconComponent = impact.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
                role="button"
                tabIndex={0}
              >
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: impact.color }}
                />
                
                {/* Card */}
                <div 
                  className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 rounded-2xl p-8 h-full hover:border-opacity-80 transition-all duration-300 depth-shadow"
                  style={{ borderColor: `${impact.color}40` }}
                >
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-6">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ 
                        backgroundColor: `${impact.color}20`,
                        border: `2px solid ${impact.color}60`
                      }}
                    >
                      <IconComponent 
                        className="w-8 h-8" 
                        style={{ color: impact.color }}
                      />
                    </div>
                    <div>
                      <h3 
                        className="text-2xl mb-2" 
                        style={{ fontWeight: 700, color: impact.color }}
                      >
                        {impact.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {impact.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {impact.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 
                          className="w-5 h-5 flex-shrink-0 mt-0.5" 
                          style={{ color: impact.color }}
                        />
                        <span className="text-gray-400">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Decorative element */}
                  <div 
                    className="absolute top-0 right-0 w-40 h-40 opacity-10 rounded-bl-full"
                    style={{ backgroundColor: impact.color }}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Outcome metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-3xl text-center mb-10 text-[#FFD700]" style={{ fontWeight: 700 }}>
            Proven Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {outcomes.map((outcome, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/20 to-[#FF00FF]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-zinc-900/80 border border-[#FFD700]/30 rounded-xl p-6 text-center hover:border-[#FFD700]/60 transition-all duration-300">
                  <div className="text-4xl md:text-5xl mb-3 text-[#FFD700]" style={{ fontWeight: 900 }}>
                    {outcome.value}
                  </div>
                  <div className="text-lg mb-2 text-gray-200" style={{ fontWeight: 600 }}>
                    {outcome.metric}
                  </div>
                  <div className="text-sm text-gray-500">
                    {outcome.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Vision statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 via-[#FF00FF]/10 to-[#00FFFF]/10 rounded-2xl blur-2xl"></div>
          <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-gradient rounded-2xl p-10 text-center">
            <Users className="w-16 h-16 text-[#FFD700] mx-auto mb-6" />
            <h3 className="text-3xl md:text-4xl mb-6 text-gradient-gold" style={{ fontWeight: 800 }}>
              Building a Financially Literate Generation
            </h3>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Fin-Forge isn't just about learning finance—it's about creating a future where everyone has the 
              competence and confidence to make smart money decisions. Through gamification, behavioral science, 
              and AI-driven personalization, we're democratizing financial education.
            </p>
            <GameButton 
              variant="primary"
              size="lg"
              icon={Flame}
              iconPosition="right"
              className="px-10 py-6 text-xl"
              onClick={() => {
                alert("🎯 Ready to start your financial journey!\n\nThis would take you to the onboarding flow.");
              }}
            >
              Start Your Journey
            </GameButton>
          </div>
        </motion.div>

        {/* Footer quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-2xl text-gray-400 italic max-w-3xl mx-auto">
            "Financial freedom starts with financial competence. 
            <span className="text-[#FFD700]"> Master the game before you play with real stakes.</span>"
          </p>
        </motion.div>
      </div>
    </div>
  );
}
