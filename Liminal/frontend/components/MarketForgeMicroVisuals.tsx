import { motion } from 'motion/react';
import { TrendingUp, Activity, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function MarketForgeMicroVisuals() {
  const sipData = [
    { month: 'M1', value: 1000 },
    { month: 'M3', value: 3200 },
    { month: 'M6', value: 6800 },
    { month: 'M12', value: 15000 },
    { month: 'M24', value: 35000 },
  ];

  const portfolioData = [
    { name: 'Stocks', value: 45, color: '#3b82f6' },
    { name: 'Bonds', value: 25, color: '#10b981' },
    { name: 'Real Estate', value: 20, color: '#f59e0b' },
    { name: 'Cash', value: 10, color: '#8b5cf6' },
  ];

  const fomoMeter = 72; // 0-100 scale

  return (
    <div className="space-y-6 mt-8">
      {/* SIP Growth Mini-Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6"
      >
        <h4 className="text-xl mb-4 flex items-center gap-2 text-purple-400">
          <TrendingUp className="w-5 h-5" />
          SIP Compounding Magic
        </h4>
        <div className="w-full h-48 mb-4 min-h-[12rem]">
          <ResponsiveContainer width="100%" height={192}>
            <LineChart data={sipData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="url(#sipGradient)" 
                strokeWidth={3}
                dot={{ fill: '#a855f7', r: 4 }}
              />
              <defs>
                <linearGradient id="sipGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-5 gap-2 text-xs">
          {sipData.map((point, i) => (
            <div key={i} className="text-center">
              <div className="text-gray-500">{point.month}</div>
              <div className="text-purple-400">${point.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sentiment/FOMO Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6"
      >
        <h4 className="text-xl mb-4 flex items-center gap-2 text-pink-400">
          <Activity className="w-5 h-5" />
          FOMO Sentiment Meter
        </h4>
        <div className="relative">
          <div className="h-8 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full relative"
              initial={{ width: 0 }}
              whileInView={{ width: `${fomoMeter}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white shadow-lg" />
            </motion.div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Calm 😌</span>
            <span>Neutral 😐</span>
            <span>FOMO 🚨</span>
          </div>
          <div className="mt-4 text-center">
            <span className={`text-2xl ${
              fomoMeter < 33 ? 'text-green-400' : 
              fomoMeter < 66 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {fomoMeter}% {fomoMeter > 66 ? 'High Risk!' : fomoMeter > 33 ? 'Caution' : 'Safe Zone'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Diversification Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6"
      >
        <h4 className="text-xl mb-4 flex items-center gap-2 text-cyan-400">
          <PieChartIcon className="w-5 h-5" />
          Portfolio Diversification
        </h4>
        <div className="w-full h-64 mb-4 min-h-[16rem]">
          <ResponsiveContainer width="100%" height={256}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {portfolioData.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-400">{item.name}</span>
              <span className="text-sm text-white ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
