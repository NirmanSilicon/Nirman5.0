import React, { useState, useEffect, useRef } from 'react';
import { Upload, Mic, MicOff, Play, Pause, User, Activity, Heart, Stethoscope } from 'lucide-react';

const PanchakarmaVoiceChatbot = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    symptoms: [],
    stressLevel: 0,
    tongueImage: null,
    breathingAudio: null,
    coughAudio: null
  });

  // Pre-fed demo values
  const demoData = {
    name: 'Tushar',
    age: '22',
    gender: 'Male',
    height: '175',
    weight: '70',
    symptoms: ['Cough', 'Breathlessness'],
    stressLevel: 3,
    tongueImage: 'tongue_demo.jpg',
    breathingAudio: 'breath_demo.wav',
    coughAudio: 'cough_demo.wav'
  };

  const symptoms = ['Cough', 'Breathlessness', 'Fatigue', 'Headache', 'Joint Pain', 'Digestive Issues'];
  
  const demoScript = [
    {
      text: "Namaste! I am Rushi, your Ayurvedic Rishi guide. Welcome to our Panchakarma patient management system. Let us begin your wellness journey.",
      action: "greeting",
      delay: 2000
    },
    {
      text: "Please provide your name to begin the assessment.",
      action: "fillName",
      delay: 1500
    },
    {
      text: "Thank you, Tushar! I have your name recorded. Now, please tell me your age.",
      action: "fillAge",
      delay: 2000
    },
    {
      text: "I have your age as 22. Excellent. Please select your gender from the options provided.",
      action: "fillGender",
      delay: 1000
    },
    {
      text: "Very good, Tushar. Now please enter your height in centimeters.",
      action: "fillHeight",
      delay: 2000
    },
    {
      text: "I have your height as 175 centimeters. Perfect. Please provide your weight in kilograms.",
      action: "fillWeight",
      delay: 2000
    },
    {
      text: "I have your weight as 70 kilograms. Now, please select your current symptoms from the list.",
      action: "fillSymptoms",
      delay: 3000
    },
    {
      text: "Thank you. On a scale of 1 to 5, what is your current stress level?",
      action: "fillStress",
      delay: 2000
    },
    {
      text: "I have recorded your stress level as 3. Now, please upload a clear image of your tongue for assessment.",
      action: "uploadTongue",
      delay: 0
    },
    {
      text: "Excellent tongue image received. Now please record your breathing pattern for 10 seconds.",
      action: "recordBreathing",
      delay: 0
    },
    {
      text: "Breathing pattern recorded successfully. If you wish, you may record a cough sample - this is optional.",
      action: "recordCough",
      delay: 0
    },
    {
      text: "Thank you, Tushar. I now have all the information needed for your preliminary assessment. Let me prepare your dosha analysis and therapy recommendations.",
      action: "processing",
      delay: 3000
    },
    {
      text: "Your preliminary Ayurvedic assessment is ready. Here are your dosha percentages and recommended therapies. Based on your assessment, I recommend consulting with our physician.",
      action: "showReport",
      delay: 2000
    },
    {
      text: "Your report has been sent successfully. The doctor status shows as Pending. Thank you for using our system, Tushar. May you find balance and wellness on your Ayurvedic journey.",
      action: "complete",
      delay: 3000
    }
  ];

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (isPlaying) {
          proceedToNextStep();
        }
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback if no speech synthesis
      setTimeout(() => {
        setIsSpeaking(false);
        if (isPlaying) {
          proceedToNextStep();
        }
      }, text.length * 50); // Approximate reading time
    }
  };

  const proceedToNextStep = () => {
    const currentScript = demoScript[currentStep];
    
    setTimeout(() => {
      // Execute the action
      switch (currentScript.action) {
        case 'fillName':
          setUserData(prev => ({ ...prev, name: demoData.name }));
          break;
        case 'fillAge':
          setUserData(prev => ({ ...prev, age: demoData.age }));
          break;
        case 'fillGender':
          setUserData(prev => ({ ...prev, gender: demoData.gender }));
          break;
        case 'fillHeight':
          setUserData(prev => ({ ...prev, height: demoData.height }));
          break;
        case 'fillWeight':
          setUserData(prev => ({ ...prev, weight: demoData.weight }));
          break;
        case 'fillSymptoms':
          setUserData(prev => ({ ...prev, symptoms: demoData.symptoms }));
          break;
        case 'fillStress':
          setUserData(prev => ({ ...prev, stressLevel: demoData.stressLevel }));
          break;
        case 'uploadTongue':
          setShowProgress(true);
          setTimeout(() => {
            setUserData(prev => ({ ...prev, tongueImage: demoData.tongueImage }));
            setShowProgress(false);
          }, 2000);
          break;
        case 'recordBreathing':
          setShowProgress(true);
          setTimeout(() => {
            setUserData(prev => ({ ...prev, breathingAudio: demoData.breathingAudio }));
            setShowProgress(false);
          }, 10000);
          break;
        case 'recordCough':
          setShowProgress(true);
          setTimeout(() => {
            setUserData(prev => ({ ...prev, coughAudio: demoData.coughAudio }));
            setShowProgress(false);
          }, 5000);
          break;
      }

      // Move to next step after delay
      setTimeout(() => {
        if (currentStep < demoScript.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, currentScript.delay);
    }, 500);
  };

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setUserData({
      name: '', age: '', gender: '', height: '', weight: '',
      symptoms: [], stressLevel: 0, tongueImage: null,
      breathingAudio: null, coughAudio: null
    });
    speakText(demoScript[0].text);
  };

  const stopDemo = () => {
    setIsPlaying(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const restartDemo = () => {
    stopDemo();
    setTimeout(() => startDemo(), 500);
  };

  useEffect(() => {
    if (isPlaying && currentStep < demoScript.length) {
      speakText(demoScript[currentStep].text);
    }
  }, [currentStep, isPlaying]);

  const currentScript = demoScript[currentStep] || demoScript[0];
  const isComplete = currentStep >= demoScript.length - 1 && !isPlaying;
  const showReport = currentScript.action === 'showReport' || currentScript.action === 'complete';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-orange-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-300 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-300 rounded-full blur-lg"></div>
      </div>

      {/* Floating Lotus Petals */}
      <div className="absolute top-20 left-1/4 animate-pulse">
        <div className="w-8 h-8 bg-pink-200 rounded-full opacity-60"></div>
      </div>
      <div className="absolute bottom-32 right-1/3 animate-bounce">
        <div className="w-6 h-6 bg-yellow-200 rounded-full opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-800 mb-2 font-serif">
              🕉️ Ayurved Vava Dhanvantari
            </h1>
            <p className="text-lg text-green-600">Panchakarma Patient Management System - Auto Demo</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Avatar Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-100">
              <div className="text-center">
                
                {/* Rishi Avatar */}
                <div className="relative mx-auto mb-6">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center border-4 border-orange-200 shadow-lg">
                    <div className="text-center">
                      <div className="text-6xl mb-2">🧙‍♂️</div>
                      <div className="text-sm font-semibold text-orange-800">Rushi</div>
                      <div className="text-xs text-orange-600">Ayurvedic Rishi</div>
                    </div>
                  </div>
                  
                  {/* Speaking Animation */}
                  {isSpeaking && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar Speech */}
                <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                  <p className="text-green-800 leading-relaxed italic">
                    "{currentScript.text}"
                  </p>
                </div>

                {/* Step Progress */}
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <span className="text-sm text-green-600">Step {currentStep + 1} of {demoScript.length}</span>
                  <div className="w-32 h-2 bg-green-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / demoScript.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Demo Controls */}
                <div className="flex justify-center space-x-2">
                  {!isPlaying ? (
                    <button
                      onClick={startDemo}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-semibold"
                    >
                      <Play size={16} />
                      <span>Start Auto Demo</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopDemo}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                    >
                      <Pause size={16} />
                      <span>Stop Demo</span>
                    </button>
                  )}
                  
                  {(isPlaying || isComplete) && (
                    <button
                      onClick={restartDemo}
                      className="flex items-center space-x-2 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                    >
                      🔄 Restart
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Demo Display Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-100">
              
              {!showReport ? (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-green-800 text-center">Patient Information</h3>
                  
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-green-800">Name</label>
                    <div className="w-full p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                      {userData.name || '—'}
                    </div>
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-green-800">Age</label>
                    <div className="w-full p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                      {userData.age || '—'}
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-green-800">Gender</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Male', 'Female', 'Other'].map((gender) => (
                        <div
                          key={gender}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            userData.gender === gender 
                              ? 'border-green-500 bg-green-50 text-green-700' 
                              : 'border-green-200 bg-white'
                          }`}
                        >
                          {gender}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Height & Weight */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-green-800">Height (cm)</label>
                      <div className="w-full p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                        {userData.height || '—'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-green-800">Weight (kg)</label>
                      <div className="w-full p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                        {userData.weight || '—'}
                      </div>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-green-800">Symptoms</label>
                    <div className="grid grid-cols-2 gap-2">
                      {symptoms.map((symptom) => (
                        <div key={symptom} className={`flex items-center space-x-2 p-2 rounded-lg ${
                          userData.symptoms.includes(symptom) ? 'bg-green-100' : 'bg-gray-50'
                        }`}>
                          <input
                            type="checkbox"
                            checked={userData.symptoms.includes(symptom)}
                            readOnly
                            className="w-4 h-4 text-green-600 rounded"
                          />
                          <span className="text-sm text-green-700">{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stress Level */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-green-800">Stress Level</label>
                    <div className="flex justify-between space-x-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                            userData.stressLevel === level 
                              ? 'border-red-500 bg-red-50 text-red-700' 
                              : 'border-green-200 bg-white'
                          }`}
                        >
                          {level}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-green-800">Tongue Image</label>
                      <div className="p-3 border-2 border-dashed border-green-300 rounded-xl text-center">
                        {showProgress && currentScript.action === 'uploadTongue' ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full"></div>
                            <span>Uploading...</span>
                          </div>
                        ) : userData.tongueImage ? (
                          <span className="text-green-600">✓ {userData.tongueImage}</span>
                        ) : (
                          <span className="text-gray-500">No file uploaded</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-green-800">Breathing Audio</label>
                      <div className="p-3 border-2 border-dashed border-green-300 rounded-xl text-center">
                        {showProgress && currentScript.action === 'recordBreathing' ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Mic className="text-red-500 animate-pulse" size={16} />
                            <span>Recording... 10s</span>
                          </div>
                        ) : userData.breathingAudio ? (
                          <span className="text-green-600">✓ {userData.breathingAudio}</span>
                        ) : (
                          <span className="text-gray-500">No recording</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-green-800">Cough Audio (Optional)</label>
                      <div className="p-3 border-2 border-dashed border-green-300 rounded-xl text-center">
                        {showProgress && currentScript.action === 'recordCough' ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Mic className="text-red-500 animate-pulse" size={16} />
                            <span>Recording... 5s</span>
                          </div>
                        ) : userData.coughAudio ? (
                          <span className="text-green-600">✓ {userData.coughAudio}</span>
                        ) : (
                          <span className="text-gray-500">No recording</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Processing */}
                  {currentScript.action === 'processing' && (
                    <div className="text-center py-8">
                      <div className="animate-spin w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full mx-auto mb-4"></div>
                      <p className="text-green-700">Processing assessment...</p>
                    </div>
                  )}
                </div>
              ) : (
                
                /* Assessment Report */
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-green-800 text-center">Ayurvedic Assessment Report</h3>
                  
                  {/* Patient Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-800 mb-2">Patient Summary</h4>
                    <p className="text-sm text-blue-700">
                      {userData.name}, {userData.age} years old, {userData.gender}
                      <br />Height: {userData.height}cm, Weight: {userData.weight}kg
                      <br />Symptoms: {userData.symptoms.join(', ')}
                      <br />Stress Level: {userData.stressLevel}/5
                    </p>
                  </div>
                  
                  {/* Dosha Analysis */}
                  <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-orange-800 mb-3">Dosha Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Vata</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: '45%' }}></div>
                          </div>
                          <span className="text-sm font-bold">45%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Pitta</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: '25%' }}></div>
                          </div>
                          <span className="text-sm font-bold">25%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Kapha</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '30%' }}></div>
                          </div>
                          <span className="text-sm font-bold">30%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Therapies */}
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-green-800 mb-3">Recommended Therapies</h4>
                    <div className="space-y-2">
                      {['Abhyanga (Oil Massage)', 'Basti (Medicated Enema)', 'Nasya (Nasal Therapy)'].map((therapy) => (
                        <div key={therapy} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-700">{therapy}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Doctor Status */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl text-center">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-200 text-amber-800 rounded-full">
                      <Activity size={16} />
                      <span className="font-semibold">Doctor Status: Pending Review</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-2">
                      Your report has been sent to our Ayurvedic physician for detailed consultation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanchakarmaVoiceChatbot;