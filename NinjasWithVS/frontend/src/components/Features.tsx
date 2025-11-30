import { Search, FileText, TrendingUp, Network, AlertCircle, Mic, Brain } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Search,
      title: 'Natural Language Legal Search',
      description: 'Ask questions like a human, get answers like an expert. No complex syntax or Boolean queries. Returns precise case law, statutes, and precedents instantly.',
      gradient: 'from-amber-500/20 to-amber-500/5',
      border: 'border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      icon: FileText,
      title: 'AI-Powered Judgment Summarization',
      description: 'Converts 200-page judgments into concise 2-page summaries. Highlights key facts, legal issues, holdings, and ratio decidendi. Saves hours of reading for judges and lawyers.',
      gradient: 'from-cyan-500/20 to-cyan-500/5',
      border: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Case Outcome Analytics',
      description: 'Uses patterns from NJDG\'s vast corpus of orders and judgments. Provides likely case outcomes, potential settlement ranges, and judge-specific tendencies.',
      gradient: 'from-pink-500/20 to-pink-500/5',
      border: 'border-pink-500/30',
      iconColor: 'text-pink-400',
    },
    {
      icon: Brain,
      title: 'Semantic Search with Legal Embeddings',
      description: 'Uses domain-specific legal embeddings like LegalBERT. Understands legal terminology and concepts beyond plain keywords. Surfaces relevant precedents that traditional keyword search would miss.',
      gradient: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
    {
      icon: Network,
      title: 'Citation Knowledge Graph',
      description: 'Interactive visual network mapping judgments, precedents, and statutory citations. Shows how cases are interconnected and which precedents are most influential. Makes complex legal doctrine intuitive and discoverable.',
      gradient: 'from-green-500/20 to-green-500/5',
      border: 'border-green-500/30',
      iconColor: 'text-green-400',
    },
    {
      icon: AlertCircle,
      title: 'Bias & Delay Detection Engine',
      description: 'Uses sentiment analysis and statistical patterns over NJDG data. Flags potential judicial inconsistencies and procedural delays. Helps identify systemic bottlenecks across courts.',
      gradient: 'from-orange-500/20 to-orange-500/5',
      border: 'border-orange-500/30',
      iconColor: 'text-orange-400',
    },
    {
      icon: Mic,
      title: 'Multilingual Voice-Enabled Access',
      description: 'Supports Indian languages like Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, etc. Allows voice queries, making legal research accessible to non-English speakers and rural users.',
      gradient: 'from-blue-500/20 to-blue-500/5',
      border: 'border-blue-500/30',
      iconColor: 'text-blue-400',
    },
  ];

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Features & Innovations
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Cutting-edge AI capabilities designed for the Indian legal ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border ${feature.border} rounded-xl p-6 hover:shadow-lg hover:shadow-current/10 transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} border ${feature.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
