"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TherapyCard } from "@/components/therapy-card";
import { TherapyClinicPopup } from "@/components/therapy-clinic-popup";
import { Therapy, getAllTherapies, getTherapiesByDosha, Dosha } from "@/app/therpy/therpy";
import { Search, Filter, Grid, List } from "lucide-react";

export default function TherapyPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDosha, setSelectedDosha] = useState<Dosha | "All">("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTherapy, setSelectedTherapy] = useState<Therapy | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const allTherapies = getAllTherapies();
  
  // Filter therapies based on search and dosha
  const filteredTherapies = allTherapies.filter(therapy => {
    const matchesSearch = therapy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapy.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDosha = selectedDosha === "All" || therapy.dosha === selectedDosha;
    
    return matchesSearch && matchesDosha;
  });

  const handleTherapySelect = (therapy: Therapy) => {
    // Redirect to treatment page to find clinics
    router.push('/treatment');
  };

  const handleViewDetails = (therapy: Therapy) => {
    // TODO: Open therapy details modal
    console.log(`Viewing details for: ${therapy.name}`);
    alert(`Viewing details for ${therapy.name}. This feature will be implemented soon!`);
  };

  const handleBookAppointment = (clinicName: string, therapyName: string) => {
    console.log(`Booking ${therapyName} at ${clinicName}`);
    alert(`Booking ${therapyName} at ${clinicName}. This feature will be implemented soon!`);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedTherapy(null);
  };

  const getDoshaStats = () => {
    const vataCount = getTherapiesByDosha("Vata").length;
    const pittaCount = getTherapiesByDosha("Pitta").length;
    const kaphaCount = getTherapiesByDosha("Kapha").length;
    
    return { vataCount, pittaCount, kaphaCount };
  };

  const stats = getDoshaStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)]">
            Ayurvedic Therapies
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover authentic Panchakarma treatments and traditional Ayurvedic therapies designed to restore balance and promote holistic wellness.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.vataCount}</div>
              <div className="text-sm text-muted-foreground">Vata Therapies</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.pittaCount}</div>
              <div className="text-sm text-muted-foreground">Pitta Therapies</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.kaphaCount}</div>
              <div className="text-sm text-muted-foreground">Kapha Therapies</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search therapies, benefits, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedDosha} onValueChange={(value) => setSelectedDosha(value as Dosha | "All")}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by Dosha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Doshas</SelectItem>
                <SelectItem value="Vata">Vata</SelectItem>
                <SelectItem value="Pitta">Pitta</SelectItem>
                <SelectItem value="Kapha">Kapha</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredTherapies.length} of {allTherapies.length} therapies
          </p>
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </Button>
          )}
        </div>

        {/* Therapies Grid */}
        {filteredTherapies.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {filteredTherapies.map((therapy) => (
              <TherapyCard
                key={therapy.id}
                therapy={therapy}
                onSelect={handleTherapySelect}
                onViewDetails={handleViewDetails}
                showDosha={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Therapies Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find the therapy you're looking for.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedDosha("All");
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Dosha Information */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Understanding Doshas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">Vata</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Air & Space elements. Governs movement, circulation, and nervous system. 
                  Vata therapies focus on grounding, warming, and nourishing treatments.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-red-100 text-red-800 border-red-200">Pitta</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fire & Water elements. Governs metabolism, digestion, and transformation. 
                  Pitta therapies focus on cooling, calming, and purifying treatments.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-green-100 text-green-800 border-green-200">Kapha</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Earth & Water elements. Governs structure, stability, and growth. 
                  Kapha therapies focus on stimulating, warming, and energizing treatments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Therapy Clinic Popup */}
        <TherapyClinicPopup
          therapy={selectedTherapy}
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onBookAppointment={handleBookAppointment}
        />
      </div>
    </div>
  );
}
