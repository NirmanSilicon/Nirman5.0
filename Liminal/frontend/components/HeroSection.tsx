import { motion } from 'motion/react';
import { Flame, ArrowDown } from 'lucide-react';
import Animated3DCoin from './Animated3DCoin';

export default function HeroSection() {
  const scrollToNext = () => {
    const nextSection = document.querySelector('[data-section="1"]');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      data-section="0"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Glowing Orbs */}
      <motion.div 
        className="absolute top-20 left-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 3D Coins */}
      <div className="absolute top-1/4 left-1/4">
        <Animated3DCoin delay={0} />
      </div>
      <div className="absolute top-1/3 right-1/4">
        <Animated3DCoin delay={0.5} />
      </div>
      <div className="absolute bottom-1/4 left-1/3">
        <Animated3DCoin delay={1} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Flame Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <Flame className="w-24 h-24 text-yellow-500 drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]" />
            <motion.div
              className="absolute inset-0"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Flame className="w-24 h-24 text-orange-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-8xl md:text-9xl tracking-tight mb-6 relative"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <span className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(255,215,0,0.5)]">
            FIN-FORGE
          </span>
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 blur-2xl -z-10"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl md:text-3xl text-yellow-200/80 mb-8 italic"
        >
          Bridging the Financial Competence Gap
        </motion.p>

        {/* Problem Statement */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <p className="text-gray-300 text-lg leading-relaxed">
            Most people enter financial markets unprepared, falling victim to emotional traps, 
            FOMO, and speculation. Traditional passive learning fails to build real competence. 
            It's time to forge your financial future through gamified, risk-free simulation.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToNext}
          className="group relative px-12 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.5)] hover:shadow-[0_0_60px_rgba(255,215,0,0.7)] transition-all duration-300"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10 flex items-center gap-3">
            <Flame className="w-6 h-6" />
            Start Your Forge
          </span>
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            <ArrowDown className="w-8 h-8 text-yellow-500/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
