import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Phone, Mail, User, Building } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business_type: '',
    problem_description: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      business_type: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save to leads table
      const { error: dbError } = await supabase
        .from('leads')
        .insert([formData]);

      if (dbError) throw dbError;

      // Send notification email
      const { error: emailError } = await supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'schedule_call',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.problem_description
        }
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
        // Don't throw error here, form submission was successful
      }

      toast({
        title: "Call request sent!",
        description: "We'll contact you within 24 hours to schedule your free consultation.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        business_type: '',
        problem_description: ''
      });

      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Book Your Free Call
          </DialogTitle>
          <DialogDescription>
            Tell us about your business and we'll schedule a free consultation call.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Your full name"
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
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Business Type
            </Label>
            <Select onValueChange={handleSelectChange} value={formData.business_type}>
              <SelectTrigger>
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restaurant">Restaurant/Food Service</SelectItem>
                <SelectItem value="retail">Retail Store</SelectItem>
                <SelectItem value="salon">Salon/Beauty</SelectItem>
                <SelectItem value="fitness">Fitness/Gym</SelectItem>
                <SelectItem value="healthcare">Healthcare/Dental</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem_description">Brief About Your Challenge</Label>
            <Textarea
              id="problem_description"
              name="problem_description"
              placeholder="Tell us about your biggest growth challenge or what you'd like to achieve..."
              value={formData.problem_description}
              onChange={handleInputChange}
              rows={3}
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
              {isLoading ? "Scheduling..." : "Schedule Call"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;