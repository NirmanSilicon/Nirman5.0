"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ClinicCard } from "@/components/clinic-card";
import { MapPin, Navigation, RefreshCw, AlertCircle } from "lucide-react";
import { getCurrentLocation, sortClinicsByDistance, Location, ClinicWithDistance } from "@/lib/location-utils";
import clinics from "@/app/near/clinic";

export default function TreatmentPage() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [sortedClinics, setSortedClinics] = useState<ClinicWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "pending">("pending");

  // Check location permission on component mount
  useEffect(() => {
    checkLocationPermission();
  }, []);


  // Check location permission status
  const checkLocationPermission = async () => {
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        
        if (permission.state === 'denied') {
          setLocationPermission("denied");
        } else if (permission.state === 'granted') {
          // If permission is granted, try to get location
          requestLocationAccess();
        }
      } catch (error) {
        // Permission check failed, continue with normal flow
      }
    }
  };


  const requestLocationAccess = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if geolocation is available
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      // Clear any cached location data
      setUserLocation(null);
      setSortedClinics([]);
      
      // Force a fresh location request with no cache
      const location = await getCurrentLocation();
      setUserLocation(location);
      setLocationPermission("granted");
      
      
      // Convert clinic data to match expected format and sort by distance
      const clinicsWithCoords = clinics.map((clinic: any) => ({
        ...clinic,
        latitude: clinic.lat,
        longitude: clinic.lng
      }));
      
      const sorted = sortClinicsByDistance(clinicsWithCoords, location).map((clinic: any, index: number) => {
        return {
          ...clinic,
          therapyPricing: "₹500", // Default therapy pricing
          id: clinic.id || index, // Use existing ID or index
          distance: clinic.distance || 0, // Use actual calculated distance
          reviews: clinic.reviews || 0, // Ensure reviews property exists
          photo: clinic.photo // Ensure photo property exists
        };
      });
      setSortedClinics(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get location");
      setLocationPermission("denied");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (clinicName: string) => {
    // TODO: Implement booking functionality
    console.log(`Booking appointment at ${clinicName}`);
    alert(`Booking appointment at ${clinicName}. This feature will be implemented soon!`);
  };

  const handleViewDetails = (clinicName: string) => {
    // TODO: Implement clinic details modal/page
    console.log(`Viewing details for ${clinicName}`);
    alert(`Viewing details for ${clinicName}. This feature will be implemented soon!`);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)]">
            Find Nearby Ayurvedic Treatment
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover authentic Ayurvedic clinics near you with traditional Panchakarma treatments and holistic healing.
          </p>
          {locationPermission === "denied" && (
            <div className="flex justify-center">
              <Button 
                onClick={requestLocationAccess}
                variant="outline"
                disabled={loading}
                className="mt-4"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {loading ? "Getting Location..." : "Enable Location Access"}
              </Button>
            </div>
          )}
        </div>

        {/* Location Access Section */}
        {locationPermission === "pending" && (
          <div className="max-w-md mx-auto mb-8">
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Find Nearby Clinics</h2>
                  <p className="text-muted-foreground text-sm">
                    Allow location access to find the nearest Ayurvedic clinics.
                  </p>
                </div>
                <Button 
                  onClick={requestLocationAccess}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Allow Location Access
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto mb-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={requestLocationAccess}
                  disabled={loading}
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Clinics List */}
        {locationPermission === "granted" && sortedClinics.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                {sortedClinics.length} Ayurvedic Clinics Found
              </h2>
              <p className="text-muted-foreground">
                Sorted by distance from your location
                {sortedClinics.length > 0 && (
                  <span className="block mt-1 text-sm">
                    Nearest: {sortedClinics[0].distance?.toFixed(1)}km • 
                    Farthest: {sortedClinics[sortedClinics.length - 1].distance?.toFixed(1)}km
                  </span>
                )}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedClinics.map((clinic, index) => (
                <ClinicCard
                  key={`${clinic.name}-${index}`}
                  clinic={{
                    ...clinic,
                    reviews: clinic.reviews || 0,
                    photo: clinic.photo
                  }}
                  onBookNow={() => handleBookNow(clinic.name)}
                  onViewDetails={() => handleViewDetails(clinic.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="border-0 shadow-md">
                <div className="h-72 bg-muted animate-pulse rounded-t-lg" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Clinics Found */}
        {locationPermission === "granted" && sortedClinics.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Clinics Found</h3>
            <p className="text-muted-foreground">
              We couldn't find any Ayurvedic clinics in your area. Try expanding your search radius.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
