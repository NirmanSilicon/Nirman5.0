import { motion } from "motion/react";
import { Code2, Database, BarChart3, Brain, Server, Layers } from "lucide-react";

export function TechStackPage() {
  const techCategories = [
    {
      category: "Frontend",
      icon: Code2,
      color: "#FFD700",
      technologies: [
        { name: "React", description: "Component-based UI framework", logo: "⚛️" },
        { name: "Next.js", description: "Production-ready React framework", logo: "▲" },
        { name: "TypeScript", description: "Type-safe JavaScript", logo: "TS" },
        { name: "Tailwind CSS", description: "Utility-first styling", logo: "🎨" }
      ]
    },
    {
      category: "Backend",
      icon: Server,
      color: "#FF00FF",
      technologies: [
        { name: "Flask", description: "Python web microframework", logo: "🧪" },
        { name: "Django", description: "High-level Python framework", logo: "🎸" },
        { name: "Node.js", description: "JavaScript runtime", logo: "🟢" },
        { name: "REST APIs", description: "RESTful architecture", logo: "🔗" }
      ]
    },
    {
      category: "Data Visualization",
      icon: BarChart3,
      color: "#00FFFF",
      technologies: [
        { name: "D3.js", description: "Data-driven documents", logo: "📊" },
        { name: "Chart.js", description: "Simple yet flexible charts", logo: "📈" },
        { name: "Recharts", description: "React charting library", logo: "📉" },
        { name: "Plotly", description: "Interactive visualizations", logo: "🎯" }
      ]
    },
    {
      category: "Machine Learning",
      icon: Brain,
      color: "#39FF14",
      technologies: [
        { name: "Scikit-Learn", description: "ML algorithms & tools", logo: "🤖" },
        { name: "TensorFlow", description: "Deep learning framework", logo: "🧠" },
        { name: "PyTorch", description: "Neural network library", logo: "🔥" },
        { name: "Pandas", description: "Data analysis library", logo: "🐼" }
      ]
    },
    {
      category: "Database",
      icon: Database,
      color: "#FFA500",
      technologies: [
        { name: "PostgreSQL", description: "Relational database", logo: "🐘" },
        { name: "MongoDB", description: "NoSQL document database", logo: "🍃" },
        { name: "Redis", description: "In-memory data store", logo: "⚡" },
        { name: "Supabase", description: "Backend as a service", logo: "⚡" }
      ]
    },
    {
      category: "Infrastructure",
      icon: Layers,
      color: "#7B68EE",
      technologies: [
        { name: "Docker", description: "Containerization platform", logo: "🐳" },
        { name: "AWS", description: "Cloud computing services", logo: "☁️" },
        { name: "Vercel", description: "Frontend deployment", logo: "▲" },
        { name: "GitHub Actions", description: "CI/CD automation", logo: "🔄" }
      ]
    }
  ];

  return (
    <div className="relative min-h-screen py-20 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black"></div>
      
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#FFD700 1px, transparent 1px), linear-gradient(90deg, #FFD700 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-[#FFD700] rounded-full blur-[150px] opacity-20"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF00FF] rounded-full blur-[150px] opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <Code2 className="w-6 h-6 text-blue-500" />
            <span className="text-blue-500 uppercase tracking-wider">Technology Stack</span>
          </div>
          <h2 className="text-5xl md:text-6xl mb-4 text-gradient-gold" style={{ fontWeight: 800 }}>
            Built with Modern Tech
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Powered by cutting-edge technologies for seamless performance, scalability, and intelligent insights
          </p>
        </motion.div>

        {/* Tech grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Card glow */}
                <div 
                  className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ backgroundColor: category.color }}
                ></div>
                
                {/* Card */}
                <div 
                  className="relative bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 rounded-2xl p-6 h-full hover:border-opacity-80 transition-all duration-300"
                  style={{ borderColor: `${category.color}40` }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-zinc-700">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${category.color}20`,
                        border: `2px solid ${category.color}60`
                      }}
                    >
                      <IconComponent 
                        className="w-6 h-6" 
                        style={{ color: category.color }}
                      />
                    </div>
                    <h3 
                      className="text-xl" 
                      style={{ fontWeight: 700, color: category.color }}
                    >
                      {category.category}
                    </h3>
                  </div>

                  {/* Technologies */}
                  <div className="space-y-4">
                    {category.technologies.map((tech, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 + i * 0.05 }}
                        whileHover={{ x: 5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-all duration-200 border border-transparent hover:border-zinc-700 cursor-pointer group"
                        role="button"
                        tabIndex={0}
                      >
                        <div className="text-2xl">{tech.logo}</div>
                        <div className="flex-1">
                          <div className="text-gray-200 mb-1" style={{ fontWeight: 600 }}>
                            {tech.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {tech.description}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-2xl text-[#FFD700] mb-8 text-center" style={{ fontWeight: 700 }}>
            System Architecture
          </h3>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-2 border-[#FFD700]/30 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {[
                { label: "User Interface", desc: "React + Next.js", color: "#FFD700" },
                { label: "API Layer", desc: "REST + WebSocket", color: "#FF00FF" },
                { label: "ML Engine", desc: "Behavioral Analytics", color: "#00FFFF" },
                { label: "Data Store", desc: "PostgreSQL + Redis", color: "#39FF14" }
              ].map((layer, index) => (
                <div key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-zinc-800 border-2 rounded-xl p-6 text-center"
                    style={{ borderColor: `${layer.color}60` }}
                  >
                    <div 
                      className="text-lg mb-2" 
                      style={{ fontWeight: 700, color: layer.color }}
                    >
                      {layer.label}
                    </div>
                    <div className="text-sm text-gray-400">{layer.desc}</div>
                  </motion.div>
                  {index < 3 && (
                    <div className="hidden md:flex justify-center my-4">
                      <div className="text-[#FFD700] text-2xl">→</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: "API Response Time", value: "<100ms" },
            { label: "Uptime", value: "99.9%" },
            { label: "Scalability", value: "1M+ users" }
          ].map((stat, index) => (
            <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 text-center">
              <div className="text-3xl text-[#FFD700] mb-2" style={{ fontWeight: 800 }}>{stat.value}</div>
              <div className="text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
