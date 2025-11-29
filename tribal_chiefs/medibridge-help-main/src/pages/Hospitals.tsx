import { useState } from "react";
import {
  MapPin,
  Phone,
  Search,
  Building2,
  Navigation as NavigationIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { geocodeLocation, fetchNearby } from "../utils/locationHelpers";

export type HospitalItem = {
  id: number | string;
  name: string;
  address?: string;
  phone?: string;
  lat?: number;
  lng?: number;
  distance?: string;
};

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function Hospitals() {
  const [searchLocation, setSearchLocation] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [results, setResults] = useState<HospitalItem[]>([]);
  const [loading, setLoading] = useState(false);

  const manualSearch = async () => {
    if (!searchLocation.trim()) return alert("Please enter a location");
    setLoading(true);
    const coords = await geocodeLocation(searchLocation);
    if (!coords) {
      setLoading(false);
      return alert("Location not found.");
    }
    setUserCoords(coords);

    const hospitals = await fetchNearby(coords.lat, coords.lng, "hospital");
    const withDistance = hospitals.map((h) => {
      const dist =
        h.lat && h.lng
          ? haversineDistance(coords.lat, coords.lng, h.lat, h.lng)
          : null;
      return {
        ...h,
        distance: dist
          ? dist < 1
            ? `${(dist * 1000).toFixed(0)} m`
            : `${dist.toFixed(1)} km`
          : "—",
        distanceValue: dist ?? 9999,
      };
    });
    withDistance.sort((a, b) => a.distanceValue! - b.distanceValue!);
    setResults(withDistance);
    setLoading(false);
  };

  const detectNearbyHospitals = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        const hospitals = await fetchNearby(latitude, longitude, "hospital");
        const withDistance = hospitals.map((h) => {
          const dist =
            h.lat && h.lng
              ? haversineDistance(latitude, longitude, h.lat, h.lng)
              : null;
          return {
            ...h,
            distance: dist
              ? dist < 1
                ? `${(dist * 1000).toFixed(0)} m`
                : `${dist.toFixed(1)} km`
              : "—",
            distanceValue: dist ?? 9999,
          };
        });
        withDistance.sort((a, b) => a.distanceValue! - b.distanceValue!);
        setResults(withDistance);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        alert("Unable to get your location. Please allow location access.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000 }
    );
  };

  const handleGetDirections = (hospital: HospitalItem) => {
    const url = hospital.lat && hospital.lng
      ? `https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`
      : "#";
    window.open(url, "_blank");
  };

  const handleCallHospital = (phone?: string) => {
    if (!phone) return alert("Phone number not available");
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Building2 className="h-4 w-4 mr-2" /> Hospital Directory
          </div>
          <h1 className="text-4xl font-bold mb-2">Find Hospitals Near You</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Locate nearby hospitals with emergency services & specialties.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter location or pincode"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && manualSearch()}
            />
          </div>
          <div className="flex gap-3 mt-3 justify-center">
            <Button onClick={manualSearch}>Search</Button>
            <Button variant="outline" onClick={detectNearbyHospitals}>
              📍 Use My Location
            </Button>
          </div>
        </div>

        {/* Hospital List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading && (
            <div className="text-center text-muted-foreground col-span-full">
              Searching nearby hospitals…
            </div>
          )}

          {!loading &&
            results.map((hospital) => (
              <Card
                key={hospital.id}
                className="p-4 hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 rounded-xl"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <CardTitle className="text-lg font-semibold">{hospital.name}</CardTitle>
                    {hospital.distance && (
                      <Badge className="bg-primary/10 text-primary text-xs">{hospital.distance}</Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {hospital.address || "Address not available"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-2 pt-2">
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 flex items-center justify-center gap-2"
                      onClick={() => handleGetDirections(hospital)}
                    >
                      <NavigationIcon className="h-4 w-4" /> Directions
                    </Button>
                    <Button
                      className="flex-1 flex items-center justify-center gap-2"
                      variant="outline"
                      onClick={() => handleCallHospital(hospital.phone)}
                    >
                      <Phone className="h-4 w-4" /> Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

          {!loading && results.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              No hospitals found for this location.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
