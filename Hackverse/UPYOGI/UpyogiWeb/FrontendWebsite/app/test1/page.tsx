'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
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
    coughAudio: null as string | null,
  });

  // Speech recognition + timers
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const noResponseTimerRef = useRef<any>(null);

  // Init speech recognition once on client
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn('SpeechRecognition not supported in this browser');
      return;
    }
    const recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
  }, []);

  // Script with placeholders for name (for UI text)
  const assessmentScript = useMemo(
    () => [
      {
        text:
          'Namaste! I am Rushi, your Ayurvedic Rishi guide. Welcome to our comprehensive health assessment. Let us begin your wellness journey with a detailed evaluation.',
        action: 'greeting',
        delay: 3000,
      },
      {
        text: 'Please tell me your name.',
        action: 'askName',
        delay: 2000,
      },
      {
        text: 'Ok {{name}}! Can you tell me your age?',
        action: 'askAge',
        delay: 2000,
      },
      {
        text:
          'Thank you {{name}}! Now, please tell me your gender - are you male, female, or other?',
        action: 'askGender',
        delay: 2000,
      },
      {
        text: 'Ok {{name}}, now please tell me your height in centimeters.',
        action: 'askHeight',
        delay: 2000,
      },
      {
        text: 'Perfect {{name}}! Now please tell me your weight in kilograms.',
        action: 'askWeight',
        delay: 2000,
      },
      {
        text:
          'Ok {{name}}, now please tell me about any symptoms you are experiencing. You can say things like headache, cough, fatigue, or any other symptoms.',
        action: 'askSymptoms',
        delay: 2000,
      },
      {
        text:
          'Thank you {{name}}! On a scale of 1 to 5, what is your current stress level? Please say a number from 1 to 5.',
        action: 'askStress',
        delay: 2000,
      },
      {
        text:
          'Thank you for providing all the information {{name}}. Now I need to capture some images for our assessment. First, please prepare to show your tongue clearly. You will be redirected to the tongue assessment page.',
        action: 'redirectTongue',
        delay: 3000,
      },
    ],
    []
  );

  // Replace {{name}} with actual user name (for UI bubble)
  const replacePlaceholders = (text: string) => {
    return text.replace(/{{name}}/g, userData.name || 'there');
  };

  // 🔊 What the voice actually speaks (AUDIO)
  const getSpokenText = (action: string, defaultText: string) => {
    const namePart = userData.name ? userData.name : 'there';

    switch (action) {
      case 'askName':
        return 'Please tell me your name.';

      case 'askAge':
        return `Ok ${namePart}! Can you tell me your age?`;

      case 'askGender':
        return `Thank you ${namePart}! Now, please tell me your gender. Are you male, female, or other?`;

      case 'askHeight':
        return `Ok ${namePart}, now please tell me your height in centimeters.`;

      case 'askWeight':
        return `Perfect ${namePart}! Now please tell me your weight in kilograms.`;

      case 'askSymptoms':
        return `Ok ${namePart}, now please tell me about any symptoms you are experiencing. You can say things like headache, cough, fatigue, or any other symptoms.`;

      case 'askStress':
        return `Thank you ${namePart}! On a scale of 1 to 5, what is your current stress level? Please say a number from 1 to 5.`;

      default:
        // For greeting and redirectTongue
        return replacePlaceholders(defaultText);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // ---------- VALIDATION HELPERS (UPDATED RULES) ----------

  const validateAnswer = (action: string, transcript: string) => {
    const text = transcript.trim();

    if (!text) return { valid: false };

    switch (action) {
      case 'askName': {
        // Only alphabets + spaces, at least 2 letters
        const alpha = /^[A-Za-z\s]+$/.test(text);
        const onlySpaces = text.replace(/\s+/g, '').length < 2;
        return { valid: alpha && !onlySpaces, value: text };
      }

      case 'askAge': {
        // Age between 1 and 100
        const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
        return {
          valid: !isNaN(num) && num >= 1 && num <= 100,
          value: String(num),
        };
      }

      case 'askGender': {
        const lower = text.toLowerCase();
        if (lower.includes('male')) return { valid: true, value: 'Male' };
        if (lower.includes('female')) return { valid: true, value: 'Female' };
        if (lower.includes('other')) return { valid: true, value: 'Other' };
        return { valid: false };
      }

      case 'askHeight': {
        // Height in cm, 30–305 (approx up to 10 ft)
        const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
        return {
          valid: !isNaN(num) && num >= 30 && num <= 305,
          value: String(num),
        };
      }

      case 'askWeight': {
        // Weight in kg, 1–500
        const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
        return {
          valid: !isNaN(num) && num >= 1 && num <= 500,
          value: String(num),
        };
      }

      case 'askSymptoms': {
        // Free text, non-empty, split to array
        return {
          valid: text.length > 1,
          value: text
            .split(/,| and /i)
            .map(s => s.trim())
            .filter(Boolean),
        };
      }

      case 'askStress': {
        // 1–5 only
        const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
        return {
          valid: !isNaN(num) && num >= 1 && num <= 5,
          value: num,
        };
      }

      default:
        return { valid: true, value: text };
    }
  };

  const getNoInputMessage = (action: string) => {
    switch (action) {
      case 'askName':
        return 'Sorry, can you please tell your name?';
      case 'askAge':
        return 'Sorry, can you please tell your age?';
      case 'askGender':
        return 'Sorry, can you please tell your gender?';
      case 'askHeight':
        return 'Sorry, can you please tell your height in centimeters?';
      case 'askWeight':
        return 'Sorry, can you please tell your weight in kilograms?';
      case 'askSymptoms':
        return 'Sorry, can you please tell your symptoms?';
      case 'askStress':
        return 'Sorry, can you please tell your stress level from 1 to 5?';
      default:
        return 'Sorry, could you please repeat?';
    }
  };

  const getInvalidMessage = (action: string) => {
    switch (action) {
      case 'askName':
        return 'This does not seem like a valid name. Please say your name clearly using only letters.';
      case 'askAge':
        return 'This does not seem like a valid age. Please say a valid age between 1 and 100.';
      case 'askGender':
        return 'This does not seem like a valid gender. Please say male, female, or other.';
      case 'askHeight':
        return 'This does not seem like a valid height. Please say a valid height in centimeters, up to 10 feet.';
      case 'askWeight':
        return 'This does not seem like a valid weight. Please say a valid weight in kilograms, up to 500 kilograms.';
      case 'askSymptoms':
        return 'This does not seem like valid symptoms. Please describe your symptoms clearly.';
      case 'askStress':
        return 'This does not seem like a valid stress level. Please say a number from 1 to 5.';
      default:
        return 'This does not seem valid. Please try again.';
    }
  };

  // ---------- SPEECH SYNTHESIS ----------

  const speakText = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === 'undefined' || !(window as any).speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    const synth = (window as any).speechSynthesis;
    synth.cancel();

    const utterance = new (window as any).SpeechSynthesisUtterance(text);
    utterance.rate = 0.6;
    utterance.pitch = 0.8;
    utterance.volume = 0.9;
    utterance.lang = 'en-IN';

    const voices = synth.getVoices();
    const indianVoice = voices.find(
      (voice: any) =>
        voice.name.includes('India') ||
        voice.name.includes('Hindi') ||
        voice.name.includes('Ravi') ||
        voice.name.includes('Priya') ||
        voice.lang.includes('IN')
    );
    if (indianVoice) {
      utterance.voice = indianVoice;
    } else {
      const fallbackVoice = voices.find(
        (voice: any) =>
          voice.name.includes('Google') ||
          voice.name.includes('Microsoft') ||
          voice.name.includes('Natural')
      );
      if (fallbackVoice) {
        utterance.voice = fallbackVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd && onEnd();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      onEnd && onEnd();
    };

    synth.speak(utterance);
  }, []);

  // ---------- FLOW CONTROL ----------

  const proceedToNextStep = useCallback(() => {
    const currentScript = assessmentScript[currentStep];

    if (currentScript.action === 'redirectTongue') {
      setIsPlaying(false);

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
        skinAnalysis: null,
      };

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'assessmentData',
          JSON.stringify(assessmentData)
        );
      }

      router.push('/test2');
      return;
    }

    if (currentStep < assessmentScript.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStep, assessmentScript, router, userData]);

  // ---------- LISTENING WITH 7s TIMER ----------

  const startListeningForQuestion = useCallback(
    (action: string) => {
      const recognition = recognitionRef.current;
      if (!recognition) {
        console.warn('Recognition not available, skipping to next step');
        proceedToNextStep();
        return;
      }

      if (isListeningRef.current) {
        try {
          recognition.stop();
        } catch {}
      }

      const noInputMessage = getNoInputMessage(action);
      const invalidMessage = getInvalidMessage(action);

      isListeningRef.current = true;

      // Clear old timer
      if (noResponseTimerRef.current) {
        clearTimeout(noResponseTimerRef.current);
      }

      // Start 7-second "no response" timer
      noResponseTimerRef.current = setTimeout(() => {
        if (isListeningRef.current) {
          try {
            recognition.stop();
          } catch {}
          isListeningRef.current = false;

          speakText(noInputMessage, () => {
            startListeningForQuestion(action);
          });
        }
      }, 7000);

      recognition.onresult = (event: any) => {
        isListeningRef.current = false;
        if (noResponseTimerRef.current) {
          clearTimeout(noResponseTimerRef.current);
        }

        const transcript = event.results[0][0].transcript;
        const { valid, value } = validateAnswer(action, transcript);

        if (!valid) {
          speakText(invalidMessage, () => {
            startListeningForQuestion(action);
          });
          return;
        }

        // Save parsed value into userData
        setUserData(prev => {
          const updated: any = { ...prev };

          switch (action) {
            case 'askName':
              updated.name = String(value);
              break;
            case 'askAge':
              updated.age = String(value);
              break;
            case 'askGender':
              updated.gender = String(value);
              break;
            case 'askHeight':
              updated.height = String(value);
              break;
            case 'askWeight':
              updated.weight = String(value);
              break;
            case 'askSymptoms':
              updated.symptoms = Array.isArray(value)
                ? (value as string[])
                : [String(value)];
              break;
            case 'askStress':
              updated.stressLevel = Number(value);
              break;
          }

          return updated;
        });

        proceedToNextStep();
      };

      recognition.onerror = (event: any) => {
        console.error('Recognition error:', event.error);
        isListeningRef.current = false;
        if (noResponseTimerRef.current) {
          clearTimeout(noResponseTimerRef.current);
        }

        if (event.error === 'no-speech' || event.error === 'audio-capture') {
          speakText(noInputMessage, () => {
            startListeningForQuestion(action);
          });
        } else {
          speakText('I did not catch that. Could you please repeat?', () => {
            startListeningForQuestion(action);
          });
        }
      };

      try {
        recognition.start();
      } catch (e) {
        console.error('Error starting recognition:', e);
      }
    },
    [proceedToNextStep, speakText]
  );

  // ---------- START / STOP / RESTART ----------

  const startDemo = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      if (typeof window !== 'undefined' && (window as any).speechSynthesis) {
        const synth = (window as any).speechSynthesis;
        const testUtterance = new (window as any).SpeechSynthesisUtterance(
          'Voice test'
        );
        testUtterance.rate = 0.7;
        testUtterance.volume = 0.9;
        synth.speak(testUtterance);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setUserData({
        name: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
        symptoms: [],
        stressLevel: 0,
        tongueImage: null,
        hairImage: null,
        faceImage: null,
        breathingAudio: null,
        coughAudio: null,
      });

      setCurrentStep(0);
      setIsPlaying(true);
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
    if (typeof window !== 'undefined' && (window as any).speechSynthesis) {
      (window as any).speechSynthesis.cancel();
    }
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (noResponseTimerRef.current) {
      clearTimeout(noResponseTimerRef.current);
    }
    if (isSpeaking) setIsSpeaking(false);
  }, [isSpeaking]);

  const restartDemo = useCallback(() => {
    stopDemo();
    setTimeout(() => startDemo(), 500);
  }, [stopDemo, startDemo]);

  const handleNext = useCallback(() => {
    if (currentStep < assessmentScript.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsPlaying(false);
      router.push('/test2');
    }
  }, [currentStep, router, assessmentScript.length]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, []);

  // ---------- MAIN SPEECH EFFECT ----------

  useEffect(() => {
    if (!isPlaying || currentStep >= assessmentScript.length) return;

    const script = assessmentScript[currentStep];
    const isQuestionAction = script.action.startsWith('ask');

    // 🎯 UI text (bubble)
    const uiText = replacePlaceholders(script.text); // (kept if you want to use uiText)

    // 🎯 Audio text (forced correct by action)
    const spoken = getSpokenText(script.action, script.text);

    speakText(spoken, () => {
      if (!isPlaying) return;
      if (isQuestionAction) {
        startListeningForQuestion(script.action);
      } else {
        setTimeout(() => {
          if (isPlaying) proceedToNextStep();
        }, script.delay);
      }
    });
  }, [
    currentStep,
    isPlaying,
    assessmentScript,
    speakText,
    startListeningForQuestion,
    proceedToNextStep,
    userData.name,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: any) => {
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

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isPlaying, startDemo, stopDemo, handleNext, handlePrevious]);

  if (!user) return null;

  const currentScript = assessmentScript[currentStep] || assessmentScript[0];
  const isComplete = currentStep >= assessmentScript.length - 1 && !isPlaying;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 relative overflow-hidden">
      {/* Background visuals */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 opacity-10">
          <div className="w-full h-full border-4 border-amber-300 rounded-full animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-amber-200 rounded-full animate-reverse-spin"></div>
        </div>

        <div className="absolute bottom-20 right-20 w-48 h-48 opacity-15">
          <div className="w-full h-full border-4 border-green-300 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-green-200 rounded-full animate-bounce"></div>
        </div>

        <div className="absolute top-32 left-1/4 animate-float">
          <div className="w-12 h-12 bg-pink-300 rounded-full opacity-30 blur-sm"></div>
        </div>
        <div className="absolute bottom-40 right-1/3 animate-float-delayed">
          <div className="w-8 h-8 bg-yellow-300 rounded-full opacity-40 blur-sm"></div>
        </div>
        <div className="absolute top-1/2 right-1/4 animate-float-slow">
          <div className="w-6 h-6 bg-orange-300 rounded-full opacity-35 blur-sm"></div>
        </div>

        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-20 animate-wave"></div>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-15 animate-wave-delayed"></div>
          <div className="absolute top-3/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-25 animate-wave-slow"></div>
        </div>

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
              🕉 Ayurved Vava Dhanvantari
            </h1>
            <p className="text-xl text-emerald-200 mb-6">
              Comprehensive Health Assessment
            </p>
            <div className="text-sm text-amber-300">
              <p>💡 Press Space to begin your assessment journey</p>
            </div>
          </div>

          {/* Main card */}
          <div className="bg-black/20 backdrop-blur-lg rounded-3xl p-8 border border-amber-400/30 shadow-2xl">
            {/* Avatar */}
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
                  {isSpeaking && (
                    <div className="absolute inset-0 bg-amber-500/30 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>

              {isSpeaking && (
                <>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 border-2 border-amber-400 rounded-full animate-ping opacity-30"></div>
                    <div className="absolute w-24 h-24 border border-amber-300 rounded-full animate-ping delay-150 opacity-20"></div>
                    <div className="absolute w-28 h-28 border border-amber-200 rounded-full animate-ping delay-300 opacity-10"></div>
                  </div>
                </>
              )}
            </div>

            {/* Speech bubble */}
            <div className="bg-amber-100/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-amber-400/30">
              <p className="text-amber-100 leading-relaxed text-lg italic">
                &ldquo;{replacePlaceholders(currentScript.text)}&rdquo;
              </p>
            </div>

            {/* Progress */}
            <div className="flex justify-center items-center space-x-4 mb-6">
              <span className="text-sm text-amber-300">
                Step {currentStep + 1} of {assessmentScript.length}
              </span>
              <div className="w-48 h-3 bg-amber-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500 rounded-full"
                  style={{
                    width: `${((currentStep + 1) / assessmentScript.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isPlaying ? (
                <button
                  onClick={startDemo}
                  disabled={isLoading}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl hover:from-amber-600 hover:to-orange-600 font-semibold text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                >
                  {isLoading ? (
                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
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

            {/* Debug */}
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).speechSynthesis) {
                    const synth = (window as any).speechSynthesis;
                    const utterance = new (window as any).SpeechSynthesisUtterance(
                      'Hello, this is a test of the voice system.'
                    );
                    utterance.rate = 0.7;
                    utterance.volume = 0.9;
                    synth.speak(utterance);
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                Test Voice
              </button>
              <button
                onClick={() =>
                  console.log('Current state:', {
                    isPlaying,
                    currentStep,
                    isSpeaking,
                    userData,
                  })
                }
                className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
              >
                Debug State
              </button>
            </div>

            {/* Error */}
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

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes wave-delayed {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes wave-slow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes reverse-spin {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-wave {
          animation: wave 4s linear infinite;
        }
        .animate-wave-delayed {
          animation: wave-delayed 6s linear infinite;
        }
        .animate-wave-slow {
          animation: wave-slow 8s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AyurvedicAssessment;
