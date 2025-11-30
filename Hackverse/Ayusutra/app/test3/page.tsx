'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  Leaf, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Heart,
  Brain,
  Moon,
  Sun,
  Wind,
  Droplets,
  Flame,
  Activity,
  AlertTriangle,
  Clock,
  User
} from 'lucide-react';

interface HairFallResponse {
  [key: string]: any;
}

const hairFallQuestions = [
  {
    id: 'stress_level',
    question: 'How would you rate your current stress level?',
    type: 'scale',
    min: 1,
    max: 10,
    labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
    icon: <Brain className="w-6 h-6" />,
    category: 'Mental Health'
  },
  {
    id: 'anxiety_frequency',
    question: 'How often do you experience anxiety or worry?',
    type: 'choice',
    options: [
      { value: 'never', label: 'Never', emoji: '😌' },
      { value: 'rarely', label: 'Rarely (once a month)', emoji: '😊' },
      { value: 'sometimes', label: 'Sometimes (weekly)', emoji: '😐' },
      { value: 'often', label: 'Often (daily)', emoji: '😰' },
      { value: 'constantly', label: 'Constantly', emoji: '😱' }
    ],
    icon: <Heart className="w-6 h-6" />,
    category: 'Mental Health'
  },
  {
    id: 'sleep_quality',
    question: 'How would you describe your sleep quality?',
    type: 'choice',
    options: [
      { value: 'excellent', label: 'Excellent - Deep, restful sleep', emoji: '😴' },
      { value: 'good', label: 'Good - Mostly restful', emoji: '😊' },
      { value: 'fair', label: 'Fair - Some disturbances', emoji: '😐' },
      { value: 'poor', label: 'Poor - Frequent waking', emoji: '😵' },
      { value: 'terrible', label: 'Terrible - Insomnia', emoji: '😫' }
    ],
    icon: <Moon className="w-6 h-6" />,
    category: 'Lifestyle'
  },
  {
    id: 'hair_loss_pattern',
    question: 'What pattern of hair loss are you experiencing?',
    type: 'multiple_choice',
    options: [
      { value: 'thinning_crown', label: 'Thinning at crown', emoji: '👑' },
      { value: 'receding_hairline', label: 'Receding hairline', emoji: '📐' },
      { value: 'patchy_loss', label: 'Patchy hair loss', emoji: '🔲' },
      { value: 'overall_thinning', label: 'Overall thinning', emoji: '🌊' },
      { value: 'excessive_shedding', label: 'Excessive shedding', emoji: '🍂' },
      { value: 'none', label: 'No significant hair loss', emoji: '✨' }
    ],
    icon: <User className="w-6 h-6" />,
    category: 'Physical Symptoms'
  },
  {
    id: 'diet_quality',
    question: 'How would you rate your current diet?',
    type: 'choice',
    options: [
      { value: 'excellent', label: 'Excellent - Balanced, nutritious', emoji: '🥗' },
      { value: 'good', label: 'Good - Mostly healthy', emoji: '🍎' },
      { value: 'fair', label: 'Fair - Some healthy choices', emoji: '🍽️' },
      { value: 'poor', label: 'Poor - Mostly processed foods', emoji: '🍟' },
      { value: 'terrible', label: 'Terrible - Junk food diet', emoji: '🍕' }
    ],
    icon: <Droplets className="w-6 h-6" />,
    category: 'Lifestyle'
  },
  {
    id: 'exercise_frequency',
    question: 'How often do you exercise?',
    type: 'choice',
    options: [
      { value: 'daily', label: 'Daily', emoji: '🏃‍♂️' },
      { value: '4_5_times', label: '4-5 times per week', emoji: '💪' },
      { value: '2_3_times', label: '2-3 times per week', emoji: '🚶‍♂️' },
      { value: 'weekly', label: 'Once a week', emoji: '🏃‍♀️' },
      { value: 'rarely', label: 'Rarely or never', emoji: '🛋️' }
    ],
    icon: <Activity className="w-6 h-6" />,
    category: 'Lifestyle'
  },
  {
    id: 'hormonal_issues',
    question: 'Do you have any hormonal imbalances or conditions?',
    type: 'multiple_choice',
    options: [
      { value: 'thyroid', label: 'Thyroid issues', emoji: '🦋' },
      { value: 'pcos', label: 'PCOS', emoji: '🔄' },
      { value: 'menopause', label: 'Menopause', emoji: '🌅' },
      { value: 'pregnancy', label: 'Pregnancy/Postpartum', emoji: '🤱' },
      { value: 'diabetes', label: 'Diabetes', emoji: '🍯' },
      { value: 'none', label: 'None', emoji: '✅' }
    ],
    icon: <Flame className="w-6 h-6" />,
    category: 'Health Conditions'
  },
  {
    id: 'scalp_condition',
    question: 'How would you describe your scalp condition?',
    type: 'choice',
    options: [
      { value: 'healthy', label: 'Healthy - No issues', emoji: '✨' },
      { value: 'oily', label: 'Oily', emoji: '🛢️' },
      { value: 'dry', label: 'Dry', emoji: '🏜️' },
      { value: 'itchy', label: 'Itchy', emoji: '🤏' },
      { value: 'flaky', label: 'Flaky/Dandruff', emoji: '❄️' },
      { value: 'sensitive', label: 'Sensitive', emoji: '🤕' }
    ],
    icon: <Wind className="w-6 h-6" />,
    category: 'Physical Symptoms'
  },
  {
    id: 'hair_care_routine',
    question: 'How often do you use heat styling tools or chemical treatments?',
    type: 'choice',
    options: [
      { value: 'never', label: 'Never', emoji: '🌿' },
      { value: 'rarely', label: 'Rarely (monthly)', emoji: '🌱' },
      { value: 'weekly', label: 'Weekly', emoji: '🔥' },
      { value: 'daily', label: 'Daily', emoji: '⚡' },
      { value: 'multiple_daily', label: 'Multiple times daily', emoji: '💥' }
    ],
    icon: <Sun className="w-6 h-6" />,
    category: 'Hair Care'
  },
  {
    id: 'family_history',
    question: 'Is there a family history of hair loss?',
    type: 'choice',
    options: [
      { value: 'none', label: 'No family history', emoji: '✅' },
      { value: 'maternal', label: 'Maternal side only', emoji: '👩' },
      { value: 'paternal', label: 'Paternal side only', emoji: '👨' },
      { value: 'both', label: 'Both sides', emoji: '👨‍👩‍👧‍👦' },
      { value: 'unknown', label: 'Unknown', emoji: '❓' }
    ],
    icon: <User className="w-6 h-6" />,
    category: 'Genetics'
  }
];

