import { Building2, CreditCard, TrendingUp } from 'lucide-react';

export default function BusinessModel() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Flexible Deployment
            </span>
            <br />
            <span className="text-white">for Courts & Law Firms</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Scalable solutions designed for organizations of all sizes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="relative bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-sm border border-amber-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300">
            <Building2 className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">SaaS Licensing</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Per-seat or institution-based licensing for courts and law firms. Flexible subscription models tailored to your needs.
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
            <CreditCard className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Enterprise Deployments</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Custom deployments for High Courts and Supreme Court-level institutions with dedicated infrastructure and support.
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-pink-500/10 to-pink-500/5 backdrop-blur-sm border border-pink-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
            <TrendingUp className="w-8 h-8 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">APIs & Custom Analytics</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Integration APIs and custom analytics solutions for policy and research bodies requiring specialized insights.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button className="px-8 py-4 rounded-lg border-2 border-amber-500/30 hover:border-amber-500/60 text-amber-400 font-semibold transition-all duration-300 hover:bg-amber-500/5 hover:shadow-lg hover:shadow-amber-500/20">
            Contact us for pilot programs and custom deployments
          </button>
        </div>
      </div>
    </section>
  );
}
