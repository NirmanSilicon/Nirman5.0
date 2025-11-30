import { motion } from 'motion/react';
import { Network, Coins, ArrowRight } from 'lucide-react';

export default function DigitalForgeMicroVisuals() {
  const blockchainFlow = [
    { step: 'Wallet', icon: '💳' },
    { step: 'Transaction', icon: '📤' },
    { step: 'Validation', icon: '✅' },
    { step: 'Block', icon: '🔗' },
    { step: 'Confirmed', icon: '✨' },
  ];

  const tokenomics = {
    totalSupply: 1000000,
    circulating: 650000,
    utility: 75,
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Blockchain Transaction Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6"
      >
        <h4 className="text-xl mb-6 flex items-center gap-2 text-orange-400">
          <Network className="w-5 h-5" />
          Blockchain Transaction Flow
        </h4>
        <div className="flex items-center justify-between gap-2">
          {blockchainFlow.map((item, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.1 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl p-4 shadow-lg">
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <div className="text-xs text-white text-center">{item.step}</div>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl blur-xl opacity-0 group-hover:opacity-50 -z-10"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                />
              </motion.div>
              {index < blockchainFlow.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.1 }}
                  className="flex-1 mx-2"
                >
                  <ArrowRight className="w-6 h-6 text-orange-500" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tokenomics Supply-Utility Gauge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl p-6"
      >
        <h4 className="text-xl mb-6 flex items-center gap-2 text-yellow-400">
          <Coins className="w-5 h-5" />
          Tokenomics Analysis
        </h4>
        
        {/* Supply Visualization */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Token Supply</span>
            <span className="text-white">{tokenomics.circulating.toLocaleString()} / {tokenomics.totalSupply.toLocaleString()}</span>
          </div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${(tokenomics.circulating / tokenomics.totalSupply) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Utility Gauge */}
        <div className="relative">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-400 mb-2">Utility Score</div>
            <div className="relative inline-block">
              <svg width="200" height="120" viewBox="0 0 200 120">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                {/* Background Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Colored Arc */}
                <motion.path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: tokenomics.utility / 100 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                {/* Needle */}
                <motion.line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="30"
                  stroke="#fff"
                  strokeWidth="2"
                  initial={{ rotate: -90 }}
                  whileInView={{ rotate: (tokenomics.utility / 100) * 180 - 90 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ transformOrigin: '100px 100px' }}
                />
                <circle cx="100" cy="100" r="5" fill="#fff" />
              </svg>
              <div className="absolute inset-0 flex items-end justify-center pb-4">
                <span className="text-3xl bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  {tokenomics.utility}%
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low Utility</span>
            <span>Optimal</span>
            <span>High Utility</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
