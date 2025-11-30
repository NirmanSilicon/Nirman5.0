'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Leaf, 
  Camera, 
  RotateCcw, 
  CheckCircle, 
  Upload,
  Eye,
  Lightbulb,
  ArrowRight,
  Info,
  ArrowLeft
} from 'lucide-react';

export default function HairAssessment() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<'instructions' | 'camera' | 'capture' | 'confirm' | 'processing'>('instructions');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Voice function
  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      utterance.lang = 'en-US';
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Natural') ||
        voice.name.includes('English')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Welcome voice on page load
  useEffect(() => {
    if (user && step === 'instructions') {
      setTimeout(() => {
        speakText("Welcome to the hair assessment. Please follow the instructions to capture a clear image of your hair and scalp for analysis.");
      }, 1000);
    }
  }, [user, step, speakText]);

  useEffect(() => {
    return () => {
      // Cleanup camera stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  if (!user) return null;

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setStep('camera');
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions or try uploading an image instead.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        setStep('confirm');
        
        // Stop camera stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setStep('camera');
    startCamera();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCapturedImage(e.target?.result as string);
          setStep('confirm');
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please select a valid image file.');
      }
    }
  };

  const processImage = async () => {
    if (!capturedImage) return;
    
    setLoading(true);
    setStep('processing');
    
    // Update assessment data with hair image
    const existingData = localStorage.getItem('assessmentData');
    if (existingData) {
      const assessmentData = JSON.parse(existingData);
      assessmentData.hairImage = capturedImage;
      localStorage.setItem('assessmentData', JSON.stringify(assessmentData));
    }
    
    // Voice guidance during processing
    speakText("Hair image captured successfully. Now I will redirect you to the face assessment page. Please prepare to show your face clearly for analysis.");
    
    // Wait for voice to finish before redirecting
    setTimeout(() => {
      router.push('/face-assessment');
    }, 3000);
    
    setLoading(false);
  };

  const hairAnalysisInstructions = [
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Good Lighting",
      description: "Ensure you're in a well-lit area, preferably with natural light"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Clear View",
      description: "Position your hair clearly in the frame, showing scalp and hair texture"
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Close Distance",
      description: "Position your head 12-18 inches from the camera"
    }
  ];

  // Instructions Screen
  if (step === 'instructions') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 opacity-10">
            <div className="w-full h-full border-4 border-amber-300 rounded-full animate-spin-slow"></div>
          </div>
          <div className="absolute bottom-20 right-20 w-48 h-48 opacity-15">
            <div className="w-full h-full border-4 border-green-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-screen">
          <div className="max-w-4xl mx-auto">
            <header className="bg-card/20 backdrop-blur-sm border border-amber-400/30 shadow-sm rounded-2xl mb-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center space-x-4">
                    <Leaf className="h-8 w-8 text-amber-400" />
                    <div>
                      <h1 className="text-xl font-bold text-amber-200 font-[family-name:var(--font-playfair)]">
                        Hair Analysis
                      </h1>
                      <p className="text-sm text-emerald-300">
                        Scalp & Hair Health Assessment
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm bg-amber-500/20 text-amber-200">
                    Step 2 of 4
                  </Badge>
                </div>
              </div>
            </header>

            <Card className="bg-black/20 backdrop-blur-lg border border-amber-400/30 shadow-2xl">
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-amber-500/20 rounded-full p-6">
                    <span className="text-6xl">💇‍♀️</span>
                  </div>
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold text-amber-200 font-[family-name:var(--font-playfair)] mb-2">
                    AI-Powered Hair Analysis
                  </CardTitle>
                  <CardDescription className="text-lg text-emerald-200 max-w-2xl mx-auto">
                    In Ayurveda, hair health reflects your overall well-being and dosha balance. 
                    Our AI will analyze your hair and scalp to provide personalized health recommendations.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                <Alert className="bg-amber-500/10 border-amber-400/30">
                  <Info className="h-4 w-4 text-amber-300" />
                  <AlertDescription className="text-amber-200">
                    This analysis is for educational purposes and should not replace professional medical advice.
                    For serious health concerns, please consult with a qualified healthcare provider.
                  </AlertDescription>
                </Alert>

                <div>
                  <h3 className="text-xl font-semibold text-amber-200 mb-6 text-center">
                    For Best Results, Please Follow These Tips:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {hairAnalysisInstructions.map((instruction, index) => (
                      <div key={index} className="text-center space-y-3">
                        <div className="flex justify-center">
                          <div className="bg-amber-500/20 rounded-full p-3 text-amber-400">
                            {instruction.icon}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-amber-200 mb-1">{instruction.title}</h4>
                          <p className="text-sm text-emerald-300">{instruction.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={startCamera}
                    className="bg-amber-500 hover:bg-amber-600 text-white flex items-center space-x-2"
                    size="lg"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Use Camera</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 border-amber-400 text-amber-200 hover:bg-amber-500/20"
                    size="lg"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload Image</span>
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload hair image for analysis"
                  title="Upload hair image for analysis"
                />

                {error && (
                  <Alert className="bg-red-500/20 border-red-400/30">
                    <AlertDescription className="text-red-200">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/test1')}
                    className="flex items-center space-x-2 border-amber-400 text-amber-200 hover:bg-amber-500/20"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Assessment</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Camera Screen
  if (step === 'camera') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-black/20 backdrop-blur-lg border border-amber-400/30 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-amber-200 font-[family-name:var(--font-playfair)]">
              Position Your Hair
            </CardTitle>
            <CardDescription className="text-emerald-200">
              Show your hair and scalp clearly in the frame
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto max-h-96 object-cover"
              />
              <div className="absolute inset-0 border-4 border-amber-400/30 rounded-lg pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-amber-400 rounded-lg">
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-amber-400"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-amber-400"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-amber-400"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-amber-400"></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                  }
                  setStep('instructions');
                }}
                className="border-amber-400 text-amber-200 hover:bg-amber-500/20"
              >
                Cancel
              </Button>
              <Button
                onClick={capturePhoto}
                className="bg-amber-500 hover:bg-amber-600 text-white flex items-center space-x-2"
              >
                <Camera className="h-4 w-4" />
                <span>Capture</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  // Confirm Screen
  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-black/20 backdrop-blur-lg border border-amber-400/30 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-amber-200 font-[family-name:var(--font-playfair)]">
              Review Your Image
            </CardTitle>
            <CardDescription className="text-emerald-200">
              Is this image clear and well-lit? We'll analyze it for hair health insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {capturedImage && (
              <div className="rounded-lg overflow-hidden bg-black">
                <img
                  src={capturedImage}
                  alt="Captured hair"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={retakePhoto}
                className="flex items-center space-x-2 border-amber-400 text-amber-200 hover:bg-amber-500/20"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retake</span>
              </Button>
              <Button
                onClick={processImage}
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-white flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span>{loading ? 'Processing...' : 'Analyze Image'}</span>
              </Button>
            </div>
            
            {error && (
              <Alert className="bg-red-500/20 border-red-400/30">
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Processing Screen
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-black/20 backdrop-blur-lg border border-amber-400/30 shadow-2xl">
          <CardContent className="text-center py-12 space-y-6">
            <div className="flex justify-center">
              <div className="bg-amber-500/20 rounded-full p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent"></div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-amber-200 mb-2">
                Analyzing Your Hair...
              </h3>
              <p className="text-emerald-200">
                Our AI is examining the texture, density, and scalp condition to provide personalized insights.
              </p>
            </div>
            <div className="space-y-2 text-sm text-emerald-300">
              <div>🔍 Analyzing hair texture and density...</div>
              <div>📊 Evaluating scalp condition...</div>
              <div>🧠 Generating health insights...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
