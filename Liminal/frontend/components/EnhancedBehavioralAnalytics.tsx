import { motion } from 'motion/react';
import { Clock, Zap, Target, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function EnhancedBehavioralAnalytics() {
  // Reaction Time Data
  const reactionTimeData = [
    { scenario: 'Bull Run', time: 2.5 },
    { scenario: 'Market Crash', time: 1.2 },
    { scenario: 'Stable', time: 5.8 },
    { scenario: 'FOMO Alert', time: 0.9 },
    { scenario: 'News Event', time: 1.5 },
  ];

  // Trading Frequency Data
  const tradingFrequencyData = [
    { week: 'W1', trades: 15 },
    { week: 'W2', trades: 22 },
    { week: 'W3', trades: 8 },
    { week: 'W4', trades: 18 },
    { week: 'W5', trades: 25 },
  ];

  // Decision Heatmap Data (simplified)
  const heatmapData = [
    { category: 'Stocks', value: 85 },
    { category: 'Crypto', value: 65 },
    { category: 'Bonds', value: 35 },
    { category: 'Real Estate', value: 50 },
  ];

  const getHeatColor = (value: number) => {
    if (value > 70) return '#ef4444';
    if (value > 40) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 mt-8">
      {/* Reaction Time Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6"
      >
        <h4 className="text-xl mb-4 flex items-center gap-2 text-cyan-400">
          <Clock className="w-5 h-5" />
          Reaction Time Analysis
        </h4>
        <div className="w-full h-64 min-h-[16rem]">
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={reactionTimeData}>
              <XAxis 
                dataKey="scenario" 
                stroke="#6b7280" 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151', 
                  borderRadius: '8px' 
                }}
                formatter={(value: number) => [`${value}s`, 'Response Time']}
              />
              <Bar dataKey="time" radius={[8, 8, 0, 0]}>
                {reactionTimeData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.time < 2 ? '#ef4444' : entry.time < 4 ? '#f59e0b' : '#10b981'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-400 text-center">
          Lower reaction times in high-pressure situations indicate FOMO susceptibility
        </div>
      </motion.div>

      {/* Trading Frequency Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6"
      >
        <h4 className="text-xl mb-4 flex items-center gap-2 text-purple-400">
          <Zap className="w-5 h-5" />
          Trading Frequency Pattern
        </h4>
        <div className="w-full h-64 min-h-[16rem]">
          <ResponsiveContainer width="100%" height={256}>
            <LineChart data={tradingFrequencyData}>
              <XAxis dataKey="week" stroke="#6b7280" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151', 
                  borderRadius: '8px' 
                }}
                formatter={(value: number) => [`${value} trades`, 'Frequency']}
              />
              <Line 
                type="monotone" 
                dataKey="trades" 
                stroke="#a855f7" 
                strokeWidth={3}
                dot={{ fill: '#a855f7', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-400 text-center">
          High-frequency trading weeks suggest emotional decision-making
        </div>
      </motion.div>

      {/* Decision Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6"
      >
        <h4 className="text-xl mb-4 flex items-center gap-2 text-orange-400">
          <Activity className="w-5 h-5" />
          Decision Heat Intensity
        </h4>
        <div className="space-y-4">
          {heatmapData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">{item.category}</span>
                <span className="text-white">{item.value}%</span>
              </div>
              <div className="relative h-8 bg-gray-800 rounded-lg overflow-hidden">
                <motion.div
                  className="h-full flex items-center justify-end pr-2 text-white text-sm"
                  style={{ backgroundColor: getHeatColor(item.value) }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                >
                  {item.value > 70 ? '🔥' : item.value > 40 ? '⚡' : '✅'}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-400">Safe</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-gray-400">Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-400">High Risk</span>
          </div>
        </div>
      </motion.div>

      {/* Debt Prioritization Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6"
      >
        <h4 className="text-xl mb-4 flex items-center gap-2 text-green-400">
          <Target className="w-5 h-5" />
          Debt Prioritization Strategy
        </h4>
        <div className="space-y-3">
          {[
            { debt: 'Credit Card (22% APR)', priority: 95, amount: '$5,200' },
            { debt: 'Personal Loan (12% APR)', priority: 70, amount: '$8,500' },
            { debt: 'Student Loan (4.5% APR)', priority: 45, amount: '$25,000' },
            { debt: 'Mortgage (3.2% APR)', priority: 30, amount: '$180,000' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="text-white mb-1">{item.debt}</div>
                  <div className="text-sm text-gray-400">{item.amount}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${
                  item.priority > 80 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  item.priority > 50 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  P{index + 1}
                </div>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    item.priority > 80 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                    item.priority > 50 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                    'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.priority}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
