import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Building2, Users, CheckCircle, ArrowRight } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Building2,
      title: 'Multiple Venues',
      description: 'Choose from various seminar halls with different capacities',
    },
    {
      icon: Calendar,
      title: 'Real-time Availability',
      description: 'Check instant availability and book your preferred slot',
    },
    {
      icon: Users,
      title: 'Easy Management',
      description: 'Track bookings, get approvals, and manage events efficiently',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground/80 text-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              Now booking for 2025
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Book Seminar Halls
              <span className="block text-secondary">with Ease</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Streamline your event planning with our modern booking platform. 
              Find the perfect venue, check availability, and secure your spot in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="accent-gradient text-secondary-foreground hover:opacity-90 transition-opacity"
              >
                <Link to="/login">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/register">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
            <path 
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose HallBook?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform makes booking seminar halls simple, fast, and hassle-free
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="h-12 w-12 rounded-xl primary-gradient flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Book Your Next Event?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join hundreds of users who trust HallBook for their venue bookings
            </p>
            <Button asChild size="lg">
              <Link to="/register">
                <CheckCircle className="h-5 w-5 mr-2" />
                Sign Up Now — It's Free
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2025 HallBook. Seminar Hall Booking System.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
