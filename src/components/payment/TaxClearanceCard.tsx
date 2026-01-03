import React from 'react';
import { FileCheck, Lock, Download, Printer, Share2, QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/contexts/PaymentContext';
import { useTax } from '@/contexts/TaxContext';
import { cn } from '@/lib/utils';

interface TaxClearanceCardProps {
  className?: string;
}

export function TaxClearanceCard({ className }: TaxClearanceCardProps) {
  const { userProfile } = useTax();
  const { paymentState, openSubscriptionModal } = usePayment();

  const isSecurePlus = userProfile.mode === 'secure-plus';
  const isPaid = paymentState.taxPaidFor2026;

  // Locked state for non-Secure+ users
  if (!isSecurePlus) {
    return (
      <Card variant="locked" className={cn('relative', className)}>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Tax Clearance Certificate</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate official tax clearance for 2026
          </p>
          <Button
            variant="upgrade"
            size="sm"
            onClick={() => openSubscriptionModal('secure-plus')}
          >
            Upgrade to Secure+
          </Button>
        </div>
        <CardHeader className="blur-locked">
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Tax Clearance Certificate
          </CardTitle>
        </CardHeader>
        <CardContent className="blur-locked">
          <div className="h-24" />
        </CardContent>
      </Card>
    );
  }

  // Tax not paid yet
  if (!isPaid) {
    return (
      <Card variant="elevated" className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Tax Clearance Certificate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-3">
              <FileCheck className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Pay your 2026 tax to generate your Tax Clearance Certificate
            </p>
            <p className="text-xs text-warning">Certificate available after tax payment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Tax paid - Show certificate
  const certificateNo = `TCC-2026-${Math.random().toString().substr(2, 6).toUpperCase()}`;

  return (
    <Card variant="elevated" className={cn('border-success/30', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-success">
          <FileCheck className="h-5 w-5" />
          Tax Clearance Certificate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Certificate Preview */}
        <div className="rounded-xl border-2 border-success/30 bg-gradient-to-b from-success/5 to-transparent p-4 space-y-3">
          {/* Header */}
          <div className="text-center border-b border-border pb-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Federal Republic of Nigeria
            </p>
            <p className="font-semibold text-foreground text-sm">Tax Clearance Certificate</p>
          </div>

          {/* Details */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Certificate No:</span>
              <span className="font-mono text-foreground">{certificateNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valid Until:</span>
              <span className="text-foreground">Dec 31, 2026</span>
            </div>
            <div className="text-center py-2">
              <p className="text-muted-foreground text-xs">
                This certifies that the taxpayer has fulfilled all tax obligations for the year 2026
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
              <QrCode className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>

          {/* Demo Notice */}
          <p className="text-xs text-warning text-center">
            ⚠️ DEMO CERTIFICATE - NOT OFFICIAL
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
