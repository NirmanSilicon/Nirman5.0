"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Star,
  User,
  Phone,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";
import { getAllTherapies, getTherapyById } from "@/app/therpy/therpy";
import clinics from "@/app/near/clinic";

interface BookingData {
  therapyId: string;
  therapyName: string;
  clinicId: number;
  clinicName: string;
  selectedDate: Date | null;
  selectedTime: string | null;
  userInfo: {
    name: string;
    phone: string;
    email: string;
  };
}

export default function BookNowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<BookingData>({
    therapyId: "",
    therapyName: "",
    clinicId: 0,
    clinicName: "",
    selectedDate: null,
    selectedTime: null,
    userInfo: {
      name: "",
      phone: "",
      email: "",
    },
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Time slots (9:00 AM to 7:30 PM with lunch break 1:30-2:30 PM)
  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 1:30 PM",
    "2:30 PM - 3:30 PM",
    "3:30 PM - 4:30 PM",
    "4:30 PM - 5:30 PM",
    "5:30 PM - 6:30 PM",
    "6:30 PM - 7:30 PM",
  ];

  useEffect(() => {
    const therapyId = searchParams.get("therapyId");
    const clinicId = searchParams.get("clinicId");

    if (therapyId && clinicId) {
      const therapy = getTherapyById(therapyId);
      const clinic = clinics[parseInt(clinicId)];

      if (therapy && clinic) {
        setBookingData((prev) => ({
          ...prev,
          therapyId: therapy.id,
          therapyName: therapy.name,
          clinicId: parseInt(clinicId),
          clinicName: clinic.name,
        }));
      }
    }
  }, [searchParams]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setBookingData((prev) => ({ ...prev, selectedDate: date }));
    }
  };

  const handleTimeSelect = (time: string) => {
    setBookingData((prev) => ({ ...prev, selectedTime: time }));
  };

  const handleUserInfoChange = (field: string, value: string) => {
    setBookingData((prev) => ({
      ...prev,
      userInfo: { ...prev.userInfo, [field]: value },
    }));
  };

  const handleNextStep = () => {
    if (
      currentStep === 1 &&
      bookingData.selectedDate &&
      bookingData.selectedTime
    ) {
      setCurrentStep(2);
    } else if (
      currentStep === 2 &&
      bookingData.userInfo.name &&
      bookingData.userInfo.phone
    ) {
      setCurrentStep(3);
    }
  };

const handleProceedToPayment = () => {
  setLoading(true);
  (async () => {
    try {
      const res = await fetch("/api/booking/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          therapyName: bookingData.therapyName,
          selectedDate: bookingData.selectedDate
            ? bookingData.selectedDate.toISOString().split("T")[0]
            : null,
          selectedTime: bookingData.selectedTime,
          amount: therapy?.price || 0,
          currency: "INR",
          userInfo: bookingData.userInfo,
          clinicId: bookingData.clinicId,
          clinicName: bookingData.clinicName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");

      // Save booking locally
      localStorage.setItem(
        "bookingData",
        JSON.stringify({ ...bookingData, bookingId: data.booking.id })
      );

      // 🔔 Fire-and-forget WhatsApp notification (don’t block user)
      try {
        await fetch("/api/notify/whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: bookingData.userInfo.phone,
            name: bookingData.userInfo.name,
            therapyName: bookingData.therapyName,
            clinicName: bookingData.clinicName,
            selectedDate: bookingData.selectedDate
              ? bookingData.selectedDate.toISOString().split("T")[0]
              : "",
            selectedTime: bookingData.selectedTime,
            amount: therapy?.price || 0,
            currency: "INR",
          }),
        });
      } catch (notifyErr) {
        console.warn("Failed to send WhatsApp notification:", notifyErr);
        // don't alert user, booking is still fine
      }

      // Then go to payment page
      router.push("/payment");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  })();
};

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const therapy = getTherapyById(bookingData.therapyId);
  const clinic = clinics[bookingData.clinicId];

  if (!therapy || !clinic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Booking Request</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clinic Details
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Date & Time Selection */}
            {currentStep === 1 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Select Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Choose Date</h3>
                    <Calendar
                      mode="single"
                      selected={bookingData.selectedDate || undefined}
                      onSelect={handleDateSelect}
                      disabled={isDateDisabled}
                      className="rounded-md border"
                    />
                  </div>

                  <Separator />

                  {/* Time Selection */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Choose Time Slot
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={
                            bookingData.selectedTime === time
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleTimeSelect(time)}
                          className="h-12 text-sm"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {time}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      * Lunch break: 1:30 PM - 2:30 PM
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleNextStep}
                      disabled={
                        !bookingData.selectedDate || !bookingData.selectedTime
                      }
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next: Personal Information
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={bookingData.userInfo.name}
                        onChange={(e) =>
                          handleUserInfoChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={bookingData.userInfo.phone}
                        onChange={(e) =>
                          handleUserInfoChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={bookingData.userInfo.email}
                      onChange={(e) =>
                        handleUserInfoChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={
                        !bookingData.userInfo.name ||
                        !bookingData.userInfo.phone
                      }
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next: Review & Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review & Payment */}
            {currentStep === 3 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Review & Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Booking Summary</h3>

                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Treatment:</span>
                        <span>{bookingData.therapyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Clinic:</span>
                        <span>{bookingData.clinicName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Date:</span>
                        <span>
                          {bookingData.selectedDate
                            ? format(bookingData.selectedDate, "PPP")
                            : ""}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Time:</span>
                        <span>{bookingData.selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Patient:</span>
                        <span>{bookingData.userInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Phone:</span>
                        <span>{bookingData.userInfo.phone}</span>
                      </div>
                    </div>

                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          Total Amount:
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {therapy.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleProceedToPayment}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{therapy.name}</h4>
                  <Badge className="mt-1">{therapy.dosha}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{clinic.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>
                      {clinic.rating} ({clinic.reviews} reviews)
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{therapy.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium text-primary">
                      {therapy.price}
                    </span>
                  </div>
                </div>

                {bookingData.selectedDate && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm">
                      <div className="font-medium">Selected Date:</div>
                      <div>{format(bookingData.selectedDate, "PPP")}</div>
                    </div>
                    {bookingData.selectedTime && (
                      <div className="text-sm mt-2">
                        <div className="font-medium">Selected Time:</div>
                        <div>{bookingData.selectedTime}</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
