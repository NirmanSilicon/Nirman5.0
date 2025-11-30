import { Database, Brain, Laptop, RefreshCw } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Database,
      title: 'Ingest & Structure Judicial Data',
      description: 'NyayAI connects to NJDG and Commercial Court data. Cleans, structures, and indexes orders and judgments.',
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      number: '02',
      icon: Brain,
      title: 'AI & NLP Processing',
      description: 'Uses Machine Learning, LegalBERT embeddings, GPT-based summarization, and entity extraction. Builds searchable vector indexes and knowledge graphs.',
      gradient: 'from-cyan-500 to-cyan-600',
    },
    {
      number: '03',
      icon: Laptop,
      title: 'Insightful Interface',
      description: 'Judges and lawyers interact via natural language search, dashboards, summaries, analytics, and graphs.',
      gradient: 'from-pink-500 to-pink-600',
    },
    {
      number: '04',
      icon: RefreshCw,
      title: 'Continuous Learning Loop',
      description: 'User interactions and feedback help refine model performance over time.',
      gradient: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">How </span>
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              NyayAI Works
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From raw judicial data to actionable legal intelligence
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0 -translate-y-1/2 hidden lg:block"></div>

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-2">
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    <div className={`text-5xl font-bold bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent opacity-20 text-center mb-2`}>
                      {step.number}
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-3 text-center">
                      {step.title}
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed text-center">
                      {step.description}
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
