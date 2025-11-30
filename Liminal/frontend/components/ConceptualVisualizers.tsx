import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Wallet, Newspaper } from 'lucide-react';
import { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function ConceptualVisualizers() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(3);

  const compoundData = Array.from({ length: years + 1 }, (_, i) => ({
    year: i,
    value: principal * Math.pow(1 + rate / 100, i),
  }));

  const inflationData = Array.from({ length: 10 }, (_, i) => ({
    year: i,
    value: 1000 * Math.pow(1 - inflationRate / 100, i),
  }));

  const mockAssets = [
    { name: 'Tech Stocks', value: 15420, change: 12.5, color: 'from-blue-500 to-cyan-500' },
    { name: 'Real Estate', value: 8900, change: 3.2, color: 'from-green-500 to-emerald-500' },
    { name: 'Crypto', value: 4200, change: -5.8, color: 'from-orange-500 to-yellow-500' },
    { name: 'Bonds', value: 6750, change: 1.8, color: 'from-purple-500 to-pink-500' },
  ];

  const newsItems = [
    { title: 'Fed Announces Rate Decision', sentiment: 'neutral', time: '2h ago' },
    { title: 'Tech Stocks Rally on Earnings', sentiment: 'positive', time: '4h ago' },
    { title: 'Market Volatility Increases', sentiment: 'negative', time: '6h ago' },
  ];

  return (
    <section 
      data-section="6"
      className="relative min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-b from-black via-gray-950 to-black"
    >
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl mb-6">
            <span className="bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Interactive Visualizers
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Powerful tools to understand complex financial concepts through interactive simulations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Compound Interest Calculator */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8"
          >
            <h3 className="text-2xl mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              Compound Interest Calculator
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Principal: ${principal.toLocaleString()}</label>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-500 [&::-webkit-slider-thumb]:to-emerald-500 [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Interest Rate: {rate}%</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-500 [&::-webkit-slider-thumb]:to-emerald-500 [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Years: {years}</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-500 [&::-webkit-slider-thumb]:to-emerald-500 [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Final Value</div>
                <div className="text-4xl bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  ${compoundData[compoundData.length - 1].value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            <div className="w-full h-48 min-h-[12rem]">
              <ResponsiveContainer width="100%" height={192}>
                <AreaChart data={compoundData}>
                  <defs>
                    <linearGradient id="compoundGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value: number) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#compoundGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Inflation Loss Calculator */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8"
          >
            <h3 className="text-2xl mb-6 flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-red-500" />
              Inflation Impact Calculator
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Inflation Rate: {inflationRate}%</label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-red-500 [&::-webkit-slider-thumb]:to-orange-500 [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Purchasing Power After 10 Years</div>
                <div className="text-4xl bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  ${inflationData[inflationData.length - 1].value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Loss: ${(1000 - inflationData[inflationData.length - 1].value).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            <div className="w-full h-48 min-h-[12rem]">
              <ResponsiveContainer width="100%" height={192}>
                <AreaChart data={inflationData}>
                  <defs>
                    <linearGradient id="inflationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value: number) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                  />
                  <Area type="monotone" dataKey="value" stroke="#ef4444" fill="url(#inflationGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Mock Asset Tracker */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8"
          >
            <h3 className="text-2xl mb-6 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-cyan-500" />
              Portfolio Asset Tracker
            </h3>
            
            <div className="space-y-4">
              {mockAssets.map((asset, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white mb-1">{asset.name}</h4>
                      <div className="text-2xl mb-2">${asset.value.toLocaleString()}</div>
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${asset.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                    <div className={`ml-4 px-3 py-1 rounded-full text-sm ${
                      asset.change > 0 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {asset.change > 0 ? '+' : ''}{asset.change}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 bg-gray-800/30 rounded-xl p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Total Portfolio Value</div>
              <div className="text-3xl bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                ${mockAssets.reduce((sum, asset) => sum + asset.value, 0).toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* News Integration */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8"
          >
            <h3 className="text-2xl mb-6 flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-yellow-500" />
              Market News Feed
            </h3>
            
            <div className="space-y-4">
              {newsItems.map((news, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white mb-2">{news.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          news.sentiment === 'positive' 
                            ? 'bg-green-500/20 text-green-400' 
                            : news.sentiment === 'negative'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {news.sentiment}
                        </span>
                        <span className="text-xs text-gray-500">{news.time}</span>
                      </div>
                    </div>
                    <div className="text-2xl">
                      {news.sentiment === 'positive' ? '📈' : news.sentiment === 'negative' ? '📉' : '📊'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl hover:shadow-lg transition-all"
            >
              Load More News
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
