import { Users } from 'lucide-react';

export default function Team() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-pink-500/10 border border-amber-500/20 backdrop-blur-sm mb-6">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">About the Team</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Team </span>
              <span className="bg-gradient-to-r from-amber-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                NinjasWithVS
              </span>
            </h2>
          </div>

          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-pink-500/5 rounded-2xl"></div>

            <div className="relative">
              <div className="flex items-center justify-center mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 via-cyan-500 to-pink-500 flex items-center justify-center shadow-xl">
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>

              <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed text-center mb-6">
                We are a team of engineers and legal-tech enthusiasts building AI tools to make justice{' '}
                <span className="text-amber-400 font-semibold">faster</span>,{' '}
                <span className="text-cyan-400 font-semibold">fairer</span>, and{' '}
                <span className="text-pink-400 font-semibold">more accessible</span> in India.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/30 text-sm text-gray-300">
                  AI & Machine Learning
                </div>
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30 text-sm text-gray-300">
                  Legal Technology
                </div>
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-pink-500/10 border border-pink-500/30 text-sm text-gray-300">
                  Judicial Innovation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
