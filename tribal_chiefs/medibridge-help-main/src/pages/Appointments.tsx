import { Calendar, Clock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";

const Appointments = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            My Appointments
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Appointments
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            View and manage all your upcoming and past medical appointments in one place.
          </p>
        </div>

        {/* No Appointments State */}
        <Card className="max-w-2xl mx-auto border-muted bg-muted/10">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Booked Appointments</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any appointments scheduled yet. Book your first appointment with our qualified specialists.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link to="/checkup">
                      <Calendar className="h-4 w-4 mr-2" />
                      Click Here to Book an Appointment with a Specialist
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/emergency">
                      <Phone className="h-4 w-4 mr-2" />
                      Emergency Services
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <Card className="hover:shadow-medical transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <User className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">General Checkup</CardTitle>
              <CardDescription>Schedule routine health examination</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/checkup">Book Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medical transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-lg">Specialist Consultation</CardTitle>
              <CardDescription>Book with specialized doctors</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/specialists">Book Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medical transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-emergency/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Phone className="h-6 w-6 text-emergency" />
              </div>
              <CardTitle className="text-lg">Emergency Care</CardTitle>
              <CardDescription>24/7 emergency medical support</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground">
                <Link to="/emergency">Emergency</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-12 max-w-2xl mx-auto bg-gradient-card border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-primary">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you with appointments and medical inquiries.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                (555) 123-4567
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                24/7 Support
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Appointments;