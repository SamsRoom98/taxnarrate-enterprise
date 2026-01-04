import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Lock, AlertTriangle, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector';
import { Employee, formatCurrency } from '@/types/employee';
import { PaymentMethod } from '@/types/payment';
import { useTax } from '@/contexts/TaxContext';
import { cn } from '@/lib/utils';

interface PayrollPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  paymentMode: 'bulk' | 'individual';
  onSuccess: () => void;
}

export function PayrollPaymentModal({
  open,
  onOpenChange,
  employees,
  paymentMode,
  onSuccess,
}: PayrollPaymentModalProps) {
  const { userProfile } = useTax();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [consentGiven, setConsentGiven] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [success, setSuccess] = useState(false);

  const selectedEmployees = employees.filter((e) => e.selected);
  const totalTax = selectedEmployees.reduce((sum, e) => sum + e.monthlyTax, 0);
  const employeeCount = selectedEmployees.length;
  const isSecurePlus = userProfile.mode === 'secure-plus';

  useEffect(() => {
    if (processing) {
      const steps = [
        setTimeout(() => setProcessingStep(1), 1000),
        setTimeout(() => setProcessingStep(2), 2000),
        setTimeout(() => {
          setProcessingStep(3);
          setProcessing(false);
          setSuccess(true);
        }, 3500),
      ];
      return () => steps.forEach(clearTimeout);
    }
  }, [processing]);

  const handlePayment = async () => {
    setProcessing(true);
  };

  const handleClose = () => {
    if (!processing) {
      if (success) {
        onSuccess();
      }
      setSuccess(false);
      setProcessingStep(0);
      setConsentGiven(false);
      onOpenChange(false);
    }
  };

  const processingSteps = [
    'Connecting to NRS Gateway...',
    'Validating employee TINs...',
    'Processing PAYE remittance...',
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {paymentMode === 'bulk' ? 'Bulk PAYE Remittance' : 'Individual PAYE Payment'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {employeeCount} employee{employeeCount > 1 ? 's' : ''} selected
          </p>
        </DialogHeader>

        {processing ? (
          <div className="py-8 space-y-6">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="font-medium text-foreground">
                {processingSteps[processingStep] || 'Processing...'}
              </p>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((processingStep + 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        ) : success ? (
          <div className="py-8 space-y-6">
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <p className="text-xl font-semibold text-foreground">PAYE Remittance Successful!</p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                {employeeCount} employee{employeeCount > 1 ? 's' : ''} PAYE has been remitted to NRS
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reference:</span>
                <span className="font-mono text-foreground">NRS-PAYE-{Date.now().toString(36).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Employees:</span>
                <span className="text-foreground">{employeeCount}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-foreground">Total Remitted:</span>
                <span className="text-success">{formatCurrency(totalTax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground">{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Close
              </Button>
              <Button className="flex-1">Download Receipt</Button>
            </div>

            <div className="rounded-lg bg-warning/10 border border-warning/30 p-3">
              <p className="text-xs text-warning text-center">
                ⚠️ DEMO RECEIPT - NOT VALID FOR OFFICIAL USE
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Selected Employees Summary */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Selected Employees</span>
                <Badge variant="secondary">{employeeCount}</Badge>
              </div>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {selectedEmployees.map((emp) => (
                  <div key={emp.id} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                    <span className="text-muted-foreground truncate">{emp.name}</span>
                    <span className="text-foreground shrink-0">{formatCurrency(emp.monthlyTax)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 border-t border-border font-semibold">
                <span className="text-foreground">Total Monthly PAYE</span>
                <span className="text-success">{formatCurrency(totalTax)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Payment Method</p>
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onSelect={setPaymentMethod}
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
                    This PAYE remittance will be processed through Nigeria Revenue Service (NRS) Gateway.
                    Each employee's TIN will be validated before payment.
                  </p>
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="payroll-consent"
                checked={consentGiven}
                onCheckedChange={(checked) => setConsentGiven(checked === true)}
              />
              <label htmlFor="payroll-consent" className="text-sm text-muted-foreground cursor-pointer">
                I authorize this PAYE remittance for {employeeCount} employee{employeeCount > 1 ? 's' : ''} and confirm all TINs are correct
              </label>
            </div>

            {/* Pay Button */}
            <Button
              className="w-full h-12 text-base"
              variant="success"
              onClick={handlePayment}
              disabled={!consentGiven || employeeCount === 0}
            >
              <Lock className="h-4 w-4 mr-2" />
              Remit {formatCurrency(totalTax)} to NRS
            </Button>

            {/* Demo Disclaimer */}
            <div className="rounded-lg bg-warning/10 border border-warning/30 p-3">
              <p className="text-xs text-warning text-center">
                🚧 DEMO MODE - Placeholder payment. Real NRS integration pending regulatory approval.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
