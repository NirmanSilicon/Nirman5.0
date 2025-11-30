'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Clock, Star, Search } from 'lucide-react';

interface Clinic {
  clinic_id: string;
  clinic_name: string;
  owner_name: string;
  phone_number: string;
  email?: string;
  address: string;
  nearby_city: string;
  distance?: string;
  photos: string[];
  doctors: any[];
  services: any[];
  created_at: string;
}

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState('');
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    loadClinics();
  }, []);

  useEffect(() => {
    if (searchCity.trim()) {
      const filtered = clinics.filter(clinic =>
        clinic.nearby_city.toLowerCase().includes(searchCity.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchCity.toLowerCase())
      );
      setFilteredClinics(filtered);
    } else {
      setFilteredClinics(clinics);
    }
  }, [searchCity, clinics]);

  const loadClinics = async () => {
    try {
      const response = await fetch('/api/clinic/approved');
      const result = await response.json();
      
      if (result.success) {
        setClinics(result.clinics);
        setFilteredClinics(result.clinics);
      }
    } catch (error) {
      console.error('Error loading clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchClinics = async () => {
    if (!searchCity.trim()) {
      setFilteredClinics(clinics);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/clinic/approved?city=${encodeURIComponent(searchCity)}`);
      const result = await response.json();
      
      if (result.success) {
        setFilteredClinics(result.clinics);
      }
    } catch (error) {
      console.error('Error searching clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && clinics.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Partner Clinics
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover our network of approved Ayurvedic clinics
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by city or location..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={searchClinics} disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredClinics.length} clinic{filteredClinics.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Clinics Grid */}
        {filteredClinics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No clinics found. Try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClinics.map((clinic) => (
              <Card key={clinic.clinic_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Clinic Photo */}
                {clinic.photos && clinic.photos.length > 0 ? (
                  <div className="h-48 relative">
                    <img
                      src={clinic.photos[0]}
                      alt={clinic.clinic_name}
                      className="w-full h-full object-cover"
                    />
                    {clinic.photos.length > 1 && (
                      <Badge className="absolute top-2 right-2 bg-black/50 text-white">
                        +{clinic.photos.length - 1} more
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No photos available</span>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-xl">{clinic.clinic_name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{clinic.nearby_city}</span>
                    {clinic.distance && (
                      <span>• {clinic.distance} km</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{clinic.phone_number}</span>
                    </div>
                    {clinic.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{clinic.email}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">{clinic.address}</span>
                    </div>
                  </div>

                  {/* Doctors Count */}
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-muted-foreground" />
                    <span>{clinic.doctors?.length || 0} doctor{(clinic.doctors?.length || 0) !== 1 ? 's' : ''}</span>
                  </div>

                  {/* Services Count */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{clinic.services?.length || 0} service{(clinic.services?.length || 0) !== 1 ? 's' : ''}</span>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full mt-4">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
