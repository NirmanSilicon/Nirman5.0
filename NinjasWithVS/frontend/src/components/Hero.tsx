import { Sparkles, Database } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-pink-500/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(236,72,153,0.05),transparent_50%)]"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 gap-12">
          <div className="space-y-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-pink-500/10 border border-amber-500/20 backdrop-blur-sm mx-auto">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">AI-Powered Legal Intelligence</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight max-w-4xl mx-auto">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                NyayAI
              </span>
              <span className="text-white"> — The AI Co-Pilot for </span>
              <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                Indian Courts
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              NyayAI turns NJDG and Commercial Courts data into instant legal intelligence — natural language search, AI judgment summaries, predictive analytics, and citation graphs for judges and lawyers.
            </p>


            <div className="flex flex-wrap gap-4 pt-4 justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-amber-500/20">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-gray-300">Built for Indian Commercial Courts</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-pink-500/20">
                <Database className="w-4 h-4 text-pink-400" />
                <span className="text-sm text-gray-300">Derives insights from NJDG data</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-pink-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                </div>

                <div className="bg-white/5 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">Natural Language Query</span>
                  </div>
                  <p className="text-sm text-gray-300 italic">
                    "What are recent precedents on delayed commercial payments under the Commercial Courts Act?"
                  </p>
                </div>

                <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-cyan-400">AI Judgment Summary</span>
                    <span className="text-xs text-cyan-400/70">2 min read</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 bg-cyan-400/30 rounded w-full"></div>
                    <div className="h-2 bg-cyan-400/20 rounded w-5/6"></div>
                    <div className="h-2 bg-cyan-400/10 rounded w-4/6"></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/30 rounded-lg p-4">
                  <span className="text-sm font-semibold text-pink-400 mb-2 block">Outcome Prediction</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/5 rounded-full h-2">
                      <div className="bg-gradient-to-r from-pink-400 to-amber-400 h-2 rounded-full w-3/4"></div>
                    </div>
                    <span className="text-xs text-gray-300">75% favorable</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-lg p-4">
                  <span className="text-sm font-semibold text-amber-400 mb-3 block">Citation Graph</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="h-12 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-400/5 border border-amber-400/30 flex items-center justify-center"
                      >
                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
    </section>
  );
}
