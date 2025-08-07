import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, IndianRupee, Smartphone, QrCode, CheckCircle } from 'lucide-react';

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  payment: {
    id: string;
    amount: number;
    description: string;
    reference_number: string;
  };
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ isOpen, onClose, payment }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { toast } = useToast();

  const handlePayment = async (method: 'card' | 'upi') => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update payment status in database
      const { error } = await supabase
        .from('project_payments')
        .update({ 
          status: 'paid', 
          paid_at: new Date().toISOString(),
          payment_method: method,
          transaction_id: `TXN${Date.now()}`
        })
        .eq('id', payment.id);

      if (error) throw error;

      setPaymentSuccess(true);
      toast({
        title: "Payment Successful!",
        description: `₹${payment.amount.toLocaleString()} has been paid successfully.`,
      });

      setTimeout(() => {
        onClose();
        setPaymentSuccess(false);
        setPaymentMethod(null);
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-primary" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to complete the transaction.
          </DialogDescription>
        </DialogHeader>

        {paymentSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Your payment of ₹{payment.amount.toLocaleString()} has been processed.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold">₹{payment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Description:</span>
                    <span className="text-sm text-muted-foreground">{payment.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reference:</span>
                    <span className="text-sm text-muted-foreground">{payment.reference_number}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h3 className="font-semibold">Choose Payment Method:</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Credit/Debit Card */}
                <Card 
                  className={`cursor-pointer transition-all hover:border-primary ${
                    paymentMethod === 'card' ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CardContent className="flex flex-col items-center p-6">
                    <CreditCard className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-medium">Card Payment</h4>
                    <p className="text-xs text-center text-muted-foreground">
                      Credit/Debit Card
                    </p>
                  </CardContent>
                </Card>

                {/* UPI Payment */}
                <Card 
                  className={`cursor-pointer transition-all hover:border-primary ${
                    paymentMethod === 'upi' ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <CardContent className="flex flex-col items-center p-6">
                    <Smartphone className="w-8 h-8 text-primary mb-2" />
                    <h4 className="font-medium">UPI Payment</h4>
                    <p className="text-xs text-center text-muted-foreground">
                      Google Pay, PhonePe, Paytm
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* UPI QR Code (Demo) */}
              {paymentMethod === 'upi' && (
                <Card>
                  <CardContent className="flex flex-col items-center p-4">
                    <QrCode className="w-24 h-24 text-muted-foreground mb-2" />
                    <p className="text-xs text-center text-muted-foreground">
                      Scan this QR code with your UPI app
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs">Demo QR Code</Badge>
                  </CardContent>
                </Card>
              )}

              {/* Payment Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  onClick={() => paymentMethod && handlePayment(paymentMethod)}
                  disabled={!paymentMethod || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${payment.amount.toLocaleString()}`
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentGateway;