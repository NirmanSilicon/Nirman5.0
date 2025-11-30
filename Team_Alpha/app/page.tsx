"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  Home,
  Menu,
  X,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Moon,
  Sun,
  FileText,
  LogIn,
  UserPlus,
  Users,
  Phone,
  ChevronRight,
  Mail,
  Clock,
  Shield,
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { GoogleGenerativeAI } from "@google/generative-ai"
import SplashScreen from "@/components/splash-screen"

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [symptomText, setSymptomText] = useState("")
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [recommendedSpecializations, setRecommendedSpecializations] = useState<Array<{specialization: string, description: string, urgency: string}>>([])
  const [isTyping, setIsTyping] = useState(false)
  const { theme, setTheme } = useTheme()

  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    { title: "SymptoCare", subtitle: "Your symptoms, our care!", image: "/carousel1.jpg" },
    { title: "Smart Diagnosis", subtitle: "Get instant insights into your health symptoms", image: "/carousel2.jpg" },
    { title: "Expert Care", subtitle: "Connect with healthcare professionals when needed", image: "/carousel3.jpg" },
  ]

  // Use NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY, fallback to GOOGLE_GEMINI_API_KEY if not set
  const apiKey = typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY)
    : null;
  if (!apiKey && typeof window !== 'undefined') {
    console.error('Google Gemini API key is missing. Please set NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY in .env.local');
  }
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)
    return () => clearTimeout(splashTimer)
  }, [])

  const sendMessage = async () => {
    if (!symptomText.trim()) return

    const userMessage = symptomText
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setSymptomText("")
    setIsTyping(true)

    try {
      if (!genAI) {
        const errorMessage = "AI service is currently unavailable. Please try again later or contact support."
        setChatMessages(prev => [...prev, { role: 'assistant', content: errorMessage }])
        setIsTyping(false)
        return
      }

      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      const prompt = `You are a medical AI assistant. Based on the following symptoms: "${userMessage}", recommend 3-5 appropriate medical specializations that the patient should consult. For each specialization, provide:
1. The specialization name
2. A brief reason why this specialist is recommended
3. Urgency level (low, medium, high)

Format your response as a JSON array of objects with keys: specialization, description, urgency.

Example format:
[
  {"specialization": "Cardiology", "description": "For chest pain and heart-related symptoms", "urgency": "high"},
  {"specialization": "Pulmonology", "description": "For breathing difficulties and lung issues", "urgency": "medium"}
]`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        try {
          const specializations = JSON.parse(jsonMatch[0])
          setRecommendedSpecializations(specializations)

          // Create a human-readable response
          const assistantMessage = `Based on your symptoms, here are the recommended medical specializations to consult:\n\n${specializations.map((spec: any, index: number) =>
            `${index + 1}. **${spec.specialization}** - ${spec.description} (Urgency: ${spec.urgency})`
          ).join('\n')}\n\nPlease consider booking an appointment with one of these specialists for proper diagnosis and treatment.`

          setChatMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }])
        } catch (parseError) {
          console.error("Error parsing AI response:", parseError)
          const errorMessage = "I couldn't properly analyze your symptoms. Please try rephrasing your symptoms or provide more details."
          setChatMessages(prev => [...prev, { role: 'assistant', content: errorMessage }])
        }
      } else {
        const errorMessage = "I couldn't generate recommendations from your symptoms. Please try providing more specific symptoms or contact a healthcare professional directly."
        setChatMessages(prev => [...prev, { role: 'assistant', content: errorMessage }])
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
      const errorMessage = "I'm experiencing technical difficulties. Please try again in a moment or consult a healthcare professional for immediate assistance."
      setChatMessages(prev => [...prev, { role: 'assistant', content: errorMessage }])
    } finally {
      setIsTyping(false)
    }
  }



  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <div className="min-h-screen bg-background flex" suppressHydrationWarning>
      {/* Mobile Overlay Sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0 md:w-16"
        }`}
      >
        <div className="p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent md:justify-center"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            {isSidebarOpen && <span className="ml-2">Menu</span>}
          </Button>
        </div>

        <nav className="px-4 space-y-2">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-primary hover:bg-sidebar-accent"
            >
              <Home className="h-4 w-4" />
              {isSidebarOpen && <span className="ml-2">Home</span>}
            </Button>
          </Link>

          <Link href="/fitgram">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Users className="h-4 w-4" />
              {isSidebarOpen && <span className="ml-2">FitGram</span>}
            </Button>
          </Link>

          <Link href="/profile">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <FileText className="h-4 w-4" />
              {isSidebarOpen && <span className="ml-2">My Details</span>}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Phone className="h-4 w-4" />
            {isSidebarOpen && <span className="ml-2">Contact Us</span>}
          </Button>
        </nav>
      </div>

      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-16"}`}>
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border fade-in">
          <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden text-foreground hover:bg-accent smooth-transition p-2 flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <img src="/logosymptocare.png" alt="SymptoCare Logo" className="h-8 sm:h-10 w-auto" />
            </div>

            {/* Right: Theme Switch and Auth Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-foreground hover:bg-accent smooth-transition p-2 sm:p-2.5"
                suppressHydrationWarning
              >
                {theme === "dark" ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-foreground border-border hover:bg-accent bg-transparent smooth-transition text-xs sm:text-sm px-2 sm:px-3"
                >
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition hover-scale text-xs sm:text-sm px-2 sm:px-3">
                  <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="bg-gradient-to-br from-accent via-accent/50 to-background">
          <div className="w-full">
            <Carousel className="w-full max-w-6xl mx-auto" opts={{ align: "start", loop: true }}>
              <CarouselContent>
                {slides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div
                      className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden carousel-slide"
                      style={{ backgroundImage: `url(${slide.image})` }}
                    >
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                          {slide.title}
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 italic px-2">"{slide.subtitle}"</p>
                        <div className="mt-4 sm:mt-5 flex justify-center gap-2">
                          {slides.map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                                i === currentSlide ? "bg-white scale-125" : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:left-4" />
              <CarouselNext className="right-2 sm:right-4" />
            </Carousel>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-4 sm:py-6 max-w-6xl">
          <Card className="mb-6 bg-card border-border fade-in-up hover-lift smooth-transition">
            <CardHeader className="p-4 sm:p-5">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-card-foreground flex items-center gap-2 professional-heading">
                <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                AI Health Assistant
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground professional-body mt-1 sm:mt-2">
                Describe your symptoms and get personalized doctor specialization recommendations
              </p>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-5">
              {/* Chat Messages */}
              {chatMessages.length > 0 && (
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                        <p className="text-sm">AI is analyzing your symptoms...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Recommended Specializations */}
              {recommendedSpecializations.length > 0 && (
                <div className="space-y-3 mb-4">
                  <h3 className="font-semibold text-card-foreground professional-heading text-base">Recommended Specializations:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recommendedSpecializations.map((spec, index) => (
                      <Card key={index} className="bg-accent/50 border-border hover-lift smooth-transition">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-card-foreground text-sm">{spec.specialization}</h4>
                            <Badge
                              variant={spec.urgency === 'high' ? 'destructive' : spec.urgency === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {spec.urgency}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{spec.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Link href="/doctors">
                      <Button variant="outline" size="sm" className="smooth-transition hover-scale">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Find Doctors
                      </Button>
                    </Link>
                    <Link href="/auth/login">
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition hover-scale">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <Textarea
                placeholder="Describe your symptoms... (e.g., chest pain, fever, headache)"
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                className="min-h-[80px] sm:min-h-[100px] bg-input border-border text-foreground placeholder:text-muted-foreground professional-body text-sm sm:text-base resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 professional-body smooth-transition hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!symptomText.trim() || isTyping}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                {isTyping ? 'Analyzing...' : 'Get Recommendations'}
              </Button>
            </CardContent>
          </Card>

          {/* How It Works Section */}
          <section className="mb-6 fade-in-up">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground professional-heading mb-2">
                How SymptoCare Works
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Get started in three simple steps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border hover-lift smooth-transition">
                <CardContent className="p-4 sm:p-5 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 float-animation">
                    <span className="text-xl sm:text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-2 text-base sm:text-lg">Describe Symptoms</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Tell us about your symptoms and health concerns in detail
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border hover-lift smooth-transition">
                <CardContent className="p-4 sm:p-5 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '0.1s' }}>
                    <span className="text-xl sm:text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-2 text-base sm:text-lg">AI Analysis</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Our AI analyzes your symptoms and suggests possible conditions
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border hover-lift smooth-transition">
                <CardContent className="p-4 sm:p-5 text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 float-animation" style={{ animationDelay: '0.2s' }}>
                    <span className="text-xl sm:text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-card-foreground mb-2 text-base sm:text-lg">Get Guidance</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Receive recommendations and connect with verified doctors
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-card border-border hover-lift fade-in-up smooth-transition" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-4 sm:p-5 text-center">
                <div className="p-2.5 bg-primary/10 rounded-lg w-fit mx-auto mb-2.5 float-animation">
                  <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-1.5 text-base sm:text-lg">AI-Powered Analysis</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Advanced algorithms analyze your symptoms for accurate results
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover-lift fade-in-up smooth-transition" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-4 sm:p-5 text-center">
                <div className="p-2.5 bg-primary/10 rounded-lg w-fit mx-auto mb-2.5 float-animation" style={{ animationDelay: '0.1s' }}>
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-1.5 text-base sm:text-lg">Detailed Questions</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Answer specific questions to confirm potential conditions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover-lift fade-in-up smooth-transition sm:col-span-2 md:col-span-1" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-4 sm:p-5 text-center">
                <div className="p-2.5 bg-primary/10 rounded-lg w-fit mx-auto mb-2.5 float-animation" style={{ animationDelay: '0.2s' }}>
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-1.5 text-base sm:text-lg">Professional Guidance</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Get recommendations for next steps and when to see a doctor
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FitGram Section */}
          <section className="mb-6 fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
              <div className="order-2 md:order-1">
                <Card className="bg-gradient-to-br from-card to-accent/30 border-border hover-lift smooth-transition h-full">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 bg-primary/10 rounded-lg float-animation">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground professional-heading">FitGram</h2>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground professional-body mb-3">
                      Join our vibrant health community! Share your wellness journey, connect with others on similar health paths, 
                      and get inspired by success stories. FitGram is your social network for health, fitness, and wellness.
                    </p>
                    <ul className="space-y-1.5 mb-4 text-xs sm:text-sm text-muted-foreground professional-body">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Share your health milestones and achievements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Connect with people facing similar health challenges</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Get tips, recipes, and wellness advice from the community</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Track your progress and celebrate your journey</span>
                      </li>
                    </ul>
                    <Link href="/fitgram">
                      <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition hover-scale text-sm">
                        <Users className="h-4 w-4 mr-2" />
                        Explore FitGram
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative h-48 sm:h-64 md:h-72 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center" style={{ backgroundImage: `url(/fitgramsection.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                </div>
              </div>
            </div>
          </section>

          {/* Doctors & Medicine Store Section */}
          <section className="mb-6 fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
              <div className="order-2 md:order-2">
                <div className="relative h-48 sm:h-64 md:h-72 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center" style={{ backgroundImage: `url(/doctorsection.avif)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                </div>
              </div>
              <div className="order-1 md:order-1">
                <Card className="bg-gradient-to-br from-card to-accent/30 border-border hover-lift smooth-transition h-full">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 bg-primary/10 rounded-lg float-animation">
                        <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-card-foreground professional-heading">Expert Care & Medicine</h2>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground professional-body mb-3">
                      Access qualified healthcare professionals and order medicines online. Book consultations with experienced doctors 
                      and get your prescriptions delivered to your doorstep through our integrated medicine store.
                    </p>
                    <ul className="space-y-1.5 mb-4 text-xs sm:text-sm text-muted-foreground professional-body">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Consult with verified and experienced doctors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Book appointments online at your convenience</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Order prescribed medicines with fast delivery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Get expert medical advice and follow-up care</span>
                      </li>
                    </ul>
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                      <Link href="/doctors">
                        <Button variant="outline" className="w-full sm:w-auto smooth-transition hover-scale text-sm">
                          <Stethoscope className="h-4 w-4 mr-2" />
                          Find Doctors
                        </Button>
                      </Link>
                      <Link href="/medicine-store">
                        <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition hover-scale text-sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Medicine Store
                        </Button>
                      </Link>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Are you a healthcare professional?</p>
                      <Link href="/auth/doctor-signup">
                        <Button variant="outline" className="w-full sm:w-auto smooth-transition hover-scale text-xs sm:text-sm">
                          <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Register as Doctor
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* AI Disclaimer Section */}
          <section className="mb-6 fade-in-up">
            <Card className="bg-gradient-to-br from-yellow-50/50 via-orange-50/30 to-red-50/50 dark:from-yellow-950/20 dark:via-orange-950/10 dark:to-red-950/20 border-2 border-yellow-200 dark:border-yellow-800 hover-lift smooth-transition">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex-shrink-0">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-card-foreground professional-heading mb-2 sm:mb-3">
                      Important Medical Disclaimer
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground professional-body mb-3 leading-relaxed">
                      <strong className="text-foreground">Please Note:</strong> The AI-powered symptom analysis and condition predictions 
                      provided by SymptoCare are <strong className="text-foreground">not 100% accurate</strong> and should not be considered 
                      as a definitive medical diagnosis. Our AI system is designed to provide preliminary insights and possible conditions 
                      based on the symptoms you describe, but it cannot replace professional medical evaluation.
                    </p>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground professional-body mb-4 leading-relaxed">
                      <strong className="text-foreground">Always consult with a qualified healthcare professional</strong> for accurate diagnosis, 
                      treatment, and medical advice. If you experience severe symptoms, medical emergencies, or have concerns about your health, 
                      please seek immediate medical attention from a licensed physician or visit your nearest emergency room.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Link href="/auth/login">
                        <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition hover-scale text-sm">
                          <LogIn className="h-4 w-4 mr-2" />
                          Login to Consult Doctors
                        </Button>
                      </Link>
                      <Link href="/doctors">
                        <Button variant="outline" className="w-full sm:w-auto smooth-transition hover-scale text-sm">
                          <Stethoscope className="h-4 w-4 mr-2" />
                          Browse Doctors
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>

        <footer className="bg-gradient-to-br from-card via-accent/30 to-card border-t-2 border-primary/20 mt-6 fade-in relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6">
              {/* Brand Section */}
              <div className="sm:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <img src="/logosymptocare.png" alt="SymptoCare Logo" className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary professional-heading italic">SymptoCare</h3>
                </div>
                <p className="text-muted-foreground mb-4 professional-body text-sm sm:text-base leading-relaxed max-w-md">
                  AI-powered healthcare assistance providing intelligent symptom analysis and professional medical guidance. 
                  Your health is our priority.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>© 2025 SymptoCare. All rights reserved.</span>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-card-foreground mb-4 professional-heading flex items-center gap-2 text-base sm:text-lg">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  Contact Us
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-accent/50 rounded-lg border border-border hover-lift smooth-transition">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-card-foreground">Email</span>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">
                        Coming Soon
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">sarthakmahapatra303@gmail.com</p>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg border border-border hover-lift smooth-transition">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium text-card-foreground">Phone</span>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">
                        Coming Soon
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">   </p>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-card-foreground">24/7 Support</p>
                        <p className="text-xs text-muted-foreground">Always here to help</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-card-foreground mb-4 professional-heading text-base sm:text-lg">Quick Links</h4>
                <div className="space-y-2.5">
                  <Link href="/about" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary smooth-transition group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 smooth-transition" />
                    <span>About Us</span>
                  </Link>
                  <Link href="/privacy" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary smooth-transition group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 smooth-transition" />
                    <span>Privacy Policy</span>
                  </Link>
                  <Link href="/terms" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary smooth-transition group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 smooth-transition" />
                    <span>Terms of Service</span>
                  </Link>
                  <Link href="/help" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary smooth-transition group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 smooth-transition" />
                    <span>Help Center</span>
                  </Link>
                  <Link href="/doctors" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary smooth-transition group">
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 smooth-transition" />
                    <span>Find Doctors</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
