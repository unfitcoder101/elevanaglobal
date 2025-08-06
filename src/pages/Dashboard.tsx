import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  LogOut, 
  User, 
  Plus, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  Settings,
  Upload,
  BarChart3
} from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface UserRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  hours_worked: number;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  due_date: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoadingData(true);
      
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
      } else if (profileData) {
        setProfile(profileData);
      }

      // Load user requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('user_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error loading requests:', requestsError);
      } else {
        setRequests(requestsData || []);
      }

      // Load payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('Error loading payments:', paymentsError);
      } else {
        setPayments(paymentsData || []);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'pending': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaidAmount = () => {
    return payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getDueAmount = () => {
    return payments
      .filter(p => p.status === 'pending' && p.due_date && new Date(p.due_date) < new Date())
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getPendingAmount = () => {
    return payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">ELEVANA Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/profile')}>
              <Settings className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">
                Welcome back, {profile?.full_name || user?.email?.split('@')[0] || 'User'}!
              </h2>
              <p className="text-muted-foreground">Here's what's happening with your projects</p>
            </div>
          </div>
        </div>

        {/* Payment Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${getPaidAmount().toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total amount paid
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Due</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${getDueAmount().toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Overdue payments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ${getPendingAmount().toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with these common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                I want results like this
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Feedback
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest project updates</CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No recent activity. Create your first request to get started!
                </p>
              ) : (
                <div className="space-y-3">
                  {requests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{request.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>Track the progress of your ongoing projects</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first project by clicking "I want results like this"
                </p>
                <Button variant="gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{request.title}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {request.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{request.progress_percentage}%</span>
                      </div>
                      <Progress value={request.progress_percentage} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                      <span>Hours worked: {request.hours_worked}</span>
                      <span>Updated: {new Date(request.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;