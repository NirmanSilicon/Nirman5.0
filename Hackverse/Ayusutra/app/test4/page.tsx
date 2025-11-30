'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Heart,
  Brain,
  Activity,
  Stethoscope,
  FileText,
  Download,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  Star,
  Pill,
  Droplets,
  Wind,
  Flame
} from 'lucide-react';

interface PrescriptionData {
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
    symptoms: string[];
    stressLevel: number;
  };
  doshaAnalysis: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  dominantDosha: string;
  hairFallAnalysis?: any;
  recommendations: any[];
  riskLevel: string;
  hairHealthScore: number;
  prescriptionId: string;
  generatedAt: string;
  validUntil: string;
}

export default function PrescriptionGeneration() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      generatePrescription();
    }
  }, [user]);

  if (!user) return null;

  const generatePrescription = async () => {
    try {
      setLoading(true);
      
      // Get hair fall analysis from session if available
      const hairFallAnalysis = sessionStorage.getItem('hairFallAnalysis');
      const parsedHairFallAnalysis = hairFallAnalysis ? JSON.parse(hairFallAnalysis) : null;

      // Generate prescription data
      const prescription: PrescriptionData = {
        patientInfo: {
          name: 'Tushar',
          age: '22',
          gender: 'Male',
          height: '175',
          weight: '70',
          symptoms: ['Cough', 'Breathlessness'],
          stressLevel: 3
        },
        doshaAnalysis: {
          vata: 45,
          pitta: 25,
          kapha: 30
        },
        dominantDosha: 'Vata',
        hairFallAnalysis: parsedHairFallAnalysis,
        recommendations: generateRecommendations(parsedHairFallAnalysis),
        riskLevel: parsedHairFallAnalysis?.riskLevel || 'Medium',
        hairHealthScore: parsedHairFallAnalysis?.hairHealthScore || 75,
        prescriptionId: `PRES-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };

      setPrescriptionData(prescription);
      
      // Save prescription to database
      await savePrescription(prescription);
      
    } catch (error) {
      console.error('Error generating prescription:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (hairFallAnalysis: any) => {
    const recommendations = [];

    // General Ayurvedic recommendations
    recommendations.push({
      category: 'Diet & Nutrition',
      icon: <Droplets className="w-5 h-5" />,
      items: [
        'Include warm, cooked foods to balance Vata',
        'Add healthy fats like ghee and sesame oil',
        'Include grounding foods like root vegetables',
        'Drink warm water throughout the day',
        'Avoid cold and raw foods'
      ]
    });

    recommendations.push({
      category: 'Lifestyle & Stress Management',
      icon: <Brain className="w-5 h-5" />,
      items: [
        'Practice daily meditation for 15-20 minutes',
        'Maintain regular sleep schedule (10 PM - 6 AM)',
        'Practice gentle yoga or stretching',
        'Avoid excessive stimulation and stress',
        'Take regular breaks from work'
      ]
    });

    recommendations.push({
      category: 'Hair Care Routine',
      icon: <Wind className="w-5 h-5" />,
      items: [
        'Daily warm oil scalp massage with sesame oil',
        'Use mild, natural shampoos',
        'Avoid heat styling tools',
        'Protect hair from sun and pollution',
        'Gentle hair brushing with wooden comb'
      ]
    });

    recommendations.push({
      category: 'Herbal Supplements',
      icon: <Pill className="w-5 h-5" />,
      items: [
        'Brahmi (Bacopa monnieri) - 500mg twice daily',
        'Ashwagandha - 300mg once daily',
        'Biotin - 10mg daily',
        'Iron supplement if needed',
        'Omega-3 fatty acids'
      ]
    });

    recommendations.push({
      category: 'Panchakarma Therapies',
      icon: <Activity className="w-5 h-5" />,
      items: [
        'Abhyanga (Oil massage) - Weekly',
        'Shirodhara - Monthly',
        'Nasya therapy - As recommended',
        'Basti therapy - Seasonal',
        'Regular detoxification'
      ]
    });

    return recommendations;
  };

  const savePrescription = async (prescription: PrescriptionData) => {
    try {
      const response = await fetch('/api/prescription/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          prescription: prescription
        }),
      });

      if (!response.ok) {
        console.error('Failed to save prescription');
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

  const downloadPrescription = () => {
    if (!prescriptionData) return;

    const prescriptionText = generatePrescriptionText(prescriptionData);
    const blob = new Blob([prescriptionText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription-${prescriptionData.prescriptionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePrescriptionText = (prescription: PrescriptionData) => {
    return `
AYURVEDIC PRESCRIPTION
=====================

Prescription ID: ${prescription.prescriptionId}
Generated: ${new Date(prescription.generatedAt).toLocaleDateString()}
Valid Until: ${new Date(prescription.validUntil).toLocaleDateString()}

PATIENT INFORMATION
------------------
Name: ${prescription.patientInfo.name}
Age: ${prescription.patientInfo.age} years
Gender: ${prescription.patientInfo.gender}
Height: ${prescription.patientInfo.height} cm
Weight: ${prescription.patientInfo.weight} kg
Symptoms: ${prescription.patientInfo.symptoms.join(', ')}
Stress Level: ${prescription.patientInfo.stressLevel}/5

DOSHA ANALYSIS
--------------
Vata: ${prescription.doshaAnalysis.vata}%
Pitta: ${prescription.doshaAnalysis.pitta}%
Kapha: ${prescription.doshaAnalysis.kapha}%
Dominant Dosha: ${prescription.dominantDosha}

HAIR HEALTH ASSESSMENT
---------------------
Hair Health Score: ${prescription.hairHealthScore}/100
Risk Level: ${prescription.riskLevel}

RECOMMENDATIONS
---------------
${prescription.recommendations.map(rec => `
${rec.category}:
${rec.items.map(item => `• ${item}`).join('\n')}
`).join('\n')}

IMPORTANT NOTES
---------------
• This prescription is based on Ayurvedic principles
• Follow the recommendations consistently for best results
• Consult with a qualified Ayurvedic practitioner for personalized treatment
• This prescription is valid for 30 days from the date of generation

Generated by: Ayurved Vava Dhanvantari System
    `.trim();
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Generating your prescription...</p>
        </div>
      </div>
    );
  }

  if (!prescriptionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>No Prescription Data</CardTitle>
            <CardDescription>
              Unable to generate prescription. Please complete the previous assessments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/test1')} className="w-full">
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Stethoscope className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
                  Ayurvedic Prescription
                </h1>
                <p className="text-sm text-muted-foreground">
                  Personalized treatment plan for {prescriptionData.patientInfo.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {prescriptionData.prescriptionId}
              </Badge>
              <Button onClick={downloadPrescription} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Patient Information */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Patient Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm">{prescriptionData.patientInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Age</label>
                  <p className="text-sm">{prescriptionData.patientInfo.age} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gender</label>
                  <p className="text-sm">{prescriptionData.patientInfo.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Height/Weight</label>
                  <p className="text-sm">{prescriptionData.patientInfo.height}cm / {prescriptionData.patientInfo.weight}kg</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Symptoms</label>
                  <p className="text-sm">{prescriptionData.patientInfo.symptoms.join(', ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Stress Level</label>
                  <p className="text-sm">{prescriptionData.patientInfo.stressLevel}/5</p>
                </div>
              </CardContent>
            </Card>

            {/* Dosha Analysis */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Dosha Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vata</span>
                    <span className="text-sm font-bold">{prescriptionData.doshaAnalysis.vata}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${prescriptionData.doshaAnalysis.vata}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pitta</span>
                    <span className="text-sm font-bold">{prescriptionData.doshaAnalysis.pitta}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${prescriptionData.doshaAnalysis.pitta}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Kapha</span>
                    <span className="text-sm font-bold">{prescriptionData.doshaAnalysis.kapha}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${prescriptionData.doshaAnalysis.kapha}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">
                    Dominant Dosha: <span className="text-primary">{prescriptionData.dominantDosha}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Hair Health Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Hair Health Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className={`text-3xl font-bold ${getScoreColor(prescriptionData.hairHealthScore)}`}>
                    {prescriptionData.hairHealthScore}/100
                  </div>
                  <Badge className={getRiskColor(prescriptionData.riskLevel)}>
                    {prescriptionData.riskLevel} Risk
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Treatment Recommendations</span>
                </CardTitle>
                <CardDescription>
                  Personalized Ayurvedic treatment plan based on your assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {prescriptionData.recommendations.map((recommendation, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      {recommendation.icon}
                      <h3 className="font-semibold text-lg">{recommendation.category}</h3>
                    </div>
                    <ul className="space-y-2">
                      {recommendation.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Prescription Details */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Prescription Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Prescription ID</span>
                  <span className="text-sm font-mono">{prescriptionData.prescriptionId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Generated</span>
                  <span className="text-sm">{new Date(prescriptionData.generatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Valid Until</span>
                  <span className="text-sm">{new Date(prescriptionData.validUntil).toLocaleDateString()}</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    This prescription is generated by the Ayurved Vava Dhanvantari System and should be reviewed by a qualified Ayurvedic practitioner.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={() => router.push('/test3')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous Assessment</span>
          </Button>

          <div className="flex space-x-4">
            <Button
              onClick={downloadPrescription}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Prescription</span>
            </Button>
            <Button
              onClick={() => router.push('/clinics')}
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Consultation</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}



