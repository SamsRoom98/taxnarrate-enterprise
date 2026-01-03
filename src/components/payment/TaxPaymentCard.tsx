import React from 'react';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { usePayment } from '@/contexts/PaymentContext';
import { useTax } from '@/contexts/TaxContext';
import { formatCurrency, TaxBreakdown, PaymentPlan } from '@/types/payment';
import { cn } from '@/lib/utils';

interface TaxPaymentCardProps {
  taxAmount: number;
  taxBreakdown: TaxBreakdown;
  className?: string;
}

export function TaxPaymentCard({ taxAmount, taxBreakdown, className }: TaxPaymentCardProps) {
  const { userProfile } = useTax();
  const { openTaxPaymentModal, paymentState } = usePayment();
  
  const isLiteMode = userProfile.mode === 'lite';
  const isBusinessTax = userProfile.taxMode === 'business';
  const isPaid = paymentState.taxPaidFor2026;

  const [selectedPlan, setSelectedPlan] = React.useState<PaymentPlan>('full');

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

  const handleProceed = () => {
    openTaxPaymentModal(taxAmount, taxBreakdown);
  };

  // Locked state for Lite mode
  if (isLiteMode) {
    return (
      <Card variant="locked" className={cn('relative', className)}>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Tax Payment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Pay your tax directly through the app with instant compliance update
          </p>
          <span className="text-xs text-warning font-medium mb-4">Secure Mode Required</span>
          <p className="text-xs text-muted-foreground">
            Tax payment requires identity verification. Upgrade to Secure Mode to pay your taxes securely.
          </p>
        </div>
        <CardHeader className="blur-locked">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Pay Your Tax
          </CardTitle>
        </CardHeader>
        <CardContent className="blur-locked">
          <div className="h-32" />
        </CardContent>
      </Card>
    );
  }

  // Paid state
  if (isPaid) {
    return (
      <Card variant="elevated" className={cn('border-success/30', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <CreditCard className="h-5 w-5" />
            2026 Tax Paid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-success" />
            </div>
            <p className="text-2xl font-bold text-success">{formatCurrency(taxAmount)}</p>
            <p className="text-sm text-muted-foreground mt-1">Paid on {new Date().toLocaleDateString()}</p>
            <p className="text-xs text-success mt-2">✓ You are compliant for tax year 2026</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pay Your 2026 Tax
        </CardTitle>
        <p className="text-sm text-muted-foreground">Pay your tax obligation securely</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tax Summary */}
        <div className="text-center py-4 rounded-xl bg-muted/50">
          <p className="text-sm text-muted-foreground">
            {isBusinessTax ? 'Company Income Tax Due' : 'Your 2026 Annual Tax'}
          </p>
          <p className="text-3xl font-bold text-foreground mt-1">{formatCurrency(taxAmount)}</p>
          {!isBusinessTax && (
            <p className="text-xs text-muted-foreground mt-1">
              Breakdown: {formatCurrency(Math.round(taxAmount / 12))}/month
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {isBusinessTax ? 'CIT 2026 • Due: March 31, 2026' : 'Tax Year: 2026'}
          </p>
        </div>

        {/* Payment Frequency (Individual only) */}
        {!isBusinessTax && (
          <RadioGroup value={selectedPlan} onValueChange={(v) => setSelectedPlan(v as PaymentPlan)}>
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="full" id="full" />
              <Label htmlFor="full" className="flex-1 cursor-pointer">
                Pay Full Amount ({formatCurrency(taxAmount)})
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="quarterly" id="quarterly" />
              <Label htmlFor="quarterly" className="flex-1 cursor-pointer">
                Pay Quarterly ({formatCurrency(getPaymentAmount('quarterly'))} per quarter)
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                Pay Monthly ({formatCurrency(getPaymentAmount('monthly'))} per month)
              </Label>
            </div>
          </RadioGroup>
        )}

        {/* Proceed Button */}
        <Button 
          variant="success" 
          className="w-full"
          onClick={handleProceed}
        >
          <Lock className="h-4 w-4 mr-2" />
          Proceed to Tax Payment
        </Button>

        {/* Demo Disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30">
          <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-warning">
            DEMO MODE: Placeholder payment. Real NRS/FIRS integration pending regulatory approval.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
