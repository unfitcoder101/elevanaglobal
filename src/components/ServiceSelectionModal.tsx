import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Palette, IndianRupee, Clock, Users, Globe, Smartphone, Zap, BarChart3 } from 'lucide-react';

interface ServiceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceOption {
  id: string;
  name: string;
  // basePrice: number; // Commented out - will uncomment later
  icon: React.ReactNode;
  subOptions: {
    id: string;
    name: string;
    // price: number; // Commented out - will uncomment later
    description: string;
  }[];
}

const serviceOptions: ServiceOption[] = [
  {
    id: 'website',
    name: 'Full Website Creation',
    // basePrice: 25000, // Commented out - will uncomment later
    icon: <Globe className="w-5 h-5" />,
    subOptions: [
      { id: 'ui-ux', name: 'UI/UX Design', /* price: 8000, */ description: 'Modern, responsive design' },
      { id: 'seo', name: 'SEO Optimization', /* price: 5000, */ description: 'Search engine optimization' },
      { id: 'hosting', name: 'Hosting Setup', /* price: 3000, */ description: '1 year hosting included' },
      { id: 'deployment', name: 'Deployment & Launch', /* price: 2000, */ description: 'Complete deployment setup' },
      { id: 'cms', name: 'Content Management', /* price: 7000, */ description: 'Easy content updates' },
      { id: 'mobile-responsive', name: 'Mobile Responsive', /* price: 4000, */ description: 'Perfect mobile experience' }
    ]
  },
  {
    id: 'automation',
    name: 'Business Automation',
    // basePrice: 15000, // Commented out - will uncomment later
    icon: <Zap className="w-5 h-5" />,
    subOptions: [
      { id: 'payment-integration', name: 'Payment Gateway', /* price: 5000, */ description: 'Secure payment processing' },
      { id: 'email-automation', name: 'Email Automation', /* price: 4000, */ description: 'Automated email campaigns' },
      { id: 'inventory-management', name: 'Inventory Management', /* price: 8000, */ description: 'Track products & stock' },
      { id: 'customer-management', name: 'Customer Management', /* price: 6000, */ description: 'CRM integration' },
      { id: 'analytics', name: 'Analytics Dashboard', /* price: 7000, */ description: 'Business insights & reports' },
      { id: 'social-media', name: 'Social Media Integration', /* price: 3000, */ description: 'Connect social platforms' }
    ]
  },
  {
    id: 'mobile-app',
    name: 'Mobile App Development',
    // basePrice: 40000, // Commented out - will uncomment later
    icon: <Smartphone className="w-5 h-5" />,
    subOptions: [
      { id: 'ios-app', name: 'iOS App', /* price: 20000, */ description: 'Native iOS application' },
      { id: 'android-app', name: 'Android App', /* price: 18000, */ description: 'Native Android application' },
      { id: 'app-store', name: 'App Store Publishing', /* price: 5000, */ description: 'Publish to app stores' },
      { id: 'push-notifications', name: 'Push Notifications', /* price: 3000, */ description: 'Engage users effectively' },
      { id: 'offline-mode', name: 'Offline Functionality', /* price: 8000, */ description: 'Works without internet' }
    ]
  },
  {
    id: 'marketing',
    name: 'Digital Marketing',
    // basePrice: 12000, // Commented out - will uncomment later
    icon: <BarChart3 className="w-5 h-5" />,
    subOptions: [
      { id: 'social-media-marketing', name: 'Social Media Marketing', /* price: 6000, */ description: 'Complete social strategy' },
      { id: 'google-ads', name: 'Google Ads Setup', /* price: 4000, */ description: 'Professional ad campaigns' },
      { id: 'content-creation', name: 'Content Creation', /* price: 5000, */ description: 'Engaging content strategy' },
      { id: 'brand-identity', name: 'Brand Identity', /* price: 8000, */ description: 'Logo & brand guidelines' },
      { id: 'video-marketing', name: 'Video Marketing', /* price: 10000, */ description: 'Professional video content' }
    ]
  }
];

