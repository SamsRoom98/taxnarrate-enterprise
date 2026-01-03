import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Lock, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { TaxReceiptCard } from './TaxReceiptCard';
import { usePayment } from '@/contexts/PaymentContext';
import { useTax } from '@/contexts/TaxContext';
import { formatCurrency, PaymentPlan } from '@/types/payment';
import { cn } from '@/lib/utils';

export function TaxPaymentModal() {
  const { userProfile, setComplianceStatus } = useTax();
  const {
    paymentState,
    closeTaxPaymentModal,
    setTaxPaymentPlan,
    setTaxPaymentMethod,
    setTaxConsent,
    processTaxPayment,
    resetTaxPaymentState,
  } = usePayment();

  const {
    showTaxPaymentModal,
    taxAmount,
    taxPaymentPlan,
    taxPaymentMethod,
    taxProcessing,
    taxSuccess,
    taxConsentGiven,
    taxReceipt,
    taxBreakdown,
  } = paymentState;

  const [processingStep, setProcessingStep] = useState(0);

  const isBusinessTax = userProfile.taxMode === 'business';
  const taxType = isBusinessTax ? 'CIT' : 'PAYE';
  const taxpayerName = isBusinessTax ? 'Sample Business Ltd' : 'John Doe';
  const isSecurePlus = userProfile.mode === 'secure-plus';

  // Calculate payment based on plan
  const getPaymentAmount = (plan: PaymentPlan): number => {
    switch (plan) {
      case 'quarterly':
        return Math.round(taxAmount / 4);
      case 'monthly':
        return Math.round(taxAmount / 12);
      default:
        return taxAmount;
    }
  };

  const paymentPlans: { id: PaymentPlan; label: string; amount: number }[] = isBusinessTax
    ? [{ id: 'full', label: 'Pay Full Amount', amount: taxAmount }]
    : [
        { id: 'full', label: 'Pay Full Amount', amount: taxAmount },
        { id: 'quarterly', label: 'Pay Quarterly', amount: getPaymentAmount('quarterly') },
        { id: 'monthly', label: 'Pay Monthly', amount: getPaymentAmount('monthly') },
      ];

  // Simulate processing steps
  useEffect(() => {
    if (taxProcessing) {
      const steps = [
        setTimeout(() => setProcessingStep(1), 1000),
        setTimeout(() => setProcessingStep(2), 2000),
        setTimeout(() => setProcessingStep(3), 3000),
      ];
      return () => steps.forEach(clearTimeout);
    } else {
      setProcessingStep(0);
    }
  }, [taxProcessing]);

  const handlePayment = async () => {
    await processTaxPayment(taxType, taxpayerName);
    
    // Update compliance status
    setComplianceStatus(prev => ({
      ...prev,
      overallScore: 100,
      payeStatus: 'ready',
    }));
  };

  const handleClose = () => {
    if (!taxProcessing) {
      resetTaxPaymentState();
    }
  };

  const processingSteps = [
    'Connecting to NRS Gateway...',
    'Verifying TIN with FIRS...',
    'Processing payment...',
  ];

  return (
    <Dialog open={showTaxPaymentModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pay Your Tax</DialogTitle>
          <p className="text-sm text-muted-foreground">2026 {taxType}</p>
        </DialogHeader>

        {taxProcessing ? (
          <div className="py-8 space-y-6">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="font-medium text-foreground">{processingSteps[processingStep] || 'Processing...'}</p>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((processingStep + 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        ) : taxSuccess && taxReceipt ? (
          <TaxReceiptCard receipt={taxReceipt} onBack={handleClose} />
        ) : (
          <div className="space-y-6">
            {/* Identity Verification */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/30">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Identity Verified</p>
                <p className="text-xs text-muted-foreground">{taxpayerName} • TIN-XXXXXXXXX</p>
              </div>
              <span className="text-xs text-success font-medium">Ready to pay</span>
            </div>

            {/* Amount Display */}
            <div className="text-center py-4 rounded-xl bg-muted/50">
              <p className="text-4xl font-bold text-foreground">{formatCurrency(taxAmount)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {isBusinessTax ? 'Company Income Tax 2026' : 'Your 2026 Annual Tax'}
              </p>
              {!isBusinessTax && (
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(Math.round(taxAmount / 12))}/month
                </p>
              )}
            </div>

            {/* Tax Breakdown */}
            {taxBreakdown && (
              <div className="rounded-lg border border-border p-4 space-y-2 text-sm">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Tax Breakdown
                </p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gross Income</span>
                  <span className="text-foreground">{formatCurrency(taxBreakdown.grossIncome)}</span>
                </div>
                {taxBreakdown.pensionDeduction > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Less: Pension (8%)</span>
                    <span className="text-destructive">-{formatCurrency(taxBreakdown.pensionDeduction)}</span>
                  </div>
                )}
                {taxBreakdown.rentRelief > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Less: Rent Relief</span>
                    <span className="text-destructive">-{formatCurrency(taxBreakdown.rentRelief)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Taxable Income</span>
                  <span className="text-foreground">{formatCurrency(taxBreakdown.taxableIncome)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total Tax Due</span>
                  <span className="text-success">{formatCurrency(taxBreakdown.taxAmount)}</span>
                </div>
              </div>
            )}

            {/* Payment Frequency (Individual only) */}
            {!isBusinessTax && (
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Payment Plan</p>
                <div className="space-y-2">
                  {paymentPlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setTaxPaymentPlan(plan.id)}
                      className={cn(
                        'w-full flex items-center justify-between p-3 rounded-lg border transition-all',
                        taxPaymentPlan === plan.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/30'
                      )}
                    >
                      <span className="text-sm text-foreground">{plan.label}</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(plan.amount)}
                        {plan.id !== 'full' && (
                          <span className="text-xs text-muted-foreground ml-1">
                            /{plan.id === 'quarterly' ? 'quarter' : 'month'}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Payment Method</p>
              <PaymentMethodSelector
                selectedMethod={taxPaymentMethod}
                onSelect={setTaxPaymentMethod}
                showDebit
                isSecurePlus={isSecurePlus}
              />
            </div>

            {/* Authorization Notice */}
            <div className="rounded-lg bg-warning/10 border border-warning/30 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Authorization Required</p>
                  <p className="text-xs text-muted-foreground">
                    This payment will be processed through Nigeria Revenue Service (NRS) Gateway
                    and Federal Inland Revenue Service (FIRS) secure government payment infrastructure.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    By proceeding, you authorize TaxNarrate to access your tax records, process this
                    payment, and update your compliance status.
                  </p>
                </div>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="tax-consent"
                checked={taxConsentGiven}
                onCheckedChange={(checked) => setTaxConsent(checked === true)}
              />
              <label htmlFor="tax-consent" className="text-sm text-muted-foreground cursor-pointer">
                I authorize this tax payment and confirm all details are correct
              </label>
            </div>

            {/* Pay Button */}
            <Button
              className="w-full h-12 text-base"
              variant="success"
              onClick={handlePayment}
              disabled={!taxConsentGiven}
            >
              <Lock className="h-4 w-4 mr-2" />
              Pay {formatCurrency(getPaymentAmount(taxPaymentPlan))} to NRS
            </Button>

            {/* Demo Disclaimer */}
            <div className="rounded-lg bg-warning/10 border border-warning/30 p-3">
              <p className="text-xs text-warning text-center">
                🚧 DEMO MODE - This is a demonstration. Real NRS/FIRS integration pending regulatory approval.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
