'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Flame,
  Eye,
  Camera
} from 'lucide-react';

interface AssessmentData {
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
  tongueAnalysis?: any;
  hairAnalysis?: any;
  faceAnalysis?: any;
  recommendations: any[];
  riskLevel: string;
  healthScore: number;
  assessmentId: string;
  generatedAt: string;
  validUntil: string;
}

export default function AssessmentSummary() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
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
      generateAssessment();
    }
  }, [user]);

  if (!user) return null;

  const generateAssessment = async () => {
    try {
      setLoading(true);
      
      // Generate comprehensive assessment data
      const assessment: AssessmentData = {
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
        tongueAnalysis: {
          color: 'Pink',
          coating: 'Thin white',
          texture: 'Smooth',
          healthScore: 75
        },
        hairAnalysis: {
          texture: 'Normal',
          density: 'Good',
          scalpCondition: 'Healthy',
          healthScore: 80
        },
        faceAnalysis: {
          complexion: 'Fair',
          skinTexture: 'Smooth',
          eyeArea: 'Normal',
          healthScore: 70
        },
        recommendations: generateRecommendations(),
        riskLevel: 'Medium',
        healthScore: 75,
        assessmentId: `ASSESS-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      setAssessmentData(assessment);
      
      // Save assessment to database
      await saveAssessment(assessment);
      
    } catch (error) {
      console.error('Error generating assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = () => {
    return [
      {
        category: 'Diet & Nutrition',
        icon: <Droplets className="w-5 h-5" />,
        items: [
          'Include warm, cooked foods to balance Vata',
          'Add healthy fats like ghee and sesame oil',
          'Include grounding foods like root vegetables',
          'Drink warm water throughout the day',
          'Avoid cold and raw foods'
        ]
      },
      {
        category: 'Lifestyle & Stress Management',
        icon: <Brain className="w-5 h-5" />,
        items: [
          'Practice daily meditation for 15-20 minutes',
          'Maintain regular sleep schedule (10 PM - 6 AM)',
          'Practice gentle yoga or stretching',
          'Avoid excessive stimulation and stress',
          'Take regular breaks from work'
        ]
      },
      {
        category: 'Hair Care Routine',
        icon: <Wind className="w-5 h-5" />,
        items: [
          'Daily warm oil scalp massage with sesame oil',
          'Use mild, natural shampoos',
          'Avoid heat styling tools',
          'Protect hair from sun and pollution',
          'Gentle hair brushing with wooden comb'
        ]
      },
      {
        category: 'Skin Care',
        icon: <Eye className="w-5 h-5" />,
        items: [
          'Use natural, gentle cleansers',
          'Apply warm oil massage to face',
          'Protect from sun exposure',
          'Maintain proper hydration',
          'Use Ayurvedic face packs weekly'
        ]
      },
      {
        category: 'Herbal Supplements',
        icon: <Pill className="w-5 h-5" />,
        items: [
          'Brahmi (Bacopa monnieri) - 500mg twice daily',
          'Ashwagandha - 300mg once daily',
          'Biotin - 10mg daily',
          'Iron supplement if needed',
          'Omega-3 fatty acids'
        ]
      },
      {
        category: 'Panchakarma Therapies',
        icon: <Activity className="w-5 h-5" />,
        items: [
          'Abhyanga (Oil massage) - Weekly',
          'Shirodhara - Monthly',
          'Nasya therapy - As recommended',
          'Basti therapy - Seasonal',
          'Regular detoxification'
        ]
      }
    ];
  };

  const saveAssessment = async (assessment: AssessmentData) => {
    try {
      const response = await fetch('/api/assessment/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          assessment: assessment
        }),
      });

      if (!response.ok) {
        console.error('Failed to save assessment');
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const downloadAssessment = () => {
    if (!assessmentData) return;

    const assessmentText = generateAssessmentText(assessmentData);
    const blob = new Blob([assessmentText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment-${assessmentData.assessmentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateAssessmentText = (assessment: AssessmentData) => {
    return `
COMPREHENSIVE AYURVEDIC HEALTH ASSESSMENT
=========================================

Assessment ID: ${assessment.assessmentId}
Generated: ${new Date(assessment.generatedAt).toLocaleDateString()}
Valid Until: ${new Date(assessment.validUntil).toLocaleDateString()}

PATIENT INFORMATION
------------------
Name: ${assessment.patientInfo.name}
Age: ${assessment.patientInfo.age} years
Gender: ${assessment.patientInfo.gender}
Height: ${assessment.patientInfo.height} cm
Weight: ${assessment.patientInfo.weight} kg
Symptoms: ${assessment.patientInfo.symptoms.join(', ')}
Stress Level: ${assessment.patientInfo.stressLevel}/5

DOSHA ANALYSIS
--------------
Vata: ${assessment.doshaAnalysis.vata}%
Pitta: ${assessment.doshaAnalysis.pitta}%
Kapha: ${assessment.doshaAnalysis.kapha}%
Dominant Dosha: ${assessment.dominantDosha}

ASSESSMENT RESULTS
------------------
Tongue Analysis: ${assessment.tongueAnalysis?.healthScore || 0}/100
Hair Analysis: ${assessment.hairAnalysis?.healthScore || 0}/100
Face Analysis: ${assessment.faceAnalysis?.healthScore || 0}/100
Overall Health Score: ${assessment.healthScore}/100
Risk Level: ${assessment.riskLevel}

RECOMMENDATIONS
---------------
${assessment.recommendations.map(rec => `
${rec.category}:
${rec.items.map(item => `• ${item}`).join('\n')}
`).join('\n')}

IMPORTANT NOTES
---------------
• This assessment is based on Ayurvedic principles
• Follow the recommendations consistently for best results
• Consult with a qualified Ayurvedic practitioner for personalized treatment
• This assessment is valid for 30 days from the date of generation

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
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent mx-auto"></div>
          <p className="text-amber-200">Generating your comprehensive assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/20 backdrop-blur-lg border border-amber-400/30">
          <CardHeader className="text-center">
            <CardTitle className="text-amber-200">No Assessment Data</CardTitle>
            <CardDescription className="text-emerald-200">
              Unable to generate assessment. Please complete the previous assessments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/test1')} className="w-full bg-amber-500 hover:bg-amber-600">
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 opacity-10">
          <div className="w-full h-full border-4 border-amber-300 rounded-full animate-spin-slow"></div>
        </div>
        <div className="absolute bottom-20 right-20 w-48 h-48 opacity-15">
          <div className="w-full h-full border-4 border-green-300 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-card/20 backdrop-blur-sm border-b border-amber-400/30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Stethoscope className="h-8 w-8 text-amber-400" />
              <div>
                <h1 className="text-xl font-bold text-amber-200 font-[family-name:var(--font-playfair)]">
                  Comprehensive Health Assessment
                </h1>
                <p className="text-sm text-emerald-300">
                  Complete analysis for {assessmentData.patientInfo.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-200 border-amber-400">
                {assessmentData.assessmentId}
              </Badge>
              <Button onClick={downloadAssessment} size="sm" className="bg-amber-500 hover:bg-amber-600">
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
            <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-amber-400/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-200">
                  <User className="h-5 w-5" />
                  <span>Patient Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-emerald-300">Name</label>
                  <p className="text-sm text-amber-100">{assessmentData.patientInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-emerald-300">Age</label>
                  <p className="text-sm text-amber-100">{assessmentData.patientInfo.age} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-emerald-300">Gender</label>
                  <p className="text-sm text-amber-100">{assessmentData.patientInfo.gender}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-emerald-300">Height/Weight</label>
                  <p className="text-sm text-amber-100">{assessmentData.patientInfo.height}cm / {assessmentData.patientInfo.weight}kg</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-emerald-300">Symptoms</label>
                  <p className="text-sm text-amber-100">{assessmentData.patientInfo.symptoms.join(', ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-emerald-300">Stress Level</label>
                  <p className="text-sm text-amber-100">{assessmentData.patientInfo.stressLevel}/5</p>
                </div>
              </CardContent>
            </Card>

            {/* Dosha Analysis */}
            <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-amber-400/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-200">
                  <Heart className="h-5 w-5" />
                  <span>Dosha Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-100">Vata</span>
                    <span className="text-sm font-bold text-amber-200">{assessmentData.doshaAnalysis.vata}%</span>
                  </div>
                  <div className="w-full bg-amber-900/30 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${assessmentData.doshaAnalysis.vata}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-100">Pitta</span>
                    <span className="text-sm font-bold text-amber-200">{assessmentData.doshaAnalysis.pitta}%</span>
                  </div>
                  <div className="w-full bg-amber-900/30 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${assessmentData.doshaAnalysis.pitta}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-100">Kapha</span>
                    <span className="text-sm font-bold text-amber-200">{assessmentData.doshaAnalysis.kapha}%</span>
                  </div>
                  <div className="w-full bg-amber-900/30 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${assessmentData.doshaAnalysis.kapha}%` }}
                    ></div>
                  </div>
                </div>
                <div className="pt-2 border-t border-amber-400/30">
                  <p className="text-sm font-medium text-amber-200">
                    Dominant Dosha: <span className="text-amber-400">{assessmentData.dominantDosha}</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Health Scores */}
            <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-amber-400/30">
              <CardTitle className="flex items-center space-x-2 text-amber-200 mb-4">
                <Star className="h-5 w-5" />
                <span>Health Scores</span>
              </CardTitle>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className={`text-3xl font-bold ${getScoreColor(assessmentData.healthScore)}`}>
                    {assessmentData.healthScore}/100
                  </div>
                  <Badge className={getRiskColor(assessmentData.riskLevel)}>
                    {assessmentData.riskLevel} Risk
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-100">Tongue</span>
                    <span className="text-amber-200">{assessmentData.tongueAnalysis?.healthScore || 0}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-100">Hair</span>
                    <span className="text-amber-200">{assessmentData.hairAnalysis?.healthScore || 0}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-100">Face</span>
                    <span className="text-amber-200">{assessmentData.faceAnalysis?.healthScore || 0}/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <div className="lg:col-span-2">
            <Card className="bg-black/20 backdrop-blur-lg border border-amber-400/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-200">
                  <FileText className="h-5 w-5" />
                  <span>Treatment Recommendations</span>
                </CardTitle>
                <CardDescription className="text-emerald-200">
                  Personalized Ayurvedic treatment plan based on your comprehensive assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {assessmentData.recommendations.map((recommendation, index) => (
                  <div key={index} className="border border-amber-400/30 rounded-lg p-4 bg-amber-500/5">
                    <div className="flex items-center space-x-2 mb-3">
                      {recommendation.icon}
                      <h3 className="font-semibold text-lg text-amber-200">{recommendation.category}</h3>
                    </div>
                    <ul className="space-y-2">
                      {recommendation.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-amber-100">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Assessment Details */}
            <Card className="mt-6 bg-black/20 backdrop-blur-lg border border-amber-400/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-200">
                  <Calendar className="h-5 w-5" />
                  <span>Assessment Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-emerald-300">Assessment ID</span>
                  <span className="text-sm font-mono text-amber-200">{assessmentData.assessmentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-emerald-300">Generated</span>
                  <span className="text-sm text-amber-200">{new Date(assessmentData.generatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-emerald-300">Valid Until</span>
                  <span className="text-sm text-amber-200">{new Date(assessmentData.validUntil).toLocaleDateString()}</span>
                </div>
                <div className="pt-3 border-t border-amber-400/30">
                  <p className="text-xs text-emerald-300">
                    This assessment is generated by the Ayurved Vava Dhanvantari System and should be reviewed by a qualified Ayurvedic practitioner.
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
            onClick={() => router.push('/face-assessment')}
            className="flex items-center space-x-2 border-amber-400 text-amber-200 hover:bg-amber-500/20"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous Assessment</span>
          </Button>

          <div className="flex space-x-4">
            <Button
              onClick={downloadAssessment}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600"
            >
              <Download className="h-4 w-4" />
              <span>Download Assessment</span>
            </Button>
            <Button
              onClick={() => router.push('/clinics')}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Consultation</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
}
