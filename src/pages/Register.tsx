import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  const features = [
    'Book seminar halls instantly',
    'Real-time availability',
    'Track your bookings',
    'Receive booking updates',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient items-center justify-center p-12">
        <div className="max-w-md animate-fade-in">
          <div className="h-20 w-20 rounded-2xl accent-gradient flex items-center justify-center mb-8 shadow-lg">
            <Calendar className="h-10 w-10 text-secondary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Join HallBook
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Create your account and start booking seminar halls in minutes.
          </p>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-primary-foreground/80">
                <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md border-border/50 shadow-lg animate-slide-up">
          <CardHeader className="text-center pb-2">
            <div className="lg:hidden h-14 w-14 rounded-xl primary-gradient flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-7 w-7 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Enter your details to get started</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  autoComplete="name"
                />
              </div>

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
                    autoComplete="new-password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  autoComplete="new-password"
                />
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
