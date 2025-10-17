import React, { useState } from 'react';
import { PaymentDetails } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, Smartphone, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

interface UpiPaymentProps {
  amount: number;
  onPaymentComplete: (paymentDetails: PaymentDetails) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const UpiPayment: React.FC<UpiPaymentProps> = ({
  amount,
  onPaymentComplete,
  onCancel,
  isOpen,
}) => {
  const [provider, setProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async () => {
    if (!upiId && provider === 'other') {
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      const paymentDetails: PaymentDetails = {
        amount,
        upi_id: upiId || `${provider}@user`,
        provider,
        transaction_id: transactionId,
      };

      setProcessing(false);
      setPaymentSuccess(true);

      // Wait a moment to show success message, then complete
      setTimeout(() => {
        onPaymentComplete(paymentDetails);
        resetForm();
      }, 2000);
    }, 2000);
  };

  const resetForm = () => {
    setUpiId('');
    setProvider('gpay');
    setPaymentSuccess(false);
    setProcessing(false);
  };

  const handleClose = () => {
    if (!processing) {
      resetForm();
      onCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>UPI Payment</DialogTitle>
          <DialogDescription>
            Complete your payment securely via UPI
          </DialogDescription>
        </DialogHeader>

        {paymentSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg">Payment Successful!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your booking is confirmed
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Amount Display */}
            <Card className="border-2 border-primary">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Amount to Pay</p>
                  <p className="text-3xl mt-1">₹{amount.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Provider Selection */}
            <div className="space-y-3">
              <Label>Select UPI Provider</Label>
              <RadioGroup value={provider} onValueChange={(value: any) => setProvider(value)}>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      provider === 'gpay' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setProvider('gpay')}
                  >
                    <RadioGroupItem value="gpay" id="gpay" />
                    <Label htmlFor="gpay" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-xs">
                          G
                        </div>
                        <span>Google Pay</span>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      provider === 'phonepe' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setProvider('phonepe')}
                  >
                    <RadioGroupItem value="phonepe" id="phonepe" />
                    <Label htmlFor="phonepe" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                          P
                        </div>
                        <span>PhonePe</span>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      provider === 'paytm' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setProvider('paytm')}
                  >
                    <RadioGroupItem value="paytm" id="paytm" />
                    <Label htmlFor="paytm" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                          P
                        </div>
                        <span>Paytm</span>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      provider === 'other' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setProvider('other')}
                  >
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-gray-600" />
                        <span>Other UPI</span>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* UPI ID Input (shown for "other" provider) */}
            {provider === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input
                  id="upi-id"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your UPI ID (e.g., username@paytm, username@oksbi)
                </p>
              </div>
            )}

            {/* Info Alert */}
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                You will be redirected to your UPI app to complete the payment
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handlePayment}
                disabled={processing || (provider === 'other' && !upiId)}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${amount.toFixed(2)}`
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
