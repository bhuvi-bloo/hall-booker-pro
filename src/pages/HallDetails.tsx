import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBooking } from '@/context/BookingContext';
import Header from '@/components/layout/Header';
import BookingCalendar from '@/components/booking/BookingCalendar';
import BookingForm from '@/components/booking/BookingForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Users, CheckCircle } from 'lucide-react';

const HallDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { halls } = useBooking();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const hall = halls.find(h => h.id === id);

  if (!hall) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Hall Not Found</h1>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleBookingSuccess = () => {
    setSelectedDate(null);
    navigate('/bookings');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Halls
          </Link>
        </Button>

        {/* Hall Header */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 animate-fade-in">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-9xl font-bold text-primary-foreground/10">
              {hall.name.charAt(0)}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-primary/80 to-transparent">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              {hall.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-primary-foreground/90">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {hall.capacity} seats
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {hall.location}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-1 space-y-6 animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About This Hall</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{hall.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {hall.facilities.map((facility) => (
                    <li key={facility} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success" />
                      {facility}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Capacity</span>
                  <Badge variant="secondary">{hall.capacity} people</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Location</span>
                  <span className="text-sm font-medium">{hall.location}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Calendar & Booking */}
          <div className="lg:col-span-2 space-y-6" style={{ animationDelay: '0.1s' }}>
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingCalendar
                  hallId={hall.id}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <CardHeader>
                <CardTitle className="text-lg">Booking Details</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingForm
                  hall={hall}
                  selectedDate={selectedDate}
                  onSuccess={handleBookingSuccess}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HallDetails;
