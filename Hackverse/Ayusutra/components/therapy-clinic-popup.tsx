"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Clock, Star, Phone, ExternalLink, X } from "lucide-react";
import { Therapy } from "@/app/therpy/therpy";
import { ClinicWithDistance, getCurrentLocation, sortClinicsByDistance } from "@/lib/location-utils";
import clinics from "@/app/near/clinic";
import { Skeleton } from "@/components/ui/skeleton";

interface TherapyClinicPopupProps {
  therapy: Therapy | null;
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment?: (clinicName: string, therapyName: string) => void;
}

export function TherapyClinicPopup({ therapy, isOpen, onClose, onBookAppointment }: TherapyClinicPopupProps) {
  const [nearbyClinics, setNearbyClinics] = useState<ClinicWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && therapy) {
      loadNearbyClinics();
    }
  }, [isOpen, therapy]);

  const loadNearbyClinics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userLocation = await getCurrentLocation();
      const sorted = sortClinicsByDistance(clinics, userLocation).map((clinic, index) => ({
        ...clinic,
        id: index
      }));
      setNearbyClinics(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get location");
      // Fallback: show all clinics without distance
      setNearbyClinics(clinics.map((clinic, index) => ({ ...clinic, distance: "N/A", travelTime: "N/A", id: index })));
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (clinicName: string, clinicId: number) => {
    // Redirect to clinic details page for booking
    window.open(`/clinic/${clinicId}`, '_blank');
  };

  if (!therapy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {therapy.name} - Nearby Clinics
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Therapy Info */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {therapy.dosha}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{therapy.duration}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{therapy.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-green-600">{therapy.price}</span>
                    <span className="text-muted-foreground">
                      {therapy.benefits.length} key benefits
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}. Showing all available clinics.
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-16 h-16 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Clinics List */}
          {!loading && nearbyClinics.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {nearbyClinics.length} Clinics Offering {therapy.name}
              </h3>
              
              {nearbyClinics.map((clinic, index) => (
                <Card key={`${clinic.name}-${index}`} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Clinic Photo Placeholder */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{clinic.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{clinic.rating}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                ({clinic.reviews} reviews)
                              </span>
                            </div>
                          </div>
                          
                          {clinic.distance && clinic.distance !== "N/A" && (
                            <div className="text-right">
                              <Badge variant="secondary" className="mb-1">
                                {clinic.distance}km
                              </Badge>
                              {clinic.travelTime && clinic.travelTime !== "N/A" && (
                                <p className="text-xs text-muted-foreground">
                                  ~{clinic.travelTime} by road
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {clinic.address}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-green-600">{therapy.price}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{therapy.duration}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleBookAppointment(clinic.name, clinic.id!)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Book {therapy.name}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            Call
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => window.open(`/clinic/${clinic.id}`, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                            View All Treatments
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Clinics Found */}
          {!loading && nearbyClinics.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Clinics Found</h3>
              <p className="text-muted-foreground">
                We couldn't find any clinics offering {therapy.name} in your area.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
