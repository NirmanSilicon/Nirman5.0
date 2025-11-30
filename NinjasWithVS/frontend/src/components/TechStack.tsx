import { Code2 } from 'lucide-react';

export default function TechStack() {
  const technologies = [
    { category: 'Frontend', tech: 'React (web)' },
    { category: 'Backend', tech: 'Python (Django/FastAPI)' },
    { category: 'AI/NLP', tech: 'HuggingFace Transformers (LegalBERT, GPT-based summarization)' },
    { category: 'Databases', tech: 'Elasticsearch / Pinecone, PostgreSQL' },
    { category: 'Visualization', tech: 'D3.js / Neo4j (for knowledge graphs)' },
    { category: 'Deployment', tech: 'Cloud (AWS / GCP / Azure)' },
  ];

  return (
    <section id="tech" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-amber-500/20 backdrop-blur-sm mb-6">
            <Code2 className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">Battle-tested Technologies</span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Under the Hood: </span>
            <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Modern Legal AI Stack
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built with enterprise-grade technologies for reliability and scale
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            {technologies.map((item, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Code2 className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-cyan-400 mb-1">{item.category}</div>
                    <div className="text-white">{item.tech}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-lg">
              Powered by cutting-edge AI and proven enterprise infrastructure
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
