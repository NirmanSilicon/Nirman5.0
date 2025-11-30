import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Phone, ExternalLink, IndianRupee, Car } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ClinicCardProps {
  clinic: {
    name: string;
    rating: number;
    reviews: number;
    address: string;
    distance?: number;
    travelTime?: string;
    photo?: string;
    therapyPricing?: string;
    id?: number;
  };
  onBookNow?: () => void;
  onViewDetails?: () => void;
}

export function ClinicCard({ 
  clinic, 
  onBookNow, 
  onViewDetails
}: ClinicCardProps) {
  const router = useRouter();

  // Calculate travel time based on distance (assuming average speed of 30 km/h in city)
  const calculateTravelTime = (distance: number): string => {
    if (!distance || isNaN(distance) || distance <= 0) {
      return "N/A";
    }
    const timeInMinutes = Math.round((distance / 30) * 60);
    if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  // Format distance for display
  const formatDistance = (distance: number): string => {
    if (!distance || isNaN(distance) || distance <= 0) {
      return "N/A";
    }
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const handleViewDetails = () => {
    if (clinic.id !== undefined) {
      router.push(`/clinic/${clinic.id}`);
    } else {
      onViewDetails?.();
    }
  };

  const handleBookNow = () => {
    if (clinic.id !== undefined) {
      router.push(`/clinic/${clinic.id}`);
    } else {
      onBookNow?.();
    }
  };


  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md overflow-hidden">
      <CardHeader className="p-0">
        {/* Clinic Photo */}
        <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
          {clinic.photo ? (
            <Image
              src={clinic.photo}
              alt={clinic.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No image available</p>
              </div>
            </div>
          )}
          
          {/* Distance Badge */}
          {clinic.distance && !isNaN(clinic.distance) && clinic.distance > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute top-3 right-3 bg-white/90 text-foreground"
            >
              {formatDistance(clinic.distance)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Clinic Name and Rating */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight">{clinic.name}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{clinic.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({clinic.reviews} reviews)
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {clinic.address}
          </p>
        </div>

        {/* Travel Time */}
        {clinic.distance && !isNaN(clinic.distance) && clinic.distance > 0 && (
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              ~{calculateTravelTime(clinic.distance)} by car
            </span>
          </div>
        )}

        {/* Therapy Pricing */}
        {clinic.therapyPricing && (
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              Therapies from {clinic.therapyPricing}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleBookNow}
            className="flex-1 bg-primary hover:bg-primary/90"
            size="sm"
          >
            Book Now
          </Button>
          <Button 
            onClick={handleViewDetails}
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
