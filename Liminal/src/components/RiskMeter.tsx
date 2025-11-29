import { motion } from "motion/react";
import { AlertTriangle, TrendingUp, Shield } from "lucide-react";

interface RiskMeterProps {
  riskLevel: number; // 0-100
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function RiskMeter({ riskLevel, label = "Risk Level", size = "md" }: RiskMeterProps) {
  const getRiskColor = () => {
    if (riskLevel < 30) return "text-[var(--success)]";
    if (riskLevel < 70) return "text-[var(--gold)]";
    return "text-[var(--risk)]";
  };

  const getRiskIcon = () => {
    if (riskLevel < 30) return <Shield className={iconSize} />;
    if (riskLevel < 70) return <TrendingUp className={iconSize} />;
    return <AlertTriangle className={iconSize} />;
  };

  const iconSize = size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6";
  const meterHeight = size === "sm" ? "h-1.5" : size === "md" ? "h-2" : "h-3";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">{label}</span>
        <div className={`flex items-center gap-1.5 ${getRiskColor()}`}>
          {getRiskIcon()}
          <span>{riskLevel}%</span>
        </div>
      </div>
      <div className={`${meterHeight} bg-muted rounded-full overflow-hidden relative`}>
        <motion.div
          className={`h-full rounded-full ${
            riskLevel < 30
              ? "bg-[var(--success)]"
              : riskLevel < 70
              ? "bg-[var(--gold)]"
              : "bg-[var(--risk)]"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${riskLevel}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
