import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import Header from '@/components/layout/Header';
import HallCard from '@/components/halls/HallCard';
import { Building2, Calendar, Users, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { halls, bookings } = useBooking();

  const userBookings = bookings.filter(b => b.userId === user?.id);
  const pendingCount = userBookings.filter(b => b.status === 'pending').length;
  const approvedCount = userBookings.filter(b => b.status === 'approved').length;

  const stats = [
    { label: 'Available Halls', value: halls.length, icon: Building2, color: 'text-primary' },
    { label: 'Your Bookings', value: userBookings.length, icon: Calendar, color: 'text-secondary' },
    { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-warning' },
    { label: 'Approved', value: approvedCount, icon: Users, color: 'text-success' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Browse and book seminar halls for your upcoming events.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="p-4 bg-card rounded-xl border border-border/50 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Halls Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">Seminar Halls</h2>
          <p className="text-muted-foreground text-sm">
            Select a hall to view details and make a booking
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall, index) => (
            <div
              key={hall.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <HallCard hall={hall} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
