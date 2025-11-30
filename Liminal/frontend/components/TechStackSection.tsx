import { motion } from 'motion/react';
import { Code2, Database, BarChart3, Brain, Server } from 'lucide-react';
import { useEffect, useState } from 'react';

const techStack = [
  {
    category: 'Frontend',
    icon: Code2,
    color: 'from-cyan-500 to-blue-500',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    category: 'Backend',
    icon: Server,
    color: 'from-green-500 to-emerald-500',
    technologies: ['Flask', 'Django', 'Node.js', 'REST API'],
  },
  {
    category: 'Data Visualization',
    icon: BarChart3,
    color: 'from-purple-500 to-pink-500',
    technologies: ['D3.js', 'Chart.js', 'Recharts', 'Three.js'],
  },
  {
    category: 'Machine Learning',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    technologies: ['Scikit-Learn', 'TensorFlow', 'PyTorch', 'NLP'],
  },
  {
    category: 'Database',
    icon: Database,
    color: 'from-yellow-500 to-amber-500',
    technologies: ['PostgreSQL', 'MongoDB', 'Redis', 'Firebase'],
  },
];

export default function TechStackSection() {
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

    const element = document.querySelector('[data-section="5"]');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      data-section="5"
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
          <h2 className="text-6xl md:text-7xl mb-6">
            <span className="bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Tech Stack
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Built with cutting-edge technologies to deliver a seamless, intelligent learning experience
          </p>
        </motion.div>

        {/* Tech Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {techStack.map((stack, index) => (
            <motion.div
              key={index}
              initial={{ y: 100, opacity: 0, rotateY: -20 }}
              animate={isVisible ? { y: 0, opacity: 1, rotateY: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="relative group"
              style={{ perspective: '1000px' }}
            >
              <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6 overflow-hidden shadow-2xl">
                {/* Animated Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stack.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${stack.color} shadow-lg`}>
                    <stack.icon className="w-8 h-8 text-white" />
                  </div>
                  <motion.div
                    className={`absolute top-0 left-0 w-16 h-16 bg-gradient-to-br ${stack.color} blur-xl opacity-50`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                  />
                </div>

                {/* Category */}
                <h3 className={`text-2xl mb-4 bg-gradient-to-r ${stack.color} bg-clip-text text-transparent`}>
                  {stack.category}
                </h3>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {stack.technologies.map((tech, techIndex) => (
                    <motion.div
                      key={techIndex}
                      initial={{ scale: 0 }}
                      animate={isVisible ? { scale: 1 } : {}}
                      transition={{ delay: index * 0.1 + techIndex * 0.05, type: 'spring' }}
                      className="relative"
                    >
                      <div className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300 border border-gray-700 hover:border-gray-600 transition-colors">
                        {tech}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Decorative Corner */}
                <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl ${stack.color} opacity-5 blur-2xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Tech Info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              99.9%
            </div>
            <p className="text-gray-400">Uptime</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {'<100ms'}
            </div>
            <p className="text-gray-400">Response Time</p>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI-Powered
            </div>
            <p className="text-gray-400">Personalization</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
