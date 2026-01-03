import React from 'react';
import { Download, Mail, Share2, CheckCircle2, QrCode, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaxReceipt, formatCurrency } from '@/types/payment';

interface TaxReceiptCardProps {
  receipt: TaxReceipt;
  onBack?: () => void;
}

export function TaxReceiptCard({ receipt, onBack }: TaxReceiptCardProps) {
  const handleDownload = () => {
    // TODO: Implement PDF generation
    console.log('Download tax receipt PDF:', receipt);
  };

  const handleEmail = () => {
    console.log('Email receipt:', receipt);
  };

  const handleShare = () => {
    console.log('Share receipt:', receipt);
  };

  return (
    <div className="space-y-6 animate-scale-in">
      {/* Success Icon */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Tax Payment Successful!</h3>
        <p className="text-muted-foreground">Your 2026 tax has been paid and recorded with NRS</p>
      </div>

      {/* Official Tax Receipt */}
      <div className="rounded-xl border-2 border-success/30 bg-gradient-to-b from-success/5 to-transparent p-6 space-y-4">
        {/* Header */}
        <div className="text-center border-b border-border pb-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
            Federal Republic of Nigeria
          </p>
          <p className="font-semibold text-foreground">Nigeria Revenue Service (NRS)</p>
          <p className="text-sm text-muted-foreground mt-2">Official Tax Payment Receipt</p>
        </div>

        {/* Receipt Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Receipt No:</span>
            <span className="font-mono text-foreground">{receipt.nrsReceiptNo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="text-foreground">{receipt.date}</span>
          </div>
          
          <div className="border-t border-border pt-3 mt-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Taxpayer Information
            </p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TIN:</span>
              <span className="font-mono text-foreground">{receipt.tin}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="text-foreground">{receipt.taxpayerName}</span>
            </div>
          </div>

          <div className="border-t border-border pt-3 mt-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Payment Details
            </p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax Year:</span>
              <span className="text-foreground">{receipt.taxYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax Type:</span>
              <span className="text-foreground">
                {receipt.taxType === 'PAYE' ? 'Personal Income Tax' : 'Company Income Tax'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid:</span>
              <span className="font-semibold text-success">{formatCurrency(receipt.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="text-foreground capitalize">{receipt.method}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center border-t border-border pt-3 mt-3">
            <span className="text-muted-foreground">Status:</span>
            <span className="inline-flex items-center gap-1 text-success font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              PAID
            </span>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="flex justify-center pt-4 border-t border-border">
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
              <QrCode className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Scan to verify</p>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="text-center pt-2">
          <p className="text-xs text-warning">
            ⚠️ DEMO RECEIPT - NOT VALID FOR OFFICIAL USE
          </p>
        </div>
      </div>

      {/* Compliance Update Banner */}
      <div className="rounded-lg bg-success/10 border border-success/30 p-3">
        <p className="text-sm text-success text-center">
          ✓ Your 2026 tax compliance status has been updated. You are now compliant for tax year 2026.
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handleEmail}>
          <Mail className="h-4 w-4 mr-1" />
          Email
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>

      {onBack && (
        <Button variant="ghost" className="w-full" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      )}
    </div>
  );
}
