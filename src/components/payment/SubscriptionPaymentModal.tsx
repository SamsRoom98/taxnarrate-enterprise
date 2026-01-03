import React, { useState } from 'react';
import { X, Lock, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { SubscriptionReceiptCard } from './SubscriptionReceiptCard';
import { usePayment } from '@/contexts/PaymentContext';
import { useTax } from '@/contexts/TaxContext';
import { getSubscriptionPrice, formatCurrency } from '@/types/payment';

export function SubscriptionPaymentModal() {
  const { userProfile, updateMode } = useTax();
  const {
    paymentState,
    closeSubscriptionModal,
    setSubscriptionMethod,
    processSubscriptionPayment,
    resetSubscriptionState,
  } = usePayment();

  const {
    showSubscriptionModal,
    targetMode,
    subscriptionMethod,
    subscriptionProcessing,
    subscriptionSuccess,
    subscriptionReceipt,
  } = paymentState;

  const price = getSubscriptionPrice(userProfile.accountType, targetMode);
  const monthlyEquivalent = Math.round(price / 12);
  const modeDisplayName = targetMode === 'secure' ? 'Secure' : 'Secure+';
  const userTypeDisplay = userProfile.accountType === 'individual' ? 'Individual' : 'Business';

  const handlePayment = async () => {
    const receipt = await processSubscriptionPayment(price, userProfile.accountType);
    
    // Auto-close and upgrade after 2 seconds
    setTimeout(() => {
      updateMode(targetMode);
      resetSubscriptionState();
    }, 2000);
  };

  const handleClose = () => {
    if (!subscriptionProcessing) {
      if (subscriptionSuccess) {
        updateMode(targetMode);
      }
      resetSubscriptionState();
    }
  };

  return (
    <Dialog open={showSubscriptionModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Upgrade to {modeDisplayName} Mode</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{userTypeDisplay} Plan</p>
        </DialogHeader>

        {!subscriptionSuccess ? (
          <div className="space-y-6">
            {/* Pricing Display */}
            <div className="text-center py-4 rounded-xl bg-muted/50">
              <p className="text-4xl font-bold text-foreground">{formatCurrency(price)}</p>
              <p className="text-sm text-muted-foreground mt-1">Annual Subscription</p>
              <p className="text-xs text-muted-foreground">≈ {formatCurrency(monthlyEquivalent)}/month</p>
            </div>

            {/* Payment Method Selection */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Select Payment Method</p>
              <PaymentMethodSelector
                selectedMethod={subscriptionMethod}
                onSelect={setSubscriptionMethod}
              />
            </div>

            {/* Pay Button */}
            <Button
              className="w-full h-12 text-base"
              style={{
                background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)',
              }}
              onClick={handlePayment}
              disabled={subscriptionProcessing}
            >
              {subscriptionProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay {formatCurrency(price)}</>
              )}
            </Button>

            {/* Security Footer */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Secured by Paystack • Bank-grade encryption • PCI DSS compliant</span>
            </div>

            {/* Demo Disclaimer */}
            <div className="rounded-lg bg-warning/10 border border-warning/30 p-3">
              <p className="text-xs text-warning text-center">
                ⚠️ DEMO MODE - Placeholder payment. Real Paystack integration pending.
              </p>
            </div>
          </div>
        ) : (
          subscriptionReceipt && (
            <SubscriptionReceiptCard receipt={subscriptionReceipt} onClose={handleClose} />
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