const testCategories = [
  { id: 'Mental Health', title: 'Mental Health & Stress', emoji: '🧠', color: 'bg-purple-100 text-purple-800' },
  { id: 'Lifestyle', title: 'Lifestyle & Habits', emoji: '🌱', color: 'bg-green-100 text-green-800' },
  { id: 'Physical Symptoms', title: 'Physical Symptoms', emoji: '🔍', color: 'bg-blue-100 text-blue-800' },
  { id: 'Health Conditions', title: 'Health Conditions', emoji: '🏥', color: 'bg-red-100 text-red-800' },
  { id: 'Hair Care', title: 'Hair Care Practices', emoji: '💇‍♀️', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'Genetics', title: 'Family History', emoji: '🧬', color: 'bg-indigo-100 text-indigo-800' }
];

export default function HairFallAssessment() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<HairFallResponse>({});
  const [testLoading, setTestLoading] = useState(false);
  const [showCategory, setShowCategory] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (!user) return null;

  const question = hairFallQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / hairFallQuestions.length) * 100;
  const currentCategory = testCategories.find(cat => cat.id === question?.category);

  // Show category intro when moving to a new category
  useEffect(() => {
    if (currentQuestion > 0) {
      const prevQuestion = hairFallQuestions[currentQuestion - 1];
      if (prevQuestion?.category !== question?.category) {
        setShowCategory(true);
      }
    }
  }, [currentQuestion, question?.category]);

  const handleResponse = (value: any) => {
    const updatedResponses = {
      ...responses,
      [question.id]: value
    };
    setResponses(updatedResponses);
  };

  const handleNext = () => {
    if (currentQuestion < hairFallQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowCategory(false);
    } else {
      handleTestComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowCategory(false);
    }
  };

  const handleTestComplete = async () => {
    setTestLoading(true);
    try {
      // Save responses to database
      const response = await fetch('/api/test3/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          responses: responses,
          testType: 'hair_fall_assessment'
        }),
      });

      if (response.ok) {
        // Generate Ayurvedic analysis
        const analysis = generateAyurvedicAnalysis(responses);
        // Store analysis in session for display
        sessionStorage.setItem('hairFallAnalysis', JSON.stringify(analysis));
        router.push('/test4');
      } else {
        console.error('Failed to save hair fall assessment');
      }
    } catch (error) {
      console.error('Error saving hair fall assessment:', error);
    } finally {
      setTestLoading(false);
    }
  };

  const generateAyurvedicAnalysis = (responses: HairFallResponse) => {
    // Calculate dosha imbalances based on responses
    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;

    // Stress and anxiety increase Vata
    if (responses.stress_level >= 7) vataScore += 30;
    if (responses.anxiety_frequency === 'often' || responses.anxiety_frequency === 'constantly') vataScore += 25;

    // Sleep issues increase Vata
    if (responses.sleep_quality === 'poor' || responses.sleep_quality === 'terrible') vataScore += 20;

    // Diet affects all doshas
    if (responses.diet_quality === 'poor' || responses.diet_quality === 'terrible') {
      vataScore += 15;
      pittaScore += 10;
      kaphaScore += 5;
    }

    // Exercise affects Kapha
    if (responses.exercise_frequency === 'rarely') kaphaScore += 20;
    if (responses.exercise_frequency === 'daily') kaphaScore -= 10;

    // Hormonal issues increase Pitta
    if (responses.hormonal_issues?.includes('thyroid') || responses.hormonal_issues?.includes('pcos')) pittaScore += 25;

    // Scalp condition affects doshas
    if (responses.scalp_condition === 'oily') kaphaScore += 15;
    if (responses.scalp_condition === 'dry') vataScore += 15;
    if (responses.scalp_condition === 'itchy') pittaScore += 20;

    // Heat styling increases Pitta
    if (responses.hair_care_routine === 'daily' || responses.hair_care_routine === 'multiple_daily') pittaScore += 15;

    // Normalize scores
    const total = vataScore + pittaScore + kaphaScore;
    if (total > 0) {
      vataScore = Math.round((vataScore / total) * 100);
      pittaScore = Math.round((pittaScore / total) * 100);
      kaphaScore = Math.round((kaphaScore / total) * 100);
    }

    // Generate recommendations
    const recommendations = generateRecommendations(vataScore, pittaScore, kaphaScore);
    const dominantDosha = vataScore > pittaScore && vataScore > kaphaScore ? 'Vata' : 
                          pittaScore > kaphaScore ? 'Pitta' : 'Kapha';

    return {
      doshaAnalysis: { vata: vataScore, pitta: pittaScore, kapha: kaphaScore },
      dominantDosha,
      recommendations,
      riskLevel: calculateRiskLevel(responses),
      hairHealthScore: calculateHairHealthScore(responses)
    };
  };

  const generateRecommendations = (vata: number, pitta: number, kapha: number) => {
    const recommendations = [];

    if (vata > 40) {
      recommendations.push({
        category: 'Diet',
        title: 'Vata-Balancing Foods',
        items: [
          'Include warm, cooked foods',
          'Add healthy fats like ghee and sesame oil',
          'Eat regular meals at consistent times',
          'Include grounding foods like root vegetables'
        ]
      });
      recommendations.push({
        category: 'Lifestyle',
        title: 'Stress Management',
        items: [
          'Practice daily meditation or yoga',
          'Maintain regular sleep schedule',
          'Avoid excessive stimulation',
          'Try warm oil scalp massage'
        ]
      });
    }

    if (pitta > 40) {
      recommendations.push({
        category: 'Diet',
        title: 'Pitta-Cooling Foods',
        items: [
          'Include cooling foods like cucumber and coconut',
          'Avoid spicy and fried foods',
          'Drink plenty of water',
          'Include bitter greens in your diet'
        ]
      });
      recommendations.push({
        category: 'Hair Care',
        title: 'Gentle Hair Care',
        items: [
          'Use mild, natural shampoos',
          'Avoid heat styling tools',
          'Try cooling hair masks',
          'Protect hair from sun exposure'
        ]
      });
    }

    if (kapha > 40) {
      recommendations.push({
        category: 'Lifestyle',
        title: 'Energizing Activities',
        items: [
          'Engage in regular physical exercise',
          'Try invigorating scalp massage',
          'Maintain active lifestyle',
          'Include stimulating activities'
        ]
      });
      recommendations.push({
        category: 'Hair Care',
        title: 'Scalp Health',
        items: [
          'Use clarifying shampoos occasionally',
          'Try dry brushing the scalp',
          'Avoid heavy hair products',
          'Maintain good scalp hygiene'
        ]
      });
    }

    return recommendations;
  };

  const calculateRiskLevel = (responses: HairFallResponse) => {
    let riskScore = 0;
    
    if (responses.stress_level >= 8) riskScore += 3;
    if (responses.anxiety_frequency === 'constantly') riskScore += 3;
    if (responses.sleep_quality === 'terrible') riskScore += 2;
    if (responses.diet_quality === 'terrible') riskScore += 2;
    if (responses.exercise_frequency === 'rarely') riskScore += 1;
    if (responses.hormonal_issues?.length > 0) riskScore += 2;
    if (responses.hair_care_routine === 'multiple_daily') riskScore += 2;

    if (riskScore >= 8) return 'High';
    if (riskScore >= 5) return 'Medium';
    return 'Low';
  };

  const calculateHairHealthScore = (responses: HairFallResponse) => {
    let score = 100;
    
    if (responses.stress_level >= 7) score -= 15;
    if (responses.anxiety_frequency === 'often' || responses.anxiety_frequency === 'constantly') score -= 10;
    if (responses.sleep_quality === 'poor' || responses.sleep_quality === 'terrible') score -= 10;
    if (responses.diet_quality === 'poor' || responses.diet_quality === 'terrible') score -= 15;
    if (responses.exercise_frequency === 'rarely') score -= 5;
    if (responses.hormonal_issues?.length > 0) score -= 10;
    if (responses.scalp_condition !== 'healthy') score -= 10;
    if (responses.hair_care_routine === 'daily' || responses.hair_care_routine === 'multiple_daily') score -= 10;

    return Math.max(0, score);
  };

  const isAnswered = responses[question?.id] !== undefined && responses[question?.id] !== '';
  const canProceed = question?.required !== false ? isAnswered : true;

  // Category Introduction Screen
  if (showCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-primary/10 rounded-full p-6">
                  <span className="text-6xl">💇‍♀️</span>
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-foreground font-[family-name:var(--font-playfair)] mb-2">
                  {currentCategory?.title}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Understanding your {currentCategory?.title.toLowerCase()} helps us provide personalized Ayurvedic recommendations for hair health.
                </CardDescription>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <Progress value={progress} className="flex-1 max-w-md" />
                <span className="text-sm text-muted-foreground font-medium">
                  {currentQuestion + 1} of {hairFallQuestions.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => setShowCategory(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Question Screen
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Leaf className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground font-[family-name:var(--font-playfair)]">
                  Hair Fall Assessment
                </h1>
                <p className="text-sm text-muted-foreground">
                  {currentCategory?.title}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {currentQuestion + 1} / {hairFallQuestions.length}
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      {/* Question Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 rounded-full p-4">
                {question.icon}
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground font-[family-name:var(--font-playfair)] mb-2">
                {question.question}
              </CardTitle>
              <Badge className={currentCategory?.color}>
                {currentCategory?.emoji} {currentCategory?.title}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Question Input Based on Type */}
            {question.type === 'choice' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options?.map((option) => (
                  <Button
                    key={option.value}
                    variant={responses[question.id] === option.value ? "default" : "outline"}
                    className="h-auto p-4 text-left justify-start space-x-3"
                    onClick={() => handleResponse(option.value)}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <div>
                      <div className="font-medium">{option.label}</div>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {question.type === 'multiple_choice' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {question.options?.map((option) => {
                  const isSelected = Array.isArray(responses[question.id]) 
                    ? responses[question.id].includes(option.value)
                    : responses[question.id] === option.value;
                  
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "outline"}
                      className="h-auto p-3 text-left justify-start space-x-2"
                      onClick={() => {
                        const currentValues = Array.isArray(responses[question.id]) 
                          ? responses[question.id] 
                          : [];
                        
                        if (option.value === 'none') {
                          handleResponse(['none']);
                        } else {
                          let newValues;
                          if (isSelected) {
                            newValues = currentValues.filter((v: string) => v !== option.value);
                          } else {
                            newValues = [...currentValues.filter((v: string) => v !== 'none'), option.value];
                          }
                          handleResponse(newValues);
                        }
                      }}
                    >
                      <span className="text-xl">{option.emoji}</span>
                      <span className="font-medium">{option.label}</span>
                      {isSelected && <CheckCircle className="h-4 w-4 ml-auto" />}
                    </Button>
                  );
                })}
              </div>
            )}

            {question.type === 'scale' && (
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {responses[question.id] || question.min}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {question.labels?.[Math.floor(((responses[question.id] || question.min) - question.min) / (question.max - question.min) * (question.labels.length - 1))]}
                  </div>
                </div>
                <Slider
                  value={[responses[question.id] || question.min]}
                  onValueChange={([value]) => handleResponse(value)}
                  min={question.min}
                  max={question.max}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{question.min}</span>
                  <span>{question.max}</span>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed || testLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2"
              >
                <span>
                  {currentQuestion === hairFallQuestions.length - 1 
                    ? (testLoading ? 'Analyzing...' : 'Complete Assessment') 
                    : 'Next'
                  }
                </span>
                {currentQuestion < hairFallQuestions.length - 1 && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>

            {/* Required Field Notice */}
            {question.required !== false && !isAnswered && (
              <div className="text-center text-sm text-muted-foreground">
                Please select an option to continue
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
