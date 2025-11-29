import { useState } from "react";
import { Calendar, Clock, User, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

const CheckupScheduler = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkupType: "",
    preferredDate: "",
    preferredTime: "",
    doctor: "",
    notes: ""
  });

  const checkupTypes = [
    "General Health Checkup",
    "Annual Physical Exam",
    "Blood Pressure Screening",
    "Diabetes Screening",
    "Heart Health Checkup",
    "Cancer Screening",
    "Women's Health Checkup",
    "Men's Health Checkup",
    "Senior Health Assessment"
  ];

  const availableDoctors = [
    "Dr. Sarah Johnson - General Medicine",
    "Dr. Michael Chen - Internal Medicine",
    "Dr. Emily Davis - Family Medicine",
    "Dr. James Wilson - Preventive Care",
    "Dr. Lisa Brown - Women's Health"
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Checkup appointment scheduled successfully!");
    console.log("Checkup appointment:", formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            Health Checkup Scheduler
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Schedule Your Health Checkup
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Regular health checkups are essential for maintaining optimal health. Schedule your appointment with our qualified medical professionals.
          </p>
        </div>

        {/* Appointment Status */}
        <Card className="mb-8 border-muted bg-muted/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Booked Appointments</h3>
                <p className="text-sm text-muted-foreground mb-4">You don't have any appointments scheduled yet.</p>
                <Button 
                  onClick={() => document.getElementById('appointment-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Click Here to Book an Appointment with a Specialist
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Appointment Form */}
          <div className="lg:col-span-2" id="appointment-form">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Patient Information & Scheduling
                </CardTitle>
                <CardDescription>
                  Fill in your details and preferred appointment time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
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

                  <div>
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

                  {/* Checkup Details */}
                  <div>
                    <Label htmlFor="checkupType">Type of Checkup *</Label>
                    <Select value={formData.checkupType} onValueChange={(value) => handleInputChange("checkupType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select checkup type" />
                      </SelectTrigger>
                      <SelectContent>
                        {checkupTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="doctor">Preferred Doctor</Label>
                    <Select value={formData.doctor} onValueChange={(value) => handleInputChange("doctor", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred doctor (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDoctors.map((doctor) => (
                          <SelectItem key={doctor} value={doctor}>
                            {doctor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Scheduling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Preferred Time *</Label>
                      <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
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

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any specific concerns or requirements..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Checkup Appointment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Why Regular Checkups?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Early detection of health issues</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Prevention of serious conditions</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Monitoring of existing conditions</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Updated vaccinations and screenings</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Our Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  123 Medical Center Drive<br />
                  Healthcare City, HC 12345
                </p>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Phone className="h-4 w-4 mr-2" />
                  (555) 123-4567
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  Mon-Fri: 8:00 AM - 6:00 PM
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckupScheduler;