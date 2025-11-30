"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar, Clock, User, Stethoscope, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function BookAppointmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    patientName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    symptoms: "",
    appointmentDate: "",
    appointmentTime: "",
    consultationMode: "online",
    doctorId: "", // This would come from URL params or context
    additionalNotes: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would typically send the data to your backend
    console.log("Appointment booking data:", formData)

    // For now, just show success and redirect
    alert("Appointment booked successfully!")
    router.push("/appointments/confirmation")
  }

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM", "06:00 PM"
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border fade-in">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary professional-heading">Book Appointment</h1>
              <p className="text-muted-foreground professional-body mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
                Schedule your consultation with a healthcare professional
              </p>
            </div>
            <Link href="/doctors">
              <Button variant="outline" className="w-full sm:w-auto smooth-transition hover-scale text-sm">
                <Stethoscope className="h-4 w-4 mr-2" />
                Back to Doctors
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <Card className="fade-in-up">
            <CardHeader>
              <h2 className="text-lg sm:text-xl font-semibold text-card-foreground professional-heading flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Patient Information
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Full Name *</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange("patientName", e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptoms & Medical Information */}
          <Card className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <h2 className="text-lg sm:text-xl font-semibold text-card-foreground professional-heading flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Symptoms & Medical Information
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Describe Your Symptoms *</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => handleInputChange("symptoms", e.target.value)}
                  placeholder="Please describe your symptoms, when they started, and any relevant medical history..."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                  placeholder="Any additional information you'd like to share with the doctor..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appointment Details */}
          <Card className="fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <h2 className="text-lg sm:text-xl font-semibold text-card-foreground professional-heading flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Appointment Details
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate">Preferred Date *</Label>
                  <Input
                    id="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentTime">Preferred Time *</Label>
                  <Select value={formData.appointmentTime} onValueChange={(value) => handleInputChange("appointmentTime", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Consultation Mode *</Label>
                <RadioGroup
                  value={formData.consultationMode}
                  onValueChange={(value) => handleInputChange("consultationMode", value)}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                      <div className="p-1 bg-primary/10 rounded">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      Online Consultation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="offline" id="offline" />
                    <Label htmlFor="offline" className="flex items-center gap-2 cursor-pointer">
                      <div className="p-1 bg-primary/10 rounded">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      In-Person Visit
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition hover-scale flex-1"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
            <Link href="/doctors" className="flex-1">
              <Button variant="outline" className="w-full smooth-transition hover-scale">
                Cancel
              </Button>
            </Link>
          </div>
        </form>

        {/* Important Notes */}
        <Card className="mt-6 bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex-shrink-0">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">Important Notes</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Appointments are subject to doctor availability</li>
                  <li>• You will receive a confirmation email and SMS</li>
                  <li>• Cancellation policy: 24 hours notice required</li>
                  <li>• For emergencies, please visit your nearest hospital</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
