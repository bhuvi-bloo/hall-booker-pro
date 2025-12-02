import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient items-center justify-center p-12">
        <div className="max-w-md text-center animate-fade-in">
          <div className="h-20 w-20 rounded-2xl accent-gradient flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Calendar className="h-10 w-10 text-secondary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            HallBook
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Streamline your seminar hall bookings with our modern, intuitive platform.
          </p>
          <div className="grid grid-cols-3 gap-4 text-primary-foreground/70 text-sm">
            <div className="p-4 rounded-lg bg-primary-foreground/5 backdrop-blur-sm">
              <p className="text-2xl font-bold text-secondary mb-1">3+</p>
              <p>Venues</p>
            </div>
            <div className="p-4 rounded-lg bg-primary-foreground/5 backdrop-blur-sm">
              <p className="text-2xl font-bold text-secondary mb-1">370+</p>
              <p>Capacity</p>
            </div>
            <div className="p-4 rounded-lg bg-primary-foreground/5 backdrop-blur-sm">
              <p className="text-2xl font-bold text-secondary mb-1">24/7</p>
              <p>Booking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md border-border/50 shadow-lg animate-slide-up">
          <CardHeader className="text-center pb-2">
            <div className="lg:hidden h-14 w-14 rounded-xl primary-gradient flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-7 w-7 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <p className="font-medium text-foreground mb-1">Demo Credentials:</p>
                <p className="text-muted-foreground">Admin: admin@example.com / Admin@123</p>
                <p className="text-muted-foreground">User: user1@example.com / User@123</p>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
