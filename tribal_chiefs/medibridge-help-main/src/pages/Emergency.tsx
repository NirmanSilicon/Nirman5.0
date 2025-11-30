import { useState, useEffect } from "react";
import { AlertTriangle, Phone, MapPin, Clock, Shield, Heart, Car, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import emergencyIcon from "@/assets/emergency-icon.png";

const Emergency = () => {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [userLocation, setUserLocation] = useState("Locating…");
  const [locationDenied, setLocationDenied] = useState(false);

  // Detect user location
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation("Location not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          if (data?.address?.city) setUserLocation(data.address.city);
          else if (data?.address?.town) setUserLocation(data.address.town);
          else if (data?.address?.state) setUserLocation(data.address.state);
          else setUserLocation("Unknown location");
        } catch {
          setUserLocation("Location lookup failed");
        }
        setLocationDenied(false);
      },
      () => {
        setUserLocation("Permission denied");
        setLocationDenied(true);
      }
    );
  };

  const emergencyContacts = [
    {
      service: "National Emergency",
      number: "112",
      description: `All Emergency Services - ${userLocation}`,
      color: "bg-emergency",
    },
    {
      service: "Police Emergency",
      number: "100",
      description: `Police Emergency - ${userLocation}`,
      color: "bg-destructive",
    },
    {
      service: "Fire Emergency",
      number: "101",
      description: `Fire Department - ${userLocation}`,
      color: "bg-primary",
    },
    {
      service: "Ambulance",
      number: "102",
      description: `Medical Ambulance Service - ${userLocation}`,
      color: "bg-accent",
    },
    {
      service: "Disaster Management",
      number: "108",
      description: `Emergency Response Team - ${userLocation}`,
      color: "bg-secondary",
    },
    {
      service: "Women Helpline",
      number: "1091",
      description: `Women Emergency Support - ${userLocation}`,
      color: "bg-muted",
    },
  ];

  const nearestERs = [
    {
      name: "Metropolitan General Hospital",
      address: "100 Medical Plaza, Central District",
      distance: "0.8 miles",
      waitTime: "< 15 minutes",
      phone: "(555) 100-2911",
      trauma: true,
    },
    {
      name: "Saint Mary's Medical Center",
      address: "250 Healthcare Avenue, North Side",
      distance: "1.5 miles",
      waitTime: "20-30 minutes",
      phone: "(555) 200-3911",
      trauma: false,
    },
    {
      name: "University Medical Center",
      address: "500 University Hospital Drive",
      distance: "3.2 miles",
      waitTime: "10-20 minutes",
      phone: "(555) 500-6911",
      trauma: true,
    },
  ];

  const emergencyTypes = [
    {
      title: "Medical Emergency",
      icon: Heart,
      examples: ["Chest pain", "Difficulty breathing", "Severe bleeding", "Loss of consciousness", "Stroke symptoms"],
      action: "Call 911 immediately",
    },
    {
      title: "Accident/Trauma",
      icon: Car,
      examples: ["Car accident", "Serious fall", "Burns", "Broken bones", "Head injury"],
      action: "Call 911 and don't move unless safe",
    },
    {
      title: "Mental Health Crisis",
      icon: Shield,
      examples: ["Suicidal thoughts", "Severe panic", "Psychotic episode", "Self-harm"],
      action: "Call 988 Crisis Lifeline or 911",
    },
    {
      title: "Environmental Emergency",
      icon: AlertTriangle,
      examples: ["Poisoning", "Overdose", "Allergic reaction", "Heat stroke", "Hypothermia"],
      action: "Call 911 or Poison Control",
    },
  ];

  const handleEmergencyCall = (number) => {
    setEmergencyActive(true);
    window.location.href = `tel:${number}`;
    setTimeout(() => setEmergencyActive(false), 5000);
  };

  const handleDirections = (address) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        
        {/* Emergency Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emergency/10 text-emergency mb-4 animate-pulse">
            <img src={emergencyIcon} alt="Emergency" className="h-6 w-6 mr-2" />
            Emergency SOS
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Emergency Medical Support
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Immediate access to emergency services, nearest hospitals, and critical medical support when you need it most.
          </p>

          {locationDenied && (
            <button
              onClick={getUserLocation}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Allow Location Access Again
            </button>
          )}
        </div>

        {/* Emergency Status Banner */}
        {emergencyActive && (
          <Card className="mb-8 border-emergency bg-emergency/5 shadow-emergency">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2 text-emergency">
                  <AlertTriangle className="h-8 w-8 mr-2 animate-pulse" />
                  <h2 className="text-2xl font-bold">Emergency Call Initiated</h2>
                </div>
                <p className="text-lg">Help is on the way. Stay calm and follow dispatcher instructions.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Services */}
        <Card className="mb-8 bg-gradient-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-center text-primary">
              MediBridge Emergency Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">24/7 Emergency Line</h4>
                <p className="text-sm text-muted-foreground">Direct connection to local emergency services</p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <h4 className="font-semibold">Hospital Locator</h4>
                <p className="text-sm text-muted-foreground">Find nearest hospitals with real-time directions</p>
              </div>

              <div className="space-y-2">
                <div className="w-12 h-12 bg-emergency/10 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-emergency" />
                </div>
                <h4 className="font-semibold">Medical Guidance</h4>
                <p className="text-sm text-muted-foreground">AI-powered emergency response assistance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {emergencyContacts.map((contact, index) => (
            <Card key={index} className="hover:shadow-emergency transition-all duration-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={`w-12 h-12 ${contact.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Phone className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="font-bold text-lg mb-2">{contact.service}</h3>
                  <p className="text-2xl font-bold text-emergency mb-2">{contact.number}</p>
                  <p className="text-sm text-muted-foreground mb-4">{contact.description}</p>

                  <Button
                    onClick={() => handleEmergencyCall(contact.number)}
                    className={`w-full ${contact.color} hover:opacity-90 text-white`}
                    size="lg"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nearest Emergency Rooms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Building2 className="h-6 w-6 mr-2 text-emergency" />
              Nearest Emergency Rooms
            </CardTitle>
            <CardDescription>
              Closest hospitals with emergency departments and current wait times
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {nearestERs.map((er, index) => (
                <Card key={index} className="border-2 hover:border-primary/30 transition-colors">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold">{er.name}</h4>

                        {er.trauma && (
                          <Badge variant="destructive" className="text-xs">
                            Trauma Center
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {er.address} • {er.distance}
                        </div>

                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Wait Time: {er.waitTime}
                        </div>

                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {er.phone}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button onClick={() => handleDirections(er.address)} className="flex-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          Go
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() => handleEmergencyCall(er.phone)}
                          className="bg-emergency hover:bg-emergency/90"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <AlertTriangle className="h-6 w-6 mr-2 text-emergency" />
              Emergency Situations Guide
            </CardTitle>
            <CardDescription>
              Recognize emergency situations and know what action to take
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyTypes.map((type, index) => (
                <div key={index} className="space-y-4 border p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-emergency/10 rounded-lg flex items-center justify-center mr-3">
                      <type.icon className="h-5 w-5 text-emergency" />
                    </div>
                    <h3 className="font-semibold text-lg">{type.title}</h3>
                  </div>

                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {type.examples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>

                  <p className="text-sm font-medium text-emergency">
                    Action: {type.action}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Emergency;