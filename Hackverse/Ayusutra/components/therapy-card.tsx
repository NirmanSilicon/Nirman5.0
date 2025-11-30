import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, MapPin, Info, Heart, Sparkles, IndianRupee, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Therapy } from "@/app/therpy/therpy";

interface TherapyCardProps {
  therapy: Therapy;
  onSelect?: (therapy: Therapy) => void;
  onViewDetails?: (therapy: Therapy) => void;
  showDosha?: boolean;
}

export function TherapyCard({ therapy, onSelect, onViewDetails, showDosha = true }: TherapyCardProps) {
  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case "Vata": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pitta": return "bg-red-100 text-red-800 border-red-200";
      case "Kapha": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          {therapy.image ? (
            <Image
              src={therapy.image}
              alt={therapy.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              loading="lazy"
              quality={75}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Therapy Photo</p>
              </div>
            </div>
          )}
          
          {/* Dosha Badge */}
          {showDosha && (
            <Badge 
              variant="secondary" 
              className={`absolute top-3 right-3 ${getDoshaColor(therapy.dosha)}`}
            >
              {therapy.dosha}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Title and Price */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-primary text-balance">{therapy.name}</h3>
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-primary" />
            <span className="text-lg font-medium text-primary">{therapy.price}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{therapy.description}</p>

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-foreground">
          <Clock className="h-4 w-4 text-accent" />
          <span>{therapy.duration}</span>
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Key Benefits</h4>
          <div className="space-y-1">
            {therapy.benefits.slice(0, 2).map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-accent flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
            {therapy.benefits.length > 2 && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-accent flex-shrink-0" />
                <span className="text-muted-foreground">+{therapy.benefits.length - 2} more</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={() => onSelect?.(therapy)}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Find Clinics
          </Button>
          <Button 
            onClick={() => onViewDetails?.(therapy)}
            variant="outline" 
            className="flex-1 border-primary text-primary hover:bg-primary/5 bg-transparent"
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
