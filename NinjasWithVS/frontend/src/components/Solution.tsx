import { ArrowRight, X } from 'lucide-react';

export default function Solution() {
  return (
    <section id="solution" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              The Solution:
            </span>
            <br />
            <span className="text-white">AI-Driven Legal Research for India</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            NyayAI is an AI-driven legal research engine that leverages structured judicial data from NJDG and Commercial Courts, with Machine Learning and Natural Language Processing, to automate and enhance legal research and decision-making.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <X className="w-5 h-5 text-red-400" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6">Before NyayAI</h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2"></div>
                <span className="text-gray-300">Hours of manual legal research through countless PDFs</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2"></div>
                <span className="text-gray-300">Complex Boolean queries with limited results</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2"></div>
                <span className="text-gray-300">Months lost in research and case preparation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2"></div>
                <span className="text-gray-300">No data-driven insights or predictive analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2"></div>
                <span className="text-gray-300">Limited accessibility for non-English speakers</span>
              </li>
            </ul>
          </div>

          <div className="relative bg-gradient-to-br from-cyan-500/10 to-pink-500/5 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8">
            <div className="absolute top-4 right-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6">After NyayAI</h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></div>
                <span className="text-gray-300">Instant natural language search across all judicial data</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></div>
                <span className="text-gray-300">AI-generated summaries reduce 200 pages to 2 pages</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></div>
                <span className="text-gray-300">Seconds to find relevant precedents and citations</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></div>
                <span className="text-gray-300">Predictive analytics for case outcomes and strategies</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></div>
                <span className="text-gray-300">Multilingual voice-enabled access for all users</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
