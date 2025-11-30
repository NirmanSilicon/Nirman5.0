import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Treatment } from "@/data/treatments";

interface DiseaseResultProps {
  disease: string;
  confidence: number;
  treatment: Treatment;
}

export function DiseaseResult({ disease, confidence, treatment }: DiseaseResultProps) {
  const getStatusIcon = () => {
    if (treatment.severity === "healthy") {
      return <CheckCircle2 className="w-8 h-8 text-success" />;
    } else if (treatment.severity === "mild") {
      return <Info className="w-8 h-8 text-warning" />;
    } else {
      return <AlertCircle className="w-8 h-8 text-destructive" />;
    }
  };

  const getSeverityColor = () => {
    if (treatment.severity === "healthy") return "bg-success/10 text-success border-success/20";
    if (treatment.severity === "mild") return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <Card className="p-6 shadow-medium animate-in fade-in-50 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          {getStatusIcon()}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {treatment.disease}
            </h3>
            <div className="flex items-center gap-3">
              <Badge className={getSeverityColor()}>
                {treatment.severity.toUpperCase()}
              </Badge>
              <span className="text-lg font-semibold text-foreground">
                Confidence: {confidence.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Treatment */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Treatment Instructions
          </h4>
          <p className="text-base text-foreground leading-relaxed pl-4">
            {treatment.treatment}
          </p>
        </div>

        {/* Prevention */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            Prevention Tips
          </h4>
          <p className="text-base text-foreground leading-relaxed pl-4">
            {treatment.prevention}
          </p>
        </div>
      </div>
    </Card>
  );
}
