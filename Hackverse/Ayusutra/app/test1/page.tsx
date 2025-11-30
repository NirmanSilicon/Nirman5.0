'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Play, Pause } from 'lucide-react';
import Image from 'next/image';

const AyurvedicAssessment = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    symptoms: [] as string[],
    stressLevel: 0,
    tongueImage: null as string | null,
    hairImage: null as string | null,
    faceImage: null as string | null,
    breathingAudio: null as string | null,
    coughAudio: null as string | null
  });

  // Pre-fed demo values
  const demoData = useMemo(() => ({
    name: 'Sradha',
    age: '22',
    gender: 'Female',
    height: '165',
    weight: '55',
    symptoms: ['Cough', 'Breathlessness'],
    stressLevel: 3,
    tongueImage: 'tongue_demo.jpg',
    breathingAudio: 'breath_demo.wav',
    coughAudio: 'cough_demo.wav'
  }), []);

  
  const assessmentScript = useMemo(() => [
    {
      text: "Namaste! I am Rushi, your Ayurvedic Rishi guide. Welcome to our comprehensive health assessment. Let us begin your wellness journey with a detailed evaluation.",
      action: "greeting",
      delay: 3000
    },
    {
      text: "Please tell me your name.",
      action: "askName",
      delay: 2000
    },
    {
      text: "Ok Sradha! Can you tell me your age?",
      action: "askAge",
      delay: 2000
    },
    {
      text: "Thank you Sradha! Now, please tell me your gender - are you male, female, or other?",
      action: "askGender",
      delay: 2000
    },
    {
      text: "Ok Sradha, now please tell me your height in centimeters.",
      action: "askHeight",
      delay: 2000
    },
    {
      text: "Perfect Sradha! Now please tell me your weight in kilograms.",
      action: "askWeight",
      delay: 2000
    },
    {
      text: "Ok Sradha, now please tell me about any symptoms you're experiencing. You can say things like headache, cough, fatigue, or any other symptoms.",
      action: "askSymptoms",
      delay: 2000
    },
    {
      text: "Thank you Sradha! On a scale of 1 to 5, what is your current stress level? Please say a number from 1 to 5.",
      action: "askStress",
      delay: 2000
    },
    {
      text: "Thank you for providing all the information Sradha. Now I need to capture some images for our assessment. First, please prepare to show your tongue clearly. You will be redirected to the tongue assessment page.",
      action: "redirectTongue",
      delay: 3000
    }
  ], []);


  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);


  const proceedToNextStep = useCallback(() => {
    const currentScript = assessmentScript[currentStep];
    
    // Execute the action immediately
    switch (currentScript.action) {
      case 'askName':
        setUserData(prev => ({ ...prev, name: demoData.name }));
        break;
      case 'askAge':
        setUserData(prev => ({ ...prev, age: demoData.age }));
        break;
      case 'askGender':
        setUserData(prev => ({ ...prev, gender: demoData.gender }));
        break;
      case 'askHeight':
        setUserData(prev => ({ ...prev, height: demoData.height }));
        break;
      case 'askWeight':
        setUserData(prev => ({ ...prev, weight: demoData.weight }));
        break;
      case 'askSymptoms':
        setUserData(prev => ({ ...prev, symptoms: demoData.symptoms }));
        break;
      case 'askStress':
        setUserData(prev => ({ ...prev, stressLevel: demoData.stressLevel }));
        break;
      case 'redirectTongue':
        // Save current data and redirect to tongue assessment
        setIsPlaying(false);
        
        // Save assessment data to localStorage 
        const assessmentData = {
          name: userData.name,
          age: userData.age,
          gender: userData.gender,
          height: userData.height,
          weight: userData.weight,
          symptoms: userData.symptoms,
          stressLevel: userData.stressLevel,
          tongueImage: null,
          hairImage: null,
          faceImage: null,
          skinAnalysis: null
        };
        
        localStorage.setItem('assessmentData', JSON.stringify(assessmentData));
        
        router.push('/test2');
        return;
    }

    // Wait for the delay before moving to next step
    setTimeout(() => {
      if (currentStep < assessmentScript.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsPlaying(false);
      }
    }, currentScript.delay);
  }, [currentStep, assessmentScript, demoData, router]);

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.6; // Slower for Indian accent
      utterance.pitch = 0.8; // Lower pitch
      utterance.volume = 0.9;
      utterance.lang = 'en-IN'; // Indian English
      
      const voices = window.speechSynthesis.getVoices();
      // Look for Indian voices first
      const indianVoice = voices.find(voice => 
        voice.name.includes('India') || 
        voice.name.includes('Hindi') ||
        voice.name.includes('Ravi') ||
        voice.name.includes('Priya') ||
        voice.lang.includes('IN')
      );
      
      if (indianVoice) {
        utterance.voice = indianVoice;
        console.log('Using Indian voice:', indianVoice.name);
      } else {
        // Fallback to any available voice
        const fallbackVoice = voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Microsoft') ||
          voice.name.includes('Natural')
        );
        if (fallbackVoice) {
          utterance.voice = fallbackVoice;
        }
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const startDemo = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Test voice first
      if ('speechSynthesis' in window) {
        const testUtterance = new SpeechSynthesisUtterance("Voice test");
        testUtterance.rate = 0.7;
        testUtterance.volume = 0.9;
        window.speechSynthesis.speak(testUtterance);
        
        // Wait a moment for test
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    setIsPlaying(true);
    setCurrentStep(0);
    setUserData({
      name: '', age: '', gender: '', height: '', weight: '',
      symptoms: [], stressLevel: 0, tongueImage: null,
        hairImage: null, faceImage: null, breathingAudio: null, coughAudio: null
      });
      
      console.log('Demo started, current step:', 0);
    } catch (err) {
      console.error('Error starting demo:', err);
      setError('Failed to start voice demo. Please try again.');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopDemo = useCallback(() => {
    setIsPlaying(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const restartDemo = useCallback(() => {
    stopDemo();
    setTimeout(() => startDemo(), 500);
  }, [stopDemo, startDemo]);

  const handleNext = useCallback(() => {
    if (currentStep < assessmentScript.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the test and redirect to test2
      setIsPlaying(false);
      router.push('/test2');
    }
  }, [currentStep, router, assessmentScript]);


  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  useEffect(() => {
    console.log('useEffect triggered - isPlaying:', isPlaying, 'currentStep:', currentStep, 'scriptLength:', assessmentScript.length);
    
    if (isPlaying && currentStep < assessmentScript.length) {
      console.log('About to speak text:', assessmentScript[currentStep].text);
      
      // Direct speech without extra delays
      const text = assessmentScript[currentStep].text;
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.6; // Slower for Indian accent
        utterance.pitch = 0.8; // Lower pitch
        utterance.volume = 0.9;
        utterance.lang = 'en-IN'; // Indian English
        
        const voices = window.speechSynthesis.getVoices();
        // Look for Indian voices first
        const indianVoice = voices.find(voice => 
          voice.name.includes('India') || 
          voice.name.includes('Hindi') ||
          voice.name.includes('Ravi') ||
          voice.name.includes('Priya') ||
          voice.lang.includes('IN')
        );
        
        if (indianVoice) {
          utterance.voice = indianVoice;
          console.log('Using Indian voice:', indianVoice.name);
        } else {
          // Fallback to any available voice
          const fallbackVoice = voices.find(voice => 
            voice.name.includes('Google') || 
            voice.name.includes('Microsoft') ||
            voice.name.includes('Natural')
          );
          if (fallbackVoice) {
            utterance.voice = fallbackVoice;
          }
        }
        
        utterance.onstart = () => {
          setIsSpeaking(true);
          console.log('Speech started:', text);
        };
        
        utterance.onend = () => {
          setIsSpeaking(false);
          console.log('Speech ended');
          if (isPlaying) {
            proceedToNextStep();
          }
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsSpeaking(false);
          if (isPlaying) {
            proceedToNextStep();
          }
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        console.warn('Speech synthesis not supported');
        setTimeout(() => {
          setIsSpeaking(false);
          if (isPlaying) {
            proceedToNextStep();
          }
        }, text.length * 50);
      }
    }
  }, [currentStep, isPlaying, assessmentScript, proceedToNextStep]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ' && !isPlaying) {
        event.preventDefault();
        startDemo();
      } else if (event.key === 'Escape' && isPlaying) {
        event.preventDefault();
        stopDemo();
      } else if (event.key === 'ArrowRight' && !isPlaying) {
        event.preventDefault();
        handleNext();
      } else if (event.key === 'ArrowLeft' && !isPlaying) {
        event.preventDefault();
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, currentStep, startDemo, stopDemo, handleNext, handlePrevious]);

  if (!user) return null;

  const currentScript = assessmentScript[currentStep] || assessmentScript[0];
  const isComplete = currentStep >= assessmentScript.length - 1 && !isPlaying;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 relative overflow-hidden">
      {/* Ayurvedic 3D Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Mandala Patterns */}
        <div className="absolute top-20 left-20 w-64 h-64 opacity-10">
          <div className="w-full h-full border-4 border-amber-300 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-amber-200 rounded-full animate-reverse-spin"></div>
        </div>
        
        <div className="absolute bottom-20 right-20 w-48 h-48 opacity-15">
          <div className="w-full h-full border-4 border-green-300 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-green-200 rounded-full animate-bounce"></div>
      </div>

      {/* Floating Lotus Petals */}
        <div className="absolute top-32 left-1/4 animate-float">
          <div className="w-12 h-12 bg-pink-300 rounded-full opacity-30 blur-sm"></div>
        </div>
        <div className="absolute bottom-40 right-1/3 animate-float-delayed">
          <div className="w-8 h-8 bg-yellow-300 rounded-full opacity-40 blur-sm"></div>
        </div>
        <div className="absolute top-1/2 right-1/4 animate-float-slow">
          <div className="w-6 h-6 bg-orange-300 rounded-full opacity-35 blur-sm"></div>
        </div>

        {/* Energy Waves */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-20 animate-wave"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-15 animate-wave-delayed"></div>
          <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-25 animate-wave-slow"></div>
        </div>

        {/* Sacred Geometry */}
        <div className="absolute top-1/3 right-1/4 w-32 h-32 opacity-10">
          <div className="w-full h-full border-2 border-amber-400 transform rotate-45 animate-pulse"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 opacity-15">
          <div className="w-full h-full border-2 border-green-400 transform rotate-12 animate-pulse-delayed"></div>
      </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-amber-200 mb-4 font-serif drop-shadow-lg">
              🕉️ Ayurved Vava Dhanvantari
            </h1>
            <p className="text-xl text-emerald-200 mb-6">Comprehensive Health Assessment</p>
            <div className="text-sm text-amber-300">
              <p>💡 Press Space to begin your assessment journey</p>
            </div>
          </div>

          {/* Main Assessment Area */}
          <div className="bg-black/20 backdrop-blur-lg rounded-3xl p-8 border border-amber-400/30 shadow-2xl">
            
            {/* Rishi Avatar - Centered */}
            <div className="relative mx-auto mb-8">
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full flex items-center justify-center border-4 border-amber-400/50 shadow-2xl overflow-hidden backdrop-blur-sm">
                    <div className="relative w-full h-full">
                      <Image
                        src="/rishi.png"
                        alt="Rushi - Ayurvedic Rishi"
                        fill
                        className="object-cover rounded-full"
                        priority
                      />
                      {/* Speaking Animation Overlay */}
                      {isSpeaking && (
                    <div className="absolute inset-0 bg-amber-500/30 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Speaking Animation Dots */}
                  {isSpeaking && (
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  )}
              
              {/* Voice Wave Animation */}
              {isSpeaking && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 border-2 border-amber-400 rounded-full animate-ping opacity-30"></div>
                  <div className="absolute w-24 h-24 border border-amber-300 rounded-full animate-ping delay-150 opacity-20"></div>
                  <div className="absolute w-28 h-28 border border-amber-200 rounded-full animate-ping delay-300 opacity-10"></div>
                    </div>
                  )}
                </div>

                {/* Avatar Speech */}
            <div className="bg-amber-100/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-amber-400/30">
              <p className="text-amber-100 leading-relaxed text-lg italic">
                &ldquo;{currentScript.text}&rdquo;
              </p>
              
                </div>

                {/* Step Progress */}
            <div className="flex justify-center items-center space-x-4 mb-6">
              <span className="text-sm text-amber-300">Step {currentStep + 1} of {assessmentScript.length}</span>
              <div className="w-48 h-3 bg-amber-900/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500 rounded-full"
                  style={{ width: `${((currentStep + 1) / assessmentScript.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

            {/* Assessment Controls */}
            <div className="flex justify-center space-x-4">
                  {!isPlaying ? (
                    <button
                      onClick={startDemo}
                  disabled={isLoading}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl hover:from-amber-600 hover:to-orange-600 font-semibold text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Play size={20} />
                  )}
                  <span>{isLoading ? 'Starting...' : 'Begin Assessment'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopDemo}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 font-semibold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                  <Pause size={20} />
                  <span>Pause Assessment</span>
                    </button>
                  )}
                  
                  {(isPlaying || isComplete) && (
                    <button
                      onClick={restartDemo}
                  className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-2xl hover:from-teal-600 hover:to-emerald-600 font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      🔄 Restart
                    </button>
                  )}
                </div>

            {/* Debug Controls */}
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance("Hello, this is a test of the voice system.");
                    utterance.rate = 0.7;
                    utterance.volume = 0.9;
                    window.speechSynthesis.speak(utterance);
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                Test Voice
              </button>
              <button
                onClick={() => console.log('Current state:', { isPlaying, currentStep, isSpeaking, userData })}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
              >
                Debug State
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
                <p className="text-red-200 text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-red-300 hover:text-red-100 text-xs underline"
                >
                  Dismiss
                </button>
                    </div>
                  )}

          </div>

        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes wave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes wave-delayed {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes wave-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-wave { animation: wave 4s linear infinite; }
        .animate-wave-delayed { animation: wave-delayed 6s linear infinite; }
        .animate-wave-slow { animation: wave-slow 8s linear infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-reverse-spin { animation: reverse-spin 15s linear infinite; }
      `}</style>
    </div>
  );
};

export default AyurvedicAssessment;