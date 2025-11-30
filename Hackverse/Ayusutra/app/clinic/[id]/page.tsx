"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  ExternalLink, 
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Award,
  Leaf
} from "lucide-react";
import Image from "next/image";
import { getAllTherapies, Therapy } from "@/app/therpy/therpy";
import clinics from "@/app/near/clinic";

// Function to get therapy images based on therapy name
const getTherapyImages = (therapyName: string) => {
  // Manual mapping of therapy names to their image files (matching exact names from therapy data)
  const therapyImageMap: { [key: string]: string[] } = {
    "Basti (Medicated Enema)": ["/basti1.jpg", "/basti2.jpg", "/basti3.jpg", "/basti4.jpg"],
    "Abhyanga (Warm Oil Massage)": ["/Abhyanga1.jpg", "/Abhyanga2.jpg", "/Abhyanga3.jpg", "/Abhyanga4.jpg"],
    "Swedana (Herbal Steam Therapy)": ["/swedna1.jpg", "/swedna2.jpg", "/swedna3.jpg", "/Swedna4.jpg"],
    "Nasya (Nasal Therapy)": ["/Nasya1.jpg", "/Nasya2.jpg", "/Nasya3.jpg", "/Nasya4.jpg"],
    "Virechana (Therapeutic Purgation)": ["/virechana1.jpg", "/virechana2.jpg", "/virechana3.jpg", "/virechana4.jpg"],
    "Raktamokshana (Bloodletting)": ["/raktamokshana1.jpg", "/raktamokshana2.jpg", "/raktamokshana3.jpg", "/raktamokshana4.jpg"],
    "Shirodhara (Oil Pouring on Forehead)": ["/shirodhara1.jpg", "/shirodhara2.jpg", "/shirodhara3.jpg", "/shirodhara4.jpg"],
    "Abhyanga (Cooling Oil Massage)": ["/Abhyanga1.jpg", "/Abhyanga2.jpg", "/Abhyanga3.jpg", "/Abhyanga4.jpg"],
    "Vamana (Therapeutic Emesis)": ["/vamana1.jpg", "/vamana2.jpg", "/vamana3.jpg", "/vamana4.jpg"],
    "Udvartana (Herbal Powder Massage)": ["/udvartana1.jpg", "/udvartana2.jpg", "/udvartana3.jpg", "/udvartana4.jpg"],
    "Nasya (Nasal Medication)": ["/Nasya1.jpg", "/Nasya2.jpg", "/Nasya3.jpg", "/Nasya4.jpg"],
    "Swedana (Sweating Therapy)": ["/swedna1.jpg", "/swedna2.jpg", "/swedna3.jpg", "/Swedna4.jpg"]
  };
  
  // Return the mapped images or fallback to generic therapy images
  return therapyImageMap[therapyName] || [
    "/traditional-ayurvedic-healing-center.jpg",
    "/ayurvedic-massage-therapy-room-with-natural-elemen.jpg", 
    "/ayurvedic-spa-treatment-room-with-warm-oils.jpg",
    "/traditional-panchakarma-treatment-setup-with-herbs.jpg"
  ];
};

