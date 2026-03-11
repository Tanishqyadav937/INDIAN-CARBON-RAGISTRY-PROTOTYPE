import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollReveal } from './ui/scroll-reveal';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Page, User } from '../App';
import { getApiUrl } from '../lib/api';

interface VerifyEmailPageProps {
  onNavigate: (page: Page) => void;
  onLogin: (user: User, token: string) => void;
}

export function VerifyEmailPage({ onNavigate, onLogin }: VerifyEmailPageProps) {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');

  // Check URL parameters for token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      handleVerification(urlToken);
    }
  }, []);

  const handleVerification = async (verificationToken: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Email verified successfully! Welcome to India Carbon Registry!');
        setTimeout(() => {
          onLogin(data.data.user, data.data.token);
        }, 2000);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Network error. Please check if the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please enter the verification token');
      return;
    }
    await handleVerification(token);
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first');
      return;
    }

    setIsResending(true);
    setError('');

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Verification email sent successfully! Please check your inbox.');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
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
              <ScrollReveal direction="up" distance={20} delay={100}>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-tea-green-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={25} delay={200}>
                <CardTitle className="text-3xl font-display font-light text-foreground mb-2">
                  Verify Your Email
                </CardTitle>
              </ScrollReveal>
              <ScrollReveal direction="up" distance={20} delay={300}>
                <CardDescription className="text-lg text-tea-green-200 font-light">
                  Enter the verification code sent to your email
                </CardDescription>
              </ScrollReveal>
            </CardHeader>

            <CardContent className="space-y-6 px-8 pb-8">
              {/* Success Message */}
              {success && (
                <ScrollReveal direction="up" distance={20} delay={400}>
                  <div className="bg-tea-green-50 border border-tea-green-200 rounded-2xl p-4 flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-tea-green-100 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-tea-green-200">Success!</p>
                      <p className="text-sm text-tea-green-200">{success}</p>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Error Message */}
              {error && (
                <ScrollReveal direction="up" distance={20} delay={400}>
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Error</p>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Instructions */}
              <ScrollReveal direction="up" distance={20} delay={500}>
                <div className="bg-buff-50 border border-buff-200 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-buff-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Check Your Email</p>
                      <p className="text-sm text-tea-green-200 font-light">
                        We've sent a verification link to your email address. Click the link or enter the verification code below.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <form onSubmit={handleSubmit} className="space-y-6">
                <ScrollReveal direction="up" distance={20} delay={600}>
                  <div className="space-y-3">
                    <Label htmlFor="token" className="text-base font-medium text-foreground">
                      Verification Code
                    </Label>
                    <Input
                      id="token"
                      type="text"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Enter verification code"
                      className="text-center text-lg tracking-widest font-mono h-12 rounded-2xl border-2 border-tea-green-200 focus:border-tea-green-100"
                      required
                    />
                    <p className="text-xs text-tea-green-200 text-center font-light">
                      Check your email for the verification code
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" distance={20} delay={700}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-tea-green-100 hover:bg-tea-green-200 text-white h-12 rounded-2xl text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Verifying...
                      </>
                    ) : (
                      'Verify Email'
                    )}
                  </Button>
                </ScrollReveal>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-tea-green-200" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-white px-4 text-tea-green-200 font-medium">Need help?</span>
                </div>
              </div>

              {/* Resend Email Section */}
              <ScrollReveal direction="up" distance={20} delay={800}>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-medium text-foreground">
                      Didn't receive the email?
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email to resend"
                      className="h-12 rounded-2xl border-2 border-tea-green-200 focus:border-tea-green-100"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full border-tea-green-200 text-tea-green-100 hover:bg-tea-green-50 rounded-2xl h-12"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>
                </div>
              </ScrollReveal>

              <div className="text-center space-y-4">
                <ScrollReveal direction="up" distance={20} delay={900}>
                  <p className="text-base text-tea-green-200">
                    Already verified?{' '}
                    <button
                      onClick={() => onNavigate('login')}
                      className="font-medium text-tea-green-100 hover:text-tea-green-200 transition-colors"
                    >
                      Sign in here
                    </button>
                  </p>
                </ScrollReveal>
                
                <ScrollReveal direction="up" distance={20} delay={1000}>
                  <button
                    onClick={() => onNavigate('landing')}
                    className="text-base text-tea-green-200 hover:text-tea-green-100 transition-colors font-medium"
                  >
                    ← Back to Home
                  </button>
                </ScrollReveal>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Card */}
        <div className="fixed bottom-6 right-6 bg-white p-6 rounded-3xl shadow-premium-xl border border-tea-green-200 max-w-sm">
          <h3 className="font-semibold text-base mb-3 text-tea-green-100">Email Issues?</h3>
          <div className="text-sm space-y-2 text-tea-green-200">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-tea-green-100" />
              <span>Check your spam/junk folder</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-tea-green-100" />
              <span>Email may take 2-3 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-tea-green-100" />
              <span>Ensure correct email address</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-tea-green-100" />
              <span>Contact support if needed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
