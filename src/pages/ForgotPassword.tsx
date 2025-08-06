import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Reset email sent!",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/auth')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">ELEVANA</h1>
            <p className="text-muted-foreground">Reset your password</p>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Forgot Password?</CardTitle>
            <CardDescription>
              {emailSent 
                ? "We've sent you a reset link" 
                : "Enter your email to receive a password reset link"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Check your email and click the link to reset your password.
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Send Another Email
                  </Button>
                  <Button
                    onClick={() => navigate('/auth')}
                    variant="gradient"
                    className="w-full"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  variant="gradient"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;