const ServiceSelectionModal: React.FC<ServiceSelectionModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedSubOptions, setSelectedSubOptions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business_name: '',
    // timeline: '', // Commented out - will uncomment later
    additional_requirements: '',
    call_time: ''
  });
  const { toast } = useToast();

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubOptionToggle = (subOptionId: string) => {
    setSelectedSubOptions(prev => 
      prev.includes(subOptionId) 
        ? prev.filter(id => id !== subOptionId)
        : [...prev, subOptionId]
    );
  };

  // Commented out price calculation - will uncomment later
  // const calculateTotalPrice = () => {
  //   let total = 0;
  //   
  //   // Add base prices for selected services
  //   selectedServices.forEach(serviceId => {
  //     const service = serviceOptions.find(s => s.id === serviceId);
  //     if (service) total += service.basePrice;
  //   });
  //   
  //   // Add prices for selected sub-options
  //   selectedSubOptions.forEach(subOptionId => {
  //     serviceOptions.forEach(service => {
  //       const subOption = service.subOptions.find(sub => sub.id === subOptionId);
  //       if (subOption) total += subOption.price;
  //     });
  //   });
  //   
  //   return total;
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const selectedServicesData = selectedServices.map(serviceId => {
        const service = serviceOptions.find(s => s.id === serviceId);
        return service ? { id: serviceId, name: service.name /* basePrice: service.basePrice */ } : null;
      }).filter(Boolean);

      const selectedSubOptionsData = selectedSubOptions.map(subOptionId => {
        for (const service of serviceOptions) {
          const subOption = service.subOptions.find(sub => sub.id === subOptionId);
          if (subOption) {
            return { id: subOptionId, name: subOption.name, /* price: subOption.price, */ parentService: service.id };
          }
        }
        return null;
      }).filter(Boolean);

      // Save to business_customizations table
      const { error: dbError } = await supabase
        .from('business_customizations')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business_name: formData.business_name,
          business_type: 'service_selection',
          // timeline: formData.timeline, // Commented out - will uncomment later
          additional_requirements: `${formData.additional_requirements}\n\nSelected Services: ${JSON.stringify(selectedServicesData)}\nSelected Options: ${JSON.stringify(selectedSubOptionsData)}`,
          description: `Selected Services: ${selectedServicesData.map(s => s?.name).join(', ')}. Additional Options: ${selectedSubOptionsData.map(s => s?.name).join(', ')}`,
          // estimated_cost: calculateTotalPrice(), // Commented out - will uncomment later
          call_time: formData.call_time || null
        }]);

      if (dbError) throw dbError;

      // Also save to messages table for unified inbox
      const selectedServiceNames = selectedServicesData.map(s => s?.name).join(', ');
      const selectedOptionNames = selectedSubOptionsData.map(s => s?.name).join(', ');
      const { error: messageError } = await supabase
        .from('messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: 'Service Quote Request',
          message: `Selected Services: ${selectedServiceNames}. Additional Options: ${selectedOptionNames}.` + (formData.additional_requirements ? `\n\nAdditional Requirements: ${formData.additional_requirements}` : ''),
          message_type: 'service_selection',
          status: 'unread',
          service: selectedServiceNames,
          // budget: `₹${calculateTotalPrice().toLocaleString()}`, // Commented out - will uncomment later
          call_time: formData.call_time || null
        }]);

      if (messageError) {
        console.error('Message save error:', messageError);
      }

      // Send notification email
      const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'quote_request',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business_name: formData.business_name,
          business_type: 'service_selection',
          description: `Selected Services: ${selectedServicesData.map(s => s?.name).join(', ')}. Additional Options: ${selectedSubOptionsData.map(s => s?.name).join(', ')}`,
          // budget_range: `₹${calculateTotalPrice().toLocaleString()}`, // Commented out - will uncomment later
          // timeline: formData.timeline // Commented out - will uncomment later
        }
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
        // Don't throw error here, form submission was successful
      }

      toast({
        title: "Service request submitted!",
        description: "Your service request has been sent. We'll contact you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        business_name: '',
        // timeline: '', // Commented out - will uncomment later
        additional_requirements: '',
        call_time: ''
      });
      setSelectedServices([]);
      setSelectedSubOptions([]);
      onClose();
    } catch (error) {
      console.error('Error submitting service request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Select Your Project Services
          </DialogTitle>
          <DialogDescription>
            Choose the services you need and get an instant quote. We'll customize everything for your business.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                name="business_name"
                placeholder="Your business name"
                value={formData.business_name}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose Your Services</h3>
            <div className="grid gap-4">
              {serviceOptions.map((service) => (
                <div key={service.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Checkbox
                      id={service.id}
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                    />
                    <label htmlFor={service.id} className="flex items-center space-x-2 cursor-pointer flex-1">
                      {service.icon}
                      <span className="font-medium">{service.name}</span>
                      {/* <span className="text-primary font-semibold">₹{service.basePrice.toLocaleString()}</span> */}
                    </label>
                  </div>
                  
                  {selectedServices.includes(service.id) && (
                    <div className="ml-6 space-y-2 border-l-2 border-primary/20 pl-4">
                      <p className="text-sm text-muted-foreground mb-2">Add-on Options:</p>
                      {service.subOptions.map((subOption) => (
                        <div key={subOption.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={subOption.id}
                            checked={selectedSubOptions.includes(subOption.id)}
                            onCheckedChange={() => handleSubOptionToggle(subOption.id)}
                          />
                          <label htmlFor={subOption.id} className="flex items-center justify-between cursor-pointer flex-1 text-sm">
                            <div>
                              <span className="font-medium">{subOption.name}</span>
                              <p className="text-xs text-muted-foreground">{subOption.description}</p>
                            </div>
                            {/* <span className="text-primary font-semibold">+₹{subOption.price.toLocaleString()}</span> */}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline and Additional Requirements - Timeline commented out */}
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project Timeline</Label>
              <Select onValueChange={(value) => setFormData({...formData, timeline: value})} value={formData.timeline}>
                <SelectTrigger>
                  <SelectValue placeholder="When do you need this?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP (Rush - +20%)</SelectItem>
                  <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="2-3-months">2-3 months</SelectItem>
                  <SelectItem value="3-6-months">3-6 months</SelectItem>
                  <SelectItem value="flexible">I'm flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="additional_requirements">Additional Requirements</Label>
            <Textarea
              id="additional_requirements"
              name="additional_requirements"
              placeholder="Any specific features, integrations, or requirements..."
              value={formData.additional_requirements}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="call_time">Preferred Time to Call You</Label>
            <Input
              id="call_time"
              name="call_time"
              type="time"
              value={formData.call_time}
              onChange={handleInputChange}
              placeholder="Select preferred call time"
            />
          </div>

          {/* Total Price - Commented out */}
          {/* {(selectedServices.length > 0 || selectedSubOptions.length > 0) && (
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-5 h-5 text-primary" />
                  <span className="font-medium">Total Estimated Cost:</span>
                </div>
                <span className="text-2xl font-bold text-primary">₹{calculateTotalPrice().toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Final price may vary based on specific requirements. We'll send you a detailed quote.
              </p>
            </div>
          )} */}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              disabled={isLoading || selectedServices.length === 0}
              className="flex-1"
            >
              {isLoading ? "Submitting..." : "Get Quote"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceSelectionModal;