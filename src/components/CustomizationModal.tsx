import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Palette, Building2, Mail, User } from 'lucide-react';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business_name: '',
    business_type: '',
    description: '',
    budget_range: '',
    timeline: '',
    additional_requirements: '',
    call_time: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save to business_customizations table
        const { error: dbError } = await supabase
          .from('business_customizations')
          .insert([{
            name: formData.name,
            email: formData.email,
            business_name: formData.business_name,
            business_type: formData.business_type,
            description: formData.description,
            budget_range: formData.budget_range,
            timeline: formData.timeline,
            additional_requirements: formData.additional_requirements,
            call_time: formData.call_time || null
          }]);

      if (dbError) throw dbError;

      // Also save to messages table for unified inbox
        const { error: messageError } = await supabase
          .from('messages')
          .insert([{
            name: formData.name,
            email: formData.email,
            subject: 'Custom Plan Request',
            message: formData.description + (formData.additional_requirements ? `\n\nAdditional: ${formData.additional_requirements}` : ''),
            message_type: 'customization',
            status: 'unread',
            service: formData.business_type || 'custom_plan',
            budget: formData.budget_range || null,
            call_time: formData.call_time || null
          }]);

      if (messageError) {
        console.error('Message save error:', messageError);
      }

      // Send notification email
      const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'custom_plan',
          name: formData.name,
          email: formData.email,
          business_name: formData.business_name,
          business_type: formData.business_type,
          description: formData.description,
          budget_range: formData.budget_range,
          timeline: formData.timeline
        }
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
        // Don't throw error here, form submission was successful
      }

      toast({
        title: "Custom plan request submitted!",
        description: "We'll review your requirements and send you a tailored proposal within 24 hours.",
      });

        // Reset form
        setFormData({
          name: '',
          email: '',
          business_name: '',
          business_type: '',
          description: '',
          budget_range: '',
          timeline: '',
          additional_requirements: '',
          call_time: ''
        });

      onClose();
    } catch (error) {
      console.error('Error submitting customization request:', error);
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Get Your Custom Plan
          </DialogTitle>
          <DialogDescription>
            Tell us about your business and specific needs. We'll create a tailored solution just for you.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Name
              </Label>
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
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
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

          <div className="space-y-2">
            <Label htmlFor="business_name" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Business Name
            </Label>
            <Input
              id="business_name"
              name="business_name"
              placeholder="Your business name"
              value={formData.business_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Business Type</Label>
            <Select onValueChange={(value) => handleSelectChange('business_type', value)} value={formData.business_type}>
              <SelectTrigger>
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ecommerce">E-commerce Store</SelectItem>
                <SelectItem value="saas">SaaS/Software</SelectItem>
                <SelectItem value="restaurant">Restaurant/Food</SelectItem>
                <SelectItem value="retail">Retail Business</SelectItem>
                <SelectItem value="salon">Salon/Beauty</SelectItem>
                <SelectItem value="fitness">Fitness/Health</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
                <SelectItem value="nonprofit">Non-profit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what you need - website, automation, marketing setup, etc. Be as specific as possible..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Budget Range</Label>
              <Select onValueChange={(value) => handleSelectChange('budget_range', value)} value={formData.budget_range}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-25k">Under ₹25,000</SelectItem>
                  <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
                  <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                  <SelectItem value="100k-250k">₹1,00,000 - ₹2,50,000</SelectItem>
                  <SelectItem value="250k-500k">₹2,50,000 - ₹5,00,000</SelectItem>
                  <SelectItem value="500k-plus">₹5,00,000+</SelectItem>
                  <SelectItem value="discuss">Let's discuss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timeline</Label>
              <Select onValueChange={(value) => handleSelectChange('timeline', value)} value={formData.timeline}>
                <SelectTrigger>
                  <SelectValue placeholder="When do you need this?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP</SelectItem>
                  <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="2-3-months">2-3 months</SelectItem>
                  <SelectItem value="3-6-months">3-6 months</SelectItem>
                  <SelectItem value="flexible">I'm flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_requirements">Additional Requirements (Optional)</Label>
            <Textarea
              id="additional_requirements"
              name="additional_requirements"
              placeholder="Any specific features, integrations, or requirements you have in mind..."
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
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Submitting..." : "Get Custom Quote"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomizationModal;