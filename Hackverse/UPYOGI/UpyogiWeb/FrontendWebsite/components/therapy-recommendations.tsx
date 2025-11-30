"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TherapyCard } from "@/components/therapy-card";
import { TherapyClinicPopup } from "@/components/therapy-clinic-popup";
import { Therapy, getRecommendedTherapies, Dosha } from "@/app/therpy/therpy";
import { ArrowRight, Sparkles, Heart, Star } from "lucide-react";

interface TherapyRecommendationsProps {
  userDosha: Dosha;
  doshaScores?: {
    vata: number;
    pitta: number;
    kapha: number;
    confidence: number;
    dominant_dosha: string;
  };
  onBookAppointment?: (clinicName: string, therapyName: string) => void;
}

export function TherapyRecommendations({ userDosha, doshaScores, onBookAppointment }: TherapyRecommendationsProps) {
  const [selectedTherapy, setSelectedTherapy] = useState<Therapy | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Determine the highest scoring dosha for recommendations
  const getHighestDosha = () => {
    if (!doshaScores) return userDosha;
    
    const { vata, pitta, kapha } = doshaScores;
    if (vata >= pitta && vata >= kapha) return "Vata";
    if (pitta >= vata && pitta >= kapha) return "Pitta";
    return "Kapha";
  };

  const highestDosha = getHighestDosha();
  const recommendedTherapies = getRecommendedTherapies(highestDosha, 4);
  const allTherapies = getRecommendedTherapies(highestDosha, 12);
  const displayTherapies = showAll ? allTherapies : recommendedTherapies;

  const handleTherapySelect = (therapy: Therapy) => {
    // Redirect to treatment page to find clinics
    window.location.href = '/treatment';
  };

  const handleViewDetails = (therapy: Therapy) => {
    // TODO: Open therapy details modal
    console.log(`Viewing details for: ${therapy.name}`);
    alert(`Viewing details for ${therapy.name}. This feature will be implemented soon!`);
  };

  const handleBookAppointment = (clinicName: string, therapyName: string) => {
    onBookAppointment?.(clinicName, therapyName);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedTherapy(null);
  };

  const getDoshaColor = (dosha: Dosha) => {
    switch (dosha) {
      case "Vata": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pitta": return "bg-red-100 text-red-800 border-red-200";
      case "Kapha": return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getDoshaDescription = (dosha: Dosha) => {
    switch (dosha) {
      case "Vata":
        return "Your Vata constitution benefits from grounding, warming, and nourishing therapies that calm the nervous system and improve circulation.";
      case "Pitta":
        return "Your Pitta constitution benefits from cooling, calming, and purifying therapies that reduce inflammation and balance metabolism.";
      case "Kapha":
        return "Your Kapha constitution benefits from stimulating, warming, and energizing therapies that improve circulation and boost metabolism.";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 via-white to-secondary/5 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Personalized Therapy Recommendations
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on your <span className="font-semibold text-primary">{highestDosha}</span> constitution
                  {doshaScores && (
                    <span className="ml-2 text-xs">
                      (Vata: {doshaScores.vata}%, Pitta: {doshaScores.pitta}%, Kapha: {doshaScores.kapha}%)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Badge className={`${getDoshaColor(highestDosha)} text-sm px-4 py-2 shadow-lg`}>
              <Heart className="w-3 h-3 mr-1" />
              {highestDosha} Dominant
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {getDoshaDescription(highestDosha)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Therapies */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              Recommended {highestDosha} Therapies
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Carefully selected based on your dosha analysis
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              {displayTherapies.length} of {allTherapies.length} therapies
            </div>
            <div className="text-xs text-muted-foreground">
              Showing {showAll ? "all" : "top"} recommendations
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {displayTherapies.map((therapy, index) => (
            <div key={therapy.id} className="relative">
              {/* Featured Badge for first therapy */}
              {index === 0 && !showAll && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg animate-pulse">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              <TherapyCard
                therapy={therapy}
                onSelect={handleTherapySelect}
                onViewDetails={handleViewDetails}
                showDosha={false}
              />
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {allTherapies.length > 4 && (
          <div className="text-center pt-6">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-8 py-3 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            >
              {showAll ? "Show Less" : "Explore More Therapies"}
              <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
            </Button>
          </div>
        )}
      </div>

      {/* Therapy Clinic Popup */}
      <TherapyClinicPopup
        therapy={selectedTherapy}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onBookAppointment={handleBookAppointment}
      />
    </div>
  );
}
