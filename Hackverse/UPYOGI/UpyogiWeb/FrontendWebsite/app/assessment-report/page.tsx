'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Calendar, 
  Heart, 
  Brain, 
  Shield, 
  Leaf, 
  Clock,
  FileText,
  Download,
  ArrowRight
} from 'lucide-react';

interface AssessmentData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  symptoms: string[];
  stressLevel: number;
  tongueImage?: string;
  hairImage?: string;
  faceImage?: string;
  skinAnalysis?: {
    skinType: string;
    complexion: string;
    texture: string;
    recommendations: string[];
  };
}

interface DoshaAnalysis {
  vata: number;
  pitta: number;
  kapha: number;
  dominant: string;
  description: string;
}

interface TherapyRecommendation {
  name: string;
  description: string;
  duration: string;
  frequency: string;
  benefits: string[];
}

export default function AssessmentReport() {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [doshaAnalysis, setDoshaAnalysis] = useState<DoshaAnalysis | null>(null);
  const [therapyRecommendations, setTherapyRecommendations] = useState<TherapyRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.6;
      utterance.pitch = 0.8;
      utterance.volume = 0.9;
      utterance.lang = 'en-IN';
      
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(voice => 
        voice.name.includes('India') || 
        voice.name.includes('Hindi') ||
        voice.name.includes('Ravi') ||
        voice.name.includes('Priya') ||
        voice.lang.includes('IN')
      );
      
      if (indianVoice) {
        utterance.voice = indianVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    // Load assessment data from localStorage
    const savedData = localStorage.getItem('assessmentData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setAssessmentData(data);
      
      // Generate dosha analysis
      const dosha = generateDoshaAnalysis(data);
      setDoshaAnalysis(dosha);
      
      // Generate therapy recommendations
      const therapies = generateTherapyRecommendations(data, dosha);
      setTherapyRecommendations(therapies);
      
      setIsLoading(false);
      
      // Welcome voice
      setTimeout(() => {
        speakText("Welcome to your personalized Ayurvedic assessment report. I have analyzed your health profile and prepared comprehensive recommendations for your well-being.");
      }, 1000);
    } else {
      // Redirect to test1 if no data
      router.push('/test1');
    }
  }, [router, speakText]);

  const generateDoshaAnalysis = (data: AssessmentData): DoshaAnalysis => {
    // Simple dosha calculation based on symptoms and characteristics
    let vata = 0;
    let pitta = 0;
    let kapha = 0;

    // Age factor
    const age = parseInt(data.age);
    if (age < 30) vata += 2;
    else if (age < 50) pitta += 2;
    else kapha += 2;

    // Gender factor
    if (data.gender === 'Female') {
      vata += 1;
      kapha += 1;
    } else {
      pitta += 1;
    }

    // Symptoms analysis
    data.symptoms.forEach(symptom => {
      const lowerSymptom = symptom.toLowerCase();
      if (lowerSymptom.includes('anxiety') || lowerSymptom.includes('dry') || lowerSymptom.includes('constipation')) {
        vata += 2;
      }
      if (lowerSymptom.includes('acne') || lowerSymptom.includes('anger') || lowerSymptom.includes('inflammation')) {
        pitta += 2;
      }
      if (lowerSymptom.includes('weight') || lowerSymptom.includes('congestion') || lowerSymptom.includes('sluggish')) {
        kapha += 2;
      }
    });

    // Stress level factor
    if (data.stressLevel >= 4) vata += 2;
    else if (data.stressLevel >= 3) pitta += 1;

    const total = vata + pitta + kapha;
    const vataPercent = Math.round((vata / total) * 100);
    const pittaPercent = Math.round((pitta / total) * 100);
    const kaphaPercent = Math.round((kapha / total) * 100);

    let dominant = 'Vata';
    let description = 'Air and Space elements dominate your constitution. You tend to be creative, energetic, and quick-thinking, but may experience anxiety, dryness, and irregular digestion.';
    
    if (pitta > vata && pitta > kapha) {
      dominant = 'Pitta';
      description = 'Fire and Water elements dominate your constitution. You are intelligent, focused, and have strong digestion, but may experience anger, inflammation, and sensitivity to heat.';
    } else if (kapha > vata && kapha > pitta) {
      dominant = 'Kapha';
      description = 'Earth and Water elements dominate your constitution. You are stable, loving, and have strong immunity, but may experience weight gain, congestion, and sluggishness.';
    }

    return {
      vata: vataPercent,
      pitta: pittaPercent,
      kapha: kaphaPercent,
      dominant,
      description
    };
  };

  const generateTherapyRecommendations = (data: AssessmentData, dosha: DoshaAnalysis): TherapyRecommendation[] => {
    const therapies: TherapyRecommendation[] = [];

    // Panchakarma recommendations based on dosha
    if (dosha.dominant === 'Vata') {
      therapies.push({
        name: 'Abhyanga (Oil Massage)',
        description: 'Warm sesame oil massage to calm Vata dosha and nourish the nervous system.',
        duration: '45-60 minutes',
        frequency: 'Daily for 7 days',
        benefits: ['Reduces anxiety', 'Improves sleep', 'Nourishes skin', 'Calms nervous system']
      });
      therapies.push({
        name: 'Shirodhara',
        description: 'Continuous flow of warm oil on the forehead to deeply relax the mind.',
        duration: '30-45 minutes',
        frequency: '3 times per week',
        benefits: ['Deep relaxation', 'Mental clarity', 'Stress relief', 'Better sleep']
      });
    } else if (dosha.dominant === 'Pitta') {
      therapies.push({
        name: 'Takradhara',
        description: 'Cool buttermilk treatment to pacify Pitta dosha and cool the body.',
        duration: '30-45 minutes',
        frequency: 'Daily for 5 days',
        benefits: ['Cools inflammation', 'Reduces anger', 'Improves skin', 'Balances digestion']
      });
      therapies.push({
        name: 'Sheetali Pranayama',
        description: 'Cooling breathing technique to balance Pitta and reduce heat.',
        duration: '10-15 minutes',
        frequency: 'Daily',
        benefits: ['Cools body temperature', 'Reduces acidity', 'Calms mind', 'Improves digestion']
      });
    } else {
      therapies.push({
        name: 'Udvartana (Herbal Powder Massage)',
        description: 'Dry powder massage to stimulate Kapha and improve circulation.',
        duration: '30-45 minutes',
        frequency: '3 times per week',
        benefits: ['Reduces weight', 'Improves circulation', 'Removes toxins', 'Energizes body']
      });
      therapies.push({
        name: 'Vamana (Therapeutic Vomiting)',
        description: 'Controlled elimination therapy to remove excess Kapha from the body.',
        duration: '2-3 hours',
        frequency: 'Once per month',
        benefits: ['Removes excess mucus', 'Improves breathing', 'Boosts energy', 'Clears congestion']
      });
    }

    // General recommendations
    therapies.push({
      name: 'Yoga & Meditation',
      description: 'Daily practice to balance all doshas and maintain overall well-being.',
      duration: '30-45 minutes',
      frequency: 'Daily',
      benefits: ['Balances doshas', 'Reduces stress', 'Improves flexibility', 'Mental clarity']
    });

    return therapies;
  };

  const handleProceedToDashboard = () => {
    speakText("Your assessment is complete. You can now proceed to your dashboard to track your health journey and book appointments.");
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };

  const handleDownloadReport = () => {
    // Simple download functionality
    const reportData = {
      patient: assessmentData,
      doshaAnalysis,
      therapyRecommendations,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ayurvedic-assessment-report-${assessmentData?.name || 'patient'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-amber-200">Generating your personalized report...</p>
        </div>
      </div>
    );
  }

  if (!assessmentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mr-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-amber-200">Ayurvedic Assessment Report</h1>
              <p className="text-amber-300">Personalized Health Analysis & Recommendations</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-amber-300">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date().toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <Card className="mb-6 bg-amber-50/10 border-amber-400/30">
          <CardHeader>
            <CardTitle className="text-amber-200 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-amber-100">
              <div>
                <p className="text-sm text-amber-300">Name</p>
                <p className="font-semibold">{assessmentData.name}</p>
              </div>
              <div>
                <p className="text-sm text-amber-300">Age</p>
                <p className="font-semibold">{assessmentData.age} years</p>
              </div>
              <div>
                <p className="text-sm text-amber-300">Gender</p>
                <p className="font-semibold">{assessmentData.gender}</p>
              </div>
              <div>
                <p className="text-sm text-amber-300">BMI</p>
                <p className="font-semibold">
                  {((parseFloat(assessmentData.weight) / Math.pow(parseFloat(assessmentData.height) / 100, 2)).toFixed(1))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dosha Analysis */}
        <Card className="mb-6 bg-amber-50/10 border-amber-400/30">
          <CardHeader>
            <CardTitle className="text-amber-200 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Dosha Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-200 font-semibold">Dominant Dosha: {doshaAnalysis?.dominant}</span>
                <Badge variant="outline" className="border-amber-400 text-amber-300">
                  {doshaAnalysis?.dominant} Constitution
                </Badge>
              </div>
              <p className="text-amber-100 text-sm leading-relaxed">
                {doshaAnalysis?.description}
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-amber-300 mb-1">
                  <span>Vata (Air + Space)</span>
                  <span>{doshaAnalysis?.vata}%</span>
                </div>
                <div className="w-full bg-amber-900/30 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${doshaAnalysis?.vata}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-amber-300 mb-1">
                  <span>Pitta (Fire + Water)</span>
                  <span>{doshaAnalysis?.pitta}%</span>
                </div>
                <div className="w-full bg-amber-900/30 rounded-full h-2">
                  <div 
                    className="bg-red-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${doshaAnalysis?.pitta}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-amber-300 mb-1">
                  <span>Kapha (Earth + Water)</span>
                  <span>{doshaAnalysis?.kapha}%</span>
                </div>
                <div className="w-full bg-amber-900/30 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${doshaAnalysis?.kapha}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms & Concerns */}
        <Card className="mb-6 bg-amber-50/10 border-amber-400/30">
          <CardHeader>
            <CardTitle className="text-amber-200 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Health Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-amber-300 text-sm mb-2">Reported Symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {assessmentData.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="secondary" className="bg-amber-200/20 text-amber-100 border-amber-400/30">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-amber-300 text-sm mb-2">Stress Level:</p>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-4 h-4 rounded-full ${
                        level <= assessmentData.stressLevel 
                          ? 'bg-red-400' 
                          : 'bg-amber-900/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-amber-100 text-sm">
                  {assessmentData.stressLevel}/5 - {
                    assessmentData.stressLevel <= 2 ? 'Low' :
                    assessmentData.stressLevel <= 3 ? 'Moderate' : 'High'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Therapy Recommendations */}
        <Card className="mb-6 bg-amber-50/10 border-amber-400/30">
          <CardHeader>
            <CardTitle className="text-amber-200 flex items-center">
              <Leaf className="w-5 h-5 mr-2" />
              Recommended Therapies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {therapyRecommendations.map((therapy, index) => (
                <div key={index} className="border border-amber-400/20 rounded-lg p-4 bg-amber-50/5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-amber-200 font-semibold">{therapy.name}</h4>
                    <div className="text-right text-sm text-amber-300">
                      <p>{therapy.duration}</p>
                      <p>{therapy.frequency}</p>
                    </div>
                  </div>
                  <p className="text-amber-100 text-sm mb-3">{therapy.description}</p>
                  <div>
                    <p className="text-amber-300 text-xs mb-2">Benefits:</p>
                    <div className="flex flex-wrap gap-1">
                      {therapy.benefits.map((benefit, benefitIndex) => (
                        <Badge key={benefitIndex} variant="outline" className="text-xs border-amber-400/30 text-amber-200">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skin Analysis (if available) */}
        {assessmentData.skinAnalysis && (
          <Card className="mb-6 bg-amber-50/10 border-amber-400/30">
            <CardHeader>
              <CardTitle className="text-amber-200 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Skin Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-amber-100">
                <div>
                  <p className="text-sm text-amber-300">Skin Type</p>
                  <p className="font-semibold">{assessmentData.skinAnalysis.skinType}</p>
                </div>
                <div>
                  <p className="text-sm text-amber-300">Complexion</p>
                  <p className="font-semibold">{assessmentData.skinAnalysis.complexion}</p>
                </div>
                <div>
                  <p className="text-sm text-amber-300">Texture</p>
                  <p className="font-semibold">{assessmentData.skinAnalysis.texture}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-amber-300 mb-2">Recommendations:</p>
                <div className="flex flex-wrap gap-2">
                  {assessmentData.skinAnalysis.recommendations.map((rec, index) => (
                    <Badge key={index} variant="secondary" className="bg-amber-200/20 text-amber-100 border-amber-400/30">
                      {rec}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleDownloadReport}
            variant="outline"
            className="border-amber-400 text-amber-200 hover:bg-amber-400/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button
            onClick={handleProceedToDashboard}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Proceed to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-amber-300 text-sm">
          <p>This report is generated based on Ayurvedic principles and should be used as a guide.</p>
          <p>Please consult with a qualified Ayurvedic practitioner for personalized treatment.</p>
        </div>
      </div>
    </div>
  );
}