interface ClinicDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ClinicDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [clinic, setClinic] = useState<any>(null);
  const [therapies, setTherapies] = useState<Therapy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find clinic by ID (using index as ID for now)
    const clinicId = parseInt(params.id as string);
    if (clinicId >= 0 && clinicId < clinics.length) {
      setClinic(clinics[clinicId]);
    }
    
    // Load all therapies
    setTherapies(getAllTherapies());
    setLoading(false);
  }, [params.id]);

  const handleBookTreatment = (therapyId: string, therapyName: string) => {
    // Redirect to booking page with therapy and clinic information
    router.push(`/book-now?therapyId=${therapyId}&clinicId=${params.id}`);
  };

  const getTreatmentPrice = (therapy: Therapy) => {
    // Different clinics have different pricing - this is just an example
    const basePrice = therapy.price;
    const clinicMultiplier = clinic ? (parseInt(clinic.name.length) % 3) + 1 : 1;
    
    // Extract base price and apply multiplier
    const priceMatch = basePrice.match(/₹(\d+)/);
    if (priceMatch) {
      const baseAmount = parseInt(priceMatch[1]);
      const adjustedAmount = baseAmount * clinicMultiplier;
      return `₹${adjustedAmount} - ₹${adjustedAmount + 200}`;
    }
    return basePrice;
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case "Vata": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pitta": return "bg-red-100 text-red-800 border-red-200";
      case "Kapha": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Loading clinic details...</span>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Clinic Not Found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clinics
        </Button>

        {/* Clinic Header */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Clinic Photo */}
              <div className="md:col-span-1">
                <div className="relative h-64 w-full rounded-lg overflow-hidden group">
                  {clinic.photo ? (
                    <Image
                      src={clinic.photo}
                      alt={clinic.name}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      quality={90}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto">
                          <MapPin className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">Clinic Photo</p>
                        <p className="text-xs text-muted-foreground">Upload clinic image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Clinic Info */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                    {clinic.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{clinic.rating}</span>
                      <span className="text-muted-foreground">({clinic.reviews} reviews)</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Open Now
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">{clinic.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Operating Hours</p>
                      <p className="text-muted-foreground">9:00 AM - 8:00 PM (Mon-Sun)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treatments Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] mb-4">
              Available Treatments
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover our comprehensive range of authentic Ayurvedic therapies
            </p>
          </div>

          {/* Therapies Grid */}
          <div className="grid gap-8">
            {therapies.map((therapy, index) => (
              <Card key={therapy.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    {/* Treatment Photos */}
                    <div className="md:col-span-1">
                      <div className="space-y-3">
                        {/* Main Photo */}
                        <div className="relative h-40 w-full rounded-lg overflow-hidden group">
                          <Image
                            src={getTherapyImages(therapy.name)[0]}
                            alt={`${therapy.name} - Main View`}
                            fill
                            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
                            quality={90}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center" style={{display: 'none'}}>
                            <div className="text-center space-y-1">
                              <div className="w-8 h-8 bg-primary/30 rounded-full flex items-center justify-center mx-auto">
                                <Leaf className="w-4 h-4 text-primary" />
                              </div>
                              <p className="text-xs text-muted-foreground">Photo 1</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Thumbnail Photos */}
                        <div className="grid grid-cols-3 gap-2">
                          {getTherapyImages(therapy.name).slice(1, 4).map((imagePath, idx) => (
                            <div key={idx} className="relative h-20 w-full rounded overflow-hidden group">
                              <Image
                                src={imagePath}
                                alt={`${therapy.name} - View ${idx + 2}`}
                                fill
                                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 8vw, 6vw"
                                quality={85}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center" style={{display: 'none'}}>
                                <p className="text-xs text-muted-foreground">Photo {idx + 2}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Treatment Info */}
                    <div className="md:col-span-3 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{therapy.name}</h3>
                            <Badge className={getDoshaColor(therapy.dosha)}>
                              {therapy.dosha}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {therapy.description}
                          </p>
                        </div>
                      </div>

                      {/* Treatment Details */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Duration:</span>
                            <span className="text-sm text-muted-foreground">{therapy.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Price at this clinic:</span>
                            <span className="text-sm font-medium text-green-600">
                              {getTreatmentPrice(therapy)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Benefits:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {therapy.benefits.slice(0, 3).map((benefit, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                            {therapy.benefits.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{therapy.benefits.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contraindications */}
                      {therapy.contraindications && therapy.contraindications.length > 0 && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Award className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">Important Notes:</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {therapy.contraindications.map((contraindication, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                                {contraindication}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Book Button */}
                      <div className="flex justify-end pt-4">
                        <Button 
                          onClick={() => handleBookTreatment(therapy.id, therapy.name)}
                          className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Book {therapy.name}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Clinic Stats */}
        <Card className="mt-12 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-center">Clinic Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Treatments</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{clinic.reviews}</div>
                <div className="text-sm text-muted-foreground">Reviews</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">5+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Happy Patients</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
