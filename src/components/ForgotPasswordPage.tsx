import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Leaf, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Page } from '../App';
import { getApiUrl } from '../lib/api';

interface ForgotPasswordPageProps {
  onNavigate: (page: Page) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Password reset code has been sent to your email!');
      } else {
        setError(data.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Network error. Please check if the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-600 p-3 rounded-full">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Reset Password
          </CardTitle>
        <CardDescription className="text-base">
          Enter your email to receive a password reset code
        </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-green-700">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                'Send Reset Code'
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="font-medium text-green-600 hover:text-green-500"
              >
                Back to login
              </button>
            </p>
            
            <button
              onClick={() => onNavigate('landing')}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center mx-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
