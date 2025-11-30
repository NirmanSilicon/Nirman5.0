"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Minus,
  MapPin,
  Stethoscope,
  Building2,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Camera,
  X,
} from "lucide-react"
import { clinicDataManager, type ClinicFormData, type Doctor, type Service } from "@/lib/clinic-data"

export default function ClinicOnboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [verifiedPhone, setVerifiedPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const [clinicData, setClinicData] = useState<ClinicFormData>({
    clinicName: "",
    ownerName: "",
    address: "",
    nearbyCity: "",
    distance: "",
    googleMapsLocation: "",
    photos: [],
    doctors: [{ name: "", specialization: "", experience: "" }],
    services: [{ id: "1", name: "", description: "", price: "" }],
    termsAccepted: false,
  })

  // Check for verified phone number or existing clinic login
  useEffect(() => {
    const phone = sessionStorage.getItem('clinicVerifiedPhone');
    const clinicEmail = sessionStorage.getItem('clinicEmail');
    const clinicId = sessionStorage.getItem('clinicId');
    
    if (phone) {
      // New registration flow - phone verified
      setVerifiedPhone(phone);
    } else if (clinicEmail && clinicId) {
      // Existing clinic login - use the phone from database
      loadExistingClinicData(clinicId);
    } else {
      // No verification or login - redirect to phone verification
      console.log('No verification found, redirecting to phone page');
      router.push('/clinic-phone-page');
    }
  }, [router]);

  const loadExistingClinicData = async (clinicId: string) => {
    try {
      const response = await fetch(`/api/clinic/get?clinicId=${clinicId}`);
      const result = await response.json();
      
      if (result.success) {
        // Set the phone from existing clinic data
        setVerifiedPhone(result.clinic.phone_number);
        
        // Pre-fill form with existing data if available
        if (result.clinic.clinic_name !== 'Clinic Name (To be updated)') {
          setClinicData(prev => ({
            ...prev,
            clinicName: result.clinic.clinic_name,
            ownerName: result.clinic.owner_name,
            address: result.clinic.address || '',
            nearbyCity: result.clinic.nearby_city || '',
            distance: result.clinic.distance || '',
            googleMapsLocation: result.clinic.google_maps_location || '',
            photos: result.clinic.photos || [],
            doctors: result.clinic.doctors && result.clinic.doctors.length > 0 ? result.clinic.doctors : [{ name: "", specialization: "", experience: "" }],
            services: result.clinic.services && result.clinic.services.length > 0 ? result.clinic.services : [{ id: "1", name: "", description: "", price: "" }],
          }));
        }
      }
    } catch (error) {
      console.error('Error loading existing clinic data:', error);
    }
  };

  const addDoctor = () => {
    setClinicData((prev) => ({
      ...prev,
      doctors: [...prev.doctors, { name: "", specialization: "", experience: "" }],
    }))
  }

  const removeDoctor = (index: number) => {
    if (clinicData.doctors.length > 1) {
      setClinicData((prev) => ({
        ...prev,
        doctors: prev.doctors.filter((_, i) => i !== index),
      }))
    }
  }

  const updateDoctor = (index: number, field: keyof Doctor, value: string) => {
    setClinicData((prev) => ({
      ...prev,
      doctors: prev.doctors.map((doctor, i) => (i === index ? { ...doctor, [field]: value } : doctor)),
    }))
  }

  const addService = () => {
    const newId = (clinicData.services.length + 1).toString()
    setClinicData((prev) => ({
      ...prev,
      services: [...prev.services, { id: newId, name: "", description: "", price: "" }],
    }))
  }

  const removeService = (id: string) => {
    if (clinicData.services.length > 1) {
      setClinicData((prev) => ({
        ...prev,
        services: prev.services.filter((service) => service.id !== id),
      }))
    }
  }

  const updateService = (id: string, field: keyof Omit<Service, "id">, value: string) => {
    setClinicData((prev) => ({
      ...prev,
      services: prev.services.map((service) => (service.id === id ? { ...service, [field]: value } : service)),
    }))
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      setLoading(true)
      setErrors([])
      
      const maxPhotos = 3
      const remainingSlots = maxPhotos - clinicData.photos.length
      
      if (remainingSlots <= 0) {
        setErrors(['Maximum 3 photos allowed'])
        return
      }

      // Check if Cloudinary is configured
      const configResponse = await fetch('/api/cloudinary-config');
      const configResult = await configResponse.json();
      const cloudinaryConfigured = configResult.success && configResult.configured;
      
      if (!cloudinaryConfigured) {
        // Fallback: Use local file URLs (for development only)
        const newPhotos: string[] = [];
        const filesToUpload = Array.from(files).slice(0, remainingSlots);
        
        filesToUpload.forEach((file) => {
          if (file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            newPhotos.push(url);
          }
        });
        
        setClinicData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...newPhotos],
        }));
        
        setErrors(['Note: Photos are stored locally for development. Please configure Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) for production photo uploads.']);
      } else {
        // Upload to Cloudinary via API
        const formData = new FormData()
        const filesToUpload = Array.from(files).slice(0, remainingSlots)
        
        filesToUpload.forEach((file) => {
          if (file.type.startsWith("image/")) {
            formData.append('photos', file)
          }
        })

        const response = await fetch('/api/clinic/upload-photos', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          setClinicData((prev) => ({
            ...prev,
            photos: [...prev.photos, ...result.urls],
          }))
        } else {
          setErrors([result.error || 'Failed to upload photos'])
        }
      }
    } catch (error) {
      setErrors(['Failed to upload photos. Please try again.'])
    } finally {
      setLoading(false)
      // Reset the input
      event.target.value = ""
    }
  }

  const removePhoto = (index: number) => {
    setClinicData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    const validationErrors = clinicDataManager.validateClinicForm(clinicData)

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    if (!verifiedPhone) {
      setErrors(["Phone verification is required"])
      return
    }

    try {
      setLoading(true)
      setErrors([])
      
      // Check if this is an existing clinic or new registration
      const clinicId = sessionStorage.getItem('clinicId');
      const isExistingClinic = clinicId && sessionStorage.getItem('clinicEmail');
      
      // Prepare clinic data with phone number and email (for existing clinics)
      const submitData = {
        ...clinicData,
        phoneNumber: verifiedPhone,
        ...(isExistingClinic && { email: sessionStorage.getItem('clinicEmail') })
      }

      let response;
      if (isExistingClinic) {
        // Update existing clinic
        response = await fetch('/api/clinic/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clinicId,
            ...submitData
          }),
        })
      } else {
        // Create new clinic
        response = await fetch('/api/clinic/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        })
      }

      const result = await response.json()

      if (result.success) {
        // Clear the verified phone from session storage only after successful submission
        sessionStorage.removeItem('clinicVerifiedPhone')
        setIsSubmitted(true)
      } else {
        setErrors([result.error || "Failed to submit clinic registration. Please try again."])
      }
    } catch (error) {
      setErrors(["Failed to submit clinic registration. Please try again."])
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: "Clinic Details", icon: Building2 },
    { number: 2, title: "Doctor Information", icon: Stethoscope },
    { number: 3, title: "Services & Pricing", icon: FileText },
    { number: 4, title: "Review & Submit", icon: CheckCircle },
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Submitted Successfully!</CardTitle>
            <CardDescription>
              Your clinic registration has been submitted for admin approval. You will be notified once reviewed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/clinic-dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Ayurvedic Panchakarma Clinic Registration</h1>
            <p className="text-muted-foreground">Join our network of certified Ayurvedic practitioners</p>
          </div>

          {/* Error Display */}
          {errors.length > 0 && (
            <Alert className="mb-6 border-destructive/50 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Please fix the following errors:</div>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      currentStep >= step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      currentStep >= step.number ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Form Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="clinicName">Clinic Name *</Label>
                      <Input
                        id="clinicName"
                        value={clinicData.clinicName}
                        onChange={(e) => setClinicData((prev) => ({ ...prev, clinicName: e.target.value }))}
                        placeholder="Enter clinic name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name *</Label>
                      <Input
                        id="ownerName"
                        value={clinicData.ownerName}
                        onChange={(e) => setClinicData((prev) => ({ ...prev, ownerName: e.target.value }))}
                        placeholder="Enter owner name"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={clinicData.address}
                        onChange={(e) => setClinicData((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter complete address"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nearbyCity">Nearby City *</Label>
                      <Input
                        id="nearbyCity"
                        value={clinicData.nearbyCity}
                        onChange={(e) => setClinicData((prev) => ({ ...prev, nearbyCity: e.target.value }))}
                        placeholder="Enter nearby city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="distance">Distance from City (km) *</Label>
                      <Input
                        id="distance"
                        type="number"
                        value={clinicData.distance}
                        onChange={(e) => setClinicData((prev) => ({ ...prev, distance: e.target.value }))}
                        placeholder="Enter distance"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="googleMaps">Google Maps Location</Label>
                      <div className="flex gap-2">
                        <Input
                          id="googleMaps"
                          value={clinicData.googleMapsLocation}
                          onChange={(e) => setClinicData((prev) => ({ ...prev, googleMapsLocation: e.target.value }))}
                          placeholder="Paste Google Maps link or coordinates"
                        />
                        <Button variant="outline" size="icon">
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Photo Upload Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Clinic Photos (Upload 2-3 photos)</Label>
                      <p className="text-sm text-muted-foreground">
                        Upload photos of your clinic interior, treatment rooms, or exterior areas
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Photo Upload Slots */}
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="relative">
                          {clinicData.photos[index] ? (
                            <div className="relative group">
                              <img
                                src={clinicData.photos[index] || "/placeholder.svg"}
                                alt={`Clinic photo ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border-2 border-muted"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removePhoto(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
                              <div className="w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
                                <Camera className="w-6 h-6 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">Upload Photo</span>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handlePhotoUpload}
                                disabled={loading}
                              />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>

                    {loading && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span>Uploading photos...</span>
                      </div>
                    )}
                    
                    {clinicData.photos.length > 0 && !loading && (
                      <p className="text-sm text-primary">{clinicData.photos.length} of 3 photos uploaded</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  {clinicData.doctors.map((doctor, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Doctor {index + 1}
                        </h3>
                        {clinicData.doctors.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeDoctor(index)}>
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Doctor Name *</Label>
                          <Input
                            value={doctor.name}
                            onChange={(e) => updateDoctor(index, "name", e.target.value)}
                            placeholder="Enter doctor name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Specialization *</Label>
                          <Select
                            value={doctor.specialization}
                            onValueChange={(value) => updateDoctor(index, "specialization", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="panchakarma">Panchakarma Specialist</SelectItem>
                              <SelectItem value="ayurveda">General Ayurveda</SelectItem>
                              <SelectItem value="rasayana">Rasayana Therapy</SelectItem>
                              <SelectItem value="kayachikitsa">Kayachikitsa</SelectItem>
                              <SelectItem value="shalya">Shalya Tantra</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Experience (years) *</Label>
                          <Input
                            type="number"
                            value={doctor.experience}
                            onChange={(e) => updateDoctor(index, "experience", e.target.value)}
                            placeholder="Years of experience"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addDoctor} variant="outline" className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Doctor
                  </Button>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  {clinicData.services.map((service) => (
                    <Card key={service.id} className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Service {service.id}</h3>
                        {clinicData.services.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeService(service.id)}>
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Service Name *</Label>
                          <Input
                            value={service.name}
                            onChange={(e) => updateService(service.id, "name", e.target.value)}
                            placeholder="e.g., Abhyanga Massage"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Price (₹) *</Label>
                          <Input
                            type="number"
                            value={service.price}
                            onChange={(e) => updateService(service.id, "price", e.target.value)}
                            placeholder="Enter price"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-1">
                          <Label>Description</Label>
                          <Textarea
                            value={service.description}
                            onChange={(e) => updateService(service.id, "description", e.target.value)}
                            placeholder="Brief description"
                            rows={2}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button onClick={addService} variant="outline" className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Service
                  </Button>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Clinic Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Name:</span> {clinicData.clinicName}
                        </p>
                        <p>
                          <span className="font-medium">Owner:</span> {clinicData.ownerName}
                        </p>
                        <p>
                          <span className="font-medium">City:</span> {clinicData.nearbyCity}
                        </p>
                        <p>
                          <span className="font-medium">Distance:</span> {clinicData.distance} km
                        </p>
                        <p>
                          <span className="font-medium">Photos:</span> {clinicData.photos.length} uploaded
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Doctors ({clinicData.doctors.length})
                      </h3>
                      <div className="space-y-2">
                        {clinicData.doctors.map((doctor, index) => (
                          <div key={index} className="text-sm">
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-muted-foreground">
                              {doctor.specialization} • {doctor.experience} years
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Photo Preview in Review Section */}
                  {clinicData.photos.length > 0 && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Clinic Photos ({clinicData.photos.length})
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {clinicData.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo || "/placeholder.svg"}
                            alt={`Clinic photo ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border"
                          />
                        ))}
                      </div>
                    </Card>
                  )}

                  <Card className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Services & Pricing ({clinicData.services.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clinicData.services.map((service) => (
                        <div key={service.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{service.name}</h4>
                            <Badge variant="secondary">₹{service.price}</Badge>
                          </div>
                          {service.description && (
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Terms & Conditions */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={clinicData.termsAccepted}
                      onCheckedChange={(checked) =>
                        setClinicData((prev) => ({ ...prev, termsAccepted: checked as boolean }))
                      }
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the{" "}
                      <Dialog open={isTermsModalOpen} onOpenChange={setIsTermsModalOpen}>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="text-primary hover:text-primary/80 underline font-medium"
                            onClick={() => setIsTermsModalOpen(true)}
                          >
                            Terms & Conditions
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-primary">
                              Ayurvedic Panchakarma Clinic - Terms & Conditions
                            </DialogTitle>
                            <DialogDescription>
                              Please read and understand the following terms before registering your clinic.
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="h-[60vh] pr-4">
                            <div className="space-y-4 text-sm">
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                                    1
                                  </span>
                                  <p>
                                    <strong>Certification Requirements:</strong> All registered clinics must possess
                                    valid Ayurvedic practice licenses and certifications from recognized institutions.
                                    Doctors must have appropriate qualifications in Ayurveda and Panchakarma therapy.
                                  </p>
                                </div>

                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                                    2
                                  </span>
                                  <p>
                                    <strong>Quality Standards:</strong> Clinics must maintain high standards of hygiene,
                                    safety, and treatment protocols as per traditional Ayurvedic practices and modern
                                    healthcare regulations.
                                  </p>
                                </div>

                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                                    3
                                  </span>
                                  <p>
                                    <strong>Accurate Information:</strong> All information provided during registration
                                    must be truthful and accurate. Any false or misleading information may result in
                                    immediate suspension or termination of services.
                                  </p>
                                </div>

                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                                    4
                                  </span>
                                  <p>
                                    <strong>Patient Privacy:</strong> Clinics must comply with patient confidentiality
                                    laws and maintain strict privacy of all patient information and treatment records.
                                  </p>
                                </div>

                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                                    5
                                  </span>
                                  <p>
                                    <strong>Service Pricing:</strong> All service prices must be transparent and clearly
                                    communicated to patients. Hidden charges or misleading pricing practices are
                                    strictly prohibited.
                                  </p>
                                </div>

                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                                    6
                                  </span>
                                  <p>
                                    <strong>Professional Conduct:</strong> All practitioners must maintain professional
                                    ethics and conduct as per Ayurvedic medical standards and treat patients with
                                    respect and dignity.
                                  </p>
                                </div>

                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                                    7
                                  </span>
                                  <p>
                                    <strong>Platform Compliance:</strong> Clinics must comply with all platform
                                    policies, guidelines, and updates. Regular compliance checks may be conducted to
                                    ensure adherence.
                                  </p>
                                </div>

                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                                    8
                                  </span>
                                  <p>
                                    <strong>Liability and Insurance:</strong> Clinics must maintain appropriate
                                    professional liability insurance and are responsible for their own medical
                                    malpractice coverage.
                                  </p>
                                </div>

                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                                    9
                                  </span>
                                  <p>
                                    <strong>Termination Rights:</strong> The platform reserves the right to suspend or
                                    terminate clinic registration for violations of terms, patient complaints, or
                                    failure to maintain required standards.
                                  </p>
                                </div>

                                <div className="flex items-start gap-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
                                    10
                                  </span>
                                  <p>
                                    <strong>Updates and Modifications:</strong> These terms may be updated periodically.
                                    Registered clinics will be notified of any changes and continued use of the platform
                                    constitutes acceptance of updated terms.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </ScrollArea>
                          <div className="flex justify-end pt-4 border-t">
                            <Button
                              onClick={() => setIsTermsModalOpen(false)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              I Understand
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>{" "}
                      and Privacy Policy
                    </Label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep < 4 ? (
                  <Button onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}>Next</Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!clinicData.termsAccepted || loading}>
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Submit for Approval'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
