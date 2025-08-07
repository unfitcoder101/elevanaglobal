import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  UserCheck
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
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>({
    user_id: '',
    amount: 0,
    description: '',
    due_date: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAllData();
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
        .select('*, profiles!inner(full_name)')
        .order('created_at', { ascending: false });

      if (projectRequestsError) throw projectRequestsError;
      setProjectRequests(projectRequestsData || []);

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
    
    setSendingPayment(true);
    try {
      // First, try to find if user exists in auth.users by email
      // Since we can't query auth.users directly, we'll use the customization user_id if available
      // or create a payment record without user_id for manual processing
      
      const { error } = await supabase
        .from('payments')
        .insert([{
          user_id: null, // Guest submissions don't have user_id initially
          amount: paymentRequest.amount,
          description: paymentRequest.description || `Payment for ${selectedCustomization.business_name} - ${selectedCustomization.description}`,
          due_date: paymentRequest.due_date || null,
          status: 'pending',
          currency: 'INR',
          reference_number: `REF-${Date.now()}`,
          order_id: `ORD-${selectedCustomization.id.slice(0, 8)}`
        }]);

      if (error) throw error;

      // Update customization status
      await updateCustomizationStatus(selectedCustomization.id, 'quote_sent');

      toast({
        title: "Payment request sent!",
        description: `Payment request for ₹${paymentRequest.amount.toLocaleString()} has been created.`,
      });

      // Reset form
      setPaymentRequest({
        user_id: '',
        amount: 0,
        description: '',
        due_date: ''
      });
      setSelectedCustomization(null);

    } catch (error) {
      console.error('Error sending payment request:', error);
      toast({
        title: "Error",
        description: "Failed to send payment request.",
        variant: "destructive",
      });
    } finally {
      setSendingPayment(false);
    }
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
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="customizations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="customizations" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Business Requests ({customizations.length})
            </TabsTrigger>
            <TabsTrigger value="project-requests" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Project Requests ({projectRequests.length})
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
                  {projectRequests.map((request) => (
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
    </div>
  );
};

export default AdminDashboard;