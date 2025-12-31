import { useState } from 'react';
import { User, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccountType } from '@/types/tax';
import { useTax } from '@/contexts/TaxContext';
import { cn } from '@/lib/utils';

const accountTypes: {
  id: AccountType;
  icon: typeof User;
  title: string;
  description: string;
  category: 'individual' | 'business';
}[] = [
  {
    id: 'individual',
    icon: User,
    title: 'Individual (PAYE)',
    description: 'Salaried employees and personal income',
    category: 'individual',
  },
  {
    id: 'small-business',
    icon: Building2,
    title: 'Small Business',
    description: 'Turnover ≤ ₦100 million annually',
    category: 'business',
  },
  {
    id: 'mid-size',
    icon: Building2,
    title: 'Mid-Size Business',
    description: 'Turnover ₦100m - ₦500m annually',
    category: 'business',
  },
  {
    id: 'corporate',
    icon: Building2,
    title: 'Corporate / Enterprise',
    description: 'Large corporations and enterprises',
    category: 'business',
  },
];

export function Onboarding() {
  const { updateAccountType, completeOnboarding, userProfile } = useTax();
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [step, setStep] = useState(1);

  const handleContinue = () => {
    if (selectedType) {
      updateAccountType(selectedType);
      completeOnboarding();
    }
  };

  return (
    <div className="min-h-screen bg-background bg-dots-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-4">
            <span className="text-primary-foreground font-bold text-xl">TN</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Tax<span className="text-success">Narrate</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            by Simplex Business Solutions
          </p>
        </div>

        <Card variant="elevated" className="overflow-hidden animate-fade-up delay-100">
          {/* Progress */}
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-success transition-all duration-500"
              style={{ width: `${(step / 1) * 100}%` }}
            />
          </div>

          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Welcome to TaxNarrate</CardTitle>
            <CardDescription className="text-base">
              Nigeria's 2026 Tax Law takes effect on January 1st. Let's get you ready.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <p className="text-sm font-medium text-foreground mb-4">
              Select your account type to get started:
            </p>

            <div className="grid gap-3">
              {accountTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;

                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200',
                      isSelected
                        ? 'border-success bg-success/5 shadow-md'
                        : 'border-border hover:border-muted-foreground/30 hover:bg-muted/50'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                        isSelected ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{type.title}</p>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-6 w-6 text-success animate-scale-in" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Button
                onClick={handleContinue}
                disabled={!selectedType}
                className="w-full"
                size="lg"
              >
                Continue to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                You're starting in <strong>Lite Mode</strong> • Free to explore
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-up delay-200">
          © 2024 Simplex Business Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}
