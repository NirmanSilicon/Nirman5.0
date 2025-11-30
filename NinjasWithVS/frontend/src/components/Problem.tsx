import { Clock, FileSearch, Database, Languages } from 'lucide-react';

export default function Problem() {
  const challenges = [
    {
      icon: Clock,
      title: 'Time-intensive manual research',
      description: 'Hours spent manually searching through judgments and precedents',
    },
    {
      icon: FileSearch,
      title: 'Difficulty in retrieving relevant precedents',
      description: 'Complex Boolean queries and keyword limitations miss critical cases',
    },
    {
      icon: Database,
      title: 'Lack of real-time insights from historical data',
      description: 'Vast NJDG data remains underutilized for predictive intelligence',
    },
    {
      icon: Languages,
      title: 'Language barriers and procedural delays',
      description: 'Non-English speakers face accessibility challenges in legal research',
    },
  ];

  return (
    <section id="problem" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              The Problem:
            </span>
            <br />
            <span className="text-white">Justice Delayed is Justice Denied</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Commercial disputes in India often take years to resolve, slowing business growth and straining judicial efficiency. Judges, lawyers, and court staff spend significant time manually searching judgments, precedents, and legal provisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-pink-500/5 rounded-xl transition-all duration-300"></div>

              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <challenge.icon className="w-6 h-6 text-amber-400" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {challenge.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {challenge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
