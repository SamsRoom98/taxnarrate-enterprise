import React from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/contexts/PaymentContext';
import { formatCurrency } from '@/types/payment';
import { cn } from '@/lib/utils';

interface OverdueTaxCheckerProps {
  className?: string;
}

export function OverdueTaxChecker({ className }: OverdueTaxCheckerProps) {
  const { paymentState } = usePayment();
  const [isChecking, setIsChecking] = React.useState(false);
  const [lastChecked, setLastChecked] = React.useState<Date | null>(new Date());

  // Simulated overdue status
  const hasOverdue = false; // Set to true to test overdue state
  const overdueAmount = 520000;
  const penalty = Math.round(overdueAmount * 0.1);
  const daysOverdue = 45;

  const handleCheck = async () => {
    setIsChecking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastChecked(new Date());
    setIsChecking(false);
  };

  const isPaid2026 = paymentState.taxPaidFor2026;

  return (
    <Card variant="elevated" className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Tax Status Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasOverdue ? (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-destructive">Overdue Tax Detected</p>
                <p className="text-xs text-muted-foreground">Tax Year 2025</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Overdue</span>
                <span className="font-medium text-destructive">{formatCurrency(overdueAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Penalty (10% p.a.)</span>
                <span className="text-destructive">{formatCurrency(penalty)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days Overdue</span>
                <span className="text-destructive">{daysOverdue} days</span>
              </div>
            </div>
            <Button variant="destructive" className="w-full">
              Pay Now
            </Button>
          </div>
        ) : (
          <div className="rounded-lg bg-success/10 border border-success/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-success">No Overdue Tax</p>
                <p className="text-xs text-muted-foreground">
                  {isPaid2026 ? 'Last paid: 2026 Tax Year' : 'Last paid: 2025 Tax Year'}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {isPaid2026 
                ? 'Next due: 2027 Tax (March 31, 2027)'
                : 'Next due: 2026 Tax (March 31, 2026)'}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {lastChecked 
              ? `Last checked: ${lastChecked.toLocaleTimeString()}`
              : 'Never checked'}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCheck}
            disabled={isChecking}
          >
            <RefreshCw className={cn('h-4 w-4 mr-1', isChecking && 'animate-spin')} />
            {isChecking ? 'Checking...' : 'Check Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
