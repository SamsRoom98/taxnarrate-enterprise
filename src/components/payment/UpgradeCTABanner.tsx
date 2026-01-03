import React from 'react';
import { ArrowRight, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/contexts/PaymentContext';
import { useTax } from '@/contexts/TaxContext';
import { getSubscriptionPrice, formatCurrency } from '@/types/payment';
import { cn } from '@/lib/utils';

interface UpgradeCTABannerProps {
  className?: string;
}

export function UpgradeCTABanner({ className }: UpgradeCTABannerProps) {
  const { userProfile } = useTax();
  const { openSubscriptionModal } = usePayment();

  const isLiteMode = userProfile.mode === 'lite';
  const isSecureMode = userProfile.mode === 'secure';

  const securePrice = getSubscriptionPrice(userProfile.accountType, 'secure');
  const securePlusPrice = getSubscriptionPrice(userProfile.accountType, 'secure-plus');

  if (!isLiteMode && !isSecureMode) {
    return null;
  }

  if (isLiteMode) {
    return (
      <div className={cn(
        'rounded-xl p-6 text-center',
        'bg-gradient-to-r from-primary via-primary/90 to-accent',
        className
      )}>
        <h3 className="text-xl font-bold text-primary-foreground mb-2">
          Ready to Get Compliant?
        </h3>
        <p className="text-primary-foreground/80 text-sm mb-6">
          Upgrade to Secure Mode and verify your tax profile today.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="secondary"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            onClick={() => openSubscriptionModal('secure')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Upgrade to Secure - {formatCurrency(securePrice)}/year
          </Button>
          <Button
            variant="premium"
            onClick={() => openSubscriptionModal('secure-plus')}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Go Premium - {formatCurrency(securePlusPrice)}/year
          </Button>
        </div>
      </div>
    );
  }

  // Secure Mode - Upsell to Secure+
  return (
    <div className={cn(
      'rounded-xl p-6 text-center',
      'bg-gradient-to-r from-warning via-warning/90 to-premium',
      className
    )}>
      <h3 className="text-xl font-bold text-warning-foreground mb-2">
        Want AI-Powered Tax Insights?
      </h3>
      <p className="text-warning-foreground/80 text-sm mb-6">
        Upgrade to Secure+ for multi-year tracking and AI explanations.
      </p>
      <Button
        className="bg-warning-foreground text-warning hover:bg-warning-foreground/90"
        onClick={() => openSubscriptionModal('secure-plus')}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Upgrade to Secure+ - {formatCurrency(securePlusPrice)}/year
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
