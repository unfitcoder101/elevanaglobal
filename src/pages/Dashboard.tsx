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
import { Label } from '@/components/ui/label';
import ProjectRequestModal from '@/components/ProjectRequestModal';
import PaymentRequestModal from '@/components/PaymentRequestModal';
import PaymentGateway from '@/components/PaymentGateway';
import { 
  LogOut, 
  User, 
  Plus, 
  Clock, 
  IndianRupee, 
  CheckCircle, 
  AlertCircle,
  Settings,
  BarChart3,
  CreditCard,
  Send,
  Users,
  Home
} from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  project_type: string;
  status: string;
  hours_worked: number;
  estimated_hours: number | null;
  estimated_cost: number | null;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
  admin_id: string | null;
  notes: string | null;
}

interface ProjectPayment {
  id: string;
  project_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  due_date: string | null;
  created_at: string;
  reference_number: string | null;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showProjectRequest, setShowProjectRequest] = useState(false);
  const [showPaymentRequest, setShowPaymentRequest] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ProjectPayment | null>(null);

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
      
      // Check if user is admin using the has_role function
      const { data: adminCheck } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });
      setIsAdmin(adminCheck || false);
      
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

      // Load projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error loading projects:', projectsError);
      } else {
        setProjects(projectsData || []);
      }

      // Load project payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('project_payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('Error loading payments:', paymentsError);
      } else {
        setPayments(paymentsData || []);
      }

      // Load all users if admin
      if (adminCheck) {
        const { data: usersData } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .neq('user_id', user.id);
        
        if (usersData) {
          setAllUsers(usersData);
        }
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
      .reduce((sum, p) => sum + Number(p.amount), 0);
  };

  const getDueAmount = () => {
    return payments
      .filter(p => p.status === 'pending' && p.due_date && new Date(p.due_date) < new Date())
      .reduce((sum, p) => sum + Number(p.amount), 0);
  };

  const getPendingAmount = () => {
    return payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + Number(p.amount), 0);
  };

  const handlePaymentRequest = (project: Project) => {
    setSelectedProject(project);
    setShowPaymentRequest(true);
  };

  const handleCreateProjectRequest = () => {
    if (selectedUserId) {
      setShowProjectRequest(true);
    } else {
      toast({
        title: "Select a user",
        description: "Please select a user to send a project request to.",
        variant: "destructive",
      });
    }
  };

  const handlePayNow = (payment: ProjectPayment) => {
    setSelectedPayment(payment);
    setShowPaymentGateway(true);
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
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
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
                ₹{getPaidAmount().toFixed(2)}
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
                ₹{getDueAmount().toFixed(2)}
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
                ₹{getPendingAmount().toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Admin Panel
              </CardTitle>
              <CardDescription>Manage projects and users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label>Select User to Create Project For</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    <option value="">Choose a user...</option>
                    {allUsers.map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.full_name || 'Unknown User'}
                      </option>
                    ))}
                  </select>
                </div>
                <Button 
                  onClick={handleCreateProjectRequest}
                  variant="gradient"
                  disabled={!selectedUserId}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Send Project Request
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest project updates</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No recent activity. Your projects will appear here once they're created.
              </p>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{project.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated: {new Date(project.updated_at).toLocaleDateString()} • 
                        {project.hours_worked} hours worked
                      </p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Your Projects
                {isAdmin && (
                  <Badge variant="outline">Admin View</Badge>
                )}
              </CardTitle>
              <CardDescription>Track the progress of your ongoing projects</CardDescription>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Projects created by admin will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{project.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePaymentRequest(project)}
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Payment
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {project.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {project.description}
                        </p>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.completion_percentage}%</span>
                        </div>
                        <Progress value={project.completion_percentage} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-muted-foreground">
                        <div>
                          <span>Hours: {project.hours_worked}</span>
                          {project.estimated_hours && (
                            <span> / {project.estimated_hours}</span>
                          )}
                        </div>
                        <div>
                          {project.estimated_cost && (
                            <span>Cost: ₹{Number(project.estimated_cost).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                        <span>Type: {project.project_type.replace('-', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment History
              </CardTitle>
              <CardDescription>Track your payment requests and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payments yet</h3>
                  <p className="text-muted-foreground">
                    Payment requests will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">₹{Number(payment.amount).toLocaleString()}</span>
                        <Badge className={getPaymentStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                      
                      {payment.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {payment.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Ref: {payment.reference_number}</span>
                        <span>{new Date(payment.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      {payment.due_date && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {new Date(payment.due_date).toLocaleDateString()}
                        </p>
                      )}
                      
                      {payment.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="gradient"
                          onClick={() => handlePayNow(payment)}
                          className="mt-2 w-full"
                        >
                          <CreditCard className="w-3 h-3 mr-1" />
                          Pay Now
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Modals */}
        <ProjectRequestModal
          isOpen={showProjectRequest}
          onClose={() => setShowProjectRequest(false)}
          targetUserId={selectedUserId}
          onSuccess={loadUserData}
        />
        
        {selectedProject && (
          <PaymentRequestModal
            isOpen={showPaymentRequest}
            onClose={() => setShowPaymentRequest(false)}
            projectId={selectedProject.id}
            userId={selectedProject.user_id}
            projectTitle={selectedProject.title}
          />
        )}
        
        {selectedPayment && (
          <PaymentGateway
            isOpen={showPaymentGateway}
            onClose={() => setShowPaymentGateway(false)}
            payment={{
              id: selectedPayment.id,
              amount: Number(selectedPayment.amount),
              description: selectedPayment.description || 'Project payment',
              reference_number: selectedPayment.reference_number || 'N/A'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;