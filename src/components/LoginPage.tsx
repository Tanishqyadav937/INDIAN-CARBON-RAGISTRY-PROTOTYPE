import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Leaf, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Page, User } from '../App';
import { getApiUrl } from '../lib/api';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onLogin: (user: User, token: string) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    setRequiresVerification(false);

    try {
      const apiUrl = getApiUrl();
      
      // First, try to reset demo user if using demo credentials
      if (formData.email === 'demo@carbonregistry.gov.in' && formData.password === 'demo123') {
        try {
          await fetch(`${apiUrl}/api/auth/reset-demo-users`);
          console.log('Demo user reset attempted');
        } catch (resetErr) {
          console.error('Failed to reset demo user:', resetErr);
        }
      }

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        setSuccess('Login successful! Redirecting...');
        onLogin(data.data.user, data.data.token);
      } else {
        // If using demo credentials but login failed, try to reset and login again
        if (formData.email === 'demo@carbonregistry.gov.in' && formData.password === 'demo123' && !data.success) {
          setError('Demo login failed. Attempting to reset demo user...');
          
          try {
            await fetch(`${apiUrl}/api/auth/reset-demo-users`);
            
            // Try login again after reset
            const retryResponse = await fetch(`${apiUrl}/api/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
            
            const retryData = await retryResponse.json();
            
            if (retryData.success) {
              setSuccess('Login successful after reset! Redirecting...');
              onLogin(retryData.data.user, retryData.data.token);
              return;
            } else {
              setError('Demo login failed even after reset. Please contact support.');
            }
          } catch (resetErr) {
            setError('Failed to reset demo user. Please try again later.');
          }
        } else {
          setError(data.message || 'Login failed. Please check your credentials.');
          if (data.requiresVerification) {
            setRequiresVerification(true);
          }
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check if the backend server is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Verification email sent! Please check your inbox.');
        setRequiresVerification(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to resend verification email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-green-50 via-beige-50 to-cornsilk-50 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(204,213,174,0.08),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(233,237,201,0.06),transparent_60%)]"></div>
      <div className="relative w-full max-w-lg">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-tea-green-100 to-tea-green-200 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
          <Card className="relative bg-white rounded-3xl shadow-premium-xl border border-tea-green-200">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-tea-green-100 rounded-2xl flex items-center justify-center shadow-lg">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-display font-light text-foreground mb-2">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-lg text-tea-green-200 font-light">
                Sign in to your India Carbon Registry account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
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

          {/* Verification Required */}
          {requiresVerification && (
            <div className="bg-papaya-whip-50 border border-papaya-whip-200 rounded-md p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="h-4 w-4 text-papaya-whip-300" />
                <span className="text-sm font-medium text-papaya-whip-100">
                  Email Verification Required
                </span>
              </div>
              <p className="text-sm text-papaya-whip-200 mb-3">
                Please verify your email address before logging in.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={handleResendVerification}
                className="w-full border-papaya-whip-300 text-papaya-whip-200 hover:bg-papaya-whip-50"
              >
                Resend Verification Email
              </Button>
            </div>
          )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-medium text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-tea-green-200" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your-email@example.com"
                      className="pl-12 h-12 rounded-2xl border-2 border-tea-green-200 focus:border-tea-green-100 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-base font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-tea-green-200" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="pl-12 pr-12 h-12 rounded-2xl border-2 border-tea-green-200 focus:border-tea-green-100 text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-tea-green-200 hover:text-tea-green-100 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-tea-green-100 border-gray-300 rounded focus:ring-tea-green-100"
                />
                <label htmlFor="remember" className="text-tea-green-200">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-tea-green-100 hover:text-tea-green-200 font-medium"
              >
                Forgot password?
              </button>
            </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-tea-green-100 hover:bg-tea-green-200 text-white h-12 rounded-2xl text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
          </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-tea-green-200" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-white px-4 text-tea-green-200 font-medium">Or</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-base text-tea-green-200">
                  Don't have an account?{' '}
                  <button
                    onClick={() => onNavigate('signup')}
                    className="font-medium text-tea-green-100 hover:text-tea-green-200 transition-colors"
                  >
                    Sign up here
                  </button>
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={() => onNavigate('landing')}
                  className="text-base text-tea-green-200 hover:text-tea-green-100 transition-colors font-medium"
                >
                  ← Back to Home
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Demo Credentials */}
      <div className="fixed bottom-6 right-6 bg-white p-6 rounded-3xl shadow-premium-xl border border-tea-green-200 max-w-sm">
        <h3 className="font-semibold text-base mb-3 text-tea-green-100">Demo Credentials</h3>
        <div className="text-sm space-y-2 text-tea-green-200">
          <div><strong>Admin:</strong> demo@carbonregistry.gov.in / demo123</div>
          <div className="text-tea-green-200 mt-3 border-t border-tea-green-200 pt-3 text-sm">
            <button 
              onClick={async () => {
                try {
                  const apiUrl = getApiUrl();
                  await fetch(`${apiUrl}/api/auth/reset-demo-users`);
                  setSuccess('Demo user reset successfully!');
                  setTimeout(() => setSuccess(''), 3000);
                } catch (err) {
                  setError('Failed to reset demo user');
                  setTimeout(() => setError(''), 3000);
                }
              }}
              className="text-tea-green-100 hover:text-tea-green-200 underline font-medium transition-colors"
            >
              Reset Demo User
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
