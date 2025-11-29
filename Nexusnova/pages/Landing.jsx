import { motion } from "framer-motion";
import { Button, Card } from "@nextui-org/react";
import { ShieldCheck, BrainCircuit, Globe } from "lucide-react";
import { useState } from "react";
import Dashboard from "./Dashboard";


export default function Landing() {
    const [enter, setEnter] = useState(false);
  if (enter) return <Dashboard />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#070B16] to-[#0F172A] text-white p-6 overflow-hidden relative">

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,255,255,0.12),transparent)] animate-pulse pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
        <h1 className="text-3xl font-bold tracking-widest text-cyan-400">AuditEase</h1>
        <Button color="primary" variant="ghost">Launch App</Button>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mt-24 max-w-3xl mx-auto relative z-10"
      >
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Futuristic <span className="text-cyan-400">Audit Platform</span>
        </h2>
        <p className="mt-6 text-gray-400">
          AI-powered verification. Blockchain validation. Built for the future of digital trust.
        </p>
        <Button onClick={() => setEnter(true)}className="mt-8 bg-cyan-500 text-black font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all">
             Enter Dashboard
        </Button>


      </motion.div>

      {/* Features */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
        <Feature icon={<ShieldCheck size={32} />} title="Immutable Proof" text="Stored permanently on blockchain" />
        <Feature icon={<BrainCircuit size={32} />} title="AI Analysis" text="Detect anomalies & risks instantly" />
        <Feature icon={<Globe size={32} />} title="Global Verification" text="Verify audits from anywhere" />
      </div>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <Card isHoverable className="bg-black/40 backdrop-blur-lg border border-cyan-500/20 text-white p-6 transition hover:scale-[1.02]">
      <div className="text-cyan-400 mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{text}</p>
    </Card>
  );
}
