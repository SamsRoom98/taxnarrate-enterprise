import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, FileText, Receipt, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceStatus } from '@/types/tax';
import { cn } from '@/lib/utils';

interface ComplianceCardProps {
  status: ComplianceStatus;
  className?: string;
}

export const ComplianceCard = React.forwardRef<HTMLDivElement, ComplianceCardProps>(
  function ComplianceCard({ status, className }, ref) {
  const items = [
    {
      label: 'NRS Tax ID',
      status: status.nrsTaxId,
      icon: FileText,
      description: status.nrsTaxId ? 'Verified' : 'Not Verified',
    },
    {
      label: 'E-Invoicing',
      status: status.eInvoicing,
      icon: Receipt,
      description: status.eInvoicing ? 'Active' : 'Required for 2026',
    },
    {
      label: 'PAYE Status',
      status: status.payeStatus === 'ready',
      icon: CreditCard,
      description: status.payeStatus === 'ready' ? 'Ready' : status.payeStatus === 'at-risk' ? 'At Risk' : 'Pending',
    },
  ];

  return (
    <Card ref={ref} variant="elevated" className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          Compliance Health Check
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'h-2.5 w-2.5 rounded-full animate-pulse',
                status.overallScore >= 80 ? 'bg-success' : status.overallScore >= 50 ? 'bg-warning' : 'bg-destructive'
              )}
            />
            <span className="text-sm font-medium text-muted-foreground">
              {status.overallScore}% Complete
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out',
              status.overallScore >= 80 ? 'bg-success' : status.overallScore >= 50 ? 'bg-warning' : 'bg-destructive'
            )}
            style={{ width: `${status.overallScore}%` }}
          />
        </div>

        {/* Status Items */}
        <div className="space-y-3 pt-2">
          {items.map((item) => {
            const Icon = item.icon;
            const StatusIcon = item.status ? CheckCircle2 : item.label === 'E-Invoicing' ? AlertCircle : XCircle;

            return (
              <div
                key={item.label}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-sm',
                      item.status ? 'text-success' : item.label === 'E-Invoicing' ? 'text-warning' : 'text-destructive'
                    )}
                  >
                    {item.description}
                  </span>
                  <StatusIcon
                    className={cn(
                      'h-4 w-4',
                      item.status ? 'text-success' : item.label === 'E-Invoicing' ? 'text-warning' : 'text-destructive'
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
