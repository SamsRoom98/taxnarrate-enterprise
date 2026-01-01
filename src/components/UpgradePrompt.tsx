import React from 'react';
import { ArrowRight, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTax } from '@/contexts/TaxContext';
import { UserMode } from '@/types/tax';

interface UpgradePromptProps {
  targetMode?: UserMode;
  variant?: 'card' | 'inline' | 'banner';
  className?: string;
}

const upgradeFeatures: Record<UserMode, { title: string; features: string[] }> = {
  lite: {
    title: 'You\'re in Lite Mode',
    features: [],
  },
  secure: {
    title: 'Upgrade to Secure',
    features: [
      'NIN / Business ID Verification',
      'Full rent relief calculations',
      'Save your tax profile',
      'PDF export capability',
      'NRS Tax ID retrieval',
    ],
  },
  'secure-plus': {
    title: 'Upgrade to Secure+',
    features: [
      'Multi-year tax history tracking',
      'AI-powered tax explanations',
      'Monthly PAYE timeline view',
      'Tax optimization insights',
      'Priority support access',
      'Audit-ready compliance logs',
    ],
  },
};

export const UpgradePrompt = React.forwardRef<HTMLDivElement, UpgradePromptProps>(
  function UpgradePrompt({ targetMode = 'secure', variant = 'card', className }, ref) {
    const { updateMode, userProfile } = useTax();
    const config = upgradeFeatures[targetMode];

    if (variant === 'banner') {
      return (
        <div ref={ref} className={`rounded-xl bg-gradient-to-r from-warning/20 via-warning/10 to-transparent border border-warning/30 p-4 ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Compliance Risk Detected</p>
              <p className="text-sm text-muted-foreground">
                Historical tax tracking helps detect payroll errors early.
              </p>
            </div>
          </div>
          <Button variant="warning" size="sm" onClick={() => updateMode(targetMode)}>
            {config.title}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        </div>
      );
    }

    if (variant === 'inline') {
      return (
        <div ref={ref} className={`flex items-center gap-3 rounded-lg bg-muted/50 p-3 ${className}`}>
        <Shield className="h-5 w-5 text-success" />
        <span className="text-sm text-muted-foreground flex-1">
          Unlock full compliance features
        </span>
        <Button variant="upgrade" size="sm" onClick={() => updateMode(targetMode)}>
          Upgrade
        </Button>
        </div>
      );
    }

    return (
      <Card ref={ref} variant="elevated" className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
          <div>
            <CardTitle>{config.title}</CardTitle>
            <CardDescription>Unlock full compliance capabilities</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {config.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-success" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          variant="upgrade"
          className="w-full"
          onClick={() => updateMode(targetMode)}
        >
          {config.title}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        </CardContent>
      </Card>
    );
  }
);
