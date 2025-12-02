import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import Header from '@/components/layout/Header';
import BookingStatusBadge from '@/components/booking/BookingStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Building2, Clock, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';

const BookingHistory = () => {
  const { user } = useAuth();
  const { getUserBookings } = useBooking();

  const bookings = getUserBookings(user?.id || '').sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Bookings</h1>
            <p className="text-muted-foreground">Track and manage your booking requests</p>
          </div>
          <Button asChild>
            <Link to="/dashboard">
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-primary/10 text-primary' },
            { label: 'Pending', value: stats.pending, color: 'bg-warning/10 text-warning' },
            { label: 'Approved', value: stats.approved, color: 'bg-success/10 text-success' },
            { label: 'Rejected', value: stats.rejected, color: 'bg-destructive/10 text-destructive' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`p-4 rounded-xl ${stat.color} animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bookings Table */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-medium mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by booking a seminar hall for your event
                </p>
                <Button asChild>
                  <Link to="/dashboard">Browse Halls</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hall</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Attendees</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg primary-gradient flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="font-medium">{booking.hallName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {format(new Date(booking.date), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {booking.timeSlot}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm line-clamp-1 max-w-[200px]">
                            {booking.purpose}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {booking.attendees}
                          </div>
                        </TableCell>
                        <TableCell>
                          <BookingStatusBadge status={booking.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BookingHistory;
