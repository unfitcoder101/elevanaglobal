import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import UserSearchModal from '@/components/UserSearchModal';
import PaymentRequestModal from '@/components/PaymentRequestModal';
import { 
  IndianRupee, 
  Send, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  Home,
  MessageSquare,
  UserCheck,
  Search,
  BarChart3,
  Edit3,
  Save
} from 'lucide-react';

interface BusinessCustomization {
  id: string;
  name: string;
  email: string;
  phone?: string;
  business_name: string;
  business_type: string;
  description: string;
  budget_range?: string;
  timeline?: string;
  status: string;
  estimated_cost?: number;
  created_at: string;
  additional_requirements?: string;
}

interface PaymentRequest {
  user_id: string;
  amount: number;
  description: string;
  due_date?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [customizations, setCustomizations] = useState<BusinessCustomization[]>([]);
  const [contactRequests, setContactRequests] = useState<any[]>([]);
  const [growthAudits, setGrowthAudits] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [projectRequests, setProjectRequests] = useState<any[]>([]);
  const [selectedCustomization, setSelectedCustomization] = useState<BusinessCustomization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingPayment, setSendingPayment] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>({
    user_id: '',
    amount: 0,
    description: '',
    due_date: ''
  });
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Read active tab from URL (e.g., /admin?tab=messages)
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'customizations';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    loadAllData();
    
    // Set up real-time subscriptions
    const setupRealtime = () => {
      // Subscribe to projects table changes
      const projectsChannel = supabase
        .channel('projects_realtime')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'projects'
        }, () => {
          loadAllData();
        })
        .subscribe();

      // Subscribe to project_payments table changes
      const paymentsChannel = supabase
        .channel('payments_realtime')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'project_payments'
        }, () => {
          loadAllData();
        })
        .subscribe();

      // Subscribe to project_requests table changes
      const requestsChannel = supabase
        .channel('requests_realtime')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'project_requests'
        }, () => {
          loadAllData();
        })
        .subscribe();

      // Subscribe to messages table changes
      const messagesChannel = supabase
        .channel('messages_realtime')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages'
        }, () => {
          loadAllData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(projectsChannel);
        supabase.removeChannel(paymentsChannel);
        supabase.removeChannel(requestsChannel);
        supabase.removeChannel(messagesChannel);
      };
    };

    const cleanup = setupRealtime();
    return cleanup;
  }, []);

  const loadAllData = async () => {
    try {
      // Load business customizations
      const { data: customizationsData, error: customizationsError } = await supabase
        .from('business_customizations')
        .select('*')
        .order('created_at', { ascending: false });

      if (customizationsError) throw customizationsError;
      setCustomizations(customizationsData || []);

      // Load contact requests
      const { data: contactData, error: contactError } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactError) throw contactError;
      setContactRequests(contactData || []);

      // Load growth audit submissions
      const { data: auditData, error: auditError } = await supabase
        .from('growth_audit_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (auditError) throw auditError;
      setGrowthAudits(auditData || []);

      // Load leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;
      setLeads(leadsData || []);

      // Load project requests
      const { data: projectRequestsData, error: projectRequestsError } = await supabase
        .from('project_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectRequestsError) throw projectRequestsError;
      setProjectRequests(projectRequestsData || []);

      // Load all payment history for admin view
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('project_payments')
        .select(`
          *,
          profiles!project_payments_user_id_fkey(full_name),
          projects!project_payments_project_id_fkey(title)
        `)
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('Error loading payments:', paymentsError);
      } else {
        setPaymentHistory(paymentsData || []);
      }

      // Load projects for admin view
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          profiles!projects_user_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error loading projects:', projectsError);
      } else {
        setProjects(projectsData || []);
      }

      // Load messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error loading messages:', messagesError);
      } else {
        setMessages(messagesData || []);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomizationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('business_customizations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setCustomizations(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status } : item
        )
      );

      toast({
        title: "Status updated",
        description: `Customization status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const sendPaymentRequest = async () => {
    if (!selectedCustomization) return;

    // This flow now requires an active project. Use the Projects tab → Request Payment.
    toast({
      title: 'Select a project to request payment',
      description: 'Open the Projects tab and click “Request Payment” on a project.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'quote_sent': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleConfirmPayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('project_payments')
        .update({ 
          admin_confirmed: true,
          confirmed_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;

      // Update local state
      setPaymentHistory(prev => 
        prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, admin_confirmed: true, confirmed_at: new Date().toISOString() }
            : payment
        )
      );

      toast({
        title: "Payment Confirmed",
        description: "Payment has been confirmed and user notification removed.",
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Error",
        description: "Failed to confirm payment.",
        variant: "destructive",
      });
    }
  };

  const generateReceipt = (customization: BusinessCustomization) => {
    const receipt = `
ELEVANA - SERVICE ESTIMATE

Customer Details:
Name: ${customization.name}
Email: ${customization.email}
Phone: ${customization.phone || 'Not provided'}
Business: ${customization.business_name}
Business Type: ${customization.business_type}

Project Details:
${customization.description}

Budget Range: ${customization.budget_range || 'Not specified'}
Timeline: ${customization.timeline || 'Not specified'}
Estimated Cost: ₹${customization.estimated_cost?.toLocaleString() || 'TBD'}

Additional Requirements:
${customization.additional_requirements || 'None'}

Date: ${new Date(customization.created_at).toLocaleDateString()}
Reference: REF-${customization.id.slice(0, 8).toUpperCase()}

---
ELEVANA - Your Digital Growth Partner
www.elevana.com | support@elevana.com
    `;

    // Download as text file
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ELEVANA-Receipt-${customization.business_name}-${customization.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary">ELEVANA Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage customer requests and send payment requests</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowUserSearch(true)}
                  className="flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Send Project Request
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home Page
                </Button>
              </div>
            </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="customizations" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Quote Requests ({customizations.length})
            </TabsTrigger>
            <TabsTrigger value="project-requests" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Project Requests ({projectRequests.length})
            </TabsTrigger>
            <TabsTrigger value="your-projects" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Your Projects ({user ? projects.filter(p => p.admin_id === user.id).length : 0})
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              All User Projects ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Payment History ({paymentHistory.length})
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages ({messages.length})
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Contact Requests ({contactRequests.length})
            </TabsTrigger>
            <TabsTrigger value="audits" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Growth Audits ({growthAudits.length})
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Leads ({leads.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customizations">
            {/* Business Customizations Tab */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Requests List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Business Customization Requests ({customizations.length})
                    </CardTitle>
                    <CardDescription>
                      All customer customization requests and service inquiries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {customizations.map((customization) => (
                        <div 
                          key={customization.id} 
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedCustomization?.id === customization.id ? 'border-primary bg-primary/5' : ''
                          }`}
                          onClick={() => setSelectedCustomization(customization)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{customization.business_name}</h3>
                            <Badge className={getStatusColor(customization.status)}>
                              {customization.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {customization.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(customization.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {customization.description.length > 100 
                              ? `${customization.description.substring(0, 100)}...` 
                              : customization.description}
                          </p>
                          
                          {customization.estimated_cost && (
                            <div className="flex items-center gap-1 text-primary font-semibold">
                              <IndianRupee className="w-4 h-4" />
                              {customization.estimated_cost.toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Details and Actions Panel */}
              <div className="space-y-6">
            {selectedCustomization ? (
              <>
                {/* Customer Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm">{selectedCustomization.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{selectedCustomization.email}</p>
                    </div>
                    {selectedCustomization.phone && (
                      <div>
                        <Label className="text-sm font-medium">Phone</Label>
                        <p className="text-sm">{selectedCustomization.phone}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium">Business</Label>
                      <p className="text-sm">{selectedCustomization.business_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <p className="text-sm">{selectedCustomization.business_type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Timeline</Label>
                      <p className="text-sm">{selectedCustomization.timeline || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Budget Range</Label>
                      <p className="text-sm">{selectedCustomization.budget_range || 'Not specified'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Status Update */}
                <Card>
                  <CardHeader>
                    <CardTitle>Update Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateCustomizationStatus(selectedCustomization.id, 'in_progress')}
                      >
                        In Progress
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateCustomizationStatus(selectedCustomization.id, 'quote_sent')}
                      >
                        Quote Sent
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateCustomizationStatus(selectedCustomization.id, 'completed')}
                      >
                        Completed
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => generateReceipt(selectedCustomization)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Send Payment Request */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IndianRupee className="w-5 h-5" />
                      Send Payment Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={paymentRequest.amount || ''}
                        onChange={(e) => setPaymentRequest({
                          ...paymentRequest,
                          amount: Number(e.target.value)
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Payment description..."
                        value={paymentRequest.description}
                        onChange={(e) => setPaymentRequest({
                          ...paymentRequest,
                          description: e.target.value
                        })}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="due_date">Due Date (Optional)</Label>
                      <Input
                        id="due_date"
                        type="date"
                        value={paymentRequest.due_date}
                        onChange={(e) => setPaymentRequest({
                          ...paymentRequest,
                          due_date: e.target.value
                        })}
                      />
                    </div>
                    
                    <Button 
                      onClick={sendPaymentRequest}
                      disabled={sendingPayment || !paymentRequest.amount}
                      className="w-full"
                      variant="gradient"
                    >
                      {sendingPayment ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Payment Request
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Customer</h3>
                  <p className="text-muted-foreground">
                    Click on a customer request to view details and send payment requests
                  </p>
                </CardContent>
              </Card>
            )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="project-requests">
            {/* Project Requests Tab */}
            <Card>
              <CardHeader>
                <CardTitle>Project Requests</CardTitle>
                <CardDescription>All project requests sent to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No project requests found</p>
                    </div>
                  ) : (
                    projectRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{request.title}</h3>
                          <Badge 
                            className={
                              request.status === 'accepted' ? 'bg-green-500' :
                              request.status === 'declined' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {request.profiles?.full_name || 'Unknown User'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(request.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {request.description || 'No description provided'}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Type: {request.project_type}</div>
                          {request.estimated_cost && (
                            <div className="flex items-center gap-1 text-primary">
                              <DollarSign className="w-3 h-3" />
                              ₹{request.estimated_cost.toLocaleString()}
                            </div>
                          )}
                        </div>
                        {request.estimated_hours && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Estimated Hours: {request.estimated_hours}
                          </div>
                        )}
                        {request.user_response_message && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <strong>User Response:</strong> {request.user_response_message}
                          </div>
                        )}
                        <div className="flex justify-end mt-3">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              const { error } = await supabase
                                .from('project_requests')
                                .delete()
                                .eq('id', request.id);
                              if (error) {
                                toast({
                                  title: "Error",
                                  description: "Failed to remove request.",
                                  variant: "destructive",
                                });
                              } else {
                                setProjectRequests((prev) => prev.filter((r) => r.id !== request.id));
                                toast({
                                  title: "Removed",
                                  description: "Request deleted.",
                                });
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="your-projects">
            {/* Your Projects Tab - Admin assigned projects */}
            <Card>
              <CardHeader>
                <CardTitle>Your Assigned Projects</CardTitle>
                <CardDescription>Projects where you are the assigned admin - manage progress and request payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!user ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Please log in to view your projects</p>
                    </div>
                  ) : projects.filter(p => p.admin_id === user.id).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No projects assigned to you yet</p>
                    </div>
                  ) : (
                    projects.filter(p => p.admin_id === user.id).map((project) => (
                      <div key={project.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">{project.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={
                                project.status === 'completed' ? 'bg-green-500' :
                                project.status === 'in_progress' ? 'bg-blue-500' :
                                'bg-yellow-500'
                              }
                            >
                              {project.status}
                            </Badge>
                            <Button
                              size="sm"
                              className="h-7 px-3 text-xs"
                              onClick={() => {
                                setSelectedProject(project);
                                setShowPaymentModal(true);
                              }}
                            >
                              <IndianRupee className="w-3 h-3 mr-1" />
                              Request Payment
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {project.profiles?.full_name || 'Unknown User'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {project.profiles?.email || 'No email'}
                          </div>
                        </div>
                        
                        {project.description && (
                          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        )}
                        
                        {/* Progress Section */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{project.completion_percentage || 0}%</span>
                          </div>
                          <Progress value={project.completion_percentage || 0} className="h-2" />
                        </div>
                        
                        {/* Admin Edit Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <Label className="text-xs">Hours Worked</Label>
                            <Input
                              type="number"
                              value={project.hours_worked || 0}
                              onChange={async (e) => {
                                const newHours = parseInt(e.target.value) || 0;
                                const { error } = await supabase
                                  .from('projects')
                                  .update({ hours_worked: newHours })
                                  .eq('id', project.id);
                                if (error) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to update hours",
                                    variant: "destructive",
                                  });
                                } else {
                                  // Update local state
                                  setProjects(prev => prev.map(p => 
                                    p.id === project.id ? { ...p, hours_worked: newHours } : p
                                  ));
                                }
                              }}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Completion %</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={project.completion_percentage || 0}
                              onChange={async (e) => {
                                const newPercentage = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                const { error } = await supabase
                                  .from('projects')
                                  .update({ completion_percentage: newPercentage })
                                  .eq('id', project.id);
                                if (error) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to update completion percentage",
                                    variant: "destructive",
                                  });
                                } else {
                                  setProjects(prev => prev.map(p => 
                                    p.id === project.id ? { ...p, completion_percentage: newPercentage } : p
                                  ));
                                }
                              }}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Estimated Cost</Label>
                            <div className="text-sm text-muted-foreground pt-1">
                              ₹{project.estimated_cost ? Number(project.estimated_cost).toLocaleString() : 'Not set'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Notes */}
                        <div className="mb-3">
                          <Label className="text-xs">Progress Notes</Label>
                          <Textarea
                            value={project.progress_notes || ''}
                            onChange={async (e) => {
                              const newNotes = e.target.value;
                              const { error } = await supabase
                                .from('projects')
                                .update({ 
                                  progress_notes: newNotes,
                                  updated_at: new Date().toISOString()
                                })
                                .eq('id', project.id);
                              if (error) {
                                toast({
                                  title: "Error",
                                  description: "Failed to update notes",
                                  variant: "destructive",
                                });
                              } else {
                                setProjects(prev => prev.map(p => 
                                  p.id === project.id ? { ...p, progress_notes: newNotes } : p
                                ));
                              }
                            }}
                            placeholder="Add progress notes with timestamps..."
                            className="min-h-[80px] text-sm"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                          <span>Type: {project.project_type.replace('-', ' ')}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            {/* All Projects Tab */}
            <Card>
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
                <CardDescription>All projects in the system with basic information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{project.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              project.status === 'completed' ? 'bg-green-500' :
                              project.status === 'in_progress' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }
                          >
                            {project.status}
                          </Badge>
                          {project.status === 'in_progress' && (
                            <Button
                              size="sm"
                              className="h-7 px-3 text-xs"
                              onClick={() => {
                                setSelectedProject(project);
                                setShowPaymentModal(true);
                              }}
                            >
                              <IndianRupee className="w-3 h-3 mr-1" />
                              Request Payment
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.profiles?.full_name || 'Unknown User'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {project.profiles?.email || 'No email'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(project.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {project.completion_percentage || 0}% Complete
                        </div>
                      </div>
                      
                      {/* Hours Tracking Section - Enhanced */}
                      <div className="mt-4 p-4 bg-primary/5 border-l-4 border-primary rounded-r">
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Hours Tracking
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs font-medium">Hours Worked</Label>
                            <Input
                              type="number"
                              min="0"
                              value={project.hours_worked || 0}
                              onChange={async (e) => {
                                const newHours = parseInt(e.target.value) || 0;
                                const { error } = await supabase
                                  .from('projects')
                                  .update({ hours_worked: newHours })
                                  .eq('id', project.id);
                                
                                if (!error) {
                                  setProjects(prev => prev.map(p => 
                                    p.id === project.id ? { ...p, hours_worked: newHours } : p
                                  ));
                                  toast({
                                    title: "Hours Updated",
                                    description: `Hours updated to ${newHours} for ${project.title}`,
                                  });
                                } else {
                                  toast({
                                    title: "Error",
                                    description: "Failed to update hours.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="text-sm h-9 border-2"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium">Estimated Total</Label>
                            <div className="text-sm font-semibold mt-2 p-2 bg-background rounded border">
                              {project.estimated_hours || 0} hours
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs font-medium">Progress</Label>
                            <div className="text-sm font-semibold mt-2 p-2 bg-background rounded border">
                              {project.estimated_hours 
                                ? Math.round(((project.hours_worked || 0) / project.estimated_hours) * 100)
                                : 0}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2">
                        {project.description || 'No description provided'}
                      </p>
                      
                      {project.estimated_cost && (
                        <div className="flex items-center gap-1 text-primary mt-2">
                          <DollarSign className="w-3 h-3" />
                          ₹{Number(project.estimated_cost).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            {/* Payment History Tab */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>All payment transactions across all users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          {payment.projects?.title || payment.description || 'Payment'}
                        </h3>
                        <Badge 
                          className={
                            payment.status === 'paid' ? 'bg-green-500' :
                            payment.status === 'pending' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {payment.profiles?.full_name || 'Unknown User'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(payment.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-3 h-3" />
                          ₹{Number(payment.amount).toLocaleString()}
                        </div>
                      </div>
                      {payment.reference_number && (
                        <div className="text-sm text-muted-foreground">
                          Transaction ID: {payment.reference_number}
                        </div>
                      )}
                      {payment.description && (
                        <div className="text-sm mt-2">
                          {payment.description}
                        </div>
                      )}
                      {payment.status === 'paid' && !payment.admin_confirmed && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <div className="text-sm text-amber-600 font-medium">
                            ⚠️ Payment completed - Awaiting admin confirmation
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleConfirmPayment(payment.id)}
                            className="ml-2"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Confirm Payment
                          </Button>
                        </div>
                      )}
                      {payment.admin_confirmed && (
                        <div className="text-sm text-green-600 mt-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Admin confirmed - {payment.confirmed_at ? new Date(payment.confirmed_at).toLocaleDateString() : 'Recently confirmed'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            {/* Messages Tab */}
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>All messages from website visitors and forms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{message.name}</h3>
                        <Badge variant={message.status === 'unread' ? 'secondary' : 'default'}>
                          {message.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {message.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(message.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {message.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <Phone className="w-3 h-3" />
                          {message.phone}
                        </div>
                      )}
                      {message.subject && (
                        <p className="text-sm font-medium mb-1">Subject: {message.subject}</p>
                      )}
                      {message.service && <p className="text-sm"><strong>Service:</strong> {message.service}</p>}
                      {message.budget && <p className="text-sm"><strong>Budget:</strong> {message.budget}</p>}
                      <p className="text-sm">{message.message}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        Type: {message.message_type}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            {/* Contact Requests Tab */}
            <Card>
              <CardHeader>
                <CardTitle>Contact & Call Requests</CardTitle>
                <CardDescription>All schedule call and contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{request.name}</h3>
                        <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {request.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {request.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <Phone className="w-3 h-3" />
                          {request.phone}
                        </div>
                      )}
                      <p className="text-sm">{request.message || 'No message provided'}</p>
                      <div className="text-xs text-muted-foreground mt-2">
                        Type: {request.request_type}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audits">
            {/* Growth Audits Tab */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Audit Requests</CardTitle>
                <CardDescription>Free growth audit submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {growthAudits.map((audit) => (
                    <div key={audit.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{audit.name}</h3>
                        <Badge variant={audit.status === 'pending' ? 'secondary' : 'default'}>
                          {audit.status || 'pending'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {audit.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(audit.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {audit.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <Phone className="w-3 h-3" />
                          {audit.phone}
                        </div>
                      )}
                      <div className="space-y-2 text-sm">
                        <p><strong>Website/Instagram:</strong> {audit.website_instagram || 'Not provided'}</p>
                        <p><strong>Desired Results:</strong> {audit.desired_results}</p>
                        <p><strong>Biggest Challenge:</strong> {audit.biggest_challenge}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            {/* Leads Tab */}
            <Card>
              <CardHeader>
                <CardTitle>General Leads</CardTitle>
                <CardDescription>Contact form submissions and general inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div key={lead.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{lead.name}</h3>
                        <Badge variant={lead.status === 'pending' ? 'secondary' : 'default'}>
                          {lead.status || 'pending'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </div>
                      )}
                      <div className="space-y-1 text-sm">
                        {lead.business_type && <p><strong>Business Type:</strong> {lead.business_type}</p>}
                        {lead.problem_description && <p><strong>Problem:</strong> {lead.problem_description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <UserSearchModal 
        isOpen={showUserSearch} 
        onClose={() => setShowUserSearch(false)} 
      />
      
      {selectedProject && (
        <PaymentRequestModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedProject(null);
          }}
          projectId={selectedProject.id}
          userId={selectedProject.user_id}
          projectTitle={selectedProject.title}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
