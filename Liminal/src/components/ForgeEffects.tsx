import { motion } from "motion/react";

export function SparkParticles() {
  const sparks = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 1.5 + Math.random() * 1
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
          style={{
            left: `${spark.left}%`,
            bottom: 0,
            boxShadow: "0 0 4px #FFD700, 0 0 8px #FFA500"
          }}
          animate={{
            y: [-100, 0],
            opacity: [1, 0],
            scale: [1, 0.5]
          }}
          transition={{
            duration: spark.duration,
            repeat: Infinity,
            delay: spark.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}

export function ForgeGlow({ color = "#FFD700" }: { color?: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${color}40 0%, transparent 70%)`
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

export function MoltenBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-lg molten-metal opacity-50 blur-sm"></div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
