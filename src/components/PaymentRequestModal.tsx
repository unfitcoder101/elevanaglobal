import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { IndianRupee, Send } from 'lucide-react';

interface PaymentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  userId: string;
  projectTitle: string;
}

const PaymentRequestModal: React.FC<PaymentRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  projectId, 
  userId, 
  projectTitle 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    due_date: ''
  });
  const { toast } = useToast();

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
      const { error } = await supabase
        .from('project_payments')
        .insert([{
          project_id: projectId,
          user_id: userId,
          amount: parseFloat(formData.amount),
          description: formData.description || `Payment request for ${projectTitle}`,
          due_date: formData.due_date || null,
          reference_number: `REF-${Date.now()}`,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Payment request sent!",
        description: `Payment request for ₹${parseFloat(formData.amount).toLocaleString()} has been sent to the user.`,
      });

      // Reset form
      setFormData({
        amount: '',
        description: '',
        due_date: ''
      });

      onClose();
    } catch (error) {
      console.error('Error sending payment request:', error);
      toast({
        title: "Error",
        description: "Failed to send payment request. Please try again.",
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
            <IndianRupee className="w-5 h-5 text-primary" />
            Send Payment Request
          </DialogTitle>
          <DialogDescription>
            Send a payment request to the user for project: {projectTitle}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹) *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Payment description (optional)..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date (Optional)</Label>
            <Input
              id="due_date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleInputChange}
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
              disabled={isLoading || !formData.amount}
              className="flex-1"
            >
              {isLoading ? (
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentRequestModal;