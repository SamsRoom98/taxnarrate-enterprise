import React from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SubscriptionReceipt, formatCurrency } from '@/types/payment';

interface SubscriptionReceiptCardProps {
  receipt: SubscriptionReceipt;
  onClose?: () => void;
}

export function SubscriptionReceiptCard({ receipt, onClose }: SubscriptionReceiptCardProps) {
  const handleDownload = () => {
    // TODO: Implement PDF generation
    console.log('Download receipt PDF:', receipt);
  };

  const modeDisplayName = receipt.mode === 'secure' ? 'Secure Mode' : 'Secure+ Mode';

  return (
    <div className="space-y-6 animate-scale-in">
      {/* Success Icon */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Payment Successful!</h3>
        <p className="text-muted-foreground">Upgraded to {modeDisplayName}</p>
      </div>

      {/* Receipt Card */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Receipt</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Transaction Ref</span>
            <span className="font-mono text-foreground">{receipt.transactionRef}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="text-foreground">{receipt.date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Plan</span>
            <span className="text-foreground">{modeDisplayName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-semibold text-success">{formatCurrency(receipt.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="text-foreground capitalize">{receipt.method}</span>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <Button variant="outline" className="w-full" onClick={handleDownload}>
        <Download className="h-4 w-4 mr-2" />
        Download Receipt (PDF)
      </Button>
    </div>
  );
}
