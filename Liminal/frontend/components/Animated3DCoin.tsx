import { motion } from 'motion/react';

interface Animated3DCoinProps {
  delay?: number;
}

export default function Animated3DCoin({ delay = 0 }: Animated3DCoinProps) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0, rotateY: 0 }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.6, 0.8, 0.6],
        rotateY: [0, 360],
      }}
      transition={{
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
        opacity: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        },
        rotateY: {
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          delay,
        },
      }}
      className="w-20 h-20"
      style={{ perspective: '1000px' }}
    >
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {/* Coin Face */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 shadow-[0_0_30px_rgba(255,215,0,0.6)] flex items-center justify-center border-4 border-yellow-600">
          <span className="text-3xl">💰</span>
        </div>
        {/* Coin Glow */}
        <div className="absolute inset-0 rounded-full bg-yellow-500/30 blur-xl" />
      </div>
    </motion.div>
  );
}
