import { motion } from 'motion/react';
import { ShoppingCart, Home, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function BudgetingForgeMicroVisuals() {
  const [compoundYears, setCompoundYears] = useState(10);
  const [timeline, setTimeline] = useState(5);

  const calculateCompound = (years: number) => {
    const principal = 10000;
    const rate = 0.08;
    return principal * Math.pow(1 + rate, years);
  };

  const necessities = [
    { name: 'Rent', amount: 1200, type: 'necessity', icon: Home },
    { name: 'Groceries', amount: 400, type: 'necessity', icon: ShoppingCart },
    { name: 'Entertainment', amount: 300, type: 'desire', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 mt-8">
      {/* Necessity vs Desire Visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6"
      >
        <h4 className="text-xl mb-4 flex items-center gap-2 text-blue-400">
          <ShoppingCart className="w-5 h-5" />
          Necessity vs Desire Analysis
        </h4>
        <div className="space-y-3">
          {necessities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white">${item.amount}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.type === 'necessity' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {item.type}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    item.type === 'necessity' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-orange-500 to-yellow-500'
                  }`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(item.amount / 1200) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Compounding Interest Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6"
      >
        <h4 className="text-xl mb-4 flex items-center gap-2 text-cyan-400">
          <TrendingUp className="w-5 h-5" />
          Compound Interest Growth
        </h4>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Years: {compoundYears}</span>
            <span className="text-2xl text-cyan-400">${calculateCompound(compoundYears).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={compoundYears}
            onChange={(e) => setCompoundYears(Number(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-500 [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
        <div className="relative h-48 bg-gray-800/50 rounded-xl p-4 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/30 to-blue-500/10 rounded-t-xl"
            initial={{ height: '10%' }}
            animate={{ height: `${Math.min((compoundYears / 30) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
          <div className="relative z-10 flex flex-col justify-between h-full text-xs text-gray-500">
            <div className="text-right">${calculateCompound(30).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
            <div className="text-right">${calculateCompound(15).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
            <div className="text-right">$10,000</div>
          </div>
        </div>
      </motion.div>

      {/* Multi-Year Timeline Slider */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6"
      >
        <h4 className="text-xl mb-4 flex items-center gap-2 text-blue-400">
          <Calendar className="w-5 h-5" />
          Life Planning Timeline
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Timeline Span</span>
            <span className="text-2xl text-blue-400">{timeline} Years</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={timeline}
            onChange={(e) => setTimeline(Number(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex gap-2 mt-4">
            {Array.from({ length: Math.min(timeline, 10) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg opacity-80"
                style={{ height: `${30 + (i * 10)}px` }}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mt-2">
            <div>Year 1</div>
            <div className="text-center">Year {Math.floor(timeline / 2)}</div>
            <div className="text-right">Year {timeline}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
