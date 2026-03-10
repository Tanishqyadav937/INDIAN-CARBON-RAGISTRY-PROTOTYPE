import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Leaf, Eye, EyeOff, Mail, Lock, User, Building, AlertCircle, CheckCircle } from 'lucide-react';
import { Page } from '../App';
import { getApiUrl } from '../lib/api';

interface SignupPageProps {
  onNavigate: (page: Page) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationType: 'Individual' as const,
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const organizationTypes = [
    'Individual',
    'Corporate',
    'Government',
    'NGO',
    'Research'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the Terms & Conditions');
      setIsLoading(false);
      return;
    }

    // Check if trying to register with demo email
    const demoEmails = [
      'demo@carbonregistry.gov.in',
      'contact@greenenergy.com',
      'info@forestngo.org',
      'verifier@carboncheck.com'
    ];

    if (demoEmails.includes(formData.email.toLowerCase())) {
      setError('This email is reserved for demo purposes. Please use a different email address.');
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = getApiUrl();
      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        organization: {
          name: formData.organizationName || undefined,
          type: formData.organizationType
        }
      };

      // Reset demo users in the background to ensure they're always available
      try {
        await fetch(`${apiUrl}/api/auth/reset-demo-users`);
        console.log('Demo users reset during registration');
      } catch (resetErr) {
        console.error('Failed to reset demo users during registration:', resetErr);
      }

      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (data.success) {
        setSuccess('Registration successful! Please check your email to verify your account.');
        setTimeout(() => {
          onNavigate('verify-email');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please check if the backend server is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-green-50 via-beige-50 to-cornsilk-50 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(204,213,174,0.08),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(233,237,201,0.06),transparent_60%)]"></div>
      <div className="relative w-full max-w-lg">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-tea-green-100 to-tea-green-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
          <Card className="relative bg-white rounded-2xl shadow-premium-xl border border-tea-green-200">
            <CardHeader className="text-center pb-4 pt-6">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-tea-green-100 rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-display font-light text-foreground mb-1">
                Join Carbon Registry
              </CardTitle>
              <CardDescription className="text-base text-tea-green-200 font-light">
                Create your account to start registering carbon projects
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 px-6 pb-6">
              {/* Success Message */}
              {success && (
                <div className="bg-tea-green-50 border border-tea-green-200 rounded-2xl p-4 flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-tea-green-100 flex-shrink-0" />
                  <span className="text-sm text-tea-green-200 font-medium">{success}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-700 font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-tea-green-200" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="pl-10 h-10 rounded-xl border-2 border-tea-green-200 focus:border-tea-green-100 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-tea-green-200" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your-email@example.com"
                      className="pl-10 h-10 rounded-xl border-2 border-tea-green-200 focus:border-tea-green-100 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-tea-green-200" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="pl-10 pr-10 h-10 rounded-xl border-2 border-tea-green-200 focus:border-tea-green-100 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-tea-green-200 hover:text-tea-green-100 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-tea-green-200" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="pl-10 h-10 rounded-xl border-2 border-tea-green-200 focus:border-tea-green-100 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Organization Type */}
                <div className="space-y-2">
                  <Label htmlFor="organizationType" className="text-sm font-medium text-foreground">
                    Organization Type *
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-tea-green-200" />
                    <select
                      id="organizationType"
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 h-10 border-2 border-tea-green-200 rounded-xl bg-background text-sm focus:outline-none focus:border-tea-green-100"
                      required
                    >
                      {organizationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Organization Name */}
                {formData.organizationType !== 'Individual' && (
                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="text-sm font-medium text-foreground">
                      Organization Name
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-tea-green-200" />
                      <Input
                        id="organizationName"
                        name="organizationName"
                        type="text"
                        value={formData.organizationName}
                        onChange={handleChange}
                        placeholder="Your organization name"
                        className="pl-10 h-10 rounded-xl border-2 border-tea-green-200 focus:border-tea-green-100 text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-tea-green-100 border-tea-green-200 rounded focus:ring-tea-green-100 mt-0.5"
                    required
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-tea-green-200">
                    I agree to the{' '}
                    <a href="#" className="text-tea-green-100 hover:underline font-medium">Terms & Conditions</a>
                    {' '}and{' '}
                    <a href="#" className="text-tea-green-100 hover:underline font-medium">Privacy Policy</a>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-tea-green-100 hover:bg-tea-green-200 text-white h-10 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
          </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-tea-green-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-tea-green-200 font-medium">Or</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-tea-green-200">
                  Already have an account?{' '}
                  <button
                    onClick={() => onNavigate('login')}
                    className="font-medium text-tea-green-100 hover:text-tea-green-200 transition-colors"
                  >
                    Sign in here
                  </button>
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={() => onNavigate('landing')}
                  className="text-sm text-tea-green-200 hover:text-tea-green-100 transition-colors font-medium"
                >
                  ← Back to Home
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Info Card */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-2xl shadow-premium-xl border border-tea-green-200 max-w-xs">
        <h3 className="font-semibold text-sm mb-2 text-tea-green-100">Why Join?</h3>
        <div className="text-xs space-y-1.5 text-tea-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-tea-green-100" />
            <span>Register carbon credit projects</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-tea-green-100" />
            <span>Track emissions & progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-tea-green-100" />
            <span>Trade in secure marketplace</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-tea-green-100" />
            <span>Government verification</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
