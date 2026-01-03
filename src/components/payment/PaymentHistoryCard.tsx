import React from 'react';
import { Clock, Receipt, CreditCard, Lock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/contexts/PaymentContext';
import { useTax } from '@/contexts/TaxContext';
import { formatCurrency, type PaymentHistoryItem as PaymentHistoryItemType, TaxReceipt, SubscriptionReceipt } from '@/types/payment';
import { cn } from '@/lib/utils';

interface PaymentHistoryCardProps {
  className?: string;
}

function isTaxReceipt(receipt: TaxReceipt | SubscriptionReceipt): receipt is TaxReceipt {
  return 'nrsReceiptNo' in receipt;
}

export function PaymentHistoryCard({ className }: PaymentHistoryCardProps) {
  const { userProfile } = useTax();
  const { getPaymentHistory, openSubscriptionModal } = usePayment();

  const isSecurePlus = userProfile.mode === 'secure-plus';
  const history = getPaymentHistory();

  // Locked state for non-Secure+ users
  if (!isSecurePlus) {
    return (
      <Card variant="locked" className={cn('relative', className)}>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Payment History</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Track all your tax payments from 2024-2026
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
            <Clock className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent className="blur-locked">
          <div className="h-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-3">
              <Receipt className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No payment history yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <PaymentHistoryItemRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentHistoryItemRow({ item }: { item: PaymentHistoryItemType }) {
  const isTax = item.type === 'tax';
  const receipt = item.receipt;

  const title = isTax
    ? `${(receipt as TaxReceipt).taxYear} Tax Payment`
    : `${(receipt as SubscriptionReceipt).mode === 'secure' ? 'Secure' : 'Secure+'} Subscription`;

  const receiptId = isTaxReceipt(receipt) ? receipt.nrsReceiptNo : receipt.transactionRef;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border">
      <div className={cn(
        'flex h-10 w-10 items-center justify-center rounded-lg shrink-0',
        isTax ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
      )}>
        {isTax ? <Receipt className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-foreground text-sm">{title}</p>
          <span className="text-xs text-success font-medium">✓ Paid</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(item.amount)}
          </span>
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            View Receipt
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-mono">{receiptId}</p>
      </div>
    </div>
  );
}
